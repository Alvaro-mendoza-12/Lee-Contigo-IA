"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  HeartHandshake,
  Minus,
  Plus,
  Square,
  Volume2,
} from "lucide-react";
import { type Story, type Level } from "@/lib/stories";
import {
  fontSteps,
  paginateStory,
  readingGoals,
  type ReadingGoal,
} from "@/lib/reading";
import { StoryArt } from "./art";
import { BookSpread } from "./book-spread";
import { getIllustrationScene } from "@/lib/story-creator";
import { canSpeak as speechAvailable, speak, stopSpeaking } from "./voice";

export function Reader({
  story,
  initialLevel: level,
  accompanied = false,
  goal = "imaginar",
}: {
  story: Story;
  initialLevel: Level;
  accompanied?: boolean;
  goal?: ReadingGoal;
}) {
  const [size, setSize] = useState(5);
  const [position, setPosition] = useState({ paragraph: 0, word: 0 });
  const [animate, setAnimate] = useState(false);
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
    readingGoals[goal].prompts[
      getIllustrationScene(current.paragraph, version.paragraphs.length)
    ];

  useEffect(() => {
    setCanSpeak(speechAvailable());
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimate(!preference.matches);
    update();
    preference.addEventListener("change", update);
    const compactPreference = window.matchMedia("(max-width: 900px)");
    const updateCompact = () => setCompact(compactPreference.matches);
    updateCompact();
    compactPreference.addEventListener("change", updateCompact);
    return () => {
      preference.removeEventListener("change", update);
      compactPreference.removeEventListener("change", updateCompact);
      stopSpeaking();
    };
  }, []);

  function stopVoice() {
    stopSpeaking();
    setSpeaking(false);
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
    if (speaking) {
      stopVoice();
      return;
    }
    setSpeaking(true);
    speak(
      (index === 0 ? story.title + ". " : "") + current.text,
      () => setSpeaking(false),
    );
  }

  return (
    <div className="container reader-page book-reader kid-reader">
      <div className="kid-reader-top">
        <Link href={`/?nivel=${level}`} className="kid-back">
          <ArrowLeft size={20} aria-hidden="true" />
          Cuentos
        </Link>
        <h1 id="reader-title">{story.title}</h1>
      </div>
      <div className="kid-reader-tools">
        {canSpeak ? (
          <button
            type="button"
            className={"kid-listen" + (speaking ? " is-speaking" : "")}
            onClick={readAloud}
          >
            {speaking ? (
              <Square size={22} aria-hidden="true" />
            ) : (
              <Volume2 size={24} aria-hidden="true" />
            )}
            {speaking ? "Detener" : "Escuchar"}
          </button>
        ) : null}
        <div
          className="font-controls kid-font"
          role="group"
          aria-label="Tamaño del texto"
        >
          <button
            type="button"
            aria-label="Reducir tamaño de letra"
            disabled={size === 0}
            onClick={() => resize(size - 1)}
          >
            <Minus size={18} aria-hidden="true" />
          </button>
          <span aria-hidden="true" className="kid-font-a">
            A
          </span>
          <span className="sr-only" aria-live="polite">
            {fontSteps[size].label}
          </span>
          <button
            type="button"
            aria-label="Aumentar tamaño de letra"
            disabled={size === fontSteps.length - 1}
            onClick={() => resize(size + 1)}
          >
            <Plus size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <BookSpread
        animated={animate}
        fontSize={fontSteps[size].pixels}
        onNavigate={(offset) => turnPage(index + offset)}
        page={{
          id: `${story.id}-${level}-${size}-${compact}-${index}`,
          book: `${story.id}-${level}-${size}-${compact}`,
          number: index + 1,
          text: current.text,
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
                  : Math.min(7, Math.floor((index * 8) / pages.length))
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
      <div className="book-navigation kid-page-nav">
        <button
          type="button"
          className="kid-nav-button"
          disabled={index === 0}
          onClick={() => turnPage(index - 1)}
          aria-label="Página anterior"
        >
          <ArrowLeft size={26} aria-hidden="true" />
        </button>
        <span role="status" aria-live="polite">
          Página {index + 1} de {pages.length}
        </span>
        {lastPage ? (
          <Link
            className="kid-nav-button kid-finish"
            href={`/practicar/${story.id}?nivel=${level}`}
          >
            ¡A las preguntas!
            <ArrowRight size={24} aria-hidden="true" />
          </Link>
        ) : (
          <button
            type="button"
            className="kid-nav-button kid-next"
            onClick={() => turnPage(index + 1)}
            aria-label="Página siguiente"
          >
            <ArrowRight size={26} aria-hidden="true" />
          </button>
        )}
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
  );
}
