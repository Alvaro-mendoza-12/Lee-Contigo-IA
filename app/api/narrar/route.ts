import { createHash } from "node:crypto";
import { narrationInput, resolveNarration } from "@/lib/narration";

export const runtime = "nodejs";
export const maxDuration = 20;
// Bounded, transient editorial audio cache. Generated books are never cached here.
const cache = new Map<string, { audio: ArrayBuffer; until: number }>();
const pending = new Map<string, Promise<ArrayBuffer>>();
const limits = new Map<
  string,
  { calls: number; characters: number; until: number }
>();
function failure(status: number) {
  return Response.json(
    { error: "La voz no está disponible. Puedes usar la voz del dispositivo." },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
function audioResponse(audio: ArrayBuffer) {
  return new Response(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
      "Content-Disposition": 'inline; filename="leecontigo-elevenlabs.io.mp3"',
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  try {
    if (
      origin &&
      new URL(origin).host !==
        (request.headers.get("host") ?? new URL(request.url).host)
    )
      return failure(403);
  } catch {
    return failure(403);
  }
  if (!request.headers.get("content-type")?.includes("application/json"))
    return failure(415);
  if (Number(request.headers.get("content-length") ?? 0) > 4096)
    return failure(413);
  let input;
  try {
    const body = await request.text();
    if (body.length > 4096) return failure(413);
    input = narrationInput.safeParse(JSON.parse(body));
  } catch {
    return failure(400);
  }
  if (!input.success) return failure(400);
  const secret = process.env.ELEVENLABS_API_KEY;
  if (!secret) return failure(503);
  const text = resolveNarration(input.data, secret);
  if (!text) return failure(400);
  const voice = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
  const model = "eleven_flash_v2_5";
  const now = Date.now();
  for (const [id, item] of cache) if (item.until < now) cache.delete(id);
  for (const [id, item] of limits) if (item.until < now) limits.delete(id);
  const key = createHash("sha256")
    .update(`${voice}:${model}:${text}`)
    .digest("hex");
  const editorial = input.data.source === "catalogue";
  const hit = editorial ? cache.get(key) : undefined;
  if (hit) return audioResponse(hit.audio);
  const client = createHash("sha256")
    .update(request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local")
    .digest("hex");
  const quota = limits.get(client) ?? {
    calls: 0,
    characters: 0,
    until: now + 600_000,
  };
  if (
    ++quota.calls > 24 ||
    (quota.characters += text.length) > 8000 ||
    (limits.size >= 5000 && !limits.has(client))
  )
    return failure(429);
  limits.set(client, quota);
  try {
    const generate = async () => {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: {
            "xi-api-key": secret,
            "Content-Type": "application/json",
            Accept: "audio/mpeg",
          },
          body: JSON.stringify({
            text,
            model_id: model,
            language_code: "es",
            voice_settings: {
              stability: 0.65,
              similarity_boost: 0.7,
              speed: 0.85,
            },
          }),
          signal: AbortSignal.any([request.signal, AbortSignal.timeout(12000)]),
        },
      );
      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("audio")
      ) {
        console.warn("narration_unavailable", { status: response.status });
        throw new Error("NarrationUnavailable");
      }
      const audio = await response.arrayBuffer();
      if (!audio.byteLength || audio.byteLength > 3_000_000)
        throw new Error("AudioSize");
      if (editorial) {
        if (cache.size >= 24) cache.delete(cache.keys().next().value!);
        cache.set(key, { audio, until: now + 1800_000 });
      }
      return audio;
    };
    let job = editorial ? pending.get(key) : undefined;
    if (!job) {
      job = generate();
      if (editorial) pending.set(key, job);
    }
    try {
      return audioResponse(await job);
    } finally {
      if (editorial && pending.get(key) === job) pending.delete(key);
    }
  } catch {
    return failure(503);
  }
}
