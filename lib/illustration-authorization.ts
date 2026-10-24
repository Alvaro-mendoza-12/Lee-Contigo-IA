import { signParagraph, verifyParagraph } from "./narration.ts";
import { getOpenRouterKeys } from "./openrouter.ts";
import {
  illustrationPolicySchema,
  type IllustrationPolicy,
} from "./illustration-policy.ts";

// Reuse a configured server secret, without requiring the optional narration service.
export function illustrationSigningSecret() {
  return (
    process.env.STORY_ILLUSTRATION_SECRET ||
    process.env.ELEVENLABS_API_KEY ||
    process.env.CLOUDFLARE_API_TOKEN ||
    process.env.AI_GATEWAY_API_KEY ||
    getOpenRouterKeys()[0] ||
    process.env.VERCEL_OIDC_TOKEN
  );
}

function signedContent(
  paragraphs: string[],
  artDescription: string,
  allowHumanAnimalHybrids: boolean,
) {
  return JSON.stringify({
    purpose: "story-illustrations-v1",
    paragraphs,
    artDescription,
    allowHumanAnimalHybrids,
  });
}

export function authorizeIllustrations(
  paragraphs: string[],
  artDescription: string,
  allowHumanAnimalHybrids: boolean,
  secret: string,
): IllustrationPolicy {
  return {
    allowHumanAnimalHybrids,
    authorization: signParagraph(
      signedContent(paragraphs, artDescription, allowHumanAnimalHybrids),
      secret,
    ),
  };
}

export function verifyIllustrationPolicy(
  paragraphs: string[],
  artDescription: string,
  policy: IllustrationPolicy,
  secret: string,
) {
  const parsed = illustrationPolicySchema.safeParse(policy);
  return (
    parsed.success &&
    verifyParagraph(
      signedContent(
        paragraphs,
        artDescription,
        parsed.data.allowHumanAnimalHybrids,
      ),
      parsed.data.authorization,
      secret,
    )
  );
}
