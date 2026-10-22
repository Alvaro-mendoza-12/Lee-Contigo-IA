export const narrationVoiceIds = ["george", "sarah", "daniel"] as const;
export type NarrationVoice = (typeof narrationVoiceIds)[number];
export const narrationVoices = [
  { value: "george", label: "George" },
  { value: "sarah", label: "Sarah" },
  { value: "daniel", label: "Daniel" },
] as const;

export function isNarrationVoice(value: unknown): value is NarrationVoice {
  return narrationVoiceIds.some((voice) => voice === value);
}
