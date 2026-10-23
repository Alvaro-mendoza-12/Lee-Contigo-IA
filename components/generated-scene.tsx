import { StoryScene } from "./story-scene";
import { BookOpen, LoaderCircle, Sparkles } from "lucide-react";
import type { ScenePlan } from "@/lib/story-illustrations";
import type { CSSProperties } from "react";

export function GeneratedScene({
  plan,
  images,
  paragraph = 0,
  frame = 0,
  showFallback = true,
  status = "ready",
}: {
  plan: ScenePlan;
  images?: (string | null)[];
  paragraph?: number;
  frame?: number;
  showFallback?: boolean;
  status?: "loading" | "ready" | "unavailable";
}) {
  const image = images?.[paragraph];
  if (image) {
    return (
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
    );
  }
  if (showFallback)
    return <StoryScene plan={plan} paragraph={paragraph} frame={frame} />;

  const pending = status === "loading";
  return (
    <div
      className={`generated-scene-placeholder${pending ? " is-loading" : ""}`}
      role="img"
      aria-label={
        pending
          ? `Preparando la ilustración de la página ${frame + 1}`
          : `Ilustración pendiente para la página ${frame + 1}`
      }
      data-scene-page={frame}
    >
      {pending ? (
        <LoaderCircle
          className="creator-spinner"
          size={34}
          aria-hidden="true"
        />
      ) : status === "unavailable" ? (
        <BookOpen size={34} aria-hidden="true" />
      ) : (
        <Sparkles size={34} aria-hidden="true" />
      )}
    </div>
  );
}
