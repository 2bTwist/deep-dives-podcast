import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  consoleErrorText,
  fetchEvents,
  installFakeFetch,
  jsonRequest,
  uniqueIp,
  type FetchEvent,
  type ProviderEvent,
  type ScriptedResponse,
} from "./helpers";

const AUDIENCE_KEY = "re_test_audience_key";
// A distinct transactional key, so a route that reads the wrong variable is caught.
const TRANSACTIONAL_KEY = "re_test_transactional_key";
const SEGMENT_ID = "seg_78261eea-8f8b-4381-83c6-79fa7120f1cf";
const CONTACT_ID = "479e3145-dd38-476b-932c-529ceb705947";
const EMAIL = "listener@example.test";
const CONTACTS_URL = "https://api.resend.com/contacts";

type Handler = (req: Request) => Promise<Response>;

async function loadRoute(): Promise<Handler> {
  const mod = await import("@/app/api/newsletter/route");
  return mod.POST as Handler;
}

function request(body: unknown, ip = uniqueIp()) {
  return jsonRequest("/api/newsletter", body, { "x-forwarded-for": ip });
}

/** Segment-add URLs the contract accepts: by contact id, raw email, or encoded email. */
function segmentUrls(): string[] {
  return [CONTACT_ID, EMAIL, encodeURIComponent(EMAIL)].map(
    (contact) => `${CONTACTS_URL}/${contact}/segments/${SEGMENT_ID}`,
  );
}

function isSegmentCall(call: FetchEvent): boolean {
  return call.url.includes("/segments/");
}

function resendError(statusCode: number, message: string) {
  return {
    status: statusCode,
    body: { statusCode, name: "validation_error", message },
  };
}

const CONTACT_CREATED = { object: "contact", id: CONTACT_ID };
const SEGMENT_ADDED = { id: SEGMENT_ID };

/** Happy Resend fake: contact upsert, then segment add, routed by URL. */
function happy(contactStatus = 201): (i: number, url: string) => ScriptedResponse {
  return (_i, url) =>
    url.includes("/segments/")
      ? { status: 201, body: SEGMENT_ADDED }
      : { status: contactStatus, body: CONTACT_CREATED };
}

describe("POST /api/newsletter", () => {
  let log: ProviderEvent[];
  let errorSpy: ReturnType<typeof vi.spyOn>;

  function script(responder: (i: number, url: string) => ScriptedResponse) {
    return installFakeFetch(log, responder);
  }

  function stubRequiredEnv() {
    vi.stubEnv("RESEND_AUDIENCE_API_KEY", AUDIENCE_KEY);
    vi.stubEnv("RESEND_NEWSLETTER_SEGMENT_ID", SEGMENT_ID);
    vi.stubEnv("RESEND_API_KEY", TRANSACTIONAL_KEY);
    vi.stubEnv("RESEND_BASE_URL", undefined);
  }

  beforeEach(() => {
    vi.resetModules();
    log = [];
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    stubRequiredEnv();
    script(happy());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("1. returns 500 { ok: false } with no fetch when either Resend env var is missing", async () => {
    for (const missing of ["RESEND_AUDIENCE_API_KEY", "RESEND_NEWSLETTER_SEGMENT_ID"]) {
      vi.unstubAllEnvs();
      stubRequiredEnv();
      vi.stubEnv(missing, undefined);
      vi.resetModules();
      const POST = await loadRoute();
      const res = await POST(request({ email: EMAIL, company: "" }));
      expect(res.status, `missing ${missing}`).toBe(500);
      expect(await res.json(), `missing ${missing}`).toMatchObject({ ok: false });
    }
    expect(fetchEvents(log)).toHaveLength(0);
  });

  it("2. returns 400 for a non-JSON body with no provider call", async () => {
    const POST = await loadRoute();
    const res = await POST(request("{not json"));
    expect(res.status).toBe(400);
    expect(fetchEvents(log)).toHaveLength(0);
  });

  it("3. returns 400 for an invalid email with no provider call", async () => {
    const POST = await loadRoute();
    const res = await POST(request({ email: "not-an-email", company: "" }));
    expect(res.status).toBe(400);
    expect(fetchEvents(log)).toHaveLength(0);
  });

  it("4. honeypot: non-empty company returns 200 { ok: true } with no provider call", async () => {
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "Acme" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchEvents(log)).toHaveLength(0);
  });

  it("5. valid signup creates the Resend contact, then adds it to the newsletter segment (new and existing contact)", async () => {
    for (const contactStatus of [201, 200]) {
      const label = `contact create status ${contactStatus}`;
      log.length = 0;
      script(happy(contactStatus));
      const POST = await loadRoute();
      const res = await POST(request({ email: EMAIL, company: "" }));
      expect(res.status, label).toBe(200);
      expect(await res.json(), label).toEqual({ ok: true });

      const calls = fetchEvents(log);
      expect(calls, label).toHaveLength(2);
      const [create, addToSegment] = calls;

      expect(create.method, label).toBe("POST");
      expect(create.url, label).toBe(CONTACTS_URL);
      expect(create.headers.authorization, label).toBe(`Bearer ${AUDIENCE_KEY}`);
      expect(create.body, label).toMatchObject({ email: EMAIL });

      expect(addToSegment.method, label).toBe("POST");
      expect(segmentUrls(), `${label}: ${addToSegment.url}`).toContain(addToSegment.url);
      expect(addToSegment.headers.authorization, label).toBe(`Bearer ${AUDIENCE_KEY}`);
    }
  });

  it("6. the contact create body never carries an unsubscribed key", async () => {
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(200);
    const [create] = fetchEvents(log);
    expect(create.url).toBe(CONTACTS_URL);
    expect(create.body).toBeTypeOf("object");
    expect(create.body).not.toBeNull();
    expect(Object.keys(create.body as object)).not.toContain("unsubscribed");
  });

  it("7. contact create failure returns 502 and never calls the segment endpoint", async () => {
    script((_i, url) =>
      url.includes("/segments/")
        ? { status: 201, body: SEGMENT_ADDED }
        : resendError(422, "Invalid `email` field."),
    );
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false });
    const calls = fetchEvents(log);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(CONTACTS_URL);
    expect(calls.some(isSegmentCall)).toBe(false);
  });

  it("8. segment add failure returns 502 { ok: false }", async () => {
    script((_i, url) =>
      url.includes("/segments/")
        ? resendError(404, "Segment not found")
        : { status: 201, body: CONTACT_CREATED },
    );
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false });
    const calls = fetchEvents(log);
    expect(calls).toHaveLength(2);
    expect(isSegmentCall(calls[1])).toBe(true);
  });

  it("9. network error from fetch returns 502 { ok: false }", async () => {
    script(() => ({ throws: new TypeError("fetch failed") }));
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false });
  });

  it("10. never logs the subscriber email or returns the API key on provider failure, even when Resend echoes the address", async () => {
    const echo = (statusCode: number) => ({
      status: statusCode,
      body: {
        statusCode,
        name: "validation_error",
        message: `Contact ${EMAIL} could not be processed`,
        email: EMAIL,
      },
    });
    const scenarios: Array<[string, (i: number, url: string) => ScriptedResponse]> = [
      ["contact create fails", () => echo(422)],
      [
        "segment add fails",
        (_i, url) =>
          url.includes("/segments/") ? echo(422) : { status: 201, body: CONTACT_CREATED },
      ],
      ["fetch throws", () => ({ throws: new TypeError(`fetch failed for ${EMAIL}`) })],
    ];
    for (const [label, responder] of scenarios) {
      errorSpy.mockClear();
      script(responder);
      const POST = await loadRoute();
      const res = await POST(request({ email: EMAIL, company: "" }));
      expect(res.status, label).toBe(502);
      const text = await res.text();
      expect(text, label).not.toContain(AUDIENCE_KEY);
      expect(text, label).not.toContain(TRANSACTIONAL_KEY);
      expect(consoleErrorText(errorSpy), label).not.toContain(EMAIL);
    }
  });

  it("11. the success response never contains the API key", async () => {
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(200);
    expect(await res.text()).not.toContain(AUDIENCE_KEY);
  });

  it("12. the 6th request from one IP within 60s gets 429 with Retry-After", async () => {
    const POST = await loadRoute();
    const ip = "203.0.113.77";
    const statuses: number[] = [];
    let last: Response | undefined;
    for (let i = 0; i < 6; i++) {
      last = await POST(request({ email: EMAIL, company: "" }, ip));
      statuses.push(last.status);
    }
    expect(statuses.slice(0, 5).every((s) => s !== 429)).toBe(true);
    expect(statuses[5]).toBe(429);
    expect(last?.headers.get("Retry-After")).toBeTruthy();
    expect(await last?.json()).toMatchObject({ ok: false });
  });
});
