import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchEvents,
  installFakeFetch,
  jsonRequest,
  uniqueIp,
  type ProviderEvent,
  type ScriptedResponse,
} from "./helpers";

const API_KEY = "test-resend-key";
const TO = "inbox@example.test";
const FROM = "site@example.test";
const RESEND_URL = "https://api.resend.com/emails";

const VALID = {
  name: "Ada Lovelace",
  email: "ada@example.test",
  subject: "Guest pitch",
  message: "I would love to be on the show.",
  company: "",
};

type Handler = (req: Request) => Promise<Response>;

async function loadRoute(): Promise<Handler> {
  const mod = await import("@/app/api/contact/route");
  return mod.POST as Handler;
}

function request(body: unknown) {
  return jsonRequest("/api/contact", body, { "x-forwarded-for": uniqueIp() });
}

function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (value === undefined || value === null) return [];
  return [String(value)];
}

describe("POST /api/contact", () => {
  let log: ProviderEvent[];

  function script(responder: (i: number, url: string) => ScriptedResponse) {
    return installFakeFetch(log, responder);
  }

  beforeEach(() => {
    vi.resetModules();
    log = [];
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("RESEND_API_KEY", API_KEY);
    vi.stubEnv("CONTACT_TO_EMAIL", TO);
    vi.stubEnv("CONTACT_FROM_EMAIL", FROM);
    vi.stubEnv("RESEND_BASE_URL", undefined);
    script(() => ({ status: 200, body: { id: "email_123" } }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("1. returns 500 { ok: false } with no provider call when any env var is missing", async () => {
    for (const missing of ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"]) {
      vi.unstubAllEnvs();
      vi.stubEnv("RESEND_API_KEY", API_KEY);
      vi.stubEnv("CONTACT_TO_EMAIL", TO);
      vi.stubEnv("CONTACT_FROM_EMAIL", FROM);
      vi.stubEnv("RESEND_BASE_URL", undefined);
      vi.stubEnv(missing, undefined);
      const POST = await loadRoute();
      const res = await POST(request(VALID));
      expect(res.status, `missing ${missing}`).toBe(500);
      expect(await res.json()).toMatchObject({ ok: false });
    }
    expect(fetchEvents(log)).toHaveLength(0);
  });

  it("2. returns 400 for invalid JSON or invalid fields with no provider call", async () => {
    const cases: Array<[string, unknown]> = [
      ["invalid JSON", "{oops"],
      ["missing name", { ...VALID, name: undefined }],
      ["empty name", { ...VALID, name: "" }],
      ["missing message", { ...VALID, message: undefined }],
      ["empty message", { ...VALID, message: "" }],
      ["invalid email", { ...VALID, email: "not-an-email" }],
      ["subject not in list", { ...VALID, subject: "Sponsorship" }],
      ["subject case mismatch", { ...VALID, subject: "guest pitch" }],
    ];
    const POST = await loadRoute();
    for (const [label, body] of cases) {
      const res = await POST(request(body));
      expect(res.status, label).toBe(400);
    }
    expect(fetchEvents(log)).toHaveLength(0);
  });

  it("3. honeypot: non-empty company returns 200 { ok: true } with no provider call", async () => {
    const POST = await loadRoute();
    const res = await POST(request({ ...VALID, company: "Acme" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchEvents(log)).toHaveLength(0);
  });

  it("4. a valid message sends exactly one Resend email with the right envelope", async () => {
    const subjects = [
      "Guest pitch",
      "Press inquiry",
      "Partnership",
      "Just saying hi",
      "Something else",
    ];
    for (const subject of subjects) {
      log.length = 0;
      const POST = await loadRoute();
      const res = await POST(request({ ...VALID, subject }));
      expect(res.status, subject).toBe(200);
      expect(await res.json()).toEqual({ ok: true });

      const calls = fetchEvents(log);
      expect(calls).toHaveLength(1);
      const [send] = calls;
      expect(send.method).toBe("POST");
      expect(send.url).toBe(RESEND_URL);
      expect(send.headers["authorization"]).toBe(`Bearer ${API_KEY}`);

      const body = send.body as Record<string, unknown>;
      expect(asList(body.to)).toContain(TO);
      expect(String(body.from)).toContain(FROM);
      expect(asList(body.reply_to)).toContain(VALID.email);
      expect(String(body.subject)).toContain(subject);
      expect(String(body.subject)).toContain(VALID.name);
    }
  });

  it("5. escapes HTML in name and message in the sent HTML body", async () => {
    const payload = "<script>alert(1)</script>";
    const POST = await loadRoute();
    const res = await POST(
      request({ ...VALID, name: `Eve ${payload}`, message: `Hi ${payload}` }),
    );
    expect(res.status).toBe(200);
    const [send] = fetchEvents(log);
    const html = String((send.body as Record<string, unknown>).html ?? "");
    expect(html.length).toBeGreaterThan(0);
    expect(html).not.toContain(payload);
    expect(html).not.toContain("<script");
  });

  it("6. maps Resend error responses and network failures to 502 { ok: false }", async () => {
    const scenarios: Array<[string, ScriptedResponse]> = [
      [
        "422",
        { status: 422, body: { statusCode: 422, name: "validation_error", message: "bad" } },
      ],
      [
        "500",
        { status: 500, body: { statusCode: 500, name: "internal_server_error", message: "x" } },
      ],
      ["fetch throws", { throws: new TypeError("fetch failed") }],
    ];
    for (const [label, scripted] of scenarios) {
      script(() => scripted);
      const POST = await loadRoute();
      const res = await POST(request(VALID));
      expect(res.status, label).toBe(502);
      expect(await res.json(), label).toMatchObject({ ok: false });
    }
  });
});
