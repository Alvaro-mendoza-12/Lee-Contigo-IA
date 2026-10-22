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
import { stories, levels, storyCategories, type Level } from "@/lib/stories";
import { StoryShelfRow } from "./story-shelf-row";
import { useReadingLevel } from "./use-reading-level";
const categoryIcons = { amigos: Users, naturaleza: Leaf, aventuras: Compass };
const categoryIds = {
  amigos: "cuentos-amigos",
  naturaleza: "cuentos-naturaleza",
  aventuras: "cuentos-descubrimientos",
};
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
        {storyCategories.map((category, index) => {
          const Icon = categoryIcons[category.id];
          const books = stories.filter(
            (story) => story.category === category.id,
          );
          return books.length ? (
            <StoryShelfRow
              key={category.id}
              id={categoryIds[category.id]}
              title={category.title}
              icon={<Icon size={21} aria-hidden="true" />}
              priority={index === 0}
              level={level}
              books={books}
            />
          ) : null;
        })}
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
