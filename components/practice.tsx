"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Check,
  Lightbulb,
  RotateCcw,
  Volume2,
  X,
  LoaderCircle,
} from "lucide-react";
import type { Story, Level } from "@/lib/stories";
import { canSpeak, playCorrect, playWrong, speak, stopSpeaking } from "./voice";
type Hint = {
  hint: string;
  action?: string;
  reflection?: string;
  quote: string;
  source: "ai" | "prepared";
  reason?: string;
  support?: "explore" | "retry";
};
const wrongMessages = [
  "¡Uy! Esa no es. ¡Intenta otra vez!",
  "Casi… ¡Prueba con otra!",
];
const rightMessages = ["¡Muy bien!", "¡Excelente!", "¡Lo encontraste!"];
export function Practice({ story, level }: { story: Story; level: Level }) {
  const version = story.versions[level];
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [shake, setShake] = useState(0);
  const [hints, setHints] = useState<Hint | null>(null),
    [hintCount, setHintCount] = useState(0);
  const [loading, setLoading] = useState(false),
    [showStory, setShowStory] = useState(false);
  const [complete, setComplete] = useState(false);
  const [voice, setVoice] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const hintPanel = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);
  const hintRequest = useRef(0);
  const question = version.questions[index];
  const lastQuestion = index === version.questions.length - 1;
  useEffect(() => {
    setVoice(canSpeak());
    return () => {
      hintRequest.current++;
      abort.current?.abort();
      stopSpeaking();
    };
  }, []);
  function resetQuestion() {
    setWrong([]);
    setSolved(false);
    setHints(null);
    setHintCount(0);
    setLoading(false);
    setShowStory(false);
  }
  function next() {
    hintRequest.current++;
    abort.current?.abort();
    stopSpeaking();
    if (lastQuestion) {
      setComplete(true);
      playCorrect();
    } else {
      setIndex((i) => i + 1);
      resetQuestion();
    }
    requestAnimationFrame(() => heading.current?.focus());
  }
  function choose(option: number) {
    if (solved || wrong.includes(option)) return;
    if (option === question.correct) {
      setSolved(true);
      playCorrect();
      if (voice) speak(rightMessages[index % rightMessages.length]);
      requestAnimationFrame(() => nextButton.current?.focus());
      return;
    }
    setWrong((list) => [...list, option]);
    setShake((n) => n + 1);
    playWrong();
    if (voice) speak(wrongMessages[wrong.length % wrongMessages.length]);
  }
  function readQuestion() {
    speak(
      question.prompt +
        " " +
        question.options
          .map((option, i) => String.fromCharCode(65 + i) + ": " + option)
          .join(" "),
    );
  }
  async function askHint() {
    const requestId = ++hintRequest.current;
    setLoading(true);
    const tier = Math.min(hintCount, 1);
    const support = wrong.length ? "retry" : "explore";
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    const timer = setTimeout(() => controller.abort(), 9000);
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: story.id,
          level,
          questionId: question.id,
          tier,
          support,
        }),
        signal: controller.signal,
      });
      if (!response.ok && response.status !== 429)
        throw new Error("Pista no disponible");
      const result = (await response.json()) as Hint;
      if (!result.hint) throw new Error("Pista no disponible");
      if (requestId === hintRequest.current) setHints(result);
    } catch {
      if (requestId === hintRequest.current)
        setHints({
          hint: question.hints[tier],
          quote: version.paragraphs[question.paragraph],
          source: "prepared",
          reason: "unavailable",
          support,
        });
    } finally {
      clearTimeout(timer);
      if (requestId === hintRequest.current) {
        setLoading(false);
        setHintCount((n) => n + 1);
        requestAnimationFrame(() =>
          hintPanel.current?.focus({ preventScroll: true }),
        );
      }
    }
  }
  if (complete)
    return (
      <div className="container practice-page kid-practice">
        <section className="kid-complete">
          <div className="kid-complete-art" aria-hidden="true">
            🏆
          </div>
          <div className="kid-stars" aria-hidden="true">
            ⭐⭐⭐
          </div>
          <h1 ref={heading} tabIndex={-1}>
            ¡Lo lograste!
          </h1>
          <p>
            Terminaste <strong>{story.title}</strong>.
          </p>
          <Link className="kid-big-button" href={`/?nivel=${level}`}>
            <span aria-hidden="true">📚</span> Leer otro cuento
          </Link>
          <button
            className="text-button"
            onClick={() => {
              setIndex(0);
              setComplete(false);
              resetQuestion();
            }}
          >
            <RotateCcw size={18} /> Repetir las preguntas
          </button>
        </section>
      </div>
    );
  const feedback = solved ? "correct" : wrong.length ? "retry" : null;
  return (
    <div className="container practice-page kid-practice">
      <div className="kid-reader-top">
        <Link className="kid-back" href={`/leer/${story.id}?nivel=${level}`}>
          <ArrowLeft size={20} aria-hidden="true" />
          Cuento
        </Link>
        <div
          className="kid-dots"
          role="progressbar"
          aria-label="Preguntas"
          aria-valuemin={0}
          aria-valuemax={version.questions.length}
          aria-valuenow={index + 1}
          aria-valuetext={`Pregunta ${index + 1} de ${version.questions.length}`}
        >
          {version.questions.map((q, i) => (
            <span
              className={i < index ? "done" : i === index ? "current" : ""}
              key={q.id}
            />
          ))}
        </div>
      </div>
      <section className={"kid-question" + (feedback ? " " + feedback : "")}>
        <div className="kid-question-head">
          <h1 ref={heading} tabIndex={-1}>
            {question.prompt}
          </h1>
          {voice ? (
            <button
              type="button"
              className="kid-round-button"
              onClick={readQuestion}
              aria-label="Escuchar la pregunta"
            >
              <Volume2 size={24} aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <fieldset className="kid-answers">
          <legend className="sr-only">Opciones de respuesta</legend>
          {question.options.map((option, i) => {
            const isWrong = wrong.includes(i);
            const isRight = solved && i === question.correct;
            return (
              <label
                key={i}
                className={
                  "kid-answer" +
                  (isWrong ? " wrong" : "") +
                  (isWrong && i === wrong[wrong.length - 1] ? " shake" : "") +
                  (isRight ? " right" : "")
                }
              >
                <input
                  type="radio"
                  name={"respuesta-" + question.id}
                  value={i}
                  checked={solved ? isRight : i === wrong[wrong.length - 1]}
                  disabled={solved || isWrong}
                  onChange={() => choose(i)}
                />
                <span className="kid-answer-letter" aria-hidden="true">
                  {isRight ? (
                    <Check size={22} />
                  ) : isWrong ? (
                    <X size={22} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span>{option}</span>
              </label>
            );
          })}
        </fieldset>
        <div role="status" aria-live="assertive">
          {feedback === "correct" ? (
            <div className="kid-feedback correct">
              <span className="kid-feedback-emoji" aria-hidden="true">
                🎉
              </span>
              <div>
                <strong>{rightMessages[index % rightMessages.length]}</strong>
                <p>{question.explanation}</p>
              </div>
            </div>
          ) : feedback === "retry" ? (
            <div className="kid-feedback retry" key={shake}>
              <span className="kid-feedback-emoji" aria-hidden="true">
                ❌
              </span>
              <div>
                <strong>
                  {wrongMessages[(wrong.length - 1) % wrongMessages.length]}
                </strong>
                <p>Esa respuesta no es correcta.</p>
              </div>
            </div>
          ) : null}
        </div>
        {solved ? (
          <button ref={nextButton} className="kid-big-button" onClick={next}>
            {lastQuestion ? "¡Terminar!" : "Siguiente"}
            <ArrowRight size={22} />
          </button>
        ) : (
          <div className="kid-helpers">
            <button
              className="kid-helper hint"
              onClick={askHint}
              disabled={loading || hintCount >= 2}
              aria-busy={loading}
              aria-controls="tutor-pistas"
            >
              {loading ? (
                <LoaderCircle size={20} className="spin" aria-hidden="true" />
              ) : (
                <Lightbulb size={20} aria-hidden="true" />
              )}
              {loading ? "Buscando…" : "Pista"}
            </button>
            <button
              className="kid-helper"
              aria-expanded={showStory}
              aria-controls="relato-de-apoyo"
              onClick={() => setShowStory((s) => !s)}
            >
              <BookOpen size={20} aria-hidden="true" />
              {showStory ? "Cerrar cuento" : "Ver cuento"}
            </button>
          </div>
        )}
        <div
          id="tutor-pistas"
          ref={hintPanel}
          tabIndex={-1}
          role="region"
          aria-label="Pista"
          aria-live="polite"
        >
          {hints && !solved ? (
            <div className="kid-hint">
              <span className="kid-hint-emoji" aria-hidden="true">
                💡
              </span>
              <div>
                <p>
                  {hints.action && hints.reflection
                    ? `${hints.action} ${hints.reflection}`
                    : hints.hint}
                </p>
                <small>
                  {hints.source === "ai"
                    ? "Pista con IA · puede equivocarse"
                    : "Pista preparada"}
                </small>
              </div>
            </div>
          ) : null}
        </div>
        {showStory && !solved ? (
          <div id="relato-de-apoyo" className="inline-story">
            <h2>{story.title}</h2>
            {version.paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  hints && i === question.paragraph ? "story-highlight" : ""
                }
              >
                {p}
              </p>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
