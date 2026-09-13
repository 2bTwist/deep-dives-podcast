import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  consoleErrorText,
  fetchEvents,
  installFakeFetch,
  jsonRequest,
  uniqueIp,
  type ProviderEvent,
  type ScriptedResponse,
} from "./helpers";

const API_KEY = "test-kit-key";
const FORM_ID = "1234567";
const EMAIL = "listener@example.test";

type Handler = (req: Request) => Promise<Response>;

async function loadRoute(): Promise<Handler> {
  const mod = await import("@/app/api/newsletter/route");
  return mod.POST as Handler;
}

function request(body: unknown, ip = uniqueIp()) {
  return jsonRequest("/api/newsletter", body, { "x-forwarded-for": ip });
}

describe("POST /api/newsletter", () => {
  let log: ProviderEvent[];
  let errorSpy: ReturnType<typeof vi.spyOn>;

  function script(responder: (i: number, url: string) => ScriptedResponse) {
    return installFakeFetch(log, responder);
  }

  beforeEach(() => {
    vi.resetModules();
    log = [];
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("KIT_API_KEY", API_KEY);
    vi.stubEnv("KIT_NEWSLETTER_FORM_ID", FORM_ID);
    script(() => ({ status: 201, body: {} }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("1. returns 500 { ok: false } with no fetch when either env var is missing", async () => {
    for (const missing of ["KIT_API_KEY", "KIT_NEWSLETTER_FORM_ID"]) {
      vi.unstubAllEnvs();
      vi.stubEnv("KIT_API_KEY", API_KEY);
      vi.stubEnv("KIT_NEWSLETTER_FORM_ID", FORM_ID);
      vi.stubEnv(missing, undefined);
      const POST = await loadRoute();
      const res = await POST(request({ email: EMAIL, company: "" }));
      expect(res.status, `missing ${missing}`).toBe(500);
      expect(await res.json()).toMatchObject({ ok: false });
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

  it("5. valid signup upserts the subscriber, then adds to the form (201 and 200 both succeed)", async () => {
    for (const status of [201, 200]) {
      log.length = 0;
      script(() => ({ status, body: { subscriber: { id: 1 } } }));
      const POST = await loadRoute();
      const res = await POST(request({ email: EMAIL, company: "" }));
      expect(res.status, `Kit status ${status}`).toBe(200);
      expect(await res.json()).toEqual({ ok: true });

      const calls = fetchEvents(log);
      expect(calls).toHaveLength(2);

      const [upsert, addToForm] = calls;
      expect(upsert.method).toBe("POST");
      expect(upsert.url).toBe("https://api.kit.com/v4/subscribers");
      expect(upsert.headers["x-kit-api-key"]).toBe(API_KEY);
      expect(upsert.body).toMatchObject({ email_address: EMAIL });

      expect(addToForm.method).toBe("POST");
      expect(addToForm.url).toBe(
        `https://api.kit.com/v4/forms/${FORM_ID}/subscribers`,
      );
      expect(addToForm.headers["x-kit-api-key"]).toBe(API_KEY);
      expect(addToForm.body).toMatchObject({ email_address: EMAIL });
    }
  });

  it("6. upsert failure returns 502 and never calls the form endpoint", async () => {
    script((i) =>
      i === 0
        ? { status: 422, body: { errors: ["Email address is invalid"] } }
        : { status: 201, body: {} },
    );
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false });
    const calls = fetchEvents(log);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("https://api.kit.com/v4/subscribers");
    expect(calls.some((c) => c.url.includes("/forms/"))).toBe(false);
  });

  it("7. add-to-form failure returns 502 { ok: false }", async () => {
    script((i) =>
      i === 0 ? { status: 201, body: {} } : { status: 500, body: { errors: ["boom"] } },
    );
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false });
  });

  it("8. network error from fetch returns 502 { ok: false }", async () => {
    script(() => ({ throws: new TypeError("fetch failed") }));
    const POST = await loadRoute();
    const res = await POST(request({ email: EMAIL, company: "" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false });
  });

  it("9. never logs the subscriber email on provider failure, even when Kit echoes it", async () => {
    const echo = {
      errors: [`Email address ${EMAIL} is invalid`],
      email_address: EMAIL,
    };
    const scenarios: Array<[string, (i: number) => ScriptedResponse]> = [
      ["upsert fails", () => ({ status: 422, body: echo })],
      [
        "form add fails",
        (i) => (i === 0 ? { status: 201, body: {} } : { status: 422, body: echo }),
      ],
      ["fetch throws", () => ({ throws: new TypeError("fetch failed") })],
    ];
    for (const [label, responder] of scenarios) {
      errorSpy.mockClear();
      script(responder);
      const POST = await loadRoute();
      const res = await POST(request({ email: EMAIL, company: "" }));
      expect(res.status, label).toBe(502);
      expect(consoleErrorText(errorSpy), label).not.toContain(EMAIL);
    }
  });

  it("10. the 6th request from one IP within 60s gets 429 with Retry-After", async () => {
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
  });
});
