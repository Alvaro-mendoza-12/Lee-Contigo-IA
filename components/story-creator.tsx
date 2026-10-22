"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  HeartHandshake,
  ImagePlus,
  Leaf,
  LoaderCircle,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { fontSteps, paginateStory } from "@/lib/reading";
import { levels, type Level } from "@/lib/stories";
import type { GeneratedStory } from "@/lib/story-creator";

type Screen = "form" | "book" | "questions" | "complete";
type CoverState = "idle" | "loading" | "ready" | "unavailable";

export function StoryCreator() {
  const [screen, setScreen] = useState<Screen>("form");
  const [idea, setIdea] = useState("");
  const [level, setLevel] = useState<Level>("paso");
  const [adultReviewed, setAdultReviewed] = useState(false);
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [coverState, setCoverState] = useState<CoverState>("idle");
  const [adultCoverReviewed, setAdultCoverReviewed] = useState(false);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [fontSize, setFontSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [animate, setAnimate] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const coverRequest = useRef(0);
  const activeHeading = useRef<HTMLHeadingElement>(null);
  const ideaField = useRef<HTMLTextAreaElement>(null);
  const previousScreen = useRef<Screen>("form");

  const pages = useMemo(
    () => (story ? paginateStory(story.paragraphs, fontSize, compact) : []),
    [story, fontSize, compact],
  );
  const currentPageIndex = Math.min(pageIndex, Math.max(0, pages.length - 1));
  const currentPage = pages[currentPageIndex];
  const currentQuestion = story?.questions[questionIndex];
  const correctCount = story
    ? answers.reduce(
        (count, answer, index) =>
          count + (answer === story.questions[index]?.correctIndex ? 1 : 0),
        0,
      )
    : 0;

  useEffect(() => {
    setCanSpeak("speechSynthesis" in window);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      setReducedMotion(motion.matches);
      if (motion.matches) setAnimate(false);
    };
    updateMotion();
    motion.addEventListener("change", updateMotion);

    const mobile = window.matchMedia("(max-width: 760px)");
    const updateCompact = () => setCompact(mobile.matches);
    updateCompact();
    mobile.addEventListener("change", updateCompact);

    const clearOnRestore = (event: PageTransitionEvent) => {
      if (event.persisted) resetCreator();
    };
    window.addEventListener("pageshow", clearOnRestore);
    return () => {
      motion.removeEventListener("change", updateMotion);
      mobile.removeEventListener("change", updateCompact);
      window.removeEventListener("pageshow", clearOnRestore);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
    // resetCreator is intentionally defined below and only used on bfcache restore.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (previousScreen.current !== screen) {
      if (screen === "form") ideaField.current?.focus();
      else activeHeading.current?.focus();
      previousScreen.current = screen;
    }
  }, [screen]);

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  async function createCover(description: string) {
    const requestId = ++coverRequest.current;
    setCoverState("loading");
    setCover(null);
    try {
      const response = await fetch("/api/crear/portada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artDescription: description,
          adultReviewed: true,
        }),
      });
      const data = (await response.json()) as {
        cover?: string;
        error?: string;
      };
      if (!response.ok || !data.cover) throw new Error(data.error ?? "cover");
      if (requestId !== coverRequest.current) return;
      setCover(data.cover);
      setCoverState("ready");
    } catch {
      if (requestId === coverRequest.current) setCoverState("unavailable");
    }
  }

  async function submitIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCreating(true);
    try {
      const response = await fetch("/api/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: idea.trim(),
          level,
          adultReviewed,
        }),
      });
      const data = (await response.json()) as {
        story?: GeneratedStory;
        error?: string;
      };
      if (!response.ok || !data.story)
        throw new Error(data.error ?? "No pudimos crear el cuento.");

      setStory(data.story);
      setIdea("");
      setPageIndex(0);
      setFontSize(5);
      setQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setCoverState("idle");
      setCover(null);
      setAdultCoverReviewed(false);
      setScreen("book");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No pudimos crear el cuento. Inténtalo otra vez.",
      );
    } finally {
      setCreating(false);
    }
  }

  function resetCreator() {
    coverRequest.current += 1;
    stopSpeaking();
    setScreen("form");
    setStory(null);
    setCover(null);
    setCoverState("idle");
    setIdea("");
    setLevel("paso");
    setAdultReviewed(false);
    setAdultCoverReviewed(false);
    setPageIndex(0);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setError("");
  }

  function turnPage(next: number) {
    stopSpeaking();
    setDirection(next > currentPageIndex ? "next" : "previous");
    setPageIndex(Math.max(0, Math.min(next, pages.length - 1)));
  }

  function readCurrentPage() {
    if (!currentPage || !("speechSynthesis" in window)) return;
    if (speaking) {
      stopSpeaking();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(currentPage.text);
    utterance.lang = "es";
    utterance.rate = 0.84;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  function answerQuestion(answer: number) {
    if (selectedAnswer !== null || !currentQuestion) return;
    setSelectedAnswer(answer);
    setAnswers((previous) => [...previous.slice(0, questionIndex), answer]);
  }

  function nextQuestion() {
    if (!story) return;
    if (questionIndex === story.questions.length - 1) {
      setScreen("complete");
      return;
    }
    setQuestionIndex((index) => index + 1);
    setSelectedAnswer(null);
  }

  return (
    <div className="container creator-page">
      <Link href="/biblioteca" className="back-link">
        <ArrowLeft size={16} aria-hidden="true" /> Volver a las historias
      </Link>

      {screen === "form" ? (
        <>
          <header className="creator-heading">
            <span className="small-label">UN CUENTO NACIDO DE TU IDEA</span>
            <h1 ref={activeHeading} tabIndex={-1}>
              ¿Qué historia imaginamos hoy?
            </h1>
            <p>
              Cuéntanos una idea sencilla. La IA la convertirá en un cuento y
              podrás pedir una portada ilustrada.
            </p>
          </header>

          <form className="creator-form" onSubmit={submitIdea}>
            <label className="creator-label" htmlFor="story-idea">
              Mi idea para el cuento
            </label>
            <p className="creator-help" id="idea-help">
              Por ejemplo: «Una tortuga quiere llegar al faro antes del
              anochecer».
            </p>
            <textarea
              id="story-idea"
              ref={ideaField}
              name="idea"
              value={idea}
              onChange={(event) => setIdea(event.target.value.slice(0, 220))}
              maxLength={220}
              minLength={12}
              rows={4}
              aria-describedby="idea-help idea-count"
              placeholder="Escribe una idea de cuento, no información sobre ti…"
              required
            />
            <div className="creator-count" id="idea-count" aria-live="polite">
              {idea.length} de 220 caracteres
            </div>

            <fieldset className="creator-levels">
              <legend>¿Cómo te gustaría leer?</legend>
              {(Object.entries(levels) as [Level, typeof levels.paso][]).map(
                ([id, item]) => (
                  <label
                    className={
                      level === id
                        ? "creator-level-option is-selected"
                        : "creator-level-option"
                    }
                    key={id}
                  >
                    <input
                      type="radio"
                      name="create-level"
                      value={id}
                      checked={level === id}
                      onChange={() => setLevel(id)}
                    />
                    <span className="creator-level-icon">
                      {id === "paso" ? (
                        <Leaf size={20} aria-hidden="true" />
                      ) : (
                        <Sparkles size={20} aria-hidden="true" />
                      )}
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                    {level === id ? (
                      <Check size={18} aria-hidden="true" />
                    ) : null}
                  </label>
                ),
              )}
            </fieldset>

            <aside
              className="creator-privacy-note"
              aria-label="Privacidad y seguridad"
            >
              <HeartHandshake size={22} aria-hidden="true" />
              <div>
                <strong>Hagámoslo con cuidado</strong>
                <p>
                  No escribas tu nombre, dirección, colegio, ciudad, teléfono ni
                  correo. La idea se envía a un modelo de IA para crear el
                  cuento. La portada es opcional: una persona adulta puede
                  revisar las condiciones y el costo antes de pedirla. El cuento
                  vive solo mientras esta página está abierta.
                </p>
                <Link href="/privacidad">
                  Lee cómo se usa la IA y tus datos
                </Link>
              </div>
            </aside>

            <label className="creator-adult-check">
              <input
                type="checkbox"
                checked={adultReviewed}
                onChange={(event) => setAdultReviewed(event.target.checked)}
                required
              />
              <span>
                Una persona adulta está conmigo, revisó que mi idea no tenga
                datos personales y aprueba crear el cuento.
              </span>
            </label>

            {error ? (
              <p className="creator-error" role="alert">
                {error}
              </p>
            ) : null}

            <button
              className="button creator-submit"
              type="submit"
              disabled={creating || idea.trim().length < 12 || !adultReviewed}
            >
              {creating ? (
                <>
                  <LoaderCircle className="creator-spinner" size={19} />
                  Inventando tu cuento…
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Crear mi cuento
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </>
      ) : null}

      {story && screen === "book" ? (
        <section
          className="creator-book-section"
          aria-labelledby="created-title"
        >
          <div className="creator-book-topline">
            <div>
              <span className="small-label">TU CUENTO ESTÁ LISTO</span>
              <h1 id="created-title" ref={activeHeading} tabIndex={-1}>
                {story.title}
              </h1>
              <p>{story.subtitle}</p>
            </div>
            <button
              className="text-button creator-new-button"
              onClick={resetCreator}
            >
              <RotateCcw size={16} aria-hidden="true" /> Crear otro cuento
            </button>
          </div>

          <div className="creator-reader-toolbar">
            <div
              className="font-controls"
              role="group"
              aria-label="Tamaño del texto"
            >
              <span>Letra</span>
              <button
                type="button"
                aria-label="Reducir tamaño de letra"
                disabled={fontSize === 0}
                onClick={() => setFontSize((size) => Math.max(0, size - 1))}
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <span aria-live="polite">{fontSteps[fontSize].label}</span>
              <button
                type="button"
                aria-label="Aumentar tamaño de letra"
                disabled={fontSize === fontSteps.length - 1}
                onClick={() =>
                  setFontSize((size) =>
                    Math.min(fontSteps.length - 1, size + 1),
                  )
                }
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="creator-reader-actions">
              {canSpeak ? (
                <button
                  className="text-button"
                  type="button"
                  onClick={readCurrentPage}
                >
                  {speaking ? <Square size={16} /> : <Volume2 size={17} />}
                  {speaking ? "Detener" : "Escuchar página"}
                </button>
              ) : null}
              <label className="book-animation-control">
                <input
                  type="checkbox"
                  checked={animate && !reducedMotion}
                  disabled={reducedMotion}
                  onChange={(event) => setAnimate(event.target.checked)}
                />
                Animar páginas
              </label>
            </div>
          </div>

          <div className="creator-open-book">
            <div className="creator-cover-page">
              {cover ? (
                <img
                  src={cover}
                  alt={`Ilustración de portada para ${story.title}`}
                />
              ) : (
                <div className="creator-cover-placeholder" aria-hidden="true">
                  {coverState === "loading" ? (
                    <LoaderCircle className="creator-spinner" size={36} />
                  ) : (
                    <>
                      <BookOpen size={45} />
                      <span>UN CUENTO PARA IMAGINAR</span>
                    </>
                  )}
                </div>
              )}
              <div className="creator-cover-title">
                <span>UN CUENTO HECHO PARA TI</span>
                <strong>{story.title}</strong>
              </div>
            </div>
            <article
              key={currentPageIndex}
              className={`creator-book-page ${animate && !reducedMotion ? `page-turn-${direction}` : ""}`}
              style={
                {
                  "--reading-font": `${fontSteps[fontSize].pixels}px`,
                } as CSSProperties
              }
              aria-label={`Página ${currentPageIndex + 1}`}
            >
              <span className="book-chapter">
                {currentPageIndex === 0
                  ? "Érase una vez…"
                  : currentPageIndex === pages.length - 1
                    ? "Y al final…"
                    : "La historia continúa…"}
              </span>
              <p className="book-page-text" aria-live="polite">
                {currentPage?.text}
              </p>
              <span className="book-page-number" aria-hidden="true">
                {currentPageIndex + 1}
              </span>
            </article>
          </div>

          <div
            className="creator-page-progress"
            aria-label="Progreso del cuento"
          >
            <span
              style={{
                width: `${((currentPageIndex + 1) / pages.length) * 100}%`,
              }}
            />
          </div>
          <div className="book-navigation creator-book-navigation">
            <button
              type="button"
              className="button button-outline"
              disabled={currentPageIndex === 0}
              onClick={() => turnPage(currentPageIndex - 1)}
            >
              <ArrowLeft size={17} aria-hidden="true" /> Anterior
            </button>
            <span role="status" aria-live="polite">
              Página {currentPageIndex + 1} de {pages.length}
            </span>
            {currentPageIndex < pages.length - 1 ? (
              <button
                type="button"
                className="button"
                onClick={() => turnPage(currentPageIndex + 1)}
                aria-label="Página siguiente"
              >
                Siguiente <ArrowRight size={17} aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                className="button"
                onClick={() => {
                  stopSpeaking();
                  setScreen("questions");
                }}
              >
                Leer y explorar <Sparkles size={17} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="creator-cover-status">
            {coverState === "idle" || coverState === "unavailable" ? (
              <div className="creator-cover-consent">
                <div>
                  <strong>
                    {coverState === "idle"
                      ? "¿Quieres ilustrar la portada?"
                      : "La historia está lista; no pudimos generar la ilustración."}
                  </strong>
                  <p>
                    Es opcional. La imagen usa solo la descripción visual del
                    cuento y se envía a Black Forest Labs. Su política indica
                    que puede usar prompts e imágenes para mejorar sus modelos.
                    Vercel muestra actualmente un costo de USD 0.05 por imagen;
                    se descuenta de créditos disponibles y esta app no compra ni
                    recarga créditos.
                  </p>
                  <a
                    href="https://bfl.ai/legal/privacy-policy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lee la política del proveedor de imágenes
                  </a>
                  <a
                    href="https://vercel.com/ai-gateway/models/flux-3-image"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Consulta el costo actual en Vercel
                  </a>
                </div>
                <label className="creator-adult-check">
                  <input
                    type="checkbox"
                    checked={adultCoverReviewed}
                    onChange={(event) =>
                      setAdultCoverReviewed(event.target.checked)
                    }
                  />
                  <span>
                    Una persona adulta revisó este aviso y acepta solicitar la
                    portada.
                  </span>
                </label>
                <button
                  type="button"
                  className="button button-outline"
                  disabled={!adultCoverReviewed}
                  onClick={() => void createCover(story.artDescription)}
                >
                  <ImagePlus size={17} />
                  {coverState === "idle"
                    ? "Crear portada con IA"
                    : "Intentar portada otra vez"}
                </button>
              </div>
            ) : coverState === "loading" ? (
              <p role="status" aria-live="polite">
                <LoaderCircle className="creator-spinner" size={16} /> La IA
                está pintando tu portada…
              </p>
            ) : (
              <p role="status" aria-live="polite">
                <Check size={16} /> Portada ilustrada con IA. La historia no se
                guarda al salir.
              </p>
            )}
          </div>
        </section>
      ) : null}

      {story && screen === "questions" && currentQuestion ? (
        <section className="creator-quiz" aria-labelledby="quiz-title">
          <span className="small-label">LO LEÍSTE, AHORA EXPLOREMOS</span>
          <h1 id="quiz-title" ref={activeHeading} tabIndex={-1}>
            ¿Qué descubriste en el cuento?
          </h1>
          <div className="creator-quiz-progress" role="status">
            Pregunta {questionIndex + 1} de {story.questions.length}
          </div>
          <article className="creator-question-card">
            <h2>{currentQuestion.prompt}</h2>
            <div className="creator-answer-options">
              {currentQuestion.options.map((option, index) => {
                const chosen = selectedAnswer === index;
                const correct = currentQuestion.correctIndex === index;
                let className = "creator-answer-option";
                if (selectedAnswer !== null && correct)
                  className += " is-correct";
                if (chosen && !correct) className += " is-incorrect";
                return (
                  <button
                    type="button"
                    className={className}
                    key={`${questionIndex}-${index}`}
                    disabled={selectedAnswer !== null}
                    onClick={() => answerQuestion(index)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                    {chosen && correct ? <Check size={18} /> : null}
                  </button>
                );
              })}
            </div>
            {selectedAnswer !== null ? (
              <div
                className="creator-answer-feedback"
                role="status"
                aria-live="polite"
              >
                <strong>
                  {selectedAnswer === currentQuestion.correctIndex
                    ? "¡Así es!"
                    : "Buen intento. Vamos a mirar la pista del cuento."}
                </strong>
                <p>{currentQuestion.explanation}</p>
                <button className="button" type="button" onClick={nextQuestion}>
                  {questionIndex === story.questions.length - 1
                    ? "Terminar cuento"
                    : "Siguiente pregunta"}
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : null}
          </article>
          <button
            type="button"
            className="text-button"
            onClick={() => setScreen("book")}
          >
            <ArrowLeft size={16} /> Volver al libro
          </button>
        </section>
      ) : null}

      {story && screen === "complete" ? (
        <section className="creator-complete" aria-labelledby="complete-title">
          <span className="creator-complete-icon">
            <BookOpen size={34} aria-hidden="true" />
          </span>
          <span className="small-label">UNA HISTORIA, MUCHAS IDEAS</span>
          <h1 id="complete-title" ref={activeHeading} tabIndex={-1}>
            ¡Terminaste de leer!
          </h1>
          <p>
            Encontraste {correctCount} de {story.questions.length} respuestas.
            Cada lectura te ayuda a descubrir algo nuevo.
          </p>
          <div className="creator-complete-actions">
            <button
              className="button button-outline"
              type="button"
              onClick={() => {
                setPageIndex(0);
                setScreen("book");
              }}
            >
              <BookOpen size={17} /> Leer otra vez
            </button>
            <button className="button" type="button" onClick={resetCreator}>
              <Sparkles size={17} /> Crear otro cuento
            </button>
          </div>
          <Link className="inline-link" href="/biblioteca">
            Explorar los cuentos de la biblioteca <ArrowRight size={16} />
          </Link>
        </section>
      ) : null}
    </div>
  );
}
