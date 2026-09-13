import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchEvents,
  installFakeFetch,
  type FetchEvent,
  type ProviderEvent,
  type ScriptedResponse,
} from "./helpers";

// Shared, ordered log of Resend fetches and Sanity writes, plus the Sanity script.
const shared = vi.hoisted(() => ({
  log: [] as unknown[],
  commitError: null as Error | null,
}));

vi.mock("@/sanity/lib/writeClient", () => {
  const writeClient = {
    patch(id: string) {
      shared.log.push({ kind: "sanity.patch", id });
      const builder = {
        set(payload: Record<string, unknown>) {
          shared.log.push({ kind: "sanity.set", id, payload });
          return builder;
        },
        async commit() {
          shared.log.push({ kind: "sanity.commit", id });
          if (shared.commitError) throw shared.commitError;
          return { _id: id };
        },
      };
      return builder;
    },
  };
  return { writeClient };
});

const SECRET = "test-revalidate-secret";
const AUDIENCE_KEY = "re_test_audience_key";
const TRANSACTIONAL_KEY = "re_test_transactional_key";
const SEGMENT_ID = "seg_78261eea-8f8b-4381-83c6-79fa7120f1cf";
const FROM_EMAIL = "newsletter@example.test";
const BROADCASTS_URL = "https://api.resend.com/broadcasts";
const UNSUBSCRIBE_PLACEHOLDER = "{{{RESEND_UNSUBSCRIBE_URL}}}";

const READY = {
  _type: "episode",
  _id: "ep-1",
  title: "Signals From The Deep",
  youtubeId: "abc123XYZ_-",
  slug: "signals-from-the-deep",
  publishedAt: "2026-09-01T00:00:00Z",
  description: "A conversation about listening.",
};

const REQUIRED_ENV = {
  RESEND_AUDIENCE_API_KEY: AUDIENCE_KEY,
  RESEND_NEWSLETTER_SEGMENT_ID: SEGMENT_ID,
  NEWSLETTER_FROM_EMAIL: FROM_EMAIL,
} as const;

type Handler = (req: NextRequest) => Promise<Response>;

async function loadRoute(): Promise<Handler> {
  const mod = await import("@/app/api/blast/route");
  return mod.POST as Handler;
}

function request(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/blast", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function bearer(body: unknown, token = SECRET) {
  return request(body, { authorization: `Bearer ${token}` });
}

const log = () => shared.log as ProviderEvent[];
const sanityEvents = () => log().filter((e) => e.kind.startsWith("sanity."));

function expectNoWrites() {
  expect(fetchEvents(log())).toHaveLength(0);
  expect(sanityEvents()).toHaveLength(0);
}

function bodyOf(call: FetchEvent): Record<string, unknown> {
  expect(call.body).toBeTypeOf("object");
  expect(call.body).not.toBeNull();
  return call.body as Record<string, unknown>;
}

const BROADCAST_CREATED = { id: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" };

describe("POST /api/blast", () => {
  function script(responder: (i: number, url: string) => ScriptedResponse) {
    return installFakeFetch(log(), responder);
  }

  function stubRequiredEnv() {
    vi.stubEnv("SANITY_REVALIDATE_SECRET", SECRET);
    for (const [key, value] of Object.entries(REQUIRED_ENV)) vi.stubEnv(key, value);
    vi.stubEnv("RESEND_API_KEY", TRANSACTIONAL_KEY);
    vi.stubEnv("RESEND_BASE_URL", undefined);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
  }

  beforeEach(() => {
    vi.resetModules();
    shared.log.length = 0;
    shared.commitError = null;
    vi.spyOn(console, "error").mockImplementation(() => {});
    stubRequiredEnv();
    script(() => ({ status: 201, body: BROADCAST_CREATED }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("1. returns 500 with no writes when the secret env is missing", async () => {
    vi.stubEnv("SANITY_REVALIDATE_SECRET", undefined);
    const POST = await loadRoute();
    const res = await POST(bearer(READY));
    expect(res.status).toBe(500);
    expectNoWrites();
  });

  it("2. returns 401 with no writes when there is no signature and no or wrong Bearer token", async () => {
    const POST = await loadRoute();
    for (const [label, req] of [
      ["no auth", request(READY)],
      ["wrong bearer", bearer(READY, "wrong-secret")],
      ["non-bearer scheme", request(READY, { authorization: SECRET })],
    ] as const) {
      const res = await POST(req);
      expect(res.status, label).toBe(401);
    }
    expectNoWrites();
  });

  it("3. skips non-episode documents with 200 and no writes", async () => {
    const POST = await loadRoute();
    const res = await POST(bearer({ ...READY, _type: "post" }));
    expect(res.status).toBe(200);
    expectNoWrites();
  });

  it("4. skips episodes already flagged newsletterDraftCreated with 200 and no writes", async () => {
    const POST = await loadRoute();
    const res = await POST(bearer({ ...READY, newsletterDraftCreated: true }));
    expect(res.status).toBe(200);
    expectNoWrites();
  });

  it("5. skips episodes missing a required field with 200 and no writes", async () => {
    const POST = await loadRoute();
    for (const field of ["_id", "title", "youtubeId", "slug", "publishedAt"]) {
      const body: Record<string, unknown> = { ...READY };
      delete body[field];
      const res = await POST(bearer(body));
      expect(res.status, `missing ${field}`).toBe(200);
    }
    expectNoWrites();
  });

  it("6. returns 500 with no writes when any Resend newsletter env var is missing for a ready episode", async () => {
    for (const missing of Object.keys(REQUIRED_ENV)) {
      vi.unstubAllEnvs();
      stubRequiredEnv();
      vi.stubEnv(missing, undefined);
      vi.resetModules();
      const POST = await loadRoute();
      const res = await POST(bearer(READY));
      expect(res.status, `missing ${missing}`).toBe(500);
    }
    expectNoWrites();
  });

  it("7. creates a Resend broadcast draft, then sets the Sanity flag (string and {current} slug)", async () => {
    for (const slug of [READY.slug, { current: READY.slug }]) {
      shared.log.length = 0;
      const POST = await loadRoute();
      const res = await POST(bearer({ ...READY, slug }));
      const label = `slug ${JSON.stringify(slug)}`;
      expect(res.status, label).toBe(200);
      expect(await res.json(), label).toMatchObject({ created: true });

      const calls = fetchEvents(log());
      expect(calls, label).toHaveLength(1);
      const [broadcast] = calls;
      expect(broadcast.method, label).toBe("POST");
      expect(broadcast.url, label).toBe(BROADCASTS_URL);
      expect(broadcast.headers.authorization, label).toBe(`Bearer ${AUDIENCE_KEY}`);

      const body = bodyOf(broadcast);
      expect(body.segment_id, label).toBe(SEGMENT_ID);
      expect(String(body.from ?? ""), label).toContain(FROM_EMAIL);
      expect(String(body.subject ?? ""), label).toContain(READY.title);

      const html = String(body.html ?? "");
      expect(html, label).toContain(READY.title);
      expect(html, label).toContain(`https://www.youtube.com/watch?v=${READY.youtubeId}`);
      expect(html, label).toContain(`/episodes/${READY.slug}`);
      expect(html, label).toContain(UNSUBSCRIBE_PLACEHOLDER);

      const patches = log().filter((e) => e.kind === "sanity.patch");
      const sets = log().filter((e) => e.kind === "sanity.set");
      const commits = log().filter((e) => e.kind === "sanity.commit");
      expect(patches, label).toEqual([{ kind: "sanity.patch", id: "ep-1" }]);
      expect(sets, label).toHaveLength(1);
      expect(sets[0], label).toMatchObject({
        id: "ep-1",
        payload: { newsletterDraftCreated: true },
      });
      expect(commits, label).toEqual([{ kind: "sanity.commit", id: "ep-1" }]);

      const broadcastIndex = log().indexOf(broadcast);
      const firstSanityIndex = log().findIndex((e) => e.kind.startsWith("sanity."));
      const commitIndex = log().indexOf(commits[0]);
      expect(broadcastIndex, label).toBeLessThan(firstSanityIndex);
      expect(broadcastIndex, label).toBeLessThan(commitIndex);
    }
  });

  it("8. the broadcast stays an unsent draft: send is not true and scheduled_at is absent", async () => {
    const POST = await loadRoute();
    const res = await POST(bearer(READY));
    expect(res.status).toBe(200);
    const calls = fetchEvents(log());
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(BROADCASTS_URL);
    const body = bodyOf(calls[0]);
    expect(body.send).not.toBe(true);
    expect(Object.keys(body)).not.toContain("scheduled_at");
    expect(calls.some((c) => c.url.includes("/send"))).toBe(false);
  });

  it("9. returns 502 and never writes Sanity when Resend broadcast creation fails", async () => {
    script(() => ({
      status: 422,
      body: { statusCode: 422, name: "validation_error", message: "Invalid `from` field." },
    }));
    const POST = await loadRoute();
    const res = await POST(bearer(READY));
    expect(res.status).toBe(502);
    const calls = fetchEvents(log());
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(BROADCASTS_URL);
    expect(sanityEvents()).toHaveLength(0);
  });

  it("10. returns 502 and never writes Sanity when fetch throws", async () => {
    script(() => ({ throws: new TypeError("fetch failed") }));
    const POST = await loadRoute();
    const res = await POST(bearer(READY));
    expect(res.status).toBe(502);
    expect(fetchEvents(log())).toHaveLength(1);
    expect(sanityEvents()).toHaveLength(0);
  });

  it("11. returns 502 when the broadcast succeeds but the Sanity commit rejects", async () => {
    shared.commitError = new Error("sanity unavailable");
    const POST = await loadRoute();
    const res = await POST(bearer(READY));
    expect(res.status).toBe(502);
    const calls = fetchEvents(log());
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(BROADCASTS_URL);
    expect(log().filter((e) => e.kind === "sanity.commit")).toHaveLength(1);
  });

  it("12. escapes <, >, & and \" from the title and description inside the broadcast html", async () => {
    const title = `Tom & "Jerry" <img src=x onerror=alert(1)>`;
    const description = `Rock & "roll" <script>alert(2)</script>`;
    const POST = await loadRoute();
    const res = await POST(bearer({ ...READY, title, description }));
    expect(res.status).toBe(200);
    const [broadcast] = fetchEvents(log());
    const html = String(bodyOf(broadcast).html ?? "");
    expect(html.length).toBeGreaterThan(0);

    expect(html).not.toContain(title);
    expect(html).not.toContain("<img src=x");
    expect(html).not.toContain(`"Jerry"`);
    expect(html).not.toContain("Tom & ");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).toContain("Tom &amp; ");

    expect(html).not.toContain(description);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain(`"roll"`);
    expect(html).not.toContain("Rock & ");
  });

  it("13. rejects an invalid sanity-webhook-signature without Bearer with 401 and no writes", async () => {
    const POST = await loadRoute();
    const res = await POST(
      request(READY, {
        "sanity-webhook-signature": "t=1757721600000,v1=invalidsignaturevalue",
      }),
    );
    expect(res.status).toBe(401);
    expectNoWrites();
  });
});
