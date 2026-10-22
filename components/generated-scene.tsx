import { StoryScene } from "./story-scene";
import type { ScenePlan } from "@/lib/story-illustrations";
import type { CSSProperties } from "react";

export function GeneratedScene({
  plan,
  images,
  paragraph = 0,
  frame = 0,
}: {
  plan: ScenePlan;
  images?: (string | null)[];
  paragraph?: number;
  frame?: number;
}) {
  const image = images?.[paragraph];
  return image ? (
    <div
      className="generated-story-scene"
      data-scene-page={frame}
      style={{ "--scene-zoom": 1 + (frame % 3) * 0.035 } as CSSProperties}
    >
      <img
        src={image}
        width={640}
        height={640}
        alt={plan.scenes[paragraph]?.caption ?? "Ilustración del cuento"}
      />
    </div>
  ) : (
    <StoryScene plan={plan} paragraph={paragraph} frame={frame} />
  );
}
