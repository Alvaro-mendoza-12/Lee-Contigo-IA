"use client";
import Link from "next/link";
import { stories, levels, type Level } from "@/lib/stories";
import { StoryArt } from "./art";
import { useReadingLevel } from "./use-reading-level";

const levelEmoji: Record<Level, string> = { paso: "🐣", reto: "🚀" };
const cardColors = ["sun", "sky", "pink", "lime", "orange", "purple"];

export function Library({ initialLevel = "paso" }: { initialLevel?: Level }) {
  const [level, setLevel] = useReadingLevel(initialLevel);
  return (
    <div className="container kid-library">
      <header className="kid-hello">
        <h1>
          ¡Hola! <span aria-hidden="true">👋</span>
          <br />
          ¿Qué cuento leemos hoy?
        </h1>
      </header>
      <fieldset className="kid-levels">
        <legend className="sr-only">¿Cómo te gustaría leer?</legend>
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
            />
            <span className="kid-level-emoji" aria-hidden="true">
              {levelEmoji[id]}
            </span>
            <span>
              <strong>{levels[id].label}</strong>
              <small>{levels[id].description}</small>
            </span>
          </label>
        ))}
      </fieldset>
      <ul className="kid-story-grid">
        {stories.map((story, index) => (
          <li key={story.id}>
            <Link
              className={`kid-story-card card-${cardColors[index % cardColors.length]}`}
              href={"/leer/" + story.id + "?nivel=" + level}
              aria-label={"Leer " + story.title}
            >
              <StoryArt variant={story.art} priority={index < 4} />
              <span className="kid-story-title">{story.title}</span>
              <span className="kid-story-time" aria-hidden="true">
                ⏱ {story.minutes} min
              </span>
            </Link>
          </li>
        ))}
        <li>
          <Link className="kid-story-card kid-create-card" href="/crear">
            <span className="kid-create-art" aria-hidden="true">
              ✨🖍️📖
            </span>
            <span className="kid-story-title">Inventa tu cuento</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
