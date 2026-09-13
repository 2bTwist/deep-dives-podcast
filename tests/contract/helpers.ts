import { vi } from "vitest";

/** One entry in the shared, ordered provider event log. */
export type ProviderEvent =
  | {
      kind: "fetch";
      method: string;
      url: string;
      headers: Record<string, string>;
      body: unknown;
    }
  | { kind: "sanity.patch"; id: string }
  | { kind: "sanity.set"; id: string; payload: Record<string, unknown> }
  | { kind: "sanity.commit"; id: string };

export type FetchEvent = Extract<ProviderEvent, { kind: "fetch" }>;

export type ScriptedResponse =
  | { status: number; body?: unknown }
  | { throws: Error };

/** Lower-cased header map from any HeadersInit. */
function headerRecord(init: HeadersInit | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  new Headers(init).forEach((value, key) => {
    out[key.toLowerCase()] = value;
  });
  return out;
}

function parseBody(body: unknown): unknown {
  if (typeof body !== "string") return body ?? null;
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

/**
 * Installs a fake global fetch. Each call is appended to `log` and answered
 * from `responder`, which receives the zero-based call index and the URL.
 */
export function installFakeFetch(
  log: ProviderEvent[],
  responder: (index: number, url: string) => ScriptedResponse,
) {
  let index = 0;
  const fake = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    let url: string;
    let method = init?.method ?? "GET";
    let headers = headerRecord(init?.headers);
    let rawBody: unknown = init?.body;
    if (input instanceof Request) {
      url = input.url;
      method = init?.method ?? input.method;
      headers = { ...headerRecord(input.headers), ...headers };
      if (rawBody === undefined) rawBody = await input.clone().text();
    } else {
      url = input.toString();
    }
    log.push({
      kind: "fetch",
      method: method.toUpperCase(),
      url,
      headers,
      body: parseBody(rawBody),
    });
    const scripted = responder(index++, url);
    if ("throws" in scripted) throw scripted.throws;
    return new Response(
      scripted.body === undefined ? "{}" : JSON.stringify(scripted.body),
      {
        status: scripted.status,
        headers: { "content-type": "application/json" },
      },
    );
  });
  vi.stubGlobal("fetch", fake);
  return fake;
}

export function fetchEvents(log: ProviderEvent[]): FetchEvent[] {
  return log.filter((e): e is FetchEvent => e.kind === "fetch");
}

let ipCounter = 0;
/** A distinct client IP per call so the in-memory rate limiter never collides. */
export function uniqueIp(): string {
  ipCounter += 1;
  return `10.0.${Math.floor(ipCounter / 250)}.${(ipCounter % 250) + 1}`;
}

export function jsonRequest(
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Every console.error argument across all calls, stringified. */
export function consoleErrorText(spy: {
  mock: { calls: unknown[][] };
}): string {
  return spy.mock.calls
    .flat()
    .map((arg) => {
      if (arg instanceof Error) return `${arg.name}: ${arg.message} ${arg.stack ?? ""}`;
      if (typeof arg === "string") return arg;
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join("\n");
}
