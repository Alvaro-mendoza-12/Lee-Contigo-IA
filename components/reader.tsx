"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  AlignLeft,
  BookOpen,
  HeartHandshake,
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
import { BookSpread } from "./book-spread";
import { Journey } from "./journey";
import { ReadingPause } from "./reading-pause";
import { useReadingFont } from "./use-reading-font";
import { getIllustrationScene } from "@/lib/story-creator";
import { useNarration } from "./use-narration";
import { ReadingHelp } from "./reading-help";
import { ReadingSettings } from "./reading-settings";

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
  const level = initialLevel;
  const [size, setSize] = useReadingFont();
  const [position, setPosition] = useState({ paragraph: 0, word: 0 });
  const [fullText, setFullText] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const expandControlRef = useRef<HTMLButtonElement>(null);
  const [animate, setAnimate] = useState(true);
  const [compact, setCompact] = useState(false);
  const {
    speaking,
    loading: voiceLoading,
    message: voiceMessage,
    voice,
    changeVoice,
    speak,
    stop: stopNarration,
  } = useNarration();
  const canSpeak = true;
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
    readingGoals[goal].prompts[
      getIllustrationScene(current.paragraph, version.paragraphs.length)
    ];

  useEffect(() => {
    const compactPreference = window.matchMedia("(max-width: 900px)");
    const updateCompact = () => setCompact(compactPreference.matches);
    updateCompact();
    compactPreference.addEventListener("change", updateCompact);
    return () => {
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
    // Keep the expanded reader as the only interactive surface.
    const outside = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".site-header, .site-footer, .reader-page > .journey, .reader-page > .back-link",
      ),
    );
    const inertBefore = outside.map((element) => element.inert);
    outside.forEach((element) => {
      element.inert = true;
    });
    const focusFrame = window.requestAnimationFrame(() =>
      expandControlRef.current?.focus(),
    );
    function manageDialogKeys(event: KeyboardEvent) {
      if (document.querySelector("dialog[open]")) return;
      if (event.key === "Escape") {
        setExpanded(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), summary, select, textarea, [tabindex]:not([tabindex="-1"])',
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
      outside.forEach((element, index) => {
        element.inert = inertBefore[index];
      });
      window.removeEventListener("keydown", manageDialogKeys);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [expanded]);

  useEffect(() => {
    setPosition({ paragraph: 0, word: 0 });
    stopNarration();
  }, [level, story.id, stopNarration]);

  function stopVoice() {
    stopNarration();
  }
  function turnPage(next: number) {
    stopVoice();
    const target = pages[Math.max(0, Math.min(next, pages.length - 1))];
    setPosition({ paragraph: target.paragraph, word: target.start });
  }
  function resize(next: number) {
    stopVoice();
    setPosition({ paragraph: current.paragraph, word: current.start });
    setSize(next);
  }
  function readAloud() {
    if (speaking || voiceLoading) {
      stopVoice();
      return;
    }
    void speak(
      fullText
        ? story.title + ". " + version.paragraphs.join(" ")
        : current.text,
      fullText
        ? undefined
        : {
            source: "catalogue",
            storyId: story.id as import("@/lib/stories").StoryId,
            level,
            paragraph: current.paragraph,
            start: current.start,
            end: current.end,
          },
    );
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
            <div className="reader-book-heading">
              <div>
                <h1 id="reader-title">{story.title}</h1>
              </div>
              {expanded ? (
                <button
                  ref={expandControlRef}
                  className="text-button"
                  type="button"
                  onClick={() => setExpanded(false)}
                >
                  <Minimize2 size={18} aria-hidden="true" /> Cerrar ampliación
                </button>
              ) : null}
            </div>
            <p className="sr-only" role="status">
              {levels[level].label}:{" "}
              {level === "paso"
                ? "frases más cortas para avanzar con calma."
                : "más vocabulario e ideas para relacionar."}
            </p>
            <div className="reading-toolbar book-tools">
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
              <div className="book-tool-actions">
                {canSpeak ? (
                  <button
                    type="button"
                    className="text-button audio-button"
                    onClick={readAloud}
                    aria-busy={voiceLoading}
                  >
                    {speaking ? (
                      <Square size={17} aria-hidden="true" />
                    ) : (
                      <Volume2 size={18} aria-hidden="true" />
                    )}
                    {voiceLoading
                      ? "Cancelar voz…"
                      : speaking
                        ? "Detener lectura"
                        : "Escuchar"}
                  </button>
                ) : null}
                <ReadingSettings
                  voice={voice}
                  onVoiceChange={changeVoice}
                  animate={animate}
                  onAnimateChange={setAnimate}
                  expanded={expanded}
                  onExpandedChange={setExpanded}
                >
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
                </ReadingSettings>
              </div>
            </div>
            <p className="voice-status" role="status">
              {voiceMessage}
            </p>
            <ReadingHelp
              onOpen={stopVoice}
              paragraphs={version.paragraphs}
              paragraph={current.paragraph}
              pageKey={`${story.id}-${level}-${index}-${size}-${fullText}`}
              level={level}
              storyId={story.id as import("@/lib/stories").StoryId}
            >
              {!fullText ? (
                <ReadingPause
                  key={`${story.id}-${level}-${index}`}
                  scene={getIllustrationScene(
                    current.paragraph,
                    version.paragraphs.length,
                  )}
                />
              ) : null}
            </ReadingHelp>
            {/* AQUÍ: barra de experiencia compacta (Iván). */}
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
                  <p key={i} data-help-paragraph={i}>
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <>
                <BookSpread
                  paragraphs={version.paragraphs}
                  animated={animate}
                  fontSize={fontSteps[size].pixels}
                  onNavigate={(offset) => turnPage(index + offset)}
                  page={{
                    id: `${story.id}-${level}-${size}-${compact}-${index}`,
                    book: `${story.id}-${level}-${size}-${compact}`,
                    number: index + 1,
                    text: current.text,
                    paragraph: current.paragraph,
                    startWord: current.start,
                    chapter:
                      index === 0
                        ? "Érase una vez…"
                        : lastPage
                          ? "Y al final…"
                          : "La historia continúa…",
                    illustration: (
                      <StoryArt
                        variant={story.art}
                        scene={
                          lastPage
                            ? 7
                            : Math.min(
                                7,
                                Math.floor((index * 8) / pages.length),
                              )
                        }
                        frame={index}
                        priority
                      />
                    ),
                  }}
                />
                <progress
                  className="book-progress"
                  max={pages.length}
                  value={index + 1}
                  aria-label="Progreso de lectura"
                />
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
            <div className="reader-next-step">
              {lastPage || fullText ? (
                <Link
                  className="button"
                  href={`/practicar/${story.id}?nivel=${level}`}
                >
                  Vamos a pensar
                  <ArrowRight size={19} aria-hidden="true" />
                </Link>
              ) : null}
            </div>
            {accompanied ? (
              <div className="reading-companion-inline">
                <HeartHandshake size={20} aria-hidden="true" />
                <p>
                  <strong>Para conversar juntos</strong>
                  {conversation}
                </p>
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </div>
  );
}
