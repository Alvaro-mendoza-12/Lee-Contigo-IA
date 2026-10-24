import { createHash } from "node:crypto";

export const CREATIONS_PER_MINUTE = 5;
const WINDOW_MS = 60_000;
const MAX_CLIENTS = 5000;

type Attempt = { at: number };
type Reservation =
  | { allowed: true; release: () => void }
  | { allowed: false; retryAfter: number };

/** A rolling minute in each server instance; no IP address is retained. */
export function createCreationLimiter() {
  const clients = new Map<string, Attempt[]>();
  return {
    reserve(request: Request, now = Date.now()): Reservation {
      const client = createHash("sha256")
        .update(
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "local",
        )
        .digest("hex");
      const active = (clients.get(client) ?? []).filter(
        (attempt) => attempt.at > now - WINDOW_MS,
      );
      if (active.length >= CREATIONS_PER_MINUTE)
        return {
          allowed: false,
          retryAfter: Math.max(
            1,
            Math.ceil((active[0].at + WINDOW_MS - now) / 1000),
          ),
        };
      if (clients.size >= MAX_CLIENTS && !clients.has(client)) {
        for (const [key, attempts] of clients)
          if (attempts.every((attempt) => attempt.at <= now - WINDOW_MS))
            clients.delete(key);
        if (clients.size >= MAX_CLIENTS)
          return { allowed: false, retryAfter: 60 };
      }
      const attempt = { at: now };
      active.push(attempt);
      clients.set(client, active);
      return {
        allowed: true,
        release() {
          // An older request must never release a reservation in a new window.
          const remaining = clients
            .get(client)
            ?.filter((item) => item !== attempt);
          if (remaining?.length) clients.set(client, remaining);
          else clients.delete(client);
        },
      };
    },
  };
}
