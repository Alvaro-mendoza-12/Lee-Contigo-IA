"use client";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  Leaf,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { stories, levels, type Level } from "@/lib/stories";
import { StoryArt } from "./art";
import { Journey } from "./journey";
import { useReadingLevel } from "./use-reading-level";
export function Library({ initialLevel = "paso" }: { initialLevel?: Level }) {
  const [level, setLevel] = useReadingLevel(initialLevel);
  return (
    <div className="container library-page">
      <Journey current={1} />
      <header className="page-heading">
        <span className="small-label">TU MOMENTO PARA LEER</span>
        <h1>¿Qué descubrirás hoy?</h1>
        <p>Elige una historia que te dé curiosidad. No hay prisa.</p>
      </header>
      <fieldset className="level-picker">
        <legend>¿Cómo te gustaría leer?</legend>
        <div className="level-options">
          {(Object.entries(levels) as [Level, typeof levels.paso][]).map(
            ([id, item]) => (
              <label
                key={id}
                className={
                  level === id ? "level-option selected" : "level-option"
                }
              >
                <input
                  type="radio"
                  name="nivel"
                  value={id}
                  checked={level === id}
                  onChange={() => setLevel(id)}
                />
                <span className="level-graphic">
                  {id === "paso" ? <Leaf size={21} /> : <Sparkles size={21} />}
                </span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
                <span className="radio-visual">
                  {level === id ? <Check size={13} /> : null}
                </span>
              </label>
            ),
          )}
        </div>
        <p className="muted small">
          Puedes probar otro nivel en cualquier momento. Aquí no hay notas.
        </p>
      </fieldset>
      <div className="level-change-notice" role="status">
        <Sparkles size={19} aria-hidden="true" />
        <div>
          <strong>{levels[level].label} seleccionado</strong>
          <p>
            {level === "paso"
              ? "Leerás una versión con frases más cortas. Las preguntas te ayudarán a buscar detalles."
              : "Leerás una versión con más vocabulario. Las preguntas te invitarán a relacionar ideas."}
          </p>
        </div>
      </div>
      <div className="story-grid">
        {stories.map((story, index) => (
          <article className="story-card" key={story.id}>
            <Link
              className="story-cover-link"
              href={"/leer/" + story.id + "?nivel=" + level}
              aria-label={"Leer " + story.title}
            >
              <StoryArt variant={story.art} />
              <span className="story-index">HISTORIA 0{index + 1}</span>
            </Link>
            <div className="story-card-body">
              <div className="story-meta">
                <span>{story.theme}</span>
                <span>
                  <Clock3 size={14} />
                  {story.minutes} min
                </span>
              </div>
              <h2>
                <Link href={"/leer/" + story.id + "?nivel=" + level}>
                  {story.title}
                </Link>
              </h2>
              <p>{story.description}</p>
              <div className="story-level-preview">
                <span>{levels[level].label} · Así empieza</span>
                <p>“{story.versions[level].paragraphs[0]}”</p>
              </div>
              <Link
                className="button button-outline story-button"
                href={"/leer/" + story.id + "?nivel=" + level}
              >
                Quiero leerla <ArrowRight size={18} />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="library-bottom">
        <BookOpen size={22} />
        <p>Dos historias para empezar. Un montón de cosas por imaginar.</p>
      </div>
    </div>
  );
}
