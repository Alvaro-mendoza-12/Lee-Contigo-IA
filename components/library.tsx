"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Leaf,
  Sparkles,
  Users,
} from "lucide-react";
import {
  levels,
  storiesForShelf,
  storyCategories,
  type Level,
} from "@/lib/stories";
import { useReadingLevel } from "./use-reading-level";
import { StoryShelfRow } from "./story-shelf-row";

const categoryIcons = {
  amigos: Users,
  naturaleza: Leaf,
  aventuras: Compass,
};
const categoryIds = {
  amigos: "cuentos-amigos",
  naturaleza: "cuentos-naturaleza",
  aventuras: "cuentos-descubrimientos",
};

export function Library({ initialLevel = "paso" }: { initialLevel?: Level }) {
  const [level, setLevel] = useReadingLevel(initialLevel);
  const shelf = storiesForShelf(level);

  return (
    <div className="container kid-library child-library">
      <header className="kid-hello">
        <h1>
          ¡Hola! <span aria-hidden="true">👋</span>
          <br />
          ¿Qué cuento leemos hoy?
        </h1>
      </header>

      <fieldset className="kid-levels" data-level={level}>
        <legend>Elige cómo leer</legend>
        <div className="kid-level-options">
          {(Object.keys(levels) as Level[]).map((id) => (
            <label
              key={id}
              className={"kid-level" + (level === id ? " selected" : "")}
            >
              <input
                type="radio"
                name="nivel"
                value={id}
                checked={level === id}
                onChange={() => setLevel(id)}
                aria-label={levels[id].label}
                aria-describedby="library-level-feedback"
              />
              <span className="kid-level-emoji" aria-hidden="true">
                {id === "paso" ? "🐣" : "🚀"}
              </span>
              <span>
                <strong>{levels[id].label}</strong>
                <small>
                  {id === "paso" ? "Frases cortas" : "Un poco más para explorar"}
                </small>
              </span>
            </label>
          ))}
        </div>
        <p
          id="library-level-feedback"
          className="library-level-feedback"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <BookOpen size={17} aria-hidden="true" />
          <span key={level}>
            {level === "paso"
              ? "Escoge una portada y empezamos."
              : "Reto listo. Tú marcas el ritmo."}
          </span>
        </p>
      </fieldset>

      <div className="story-shelves">
        {storyCategories.map((category, index) => {
          const Icon = categoryIcons[category.id];
          const books = shelf.filter((story) => story.category === category.id);
          return books.length ? (
            <StoryShelfRow
              key={category.id}
              id={categoryIds[category.id]}
              title={category.title}
              icon={<Icon size={20} aria-hidden="true" />}
              priority={index === 0}
              level={level}
              books={books}
            />
          ) : null;
        })}
      </div>

      <Link className="kid-create-link" href="/crear">
        <span className="kid-create-icon" aria-hidden="true">
          <Sparkles size={23} />
        </span>
        <span>
          <strong>Inventar mi cuento</strong>
          <small>Elige un personaje y una aventura</small>
        </span>
        <ArrowRight size={22} aria-hidden="true" />
      </Link>
    </div>
  );
}
