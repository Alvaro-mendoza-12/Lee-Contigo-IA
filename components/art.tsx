import Image from "next/image";
import forest from "@/public/images/bosque-luciernaga.png";
import seed from "@/public/images/semilla-ventana.png";
import lighthouse from "@/public/images/tortuga-faro-escenas.png";
import kite from "@/public/images/cometa-escenas.png";
import forestBook from "@/public/images/bosque-libro-8.png";
import seedBook from "@/public/images/semilla-libro-8.png";
import lighthouseBook from "@/public/images/faro-libro-8.png";
import kiteBook from "@/public/images/cometa-libro-8.png";
import bridge from "@/public/images/puente-libro-4.png";
import cloud from "@/public/images/nube-libro-4.png";
import drum from "@/public/images/tambor-libro-4.png";
import soundmap from "@/public/images/mapa-libro-4.png";
import bread from "@/public/images/pan-libro-4.png";
import sea from "@/public/images/mar-libro-4.png";
import tracks from "@/public/images/sendero-libro-4.png";
import mail from "@/public/images/buzon-libro-4.png";
import type { StoryArtVariant } from "@/lib/stories";
import type { CSSProperties } from "react";

type PictureVariant = "night" | "seed" | "lighthouse" | "kite";
type CollectionArtVariant =
  | "tracks"
  | "mail"
  | "bridge"
  | "cloud"
  | "drum"
  | "soundmap"
  | "bread"
  | "sea";
type Scene = { main: string; extras: string[]; label: string };

// Bright, emoji-based scenes for the stories without painted illustrations.
const emojiScenes: Record<
  Exclude<StoryArtVariant, PictureVariant | CollectionArtVariant>,
  { colors: [string, string]; scenes: Scene[] }
> = {
  dragon: {
    colors: ["#b9f6ca", "#ffd6f5"],
    scenes: [
      { main: "🐉", extras: ["🌸", "🌼", "🌷"], label: "Bruno, el dragón verde, estornuda flores." },
      { main: "🐲", extras: ["🏔️", "😳", "🌸"], label: "Bruno se esconde en su cueva." },
      { main: "🎪", extras: ["🎉", "🍰", "🎈"], label: "El pueblo prepara una fiesta." },
      { main: "🐉", extras: ["💐", "🌺", "👏"], label: "Las flores de Bruno adornan la fiesta." },
    ],
  },
  ocean: {
    colors: ["#7fd8ff", "#2f7cf6"],
    scenes: [
      { main: "⭐", extras: ["🪸", "🐠", "🫧"], label: "Estela vive en una roca del mar." },
      { main: "🐟", extras: ["💧", "🫧", "🌿"], label: "Pipo, el pez amarillo, está perdido." },
      { main: "⭐", extras: ["🐟", "💬", "🫧"], label: "Estela escucha a Pipo." },
      { main: "🐠", extras: ["🪸", "🐟", "💛"], label: "Pipo vuelve con su familia." },
    ],
  },
  space: {
    colors: ["#5b3cc4", "#ff8ad8"],
    scenes: [
      { main: "📦", extras: ["🖍️", "🐱", "✨"], label: "Sofi construye un cohete de cartón." },
      { main: "🚀", extras: ["☁️", "⭐", "🌟"], label: "El cohete despega hacia las estrellas." },
      { main: "🌕", extras: ["👧", "🐱", "✨"], label: "Sofi y Lunares saltan en la luna." },
      { main: "🏠", extras: ["🌙", "🍽️", "💜"], label: "Sofi vuelve a casa para la cena." },
    ],
  },
  farm: {
    colors: ["#fff176", "#ffb74d"],
    scenes: [
      { main: "🐔", extras: ["🐥", "🐥", "🐥"], label: "Clara cuenta a sus pollitos." },
      { main: "🐔", extras: ["❓", "🐥", "🌾"], label: "¡Falta un pollito!" },
      { main: "🐄", extras: ["🐶", "💬", "🌾"], label: "Clara pregunta a la vaca y al perro." },
      { main: "🐥", extras: ["🌾", "🐔", "💛"], label: "Pío duerme en la paja." },
    ],
  },
  rain: {
    colors: ["#9be7ff", "#c5b3ff"],
    scenes: [
      { main: "☂️", extras: ["🌧️", "👦", "💧"], label: "Leo abre su paraguas de colores." },
      { main: "🐶", extras: ["💧", "☂️", "💧"], label: "Leo cubre al perrito mojado." },
      { main: "☂️", extras: ["👦", "👧", "🐶"], label: "Leo, Ana y el perrito caminan juntos." },
      { main: "🌈", extras: ["☀️", "😄", "🐶"], label: "Sale un arcoíris en el cielo." },
    ],
  },
  boat: {
    colors: ["#8be9ff", "#4f8cff"],
    scenes: [
      { main: "⛵", extras: ["👧", "📝", "🏠"], label: "Valeria escribe un mensaje en un barco de papel." },
      { main: "⛵", extras: ["🦆", "🐥", "🌊"], label: "El barco navega junto a los patos." },
      { main: "⛵", extras: ["🌬️", "🍃", "💦"], label: "El viento libera al barco y baja por la cascada." },
      { main: "👦", extras: ["⛵", "👧", "💛"], label: "Samuel encuentra el barco y conoce a Valeria." },
    ],
  },
  music: {
    colors: ["#a5f3a0", "#4fc3f7"],
    scenes: [
      { main: "🎶", extras: ["🐦", "🥁", "🦗"], label: "Los animales preparan un concierto." },
      { main: "🐸", extras: ["😢", "💧", "🌿"], label: "Rita la rana se va triste a su charca." },
      { main: "🦉", extras: ["🎼", "❓", "🌙"], label: "El búho dice que algo falta." },
      { main: "🐸", extras: ["🎵", "🥁", "👏"], label: "Rita canta y la música suena perfecta." },
    ],
  },
};

const illustrations = { night: forest, seed, lighthouse, kite };
const collectionArt = {
  tracks: {
    image: tracks,
    descriptions: [
      "Nina y Beto llegan a dos caminos con una cesta de merienda.",
      "Los amigos observan huellas de tres dedos en el barro.",
      "Nina descubre una pluma dorada protegida bajo unas hojas.",
      "Nina y Beto encuentran a Teo junto al estanque y comparten la merienda.",
    ],
  },
  mail: {
    image: mail,
    descriptions: [
      "Fito y Alma preparan un buzón azul junto a un árbol.",
      "Alma recoge las cartas que el viento ha sacado del buzón.",
      "Fito introduce un sobre por la abertura de la nueva tapa.",
      "Los amigos leen una invitación junto al buzón cerrado.",
    ],
  },
  bridge: {
    image: bridge,
    descriptions: [
      "Dos ardillas buscan una forma de cruzar el arroyo.",
      "Las amigas comprueban una rama que se mueve.",
      "Colocan piedras para sujetar el puente.",
      "Las amigas transportan sus nueces por el puente estable.",
    ],
  },
  cloud: {
    image: cloud,
    descriptions: [
      "Una nube observa un jardín seco.",
      "El girasol espera agua con las hojas inclinadas.",
      "La nube recoge agua en la niebla de una montaña.",
      "La lluvia suave devuelve humedad al jardín.",
    ],
  },
  drum: {
    image: drum,
    descriptions: [
      "Ari escucha gotas sobre un cubo.",
      "Ari compara el sonido de un recipiente.",
      "Recipientes de distintos tamaños reciben la lluvia bajo el techo.",
      "Dos amigos comparten el ritmo de la lluvia.",
    ],
  },
  soundmap: {
    image: soundmap,
    descriptions: [
      "Sol escucha los sonidos del parque con su abuelo.",
      "Sol dibuja la fuente en su mapa.",
      "Sol descubre una bicicleta al seguir una campanilla.",
      "Sol y su abuelo comparan el mapa con el parque.",
    ],
  },
  bread: {
    image: bread,
    descriptions: [
      "Inés y su abuela preparan la masa.",
      "La masa está junto a una ventana fría.",
      "Cambian el cuenco a una repisa templada.",
      "Comparten la alegría de ver crecer la masa y preparar pan.",
    ],
  },
  sea: {
    image: sea,
    descriptions: [
      "Nara y Tico encuentran una botella en la playa.",
      "El mensaje contiene dibujos de un pez y unas piedras.",
      "Los amigos encuentran una poza junto a un arco de roca.",
      "Descubren una concha junto a la poza.",
    ],
  },
};
function isCollection(
  variant: StoryArtVariant,
): variant is keyof typeof collectionArt {
  return variant in collectionArt;
}
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
  if (isCollection(variant)) {
    const item = collectionArt[variant];
    const panel = Math.min(3, Math.floor((scene ?? 0) / 2));
    return (
      <div
        className={`story-art scene-art-grid ${className}`}
        data-scene={scene === undefined ? "cover" : panel}
        data-frame={frame}
        style={
          {
            "--scene-x": `${panel % 2 ? -100 : 0}%`,
            "--scene-y": `${panel >= 2 ? -100 : 0}%`,
            "--atlas-columns": 2,
            "--atlas-rows": 2,
            "--art-zoom": 1.02,
            "--art-focus": "50% 50%",
          } as CSSProperties
        }
      >
        <div className="art-camera">
          <Image
            src={item.image}
            alt={item.descriptions[panel]}
            sizes={
              scene === undefined
                ? "(max-width: 600px) 100vw, 700px"
                : "(max-width: 600px) 200vw, 1200px"
            }
            preload={priority}
            placeholder="blur"
          />
        </div>
      </div>
    );
  }
  const book = scene !== undefined;
  if (!(variant in illustrations)) {
    const art = emojiScenes[variant as keyof typeof emojiScenes];
    const panel = Math.min(Math.max(scene ?? 0, 0), 7);
    const current = art.scenes[book ? Math.floor(panel / 2) : 0];
    return (
      <div
        className={`story-art emoji-art ${className}`}
        role="img"
        aria-label={current.label}
        style={
          {
            "--emoji-a": art.colors[0],
            "--emoji-b": art.colors[1],
          } as CSSProperties
        }
        data-scene={book ? panel : "cover"}
        data-frame={frame}
      >
        <span className="emoji-main" aria-hidden="true">
          {current.main}
        </span>
        {current.extras.map((extra, i) => (
          <span
            key={i}
            className={`emoji-extra emoji-extra-${i}`}
            aria-hidden="true"
          >
            {extra}
          </span>
        ))}
      </div>
    );
  }
  const pictureVariant = variant as PictureVariant;
  const atlas =
    book || pictureVariant === "lighthouse" || pictureVariant === "kite";
  const panel = Math.min(Math.max(scene ?? 0, 0), book ? 7 : 3);
  const sourcePanel =
    book && pictureVariant === "kite" ? [0, 1, 2, 3, 5, 4, 6, 7][panel] : panel;
  const picture = (
    <Image
      src={
        book ? bookIllustrations[pictureVariant] : illustrations[pictureVariant]
      }
      alt={
        book
          ? bookDescriptions[pictureVariant][panel]
          : descriptions[pictureVariant][0]
      }
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
          // Centre of the visible panel, so the slow zoom stays on it.
          "--drift-origin": atlas
            ? `${((sourcePanel % 2) + 0.5) * 50}% ${((Math.floor(sourcePanel / 2) + 0.5) / (book ? 4 : 2)) * 100}%`
            : "50% 50%",
        } as CSSProperties
      }
      data-scene={book ? panel : "cover"}
      data-frame={frame}
    >
      {atlas ? <div className="art-camera">{picture}</div> : picture}
    </div>
  );
}
