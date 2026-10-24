import sharp from "sharp";
import { createScenePrompt, type ScenePlan } from "./story-illustrations.ts";

export const CLOUDFLARE_IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";

/** Six independent scenes, two requests at a time, with an absolute deadline.
 * No paid-model fallback, retries, remote storage or arbitrary image endpoints. */
export async function generateCloudflareScenes({
  plan,
  description,
  paragraphs,
  allowHumanAnimalHybrids = false,
  token,
  accountId,
  signal,
  fetcher = fetch,
}: {
  plan: ScenePlan;
  description: string;
  paragraphs: string[];
  allowHumanAnimalHybrids?: boolean;
  token: string;
  accountId: string;
  signal: AbortSignal;
  fetcher?: typeof fetch;
}): Promise<(string | null)[]> {
  const images: (string | null)[] = Array(6).fill(null);
  if (!token || !/^[a-f0-9]{32}$/i.test(accountId) || paragraphs.length !== 6)
    return images;
  const deadline = AbortSignal.any([signal, AbortSignal.timeout(42000)]);
  let next = 0;
  let unavailable = false;
  async function worker() {
    while (!deadline.aborted && !unavailable && next < 6) {
      const index = next++;
      try {
        const response = await fetcher(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CLOUDFLARE_IMAGE_MODEL}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: createScenePrompt(
                plan,
                description,
                paragraphs[index],
                index,
                allowHumanAnimalHybrids,
                paragraphs[index - 1],
              ),
              steps: 4,
            }),
            signal: deadline,
          },
        );
        if (!response.ok) {
          unavailable = true;
          console.warn("cloudflare_image_unavailable", {
            status: response.status,
          });
          break;
        }
        // Bound the upstream body before parsing or decoding it.
        const reader = response.body?.getReader();
        if (!reader) throw new Error("ImageBodyMissing");
        let size = 0;
        const chunks: Uint8Array[] = [];
        try {
          while (true) {
            const part = await reader.read();
            if (part.done) break;
            size += part.value.byteLength;
            if (size > 8_000_000) throw new Error("ImageBodyTooLarge");
            chunks.push(part.value);
          }
        } finally {
          await reader.cancel().catch(() => undefined);
        }
        const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        const base64 = body?.success === true ? body.result?.image : null;
        if (typeof base64 !== "string" || !/^[A-Za-z0-9+/=]+$/.test(base64))
          throw new Error("ImageFormat");
        const original = sharp(Buffer.from(base64, "base64"), {
          limitInputPixels: 16_000_000,
        });
        const metadata = await original.metadata();
        if (!metadata.width || !metadata.height)
          throw new Error("ImageDimensions");
        // Reserve a clean story frame, trimming the footer where models sometimes invent signatures.
        const data = await original
          .extract({
            left: 0,
            top: 0,
            width: metadata.width,
            height: Math.max(1, Math.floor(metadata.height * 0.9)),
          })
          .resize(640, 640, { fit: "cover", withoutEnlargement: true })
          .webp({ quality: 76 })
          .toBuffer();
        if (deadline.aborted) break;
        if (!data.length || data.length > 250_000) throw new Error("ImageSize");
        images[index] = `data:image/webp;base64,${data.toString("base64")}`;
      } catch (error) {
        unavailable = true;
        console.warn("cloudflare_image_fallback", {
          name: error instanceof Error ? error.name : "unknown",
        });
      }
    }
  }
  await Promise.all([worker(), worker()]);
  return images;
}
