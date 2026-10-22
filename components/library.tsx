"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Clock3 } from "lucide-react";
import { stories, levels, type Level } from "@/lib/stories";
import { StoryArt } from "./art";
import { useReadingLevel } from "./use-reading-level";
export function Library({ initialLevel = "paso" }: { initialLevel?: Level }) {
  const [level, setLevel] = useReadingLevel(initialLevel);
  return (
    <div className="container library-page child-library">
      <header className="page-heading">
        <span className="library-count">
          <BookOpen size={17} aria-hidden="true" /> 10 cuentos ilustrados
        </span>
        <h1>Elige tu cuento</h1>
        <p>Toca una portada y empieza a leer.</p>
      </header>
      <fieldset className="library-levels">
        <legend>¿Cómo quieres leer?</legend>
        <div>
          {(["paso", "reto"] as const).map((id) => (
            <label key={id} className={level === id ? "selected" : ""}>
              <input
                type="radio"
                name="nivel"
                value={id}
                checked={level === id}
                onChange={() => setLevel(id)}
              />
              {levels[id].label}
            </label>
          ))}
        </div>
        <p role="status">
          {level === "paso"
            ? "Frases cortas para leer con calma."
            : "Más vocabulario y nuevas ideas."}
        </p>
      </fieldset>
      <div className="story-grid">
        {stories.map((story, index) => (
          <Link
            key={story.id}
            className="story-card story-card-direct"
            href={`/leer/${story.id}?nivel=${level}`}
            aria-label={`Leer ${story.title}`}
          >
            <div className="story-cover-link">
              <StoryArt variant={story.art} priority={index < 2} />
              <span className="story-cover-open" aria-hidden="true">
                <ArrowRight size={22} />
              </span>
            </div>
            <div className="story-card-body">
              <div className="story-meta">
                <span>{story.theme}</span>
                <span>
                  <Clock3 size={13} aria-hidden="true" /> {story.minutes} min
                </span>
              </div>
              <h2>{story.title}</h2>
              <span className="story-card-invite">
                Leer cuento <ArrowRight size={15} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <Link className="library-create-card" href="/crear">
        <Sparkles size={24} aria-hidden="true" />
        <span>
          <strong>Crea una aventura tuya</strong>
          <small>Empieza con una idea.</small>
        </span>
        <ArrowRight size={20} aria-hidden="true" />
      </Link>
    </div>
  );
}
