"use client";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Users,
  Leaf,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { stories, levels, type Level } from "@/lib/stories";
import { StoryShelfRow } from "./story-shelf-row";
import { useReadingLevel } from "./use-reading-level";
export function Library({ initialLevel = "paso" }: { initialLevel?: Level }) {
  const [level, setLevel] = useReadingLevel(initialLevel);
  return (
    <div className="container library-page child-library">
      <header className="page-heading">
        <h1>Elige tu cuento</h1>
      </header>
      <fieldset className="library-levels" data-level={level}>
        <legend>Quiero leer</legend>
        <div>
          {(["paso", "reto"] as const).map((id) => (
            <label key={id} className={level === id ? "selected" : ""}>
              <input
                type="radio"
                name="nivel"
                value={id}
                checked={level === id}
                onChange={() => setLevel(id)}
                aria-labelledby={`library-level-${id}-title`}
                aria-describedby={`library-level-${id}-detail`}
              />
              <span className="library-level-text">
                <strong id={`library-level-${id}-title`}>
                  {levels[id].label}
                </strong>
                <span id={`library-level-${id}-detail`}>
                  {id === "paso" ? "Frases cortas" : "Más vocabulario"}
                </span>
              </span>
            </label>
          ))}
        </div>
        <p
          role="status"
          id="library-level-feedback"
          className="library-level-feedback"
          aria-live="polite"
          aria-atomic="true"
        >
          {level === "reto" ? (
            <CheckCircle2 size={18} aria-hidden="true" />
          ) : (
            <Leaf size={18} aria-hidden="true" />
          )}
          <span key={level}>
            {level === "paso"
              ? "Frases cortas para leer con calma."
              : "Reto listo. Elige una portada para empezar."}
          </span>
        </p>
      </fieldset>
      <div className="story-shelves">
        <StoryShelfRow
          id="cuentos-amigos"
          title="Amigos"
          icon={<Users size={21} aria-hidden="true" />}
          priority
          level={level}
          books={stories.filter((story) =>
            [
              "luz-del-bosque",
              "cometa-en-equipo",
              "puente-de-ardillas",
            ].includes(story.id),
          )}
        />
        <StoryShelfRow
          id="cuentos-naturaleza"
          title="Naturaleza"
          icon={<Leaf size={21} aria-hidden="true" />}
          level={level}
          books={stories.filter((story) =>
            ["semilla-viajera", "nube-perdida", "tambor-lluvia"].includes(
              story.id,
            ),
          )}
        />
        <StoryShelfRow
          id="cuentos-descubrimientos"
          title="Descubrimientos"
          icon={<Compass size={21} aria-hidden="true" />}
          level={level}
          books={stories.filter((story) =>
            [
              "camino-al-faro",
              "mapa-sonidos",
              "pan-abuela",
              "botella-mar",
            ].includes(story.id),
          )}
        />
      </div>
      <Link className="library-create-card" href="/crear">
        <Sparkles size={24} aria-hidden="true" />
        <span>
          <strong>Crear un cuento</strong>
        </span>
        <ArrowRight size={20} aria-hidden="true" />
      </Link>
    </div>
  );
}
