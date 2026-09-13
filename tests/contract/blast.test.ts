import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchEvents,
  installFakeFetch,
  type ProviderEvent,
  type ScriptedResponse,
} from "./helpers";

// Shared, ordered log of Kit fetches and Sanity writes, plus the Sanity script.
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
const KIT_KEY = "test-kit-key";
const BROADCASTS_URL = "https://api.kit.com/v4/broadcasts";

const READY = {
  _type: "episode",
  _id: "ep-1",
  title: "T",
  youtubeId: "abc123",
  slug: "t",
  publishedAt: "2026-09-01T00:00:00Z",
  description: "D",
};

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

describe("POST /api/blast", () => {
  function script(responder: (i: number, url: string) => ScriptedResponse) {
    return installFakeFetch(log(), responder);
  }

  beforeEach(() => {
    vi.resetModules();
    shared.log.length = 0;
    shared.commitError = null;
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("SANITY_REVALIDATE_SECRET", SECRET);
    vi.stubEnv("KIT_API_KEY", KIT_KEY);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
    script(() => ({ status: 201, body: { broadcast: { id: 99 } } }));
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

  it("6. returns 500 with no writes when KIT_API_KEY is missing for a ready episode", async () => {
    vi.stubEnv("KIT_API_KEY", undefined);
    const POST = await loadRoute();
    const res = await POST(bearer(READY));
    expect(res.status).toBe(500);
    expectNoWrites();
  });

  it("7. creates an unsent private Kit draft, then sets the Sanity flag (string and {current} slug)", async () => {
    for (const slug of ["t", { current: "t" }]) {
      shared.log.length = 0;
      const POST = await loadRoute();
      const res = await POST(bearer({ ...READY, slug }));
      const label = `slug ${JSON.stringify(slug)}`;
      expect(res.status, label).toBe(200);

      const calls = fetchEvents(log());
      expect(calls, label).toHaveLength(1);
      const [kit] = calls;
      expect(kit.method).toBe("POST");
      expect(kit.url).toBe(BROADCASTS_URL);
      expect(kit.headers["x-kit-api-key"]).toBe(KIT_KEY);
      const body = kit.body as Record<string, unknown>;
      expect(body).toHaveProperty("send_at", null);
      expect(body.public).toBe(false);
      expect(String(body.subject)).toContain(READY.title);

      const patches = log().filter((e) => e.kind === "sanity.patch");
      const sets = log().filter((e) => e.kind === "sanity.set");
      const commits = log().filter((e) => e.kind === "sanity.commit");
      expect(patches).toEqual([{ kind: "sanity.patch", id: "ep-1" }]);
      expect(sets).toHaveLength(1);
      expect(sets[0]).toMatchObject({
        id: "ep-1",
        payload: { newsletterDraftCreated: true },
      });
      expect(commits).toEqual([{ kind: "sanity.commit", id: "ep-1" }]);

      const kitIndex = log().indexOf(kit);
      const firstSanityIndex = log().findIndex((e) => e.kind.startsWith("sanity."));
      const commitIndex = log().indexOf(commits[0]);
      expect(kitIndex).toBeLessThan(firstSanityIndex);
      expect(kitIndex).toBeLessThan(commitIndex);
    }
  });

  it("8. returns 502 and never writes Sanity when Kit broadcast creation fails", async () => {
    script(() => ({ status: 422, body: { errors: ["bad broadcast"] } }));
    const POST = await loadRoute();
    const res = await POST(bearer(READY));
    expect(res.status).toBe(502);
    expect(fetchEvents(log())).toHaveLength(1);
    expect(sanityEvents().filter((e) => e.kind === "sanity.commit")).toHaveLength(0);
  });

  it("9. returns 502 when Kit succeeds but the Sanity commit rejects", async () => {
    shared.commitError = new Error("sanity unavailable");
    const POST = await loadRoute();
    const res = await POST(bearer(READY));
    expect(res.status).toBe(502);
    expect(fetchEvents(log())).toHaveLength(1);
    expect(log().filter((e) => e.kind === "sanity.commit")).toHaveLength(1);
  });

  it("10. escapes HTML in the episode title inside broadcast content", async () => {
    const title = "<img src=x onerror=alert(1)>";
    const POST = await loadRoute();
    const res = await POST(bearer({ ...READY, title }));
    expect(res.status).toBe(200);
    const [kit] = fetchEvents(log());
    const content = String((kit.body as Record<string, unknown>).content ?? "");
    expect(content.length).toBeGreaterThan(0);
    expect(content).not.toContain(title);
    expect(content).not.toContain("<img src=x");
  });

  it("11. rejects an invalid sanity-webhook-signature without Bearer with 401 and no writes", async () => {
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
