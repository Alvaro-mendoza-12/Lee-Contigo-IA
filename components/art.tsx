import Image from "next/image";
import forest from "@/public/images/bosque-luciernaga.png";
import seed from "@/public/images/semilla-ventana.png";
import lighthouse from "@/public/images/tortuga-faro-escenas.png";
import kite from "@/public/images/cometa-escenas.png";
import forestBook from "@/public/images/bosque-libro-8.png";
import seedBook from "@/public/images/semilla-libro-8.png";
import lighthouseBook from "@/public/images/faro-libro-8.png";
import kiteBook from "@/public/images/cometa-libro-8.png";
import type { StoryArtVariant } from "@/lib/stories";
import type { CSSProperties } from "react";

const illustrations = { night: forest, seed, lighthouse, kite };
const bookIllustrations = {
  night: forestBook,
  seed: seedBook,
  lighthouse: lighthouseBook,
  kite: kiteBook,
};
const bookDescriptions = {
  night: [
    "Lina brilla junto al río al anochecer.",
    "Lina observa su pequeña luz.",
    "Tomás llega entre las hojas.",
    "Tomás mira las piedras del río en la oscuridad.",
    "Lina ilumina la primera piedra.",
    "Tomás sigue la luz de Lina por las piedras.",
    "Los amigos llegan a la otra orilla.",
    "Lina y Tomás comparten un momento junto al río.",
  ],
  seed: [
    "Nico encuentra una semilla en un bolsillo.",
    "Nico observa la semilla junto a la ventana.",
    "Nico prepara una maceta con tierra.",
    "Nico planta la semilla con cuidado.",
    "Nico riega la tierra.",
    "Nico espera y observa la maceta.",
    "Un pequeño brote aparece en la tierra.",
    "Nico admira la planta junto a la ventana.",
  ],
  lighthouse: [
    "Mara consulta su mapa.",
    "Mara guarda una manzana.",
    "Mara compara dos señales en la curva.",
    "Mara y una gaviota miran el camino de conchas.",
    "Mara observa arena sobre el sendero.",
    "Mara descubre una concha bajo la arena.",
    "Mara llega al jardín del faro.",
    "Mara y la gaviota descansan junto al faro al anochecer.",
  ],
  kite: [
    "Teo prepara una cometa azul.",
    "Ada llega con unas cintas.",
    "La cometa se inclina hacia el césped.",
    "Los amigos observan la cola corta.",
    "Los amigos añaden una cola más larga.",
    "Teo y Ada prueban la cometa con su nueva cola.",
    "La cometa sube mientras los amigos la siguen.",
    "Teo y Ada admiran la cometa que vuela estable.",
  ],
};
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
  scene,
  frame = 0,
}: {
  variant: StoryArtVariant;
  className?: string;
  priority?: boolean;
  scene?: number;
  frame?: number;
}) {
  const book = scene !== undefined;
  const atlas = book || variant === "lighthouse" || variant === "kite";
  const panel = Math.min(Math.max(scene ?? 0, 0), book ? 7 : 3);
  const sourcePanel =
    book && variant === "kite" ? [0, 1, 2, 3, 5, 4, 6, 7][panel] : panel;
  const picture = (
    <Image
      src={book ? bookIllustrations[variant] : illustrations[variant]}
      alt={book ? bookDescriptions[variant][panel] : descriptions[variant][0]}
      sizes="(max-width: 600px) 100vw, 1100px"
      preload={priority}
      placeholder="blur"
    />
  );
  return (
    <div
      className={`story-art ${atlas ? "scene-art-grid" : ""} ${className}`}
      style={
        {
          "--scene-x": `${sourcePanel % 2 ? -100 : 0}%`,
          "--scene-y": `${-Math.floor(sourcePanel / 2) * 100}%`,
          "--atlas-columns": 2,
          "--atlas-rows": book ? 4 : 2,
          "--art-zoom": book ? 1.035 + (frame % 3) * 0.025 : 1.02,
          "--art-focus": `${frame % 2 ? 60 : 40}% ${frame % 3 === 0 ? 45 : 55}%`,
        } as CSSProperties
      }
      data-scene={book ? panel : "cover"}
      data-frame={frame}
    >
      {atlas ? <div className="art-camera">{picture}</div> : picture}
    </div>
  );
}
