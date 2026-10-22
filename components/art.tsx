import Image from "next/image";
import forest from "@/public/images/bosque-luciernaga.png";
import seed from "@/public/images/semilla-ventana.png";
import lighthouse from "@/public/images/tortuga-faro-escenas.png";
import kite from "@/public/images/cometa-escenas.png";
import type { StoryArtVariant } from "@/lib/stories";
import type { CSSProperties } from "react";

const illustrations = { night: forest, seed, lighthouse, kite };
const descriptions = {
  night: ["Una luciérnaga ilumina las piedras de un río junto a un grillo."],
  seed: ["Un brote crece junto a una ventana, con sus raíces bajo la tierra."],
  lighthouse: [
    "Mara consulta un mapa junto al mar.",
    "Mara compara las señales de concha y hoja.",
    "Mara encuentra las conchas del sendero.",
    "Mara y la gaviota llegan al faro al atardecer.",
  ],
  kite: [
    "Teo y Ada preparan una cometa azul.",
    "La cometa se inclina y los amigos la observan.",
    "Ada y Teo alargan la cola de la cometa.",
    "Los amigos consiguen hacer volar la cometa.",
  ],
};
export function StoryArt({
  variant,
  className = "",
  priority = false,
  scene = 0,
}: {
  variant: StoryArtVariant;
  className?: string;
  priority?: boolean;
  scene?: number;
}) {
  const atlas = variant === "lighthouse" || variant === "kite";
  const panel = Math.min(Math.max(scene, 0), 3);
  return (
    <div
      className={`story-art ${atlas ? "scene-art-grid" : ""} ${className}`}
      style={
        {
          "--scene-x": `${panel % 2 ? -100 : 0}%`,
          "--scene-y": `${panel > 1 ? -100 : 0}%`,
        } as CSSProperties
      }
      data-scene={panel}
    >
      <Image
        src={illustrations[variant]}
        alt={descriptions[variant][atlas ? panel : 0]}
        sizes="(max-width: 760px) 100vw, (max-width: 1100px) 65vw, 700px"
        preload={priority}
        placeholder="blur"
      />
    </div>
  );
}
