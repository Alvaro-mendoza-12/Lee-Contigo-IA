"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Check,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sprout,
  Flag,
  X,
  LoaderCircle,
} from "lucide-react";
import type { Story, Level } from "@/lib/stories";
import { Journey } from "./journey";
import { useAnswerSound, SoundControl, ReadFeedback } from "./answer-audio";
type Hint = {
  hint: string;
  action?: string;
  reflection?: string;
  quote: string;
  source: "ai" | "prepared";
  reason?: string;
  support?: "explore" | "retry";
};
export function Practice({ story, level }: { story: Story; level: Level }) {
  const version = story.versions[level];
  const [index, setIndex] = useState(0),
    [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<
    "correct" | "retry" | "revealed" | null
  >(null);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [hints, setHints] = useState<Hint | null>(null),
    [hintCount, setHintCount] = useState(0);
  const [loading, setLoading] = useState(false),
    [showStory, setShowStory] = useState(false);
  const [complete, setComplete] = useState(false),
    [reported, setReported] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [needsSupport, setNeedsSupport] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const hintPanel = useRef<HTMLElement>(null);
  const abort = useRef<AbortController | null>(null);
  const hintRequest = useRef(0);
  const question = version.questions[index];
  const answerSound = useAnswerSound();
  useEffect(
    () => () => {
      hintRequest.current++;
      abort.current?.abort();
    },
    [],
  );
  function resetQuestion() {
    setSelected(null);
    setFeedback(null);
    setIncorrectAttempts(0);
    setHints(null);
    setHintCount(0);
    setLoading(false);
    setShowStory(false);
    setReported(false);
    setReportOpen(false);
    setNeedsSupport(false);
  }
  function next() {
    hintRequest.current++;
    abort.current?.abort();
    if (index === version.questions.length - 1) {
      setComplete(true);
    } else {
      setIndex((i) => i + 1);
      resetQuestion();
    }
    requestAnimationFrame(() => heading.current?.focus());
  }
  async function askHint() {
    if (loading || hintCount >= 2) return;
    const requestId = ++hintRequest.current;
    setLoading(true);
    setReported(false);
    const tier = Math.min(hintCount, 1);
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    const timer = setTimeout(() => controller.abort(), 14000);
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: story.id,
          level,
          questionId: question.id,
          tier,
          support: needsSupport ? "retry" : "explore",
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
          support: needsSupport ? "retry" : "explore",
        });
    } finally {
      clearTimeout(timer);
      if (requestId === hintRequest.current) {
        setLoading(false);
        setHintCount((n) => n + 1);
      }
    }
  }
  if (complete)
    return (
      <div className="container practice-page">
        <Journey current={3} />
        <section className="completion">
          <div className="completion-art" aria-hidden="true">
            <Sprout size={58} strokeWidth={1.4} />
            <span>✦</span>
            <span>✧</span>
          </div>
          <span className="small-label">
            UNA HISTORIA, NUEVOS DESCUBRIMIENTOS
          </span>
          <h1 ref={heading} tabIndex={-1}>
            ¡Mira todo lo que exploraste!
          </h1>
          <p>
            Terminaste <strong>{story.title}</strong>.<br />
            Cada vez que vuelves al texto, descubres algo más.
          </p>
          <div className="skills-earned">
            {version.questions.map((q) => (
              <span key={q.id}>
                <Sprout size={16} aria-hidden="true" />
                {q.skill}
              </span>
            ))}
          </div>
          <div className="completion-note">
            <HeartMessage />
          </div>
          <Link className="button" href="/biblioteca">
            Elegir otra historia <ArrowRight size={18} />
          </Link>
          <button
            className="text-button"
            onClick={() => {
              setIndex(0);
              setComplete(false);
              resetQuestion();
            }}
          >
            <RotateCcw size={16} /> Volver a explorar esta historia
          </button>
          <p className="small muted">
            Este recorrido es una práctica, no una evaluación escolar.
          </p>
        </section>
      </div>
    );
  return (
    <div className="container practice-page">
      <Journey current={3} />
      <div className="practice-top">
        <Link
          className="back-link"
          href={"/leer/" + story.id + "?nivel=" + level}
        >
          <ArrowLeft size={16} />
          Volver a leer
        </Link>
        <SoundControl
          enabled={answerSound.sound}
          onChange={answerSound.setSound}
        />
      </div>
      <div className="practice-layout">
        <section className="question-card">
          <div className="question-progress">
            <span className="small-label">
              PREGUNTA {index + 1} DE {version.questions.length}
            </span>
            <span className="skill-pill">{question.skill}</span>
          </div>
          <div
            className="question-track"
            role="progressbar"
            aria-label="Preguntas exploradas"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={index}
          >
            {version.questions.map((q, i) => (
              <span className={i <= index ? "filled" : ""} key={q.id} />
            ))}
          </div>
          <h1 ref={heading} tabIndex={-1}>
            {question.prompt}
          </h1>
          <p className="question-instruction">
            Elige la opción que te parezca mejor.
          </p>
          <fieldset className="answers">
            <legend className="sr-only">Opciones de respuesta</legend>
            {question.options.map((option, i) => (
              <label
                key={i}
                className={
                  "answer " +
                  (selected === i ? "selected " : "") +
                  (feedback === "correct" && i === selected ? "correct" : "") +
                  (feedback === "retry" && i === selected ? " incorrect" : "")
                }
              >
                <input
                  type="radio"
                  name={"respuesta-" + question.id}
                  value={i}
                  checked={selected === i}
                  disabled={feedback === "correct" || feedback === "revealed"}
                  onChange={() => {
                    setSelected(i);
                    setFeedback(null);
                  }}
                />
                <span className="answer-letter">
                  {feedback === "correct" && i === selected ? (
                    <Check size={18} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span>{option}</span>
                <span className="answer-radio">
                  {selected === i ? <span /> : null}
                </span>
              </label>
            ))}
          </fieldset>
          {feedback ? (
            <div
              className={
                "answer-feedback " +
                feedback +
                (feedback === "retry" ? " feedback-incorrect" : "")
              }
              role="status"
            >
              <strong>
                {feedback === "correct"
                  ? "¡Encontraste una buena pista en el texto!"
                  : feedback === "revealed"
                    ? "Leamos juntos la parte clave."
                    : "Aún no es la respuesta. Busquemos una pista."}
              </strong>
              <p>
                {feedback === "correct"
                  ? question.explanation
                  : feedback === "revealed"
                    ? question.explanation
                    : question.hints[
                        Math.min(Math.max(incorrectAttempts - 1, 0), 1)
                      ]}
              </p>
              {feedback === "retry" ? (
                <ReadFeedback
                  text={`Aún no es la respuesta. ${question.hints[Math.min(Math.max(incorrectAttempts - 1, 0), 1)]}`}
                />
              ) : null}
              {feedback === "correct" || feedback === "revealed" ? (
                <blockquote className="answer-evidence">
                  {version.paragraphs[question.paragraph]}
                </blockquote>
              ) : null}
              {feedback === "revealed" && level === "reto" ? (
                <Link
                  className="text-button answer-level-link"
                  href={`/leer/${story.id}?nivel=paso`}
                >
                  ¿Te ayudaría leerlo con frases más cortas? Prueba Paso a paso
                </Link>
              ) : null}
            </div>
          ) : null}
          <div className="question-actions">
            {feedback === "correct" || feedback === "revealed" ? (
              <button className="button" onClick={next}>
                {index === 2 ? "Ver mis descubrimientos" : "Siguiente pregunta"}
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                className="button"
                disabled={selected === null || feedback === "retry"}
                onClick={() => {
                  answerSound.play(selected === question.correct);
                  if (selected === question.correct) {
                    setFeedback("correct");
                    return;
                  }
                  const attempts = incorrectAttempts + 1;
                  setIncorrectAttempts(attempts);
                  setNeedsSupport(true);
                  setFeedback("retry");
                }}
              >
                Comprobar respuesta <ArrowRight size={18} />
              </button>
            )}
          </div>
          <button
            className="text-button story-toggle"
            aria-expanded={showStory}
            aria-controls="relato-de-apoyo"
            onClick={() => setShowStory((s) => !s)}
          >
            <BookOpen size={18} />
            {showStory ? "Cerrar el relato" : "Volver al relato sin salir"}
            {showStory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showStory ? (
            <div id="relato-de-apoyo" className="inline-story">
              <h2>{story.title}</h2>
              {version.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : null}
        </section>
        <aside
          className="hint-card"
          id="tutor-pistas"
          ref={hintPanel}
          tabIndex={-1}
          aria-label="Ayuda para comprender el relato"
        >
          <div className="hint-top">
            <span className="hint-icon">
              <Lightbulb size={25} />
            </span>
            <span className="small-label">UN EMPUJONCITO</span>
          </div>
          <h2>¿Necesitas una pista?</h2>
          <button
            className="button button-outline full-width"
            onClick={askHint}
            disabled={hintCount >= 2 || feedback === "revealed"}
            aria-disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <LoaderCircle size={18} className="spin" />
            ) : (
              <Sparkles size={18} />
            )}{" "}
            {loading
              ? "Buscando una pista…"
              : hintCount >= 2
                ? "Ya tienes las dos pistas"
                : hintCount
                  ? "Dame otra pista"
                  : "Dame una pista"}
          </button>
          <div className="hint-result" aria-live="polite">
            {hints ? (
              <>
                <span className="hint-source">
                  <Sparkles size={13} aria-hidden="true" />
                  {hints.source === "ai" ? "Pista con IA" : "Pista preparada"}
                </span>
                {hints.support === "retry" ? (
                  <span className="hint-adaptation">
                    Una ayuda para volver a intentarlo
                  </span>
                ) : null}
                {hints.action && hints.reflection ? (
                  <div className="hint-scaffold">
                    <p>
                      <strong>Prueba esto:</strong> {hints.action}
                    </p>
                    <p>
                      <strong>Piensa:</strong> {hints.reflection}
                    </p>
                  </div>
                ) : (
                  <p>{hints.hint}</p>
                )}
                <details>
                  <summary>Ver el fragmento del relato</summary>
                  <blockquote>{hints.quote}</blockquote>
                </details>
                {hints.source === "prepared" ? (
                  <p className="hint-footnote">
                    Usamos una pista preparada para que puedas seguir leyendo.
                  </p>
                ) : (
                  <p className="hint-footnote">
                    La IA puede equivocarse. Comprueba la pista con el relato.
                  </p>
                )}
                <button
                  className="text-button report-button"
                  onClick={() => setReportOpen(true)}
                >
                  <Flag size={13} />
                  Esta pista necesita revisión
                </button>
              </>
            ) : (
              <div className="hint-empty">
                <LeafHint />
                <small>
                  La respuesta está en la historia.
                  <br />
                  Te ayudamos a encontrarla.
                </small>
              </div>
            )}
          </div>
          {reportOpen ? (
            <div className="report-box" role="status">
              <button
                className="report-close"
                onClick={() => setReportOpen(false)}
                aria-label="Cerrar aviso"
              >
                <X size={15} />
              </button>
              <strong>
                {reported
                  ? "Pista descartada en esta sesión"
                  : "¿La pista no te ayudó?"}
              </strong>
              <p>
                Coméntalo con una persona adulta. Puedes descartarla y usar la
                pista preparada.
              </p>
              <button
                className="text-button"
                onClick={() => {
                  setHints({
                    hint: question.hints[0],
                    quote: version.paragraphs[question.paragraph],
                    source: "prepared",
                  });
                  setReported(true);
                }}
              >
                Usar la pista preparada
              </button>
              <small>Este prototipo no envía ni guarda reportes.</small>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
function LeafHint() {
  return <Sprout size={39} strokeWidth={1.2} aria-hidden="true" />;
}
function HeartMessage() {
  return (
    <>
      <Sprout size={23} />
      <p>
        Lo importante no es acertar a la primera.
        <br />
        <strong>Es animarte a seguir descubriendo.</strong>
      </p>
    </>
  );
}
