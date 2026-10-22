"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ShieldCheck,
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
import { BookSpread } from "./book-spread";
import { ReadingPause } from "./reading-pause";
import {
  comprehensionSkillLabels,
  getIllustrationScene,
  type GeneratedStory,
} from "@/lib/story-creator";

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
  const [coverIsAtlas, setCoverIsAtlas] = useState(false);
  const [coverFromCollection, setCoverFromCollection] = useState(false);
  const [error, setError] = useState("");
  const [gatewayUnavailable, setGatewayUnavailable] = useState(false);
  const [creating, setCreating] = useState(false);
  const [fontSize, setFontSize] = useState(5);
  const [position, setPosition] = useState({ paragraph: 0, word: 0 });
  const [animate, setAnimate] = useState(true);
  const [compact, setCompact] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const coverRequest = useRef(0);
  const coverAbort = useRef<AbortController | null>(null);
  const creationAbort = useRef<AbortController | null>(null);
  const activeHeading = useRef<HTMLHeadingElement>(null);
  const ideaField = useRef<HTMLTextAreaElement>(null);
  const answerGroupRef = useRef<HTMLDivElement>(null);
  const answerFeedbackRef = useRef<HTMLDivElement>(null);
  const previousScreen = useRef<Screen>("form");

  const pages = useMemo(
    () => (story ? paginateStory(story.paragraphs, fontSize, compact) : []),
    [story, fontSize, compact],
  );
  const matchedIndex = pages.findIndex(
    (item) =>
      item.paragraph === position.paragraph &&
      item.start <= position.word &&
      item.end > position.word,
  );
  const currentPageIndex = Math.max(0, matchedIndex);
  const currentPage = pages[currentPageIndex];
  const currentQuestion = story?.questions[questionIndex];
  const answerIsCorrect =
    selectedAnswer !== null && selectedAnswer === currentQuestion?.correctIndex;
  const answerIsWrong =
    selectedAnswer !== null &&
    currentQuestion !== undefined &&
    selectedAnswer !== currentQuestion.correctIndex;
  const revealAnswer = answerIsWrong && wrongAttempts >= 3;
  const showTutorHint =
    currentQuestion !== undefined &&
    wrongAttempts > 0 &&
    wrongAttempts < 3 &&
    !answerIsCorrect;
  const tutorHintIndex = Math.min(Math.max(wrongAttempts - 1, 0), 1);

  useEffect(() => {
    setCanSpeak("speechSynthesis" in window);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      if (motion.matches) setAnimate(false);
    };
    updateMotion();
    motion.addEventListener("change", updateMotion);

    const mobile = window.matchMedia("(max-width: 900px)");
    const updateCompact = () => setCompact(mobile.matches);
    updateCompact();
    mobile.addEventListener("change", updateCompact);

    const clearOnRestore = (event: PageTransitionEvent) => {
      if (event.persisted) resetCreator();
    };
    window.addEventListener("pageshow", clearOnRestore);
    return () => {
      coverRequest.current++;
      coverAbort.current?.abort();
      creationAbort.current?.abort();
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

  useEffect(() => {
    if (selectedAnswer !== null) answerFeedbackRef.current?.focus();
  }, [selectedAnswer, wrongAttempts]);

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  async function createCover(createdStory: GeneratedStory) {
    const requestId = ++coverRequest.current;
    coverAbort.current?.abort();
    const controller = new AbortController();
    coverAbort.current = controller;
    setCoverState("loading");
    setCover(null);
    try {
      const response = await fetch("/api/crear/portada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artDescription: createdStory.artDescription,
          scenes: [0, 1, 3, 5].map(
            (index) =>
              createdStory.paragraphs[
                Math.min(index, createdStory.paragraphs.length - 1)
              ],
          ),
          adultReviewed: true,
        }),
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(85_000),
        ]),
      });
      const data = (await response.json()) as {
        cover?: string;
        layout?: string;
        source?: string;
        error?: string;
      };
      if (!response.ok || !data.cover) throw new Error(data.error ?? "cover");
      if (requestId !== coverRequest.current) return;
      setCover(data.cover);
      setCoverIsAtlas(data.layout === "atlas");
      setCoverFromCollection(data.source === "collection");
      setCoverState("ready");
    } catch {
      if (requestId === coverRequest.current) setCoverState("unavailable");
    }
  }

  async function submitIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setGatewayUnavailable(false);
    setCreating(true);
    creationAbort.current?.abort();
    const controller = new AbortController();
    creationAbort.current = controller;
    try {
      const response = await fetch("/api/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: idea.trim(),
          level,
          adultReviewed,
        }),
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(55_000),
        ]),
      });
      const data = (await response.json()) as {
        story?: GeneratedStory;
        error?: string;
        code?: string;
      };
      if (controller.signal.aborted) return;
      if (!response.ok || !data.story) {
        setGatewayUnavailable(data.code === "AI_SERVICE_ACCESS_UNAVAILABLE");
        throw new Error(data.error ?? "No pudimos crear el cuento.");
      }

      setStory(data.story);
      setIdea("");
      setPosition({ paragraph: 0, word: 0 });
      setFontSize(5);
      setQuestionIndex(0);
      setWrongAttempts(0);
      setSelectedAnswer(null);
      setCoverState("idle");
      setCover(null);
      setScreen("book");
      void createCover(data.story);
    } catch (cause) {
      if (controller.signal.aborted) return;
      setError(
        cause instanceof Error &&
          ["AbortError", "TimeoutError"].includes(cause.name)
          ? "El cuento está tardando más de lo habitual. Tu idea sigue aquí; inténtalo de nuevo en un momento."
          : cause instanceof Error
            ? cause.message
            : "No pudimos crear el cuento. Inténtalo otra vez.",
      );
    } finally {
      if (creationAbort.current === controller) setCreating(false);
    }
  }

  function resetCreator() {
    coverRequest.current += 1;
    coverAbort.current?.abort();
    creationAbort.current?.abort();
    setCreating(false);
    stopSpeaking();
    setScreen("form");
    setStory(null);
    setCover(null);
    setCoverState("idle");
    setIdea("");
    setError("");
    setGatewayUnavailable(false);
    setLevel("paso");
    setAdultReviewed(false);
    setPosition({ paragraph: 0, word: 0 });
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setWrongAttempts(0);
    setError("");
  }

  function turnPage(next: number) {
    stopSpeaking();
    const target = pages[Math.max(0, Math.min(next, pages.length - 1))];
    if (target)
      setPosition({ paragraph: target.paragraph, word: target.start });
  }

  function resizeFont(next: number) {
    stopSpeaking();
    if (currentPage)
      setPosition({
        paragraph: currentPage.paragraph,
        word: currentPage.start,
      });
    setFontSize(next);
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
    if (answer !== currentQuestion.correctIndex)
      setWrongAttempts((attempts) => attempts + 1);
  }

  function nextQuestion() {
    if (!story) return;
    if (questionIndex === story.questions.length - 1) {
      setScreen("complete");
      return;
    }
    setQuestionIndex((index) => index + 1);
    setSelectedAnswer(null);
    setWrongAttempts(0);
  }

  function retryAnswer() {
    setSelectedAnswer(null);
    requestAnimationFrame(() =>
      answerGroupRef.current
        ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
        ?.focus(),
    );
  }

  return (
    <div className="container creator-page">
      <Link href="/" className="back-link">
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
              Una idea tuya, un libro para descubrir. Con ilustraciones, páginas
              para pasar y pequeñas preguntas para pensar.
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
            <div
              className="idea-starters"
              role="group"
              aria-label="Ideas para empezar"
            >
              {[
                "Una tortuga busca un faro",
                "Un zorro encuentra una nube perdida",
                "Una semilla quiere conocer el bosque",
              ].map((starter) => (
                <button
                  className="idea-starter"
                  type="button"
                  key={starter}
                  disabled={creating}
                  onClick={() => {
                    setIdea(starter);
                    ideaField.current?.focus();
                  }}
                >
                  {starter}
                </button>
              ))}
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
              <ShieldCheck size={22} aria-hidden="true" />
              <div>
                <strong>Imagina con libertad</strong>
                <p>
                  Usa personajes imaginarios. Guarda para ti tu nombre, colegio,
                  dirección y otros datos personales.
                </p>
                <Link href="/privacidad">Información para familias</Link>
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
                Una persona adulta está conmigo y revisó mi idea para crear el
                cuento y sus ilustraciones.
              </span>
            </label>

            {error ? (
              <div className="creator-error-group">
                <p className="creator-error" role="alert">
                  {error}
                </p>
                {gatewayUnavailable ? (
                  <Link className="creator-error-link" href="/">
                    Leer un cuento de la biblioteca <ArrowRight size={16} />
                  </Link>
                ) : null}
              </div>
            ) : null}

            <button
              className="button creator-submit"
              type="submit"
              disabled={creating || idea.trim().length < 12 || !adultReviewed}
            >
              {creating ? (
                <>
                  <LoaderCircle className="creator-spinner" size={19} />
                  Preparando tu aventura…
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Crear mi cuento
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            {creating ? (
              <ol className="creation-steps" aria-live="polite">
                <li>
                  <Check size={16} aria-hidden="true" />
                  Tu idea está lista
                </li>
                <li>
                  <LoaderCircle
                    className="creator-spinner"
                    size={16}
                    aria-hidden="true"
                  />
                  Escribiendo la aventura y sus preguntas…
                </li>
                <li>
                  <BookOpen size={16} aria-hidden="true" />
                  Después, prepararemos sus ilustraciones
                </li>
              </ol>
            ) : null}
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
                onClick={() => resizeFont(Math.max(0, fontSize - 1))}
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <span aria-live="polite">{fontSteps[fontSize].label}</span>
              <button
                type="button"
                aria-label="Aumentar tamaño de letra"
                disabled={fontSize === fontSteps.length - 1}
                onClick={() =>
                  resizeFont(Math.min(fontSteps.length - 1, fontSize + 1))
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
                  checked={animate}

                  onChange={(event) => setAnimate(event.target.checked)}
                />
                Animar páginas
              </label>
            </div>
          </div>

          <BookSpread
            animated={animate}
            fontSize={fontSteps[fontSize].pixels}
            onNavigate={(offset) => turnPage(currentPageIndex + offset)}
            page={{
              id: `${story.title}-${fontSize}-${compact}-${currentPageIndex}`,
              book: `${story.title}-${fontSize}-${compact}`,
              number: currentPageIndex + 1,
              text: currentPage?.text ?? "",
              chapter:
                currentPageIndex === 0
                  ? "Érase una vez…"
                  : currentPageIndex === pages.length - 1
                    ? "Y al final…"
                    : "La historia continúa…",
              illustration: cover ? (
                <div
                  className="story-art"
                  style={
                    {
                      "--atlas-columns": coverIsAtlas ? 2 : 1,
                      "--atlas-rows": coverIsAtlas ? 2 : 1,
                      "--scene-x": `${coverIsAtlas && Math.floor((currentPageIndex * 4) / pages.length) % 2 ? -100 : 0}%`,
                      "--scene-y": `${coverIsAtlas && Math.floor((currentPageIndex * 4) / pages.length) > 1 ? -100 : 0}%`,
                      "--art-zoom": 1.035 + (currentPageIndex % 3) * 0.025,
                    } as CSSProperties
                  }
                >
                  <div className="art-camera">
                    <img
                      src={cover}
                      width={1024}
                      height={1024}
                      alt={
                        coverFromCollection
                          ? "Paisaje imaginario de nuestra colección de lectura"
                          : `Ilustración del cuento: ${story.title}`
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="creator-cover-placeholder" aria-hidden="true">
                  {coverState === "loading" ? (
                    <LoaderCircle className="creator-spinner" size={36} />
                  ) : (
                    <BookOpen size={45} />
                  )}
                </div>
              ),
            }}
          />

          <progress
            className="book-progress"
            max={pages.length}
            value={currentPageIndex + 1}
            aria-label="Progreso del cuento"
          />
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

          <ReadingPause
            key={currentPage?.paragraph ?? 0}
            scene={getIllustrationScene(
              currentPage?.paragraph ?? 0,
              story.paragraphs.length,
            )}
          />

          <div className="creator-cover-status">
            {coverState === "loading" ? (
              <p role="status" aria-live="polite">
                <LoaderCircle
                  className="creator-spinner"
                  size={16}
                  aria-hidden="true"
                />
                Preparando las ilustraciones… Puedes empezar a leer.
              </p>
            ) : coverState === "unavailable" ? (
              <p role="status">
                Las ilustraciones no llegaron esta vez. Tu cuento sigue listo.{" "}
                <button
                  className="text-button"
                  type="button"
                  onClick={() => void createCover(story)}
                >
                  Reintentar ilustraciones
                </button>
              </p>
            ) : (
              <p role="status" aria-live="polite">
                <Check size={16} aria-hidden="true" />
                {coverFromCollection
                  ? "Ilustraciones de nuestra colección para acompañar tu lectura."
                  : "Tu libro está ilustrado. Las escenas cambian al avanzar."}
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
          <p className="creator-quiz-intro">
            Busca pistas en la historia. Puedes volver a leer cuando quieras.
          </p>
          <div className="creator-quiz-progress" role="status">
            Pregunta {questionIndex + 1} de {story.questions.length}
          </div>
          <article className="creator-question-card">
            <span className="skill-pill">
              {comprehensionSkillLabels[currentQuestion.skill]}
            </span>
            <h2>{currentQuestion.prompt}</h2>
            <div
              ref={answerGroupRef}
              className="creator-answer-options"
              role="group"
              aria-label="Opciones de respuesta"
            >
              {currentQuestion.options.map((option, index) => {
                const chosen = selectedAnswer === index;
                const correct = currentQuestion.correctIndex === index;
                let className = "creator-answer-option";
                if ((answerIsCorrect || revealAnswer) && correct)
                  className += " is-correct";
                if (chosen && !correct && answerIsWrong)
                  className += " is-incorrect";
                return (
                  <button
                    type="button"
                    className={className}
                    key={`${questionIndex}-${index}`}
                    disabled={selectedAnswer !== null}
                    aria-pressed={chosen}
                    onClick={() => answerQuestion(index)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                    {((chosen && correct) || (revealAnswer && correct)) && (
                      <Check size={18} aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
            {answerIsCorrect ? (
              <div
                className="creator-answer-feedback"
                role="status"
                aria-live="polite"
                ref={answerFeedbackRef}
                tabIndex={-1}
              >
                <strong>¡Muy bien! Usaste el relato para comprobarlo.</strong>
                <p>{currentQuestion.explanation}</p>
                <StoryEvidence
                  quote={currentQuestion.evidenceQuote}
                  paragraph={
                    story.paragraphs[currentQuestion.evidenceParagraph]
                  }
                  paragraphNumber={currentQuestion.evidenceParagraph + 1}
                />
                <button className="button" type="button" onClick={nextQuestion}>
                  {questionIndex === story.questions.length - 1
                    ? "Terminar cuento"
                    : "Siguiente pregunta"}
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : revealAnswer ? (
              <div
                className="creator-answer-feedback"
                role="status"
                aria-live="polite"
                ref={answerFeedbackRef}
                tabIndex={-1}
              >
                <strong>Vamos a leer la respuesta con calma.</strong>
                <p>{currentQuestion.explanation}</p>
                <StoryEvidence
                  quote={currentQuestion.evidenceQuote}
                  paragraph={
                    story.paragraphs[currentQuestion.evidenceParagraph]
                  }
                  paragraphNumber={currentQuestion.evidenceParagraph + 1}
                />
                <button className="button" type="button" onClick={nextQuestion}>
                  {questionIndex === story.questions.length - 1
                    ? "Terminar cuento"
                    : "Continuar"}
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : showTutorHint ? (
              <div
                className="creator-answer-feedback creator-tutor-hint"
                role="status"
                aria-live="polite"
                ref={answerFeedbackRef}
                tabIndex={-1}
              >
                <span className="small-label">
                  <Sparkles size={14} aria-hidden="true" />
                  Pista de IA · {tutorHintIndex + 1} de 2
                </span>
                <strong>
                  {wrongAttempts === 1
                    ? "Miremos una pista del cuento."
                    : "Probemos con otra forma de pensar."}
                </strong>
                <p>{currentQuestion.hints[tutorHintIndex]}</p>
                <details className="creator-hint-evidence">
                  <summary>
                    Volver al párrafo {currentQuestion.evidenceParagraph + 1}
                  </summary>
                  <blockquote>
                    {story.paragraphs[currentQuestion.evidenceParagraph]}
                  </blockquote>
                </details>
                {selectedAnswer !== null ? (
                  <button
                    className="button button-outline"
                    type="button"
                    onClick={retryAnswer}
                  >
                    Intentar otra vez
                  </button>
                ) : null}
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
            Practicaste distintas maneras de comprender. Volver al texto y usar
            una pista también es parte de aprender.
          </p>
          <div
            className="skills-earned"
            aria-label="Habilidades que practicaste"
          >
            {story.questions.map((question) => (
              <span key={question.skill}>
                <Check size={16} aria-hidden="true" />
                {comprehensionSkillLabels[question.skill]}
              </span>
            ))}
          </div>
          <div className="creator-complete-actions">
            <button
              className="button button-outline"
              type="button"
              onClick={() => {
                setPosition({ paragraph: 0, word: 0 });
                setScreen("book");
              }}
            >
              <BookOpen size={17} /> Leer otra vez
            </button>
            <button className="button" type="button" onClick={resetCreator}>
              <Sparkles size={17} /> Crear otro cuento
            </button>
          </div>
          <Link className="inline-link" href="/">
            Explorar los cuentos de la biblioteca <ArrowRight size={16} />
          </Link>
        </section>
      ) : null}
    </div>
  );
}

function StoryEvidence({
  quote,
  paragraph,
  paragraphNumber,
}: {
  quote: string;
  paragraph: string;
  paragraphNumber: number;
}) {
  return (
    <section
      className="creator-answer-evidence"
      aria-label="Evidencia del cuento"
    >
      <span className="small-label">Una frase del cuento lo muestra</span>
      <blockquote>{quote}</blockquote>
      <details className="creator-hint-evidence">
        <summary>Leer el párrafo {paragraphNumber} completo</summary>
        <p>{paragraph}</p>
      </details>
    </section>
  );
}
