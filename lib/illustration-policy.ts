import { z } from "zod";

export const illustrationPolicySchema = z
  .object({
    allowHumanAnimalHybrids: z.boolean(),
    authorization: z
      .string()
      .max(200)
      .regex(/^\d{13}\.[a-f0-9]{64}$/),
  })
  .strict();
export type IllustrationPolicy = z.infer<typeof illustrationPolicySchema>;

export function imageAnatomyRules(allowHumanAnimalHybrids = false) {
  return allowHumanAnimalHybrids
    ? "Only depict the human-animal hybrid explicitly described in the passage/reference. Keep every other character anatomically separate; never fuse neighboring characters."
    : "Keep humans fully human and animals their own species, in separate bodies. No human-animal hybrids, human faces on animals, animal heads/ears/tails on people, merged bodies or mixed limbs. Talking or clothed animals remain animals.";
}
