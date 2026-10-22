"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  AlignLeft,
  BookOpen,
  Check,
  Clock3,
  HeartHandshake,
  Leaf,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Square,
  Volume2,
} from "lucide-react";
import { levels, type Story, type Level } from "@/lib/stories";
import {
  fontSteps,
  paginateStory,
  readingGoals,
  type ReadingGoal,
} from "@/lib/reading";
import { StoryArt } from "./art";
import { Journey } from "./journey";
import { useReadingLevel } from "./use-reading-level";

export function Reader({
  story,
  initialLevel,
  accompanied = false,
  goal = "imaginar",
}: {
  story: Story;
  initialLevel: Level;
  accompanied?: boolean;
  goal?: ReadingGoal;
}) {
  const [level, changeLevel] = useReadingLevel(initialLevel);
  const [size, setSize] = useState(5);
  const [position, setPosition] = useState({ paragraph: 0, word: 0 });
  const [direction, setDirection] = useState("next");
  const [fullText, setFullText] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const expandControlRef = useRef<HTMLButtonElement>(null);
  const [animate, setAnimate] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [compact, setCompact] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const version = story.versions[level];
  const pages = paginateStory(version.paragraphs, size, compact);
  const matchedIndex = pages.findIndex(
    (item) =>
      item.paragraph === position.paragraph &&
      item.start <= position.word &&
      item.end > position.word,
  );
  const index = matchedIndex < 0 ? 0 : matchedIndex;
  const current = pages[index];
  const lastPage = index === pages.length - 1;
  const conversation =
    readingGoals[goal].prompts[Math.min(current.paragraph, 3)];

  useEffect(() => {
    setCanSpeak("speechSynthesis" in window);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    const compactPreference = window.matchMedia("(max-width: 760px)");
    const updateCompact = () => setCompact(compactPreference.matches);
    updateCompact();
    compactPreference.addEventListener("change", updateCompact);
    return () => {
      preference.removeEventListener("change", update);
      compactPreference.removeEventListener("change", updateCompact);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!expanded) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() =>
      expandControlRef.current?.focus(),
    );
    function manageDialogKeys(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExpanded(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !dialogRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !dialogRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", manageDialogKeys);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", manageDialogKeys);
      previousFocus?.focus();
    };
  }, [expanded]);

  useEffect(() => {
    setPosition({ paragraph: 0, word: 0 });
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [level]);

  function stopVoice() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }
  function turnPage(next: number) {
    stopVoice();
    setDirection(next > index ? "next" : "previous");
    const target = pages[Math.max(0, Math.min(next, pages.length - 1))];
    setPosition({ paragraph: target.paragraph, word: target.start });
  }
  function resize(next: number) {
    stopVoice();
    setPosition({ paragraph: current.paragraph, word: current.start });
    setSize(next);
  }
  function selectLevel(next: Level) {
    stopVoice();
    setPosition({ paragraph: 0, word: 0 });
    changeLevel(next);
  }
  function readAloud() {
    if (speaking) {
      stopVoice();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(
      fullText
        ? story.title + ". " + version.paragraphs.join(" ")
        : current.text,
    );
    utterance.lang = "es";
    utterance.rate = 0.85;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  return (
    <div className="container reader-page book-reader">
      <Journey current={2} />
      <Link href={`/biblioteca?nivel=${level}`} className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Volver a las historias
      </Link>
      <div
        className={`reading-layout${expanded ? " reading-layout-expanded" : ""}`}
      >
        {expanded ? (
          <div className="reading-expanded-backdrop" aria-hidden="true" />
        ) : null}
        <article
          ref={dialogRef}
          className={`reading-card${expanded ? " reading-card-expanded" : ""}`}
          role={expanded ? "dialog" : undefined}
          aria-modal={expanded ? true : undefined}
          aria-labelledby={expanded ? "reader-title" : undefined}
          tabIndex={expanded ? -1 : undefined}
        >
          <div className="reading-content">
            <div className="reading-meta">
              <span className="small-label">UN LIBRO PARA LEER A TU RITMO</span>
              <span>
                <Clock3 size={15} aria-hidden="true" />
                {story.minutes} min
              </span>
            </div>
            <h1 id="reader-title">{story.title}</h1>
            <p className="story-subtitle">{story.subtitle}</p>
            <div
              className="reader-level-picker"
              role="group"
              aria-label="Nivel de lectura"
            >
              {(["paso", "reto"] as const).map((id) => (
                <button
                  type="button"
                  key={id}
                  aria-pressed={level === id}
                  onClick={() => selectLevel(id)}
                >
                  {level === id ? (
                    <Check size={15} aria-hidden="true" />
                  ) : (
                    <Leaf size={15} aria-hidden="true" />
                  )}
                  {levels[id].label}
                </button>
              ))}
            </div>
            <p className="reader-level-feedback" role="status">
              <strong>{levels[level].label}:</strong>{" "}
              {level === "paso"
                ? "frases más cortas para avanzar con calma."
                : "más vocabulario e ideas para relacionar."}
            </p>
            <div className="reading-toolbar">
              <div
                className="font-controls"
                role="group"
                aria-label="Tamaño del texto"
              >
                <span>Letra</span>
                <button
                  type="button"
                  aria-label="Reducir tamaño de letra"
                  disabled={size === 0}
                  onClick={() => resize(size - 1)}
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <span aria-live="polite">{fontSteps[size].label}</span>
                <button
                  type="button"
                  aria-label="Aumentar tamaño de letra"
                  disabled={size === fontSteps.length - 1}
                  onClick={() => resize(size + 1)}
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
              {canSpeak ? (
                <button
                  type="button"
                  className="text-button audio-button"
                  onClick={readAloud}
                >
                  {speaking ? (
                    <Square size={17} aria-hidden="true" />
                  ) : (
                    <Volume2 size={18} aria-hidden="true" />
                  )}
                  {speaking ? "Detener lectura" : "Escuchar"}
                </button>
              ) : null}
            </div>
            <div className="book-view-options">
              <button
                type="button"
                className="text-button"
                aria-pressed={fullText}
                onClick={() => {
                  stopVoice();
                  setFullText((value) => !value);
                }}
              >
                {fullText ? (
                  <BookOpen size={16} aria-hidden="true" />
                ) : (
                  <AlignLeft size={16} aria-hidden="true" />
                )}
                {fullText ? "Volver al libro" : "Ver relato completo"}
              </button>
              <button
                ref={expandControlRef}
                type="button"
                className="text-button book-expand-control"
                aria-pressed={expanded}
                aria-label={
                  expanded ? "Cerrar página ampliada" : "Ampliar página"
                }
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? (
                  <Minimize2 size={16} aria-hidden="true" />
                ) : (
                  <Maximize2 size={16} aria-hidden="true" />
                )}
                {expanded ? "Cerrar ampliación" : "Ampliar página"}
              </button>
              {!fullText ? (
                <label className="book-animation-control">
                  <input
                    type="checkbox"
                    checked={animate && !reducedMotion}
                    disabled={reducedMotion}
                    onChange={(event) => setAnimate(event.target.checked)}
                  />
                  Animar páginas
                </label>
              ) : null}
            </div>
            {fullText ? (
              <div
                className="story-text book-full-text"
                id="lectura"
                style={
                  {
                    "--reading-font": `${fontSteps[size].pixels}px`,
                  } as CSSProperties
                }
              >
                {version.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <>
                <div
                  className="open-storybook"
                  style={
                    {
                      "--reading-font": `${fontSteps[size].pixels}px`,
                    } as CSSProperties
                  }
                >
                  <div className="book-illustration">
                    <StoryArt variant={story.art} priority />
                    <span>{story.theme}</span>
                  </div>
                  <section
                    key={`${level}-${index}-${size}`}
                    className={`book-leaf ${animate && !reducedMotion ? "page-turn-" + direction : ""}`}
                    aria-label={`Página ${index + 1}`}
                  >
                    <span className="book-chapter">
                      {index === 0
                        ? "Érase una vez…"
                        : lastPage
                          ? "Y al final…"
                          : "La historia continúa…"}
                    </span>
                    <p className="book-page-text" id="lectura">
                      {current.text}
                    </p>
                    <span className="book-page-number" aria-hidden="true">
                      {index + 1}
                    </span>
                  </section>
                </div>
                <div className="book-navigation">
                  <button
                    type="button"
                    className="button button-outline"
                    disabled={index === 0}
                    onClick={() => turnPage(index - 1)}
                  >
                    <ArrowLeft size={17} aria-hidden="true" />
                    Anterior
                  </button>
                  <span role="status" aria-live="polite">
                    Página {index + 1} de {pages.length}
                  </span>
                  <button
                    type="button"
                    className="button"
                    disabled={lastPage}
                    onClick={() => turnPage(index + 1)}
                    aria-label="Página siguiente"
                  >
                    Siguiente
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
            {accompanied ? (
              <div className="reading-companion-inline">
                <HeartHandshake size={20} aria-hidden="true" />
                <p>
                  <strong>Para conversar juntos</strong>
                  {conversation}
                </p>
              </div>
            ) : null}
            {lastPage || fullText ? (
              <div className="book-finish">
                <span className="small-label">LO LEÍSTE, AHORA EXPLOREMOS</span>
                <Link
                  className="button full-width"
                  href={`/practicar/${story.id}?nivel=${level}`}
                >
                  Ya leí, vamos a explorar{" "}
                  <ArrowRight size={19} aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <p className="reading-reassurance">
                Avanza página a página. Al final encontrarás las preguntas.
              </p>
            )}
          </div>
        </article>
        <aside className="reader-sidebar">
          <div className="companion-card">
            <span className="companion-icon">
              {accompanied ? (
                <HeartHandshake size={26} aria-hidden="true" />
              ) : (
                <BookOpen size={26} aria-hidden="true" />
              )}
            </span>
            <span className="small-label">
              {accompanied ? "SU MISIÓN DE LECTURA" : "ESTE ES TU MOMENTO"}
            </span>
            <h2>
              {accompanied
                ? readingGoals[goal].title
                : "No hay prisa por llegar al final."}
            </h2>
            <p aria-live={accompanied ? "polite" : "off"}>
              {accompanied
                ? conversation
                : "Cada página es un pequeño paso. Imagina el lugar y disfruta la historia."}
            </p>
            <div className="sidebar-check">
              <Check size={17} aria-hidden="true" />
              Once tamaños de letra.
            </div>
            <div className="sidebar-check">
              <Check size={17} aria-hidden="true" />
              Puedes detener la animación.
            </div>
            <div className="sidebar-check">
              <Check size={17} aria-hidden="true" />
              Sin notas ni cronómetro.
            </div>
          </div>
          <div className="level-summary">
            <span className="small-label">TU FORMA DE LEER</span>
            <strong>
              <Leaf size={17} aria-hidden="true" />
              {levels[level].label}
            </strong>
            <button
              type="button"
              className="text-button"
              onClick={() => selectLevel(level === "paso" ? "reto" : "paso")}
            >
              Probar {level === "paso" ? "un nuevo reto" : "paso a paso"}
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
