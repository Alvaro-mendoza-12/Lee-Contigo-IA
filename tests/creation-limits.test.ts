import { test } from "node:test";
import assert from "node:assert/strict";
import { createCreationLimiter } from "../lib/creation-limits.ts";

function client(ip = "192.0.2.1") {
  return new Request("https://example.test/api/crear", {
    headers: { "x-forwarded-for": ip },
  });
}

test("permite cinco creaciones por cliente y bloquea la sexta en una ventana móvil", () => {
  const limiter = createCreationLimiter();
  const request = client();
  for (let i = 0; i < 5; i++)
    assert.equal(limiter.reserve(request, 1000 + i * 1000).allowed, true);
  assert.deepEqual(limiter.reserve(request, 6000), {
    allowed: false,
    retryAfter: 55,
  });
  assert.equal(limiter.reserve(client("192.0.2.2"), 6000).allowed, true);
  // Exactly the oldest slot expires, rather than opening a new bucket of five.
  assert.equal(limiter.reserve(request, 61_000).allowed, true);
  assert.deepEqual(limiter.reserve(request, 61_000), {
    allowed: false,
    retryAfter: 1,
  });
  assert.equal(limiter.reserve(request, 62_000).allowed, true);
});

test("un fallo libera su reserva una sola vez y no libera creaciones posteriores", () => {
  const limiter = createCreationLimiter();
  const request = client();
  const attempt = limiter.reserve(request, 0);
  assert.equal(attempt.allowed, true);
  if (!attempt.allowed) throw new Error("Expected reservation");
  attempt.release();
  attempt.release();
  for (let i = 0; i < 5; i++)
    assert.equal(limiter.reserve(request, 500).allowed, true);
  assert.equal(limiter.reserve(request, 500).allowed, false);
  for (let i = 0; i < 5; i++)
    assert.equal(limiter.reserve(request, 60_500).allowed, true);
  attempt.release();
  assert.equal(limiter.reserve(request, 60_500).allowed, false);
});
