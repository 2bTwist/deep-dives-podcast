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
// resend@6.12.4 `events.send` posts to /events/send with { event, contact_id, email, payload }.
const EVENTS_SEND_URL = "https://api.resend.com/events/send";
const WELCOME_EVENT = "newsletter.subscribed";

type Handler = (req: Request) => Promise<Response>;
type Responder = (i: number, url: string) => ScriptedResponse;

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

/**
 * Contact lookup-by-email URLs the contract accepts. resend@6.12.4
 * `contacts.get({ email })` interpolates the raw address; encoded is also valid HTTP.
 */
function lookupUrls(): string[] {
  return [EMAIL, encodeURIComponent(EMAIL)].map((contact) => `${CONTACTS_URL}/${contact}`);
}

type CallKind = "lookup" | "create" | "segment" | "event" | "other";

function kindOfUrl(url: string): CallKind {
  if (url === EVENTS_SEND_URL) return "event";
  if (url.includes("/segments/")) return "segment";
  if (url === CONTACTS_URL) return "create";
  if (lookupUrls().includes(url)) return "lookup";
  return "other";
}

function kinds(calls: FetchEvent[]): CallKind[] {
  return calls.map((c) => kindOfUrl(c.url));
}

function isSegmentCall(call: FetchEvent): boolean {
  return call.url.includes("/segments/");
}

function resendError(statusCode: number, message: string, name = "validation_error") {
  return {
    status: statusCode,
    body: { statusCode, name, message },
  };
}

const CONTACT_NOT_FOUND: ScriptedResponse = {
  status: 404,
  body: { statusCode: 404, name: "not_found", message: "Contact not found" },
};
const CONTACT_CREATED = { object: "contact", id: CONTACT_ID };
const SEGMENT_ADDED = { id: SEGMENT_ID };
const EVENT_SENT = { object: "event", event: WELCOME_EVENT };

function existingContact(unsubscribed: boolean): ScriptedResponse {
  return {
    status: 200,
    body: {
      object: "contact",
      id: CONTACT_ID,
      email: EMAIL,
      created_at: "2026-06-01T12:00:00.000Z",
      first_name: null,
      last_name: null,
      unsubscribed,
      properties: {},
    },
  };
}

/**
 * Happy Resend fake routed by URL: lookup 404 (new contact), contact upsert,
 * segment add, event send. Override any leg per test.
 */
function happy(overrides: Partial<Record<CallKind, ScriptedResponse>> = {}): Responder {
  const defaults: Record<CallKind, ScriptedResponse> = {
    lookup: CONTACT_NOT_FOUND,
    create: { status: 201, body: CONTACT_CREATED },
    segment: { status: 201, body: SEGMENT_ADDED },
    event: { status: 202, body: EVENT_SENT },
    other: resendError(500, "Unexpected URL in contract fake", "unexpected_url"),
  };
  return (_i, url) => {
    const kind = kindOfUrl(url);
    return overrides[kind] ?? defaults[kind];
  };
}

describe("POST /api/newsletter", () => {
  let log: ProviderEvent[];
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;

  function script(responder: Responder) {
    return installFakeFetch(log, responder);
  }

  function callsOf(kind: CallKind): FetchEvent[] {
    return fetchEvents(log).filter((c) => kindOfUrl(c.url) === kind);
  }

  /** Every console.error, console.warn, and console.log argument, stringified. */
  function allLogText(): string {
    return [errorSpy, warnSpy, logSpy].map((spy) => consoleErrorText(spy)).join("\n");
  }

  function clearLogSpies() {
    errorSpy.mockClear();
    warnSpy.mockClear();
    logSpy.mockClear();
  }

  function stubRequiredEnv() {
    vi.stubEnv("RESEND_AUDIENCE_API_KEY", AUDIENCE_KEY);
    vi.stubEnv("RESEND_NEWSLETTER_SEGMENT_ID", SEGMENT_ID);
    vi.stubEnv("RESEND_API_KEY", TRANSACTIONAL_KEY);
    vi.stubEnv("RESEND_BASE_URL", undefined);
  }

  /** No call ever writes unsubscribe state: no PATCH, no `unsubscribed` key in any body. */
  function expectNoUnsubscribeWrite(label: string) {
    for (const call of fetchEvents(log)) {
      expect(call.method, `${label}: ${call.url}`).not.toBe("PATCH");
      expect(JSON.stringify(call.body ?? null), `${label}: ${call.url}`).not.toContain(
        "unsubscribed",
      );
    }
  }

  beforeEach(() => {
    vi.resetModules();
    log = [];
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
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

  it("5. valid signup looks up the contact, upserts it, adds it to the segment, and sends the welcome event only for a new contact", async () => {
    const scenarios: Array<[string, Responder, CallKind[]]> = [
      ["new contact (lookup 404)", happy(), ["lookup", "create", "segment", "event"]],
      [
        "existing contact (lookup 200)",
        happy({ lookup: existingContact(false), create: { status: 200, body: CONTACT_CREATED } }),
        ["lookup", "create", "segment"],
      ],
    ];
    for (const [label, responder, expected] of scenarios) {
      log.length = 0;
      script(responder);
      const POST = await loadRoute();
      const res = await POST(request({ email: EMAIL, company: "" }));
      expect(res.status, label).toBe(200);
      expect(await res.json(), label).toEqual({ ok: true });

      const calls = fetchEvents(log);
      expect(kinds(calls), label).toEqual(expected);
      const [lookup, create, addToSegment] = calls;

      expect(lookup.method, label).toBe("GET");
      expect(lookupUrls(), `${label}: ${lookup.url}`).toContain(lookup.url);
      expect(lookup.headers.authorization, label).toBe(`Bearer ${AUDIENCE_KEY}`);

      expect(create.method, label).toBe("POST");
      expect(create.url, label).toBe(CONTACTS_URL);
      expect(create.headers.authorization, label).toBe(`Bearer ${AUDIENCE_KEY}`);
      expect(create.body, label).toMatchObject({ email: EMAIL });

      expect(addToSegment.method, label).toBe("POST");
      expect(segmentUrls(), `${label}: ${addToSegment.url}`).toContain(addToSegment.url);
      expect(addToSegment.headers.authorization, label).toBe(`Bearer ${AUDIENCE_KEY}`);

      expectNoUnsubscribeWrite(label);
    }
  });

  it("6. the contact create body never carries an unsubscribed key", async () => {
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(200);
    const [create] = callsOf("create");
    expect(create).toBeDefined();
    expect(create.body).toBeTypeOf("object");
    expect(create.body).not.toBeNull();
    expect(Object.keys(create.body as object)).not.toContain("unsubscribed");
  });

  it("7. contact create failure returns 502 and never calls the segment endpoint or sends the event", async () => {
    script(happy({ create: resendError(422, "Invalid `email` field.") }));
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false });
    const calls = fetchEvents(log);
    const writes = calls.filter((c) => kindOfUrl(c.url) !== "lookup");
    expect(kinds(writes)).toEqual(["create"]);
    expect(calls.some(isSegmentCall)).toBe(false);
    expect(callsOf("event")).toHaveLength(0);
  });

  it("8. segment add failure returns 502 { ok: false } and sends no event", async () => {
    script(happy({ segment: resendError(404, "Segment not found", "not_found") }));
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false });
    const writes = fetchEvents(log).filter((c) => kindOfUrl(c.url) !== "lookup");
    expect(kinds(writes)).toEqual(["create", "segment"]);
    expect(callsOf("event")).toHaveLength(0);
  });

  it("9. network error from fetch returns 502 { ok: false }", async () => {
    script(() => ({ throws: new TypeError("fetch failed") }));
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false });
  });

  it("10. never logs the subscriber email or returns the API key on provider failure, even when Resend echoes the address", async () => {
    const echo = (statusCode: number): ScriptedResponse => ({
      status: statusCode,
      body: {
        statusCode,
        name: "validation_error",
        message: `Contact ${EMAIL} could not be processed`,
        email: EMAIL,
      },
    });
    const throwsWithEmail: ScriptedResponse = {
      throws: new TypeError(`fetch failed for ${EMAIL}`),
    };
    const scenarios: Array<[string, Responder, number, CallKind[] | null]> = [
      ["contact create fails", () => echo(422), 502, null],
      ["segment add fails", happy({ segment: echo(422) }), 502, null],
      ["fetch throws", () => throwsWithEmail, 502, null],
      ["lookup fails with 500", happy({ lookup: echo(500) }), 200, ["lookup", "create", "segment"]],
      ["lookup fetch throws", happy({ lookup: throwsWithEmail }), 200, ["lookup", "create", "segment"]],
      [
        "event send fails with 500",
        happy({ event: echo(500) }),
        200,
        ["lookup", "create", "segment", "event"],
      ],
      [
        "event fetch throws",
        happy({ event: throwsWithEmail }),
        200,
        ["lookup", "create", "segment", "event"],
      ],
    ];
    for (const [label, responder, status, expectedKinds] of scenarios) {
      log.length = 0;
      clearLogSpies();
      script(responder);
      const POST = await loadRoute();
      const res = await POST(request({ email: EMAIL, company: "" }));
      expect(res.status, label).toBe(status);
      const text = await res.text();
      expect(text, label).not.toContain(AUDIENCE_KEY);
      expect(text, label).not.toContain(TRANSACTIONAL_KEY);
      expect(text, label).not.toContain(EMAIL);
      const logs = allLogText();
      expect(logs, label).not.toContain(EMAIL);
      expect(logs, label).not.toContain(AUDIENCE_KEY);
      expect(logs, label).not.toContain(TRANSACTIONAL_KEY);
      // The failure scenarios only prove non-leakage if the failing leg was actually reached.
      if (expectedKinds) expect(kinds(fetchEvents(log)), label).toEqual(expectedKinds);
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

  it("13. new contact: sends newsletter.subscribed for the address with the audience key, after the segment add", async () => {
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const calls = fetchEvents(log);
    expect(kinds(calls)).toEqual(["lookup", "create", "segment", "event"]);
    const event = calls[3];
    expect(event.method).toBe("POST");
    expect(event.url).toBe(EVENTS_SEND_URL);
    expect(event.headers.authorization).toBe(`Bearer ${AUDIENCE_KEY}`);
    expect(event.body).toMatchObject({ event: WELCOME_EVENT, email: EMAIL });
    expectNoUnsubscribeWrite("new contact");
  });

  it("14. existing contact (subscribed or unsubscribed): subscribes as today and sends no event", async () => {
    for (const unsubscribed of [false, true]) {
      const label = `existing contact, unsubscribed: ${unsubscribed}`;
      log.length = 0;
      script(
        happy({
          lookup: existingContact(unsubscribed),
          create: { status: 200, body: CONTACT_CREATED },
        }),
      );
      const POST = await loadRoute();
      const res = await POST(request({ email: EMAIL, company: "" }));
      expect(res.status, label).toBe(200);
      expect(await res.json(), label).toEqual({ ok: true });

      expect(kinds(fetchEvents(log)), label).toEqual(["lookup", "create", "segment"]);
      expect(callsOf("event"), label).toHaveLength(0);
      const [create] = callsOf("create");
      expect(Object.keys(create.body as object), label).not.toContain("unsubscribed");
      expectNoUnsubscribeWrite(label);
    }
  });

  it("15. lookup failure (500 or network error): still subscribes, sends no event, returns 200, logs no address", async () => {
    const scenarios: Array<[string, ScriptedResponse]> = [
      ["lookup 500", resendError(500, "Internal server error", "internal_server_error")],
      ["lookup fetch throws", { throws: new TypeError("fetch failed") }],
    ];
    for (const [label, lookup] of scenarios) {
      log.length = 0;
      clearLogSpies();
      script(happy({ lookup }));
      const POST = await loadRoute();
      const res = await POST(request({ email: EMAIL, company: "" }));
      expect(res.status, label).toBe(200);
      expect(await res.json(), label).toEqual({ ok: true });

      expect(kinds(fetchEvents(log)), label).toEqual(["lookup", "create", "segment"]);
      expect(callsOf("event"), label).toHaveLength(0);
      expect(allLogText(), label).not.toContain(EMAIL);
      expectNoUnsubscribeWrite(label);
    }
  });

  it("16. event send failure (500 or network error) after a successful subscribe still returns 200 and logs without the address or keys", async () => {
    const scenarios: Array<[string, ScriptedResponse]> = [
      ["event 500", resendError(500, "Internal server error", "internal_server_error")],
      ["event fetch throws", { throws: new TypeError("fetch failed") }],
    ];
    for (const [label, event] of scenarios) {
      log.length = 0;
      clearLogSpies();
      script(happy({ event }));
      const POST = await loadRoute();
      const res = await POST(request({ email: EMAIL, company: "" }));
      expect(res.status, label).toBe(200);
      expect(await res.json(), label).toEqual({ ok: true });

      expect(kinds(fetchEvents(log)), label).toEqual(["lookup", "create", "segment", "event"]);
      expect(errorSpy, label).toHaveBeenCalled();
      const logs = allLogText();
      expect(logs, label).not.toContain(EMAIL);
      expect(logs, label).not.toContain(AUDIENCE_KEY);
      expect(logs, label).not.toContain(TRANSACTIONAL_KEY);
    }
  });
});
