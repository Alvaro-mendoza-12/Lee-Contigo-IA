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
import { levels, type Level, type StoryArtVariant } from "@/lib/stories";
import { StoryArt } from "./art";
import { ReadingFriend } from "./reading-friend";
import { BookSpread } from "./book-spread";
import { ReadingPause } from "./reading-pause";
import { useNarration } from "./use-narration";
import { ReadingSettings } from "./reading-settings";
import { useReadingFont } from "./use-reading-font";
import { ReadingHelp } from "./reading-help";
import { GeneratedScene } from "./generated-scene";
import {
  composeStoryPlan,
  scenePlanSchema,
  pageImagesSchema,
  type ScenePlan,
} from "@/lib/story-illustrations";
import { ReadFeedback } from "./answer-audio";
import { InterruptorAudio } from "./interruptor-audio";
import { reproducir, reproducirRespuesta } from "@/lib/sonidos";
import { BookShelf } from "./book-shelf";
import {
  listSavedBooks,
  makeSavedBook,
  readSavedBook,
  saveBook,
  removeBook,
  clearBooks,
  type SavedBook,
} from "@/lib/book-shelf";
import {
  comprehensionSkillLabels,
  getIllustrationScene,
  getStoryIdeaSafetyIssue,
  storySafetyMessage,
  type GeneratedStory,
} from "@/lib/story-creator";

type Screen = "form" | "preparing" | "book" | "questions" | "complete";
type CoverState = "idle" | "loading" | "ready" | "unavailable";
const ideaStarters = [
  {
    label: "Una tortuga",
    idea: "Una tortuga busca un faro",
    art: "lighthouse",
  },
  {
    label: "Una nube",
    idea: "Una nube quiere encontrar su camino a casa",
    art: "cloud",
  },
  {
    label: "Una semilla",
    idea: "Una semilla quiere conocer el bosque",
    art: "seed",
  },
] satisfies { label: string; idea: string; art: StoryArtVariant }[];

export function StoryCreator() {
  const [screen, setScreen] = useState<Screen>("form");
  const [workspace, setWorkspace] = useState<"create" | "shelf">("create");
  const [books, setBooks] = useState<SavedBook[]>([]);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "unavailable"
  >("idle");
  const [idea, setIdea] = useState("");
  const ideaSafetyIssue = getStoryIdeaSafetyIssue(idea);
  const [level, setLevel] = useState<Level>("paso");
  const [adultReviewed, setAdultReviewed] = useState(false);
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [pageImages, setPageImages] = useState<(string | null)[] | undefined>();
  const [illustrationPlan, setIllustrationPlan] = useState<ScenePlan | null>(
    null,
  );
  const [coverState, setCoverState] = useState<CoverState>("idle");
  const [coverIsAtlas, setCoverIsAtlas] = useState(false);
  const [coverFromCollection, setCoverFromCollection] = useState(false);
  const [error, setError] = useState("");
  const [gatewayUnavailable, setGatewayUnavailable] = useState(false);
  const [creating, setCreating] = useState(false);
  const [fontSize, setFontSize] = useReadingFont();
  const [position, setPosition] = useState({ paragraph: 0, word: 0 });
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
  const [audioTokens, setAudioTokens] = useState<string[]>([]);
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
  const currentBook = useRef<SavedBook | null>(null);
  const storageQueue = useRef<Promise<unknown>>(Promise.resolve());

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
  const revealAnswer = false;
  const showTutorHint =
    currentQuestion !== undefined && wrongAttempts > 0 && !answerIsCorrect;
  const tutorHintIndex = Math.min(Math.max(wrongAttempts - 1, 0), 1);

  useEffect(() => {
    let cancelled = false;
    listSavedBooks()
      .then((saved) => {
        if (cancelled) return;
        setBooks(saved);
        if (saved.length) setWorkspace("shelf");
      })
      .catch(() => {
        if (!cancelled) setSaveState("unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
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
    stopNarration();
  }

  function persistBook(book: SavedBook) {
    setSaveState("saving");
    // Serialize the text and illustration writes so a slower initial save cannot erase the cover.
    storageQueue.current = storageQueue.current
      .catch(() => undefined)
      .then(async () => {
        try {
          const saved = await saveBook(book);
          setBooks(saved);
          if (currentBook.current?.id === book.id) setSaveState("saved");
        } catch {
          setSaveState("unavailable");
        }
      });
  }

  function openSavedBook(book: SavedBook) {
    if (!readSavedBook(book)) {
      void listSavedBooks()
        .then(setBooks)
        .catch(() => setSaveState("unavailable"));
      return;
    }
    coverRequest.current++;
    coverAbort.current?.abort();
    creationAbort.current?.abort();
    stopSpeaking();
    currentBook.current = book;
    setCreating(false);
    setStory(book.story);
    setAudioTokens(book.audioTokens ?? []);
    setLevel(book.level);
    setCover(book.cover);
    setPageImages(book.pageImages);
    setIllustrationPlan(
      book.illustrationPlan ??
        (!book.cover
          ? composeStoryPlan(book.story.paragraphs, book.story.artDescription)
          : null),
    );
    setCoverIsAtlas(book.atlas);
    setCoverFromCollection(book.collection);
    setCoverState(book.cover ? "ready" : "unavailable");
    setPosition({ paragraph: 0, word: 0 });
    setQuestionIndex(0);
    setWrongAttempts(0);
    setSelectedAnswer(null);
    setSaveState("saved");
    setScreen("book");
  }

  async function deleteSavedBooks(id?: string) {
    await storageQueue.current.catch(() => undefined);
    try {
      if (id) setBooks(await removeBook(id));
      else {
        await clearBooks();
        setBooks([]);
      }
    } catch {
      setSaveState("unavailable");
    }
  }

  function showShelf() {
    if (screen !== "form") resetCreator();
    setWorkspace("shelf");
    void listSavedBooks()
      .then(setBooks)
      .catch(() => setSaveState("unavailable"));
  }

  async function createCover(createdStory: GeneratedStory) {
    const requestId = ++coverRequest.current;
    coverAbort.current?.abort();
    const controller = new AbortController();
    coverAbort.current = controller;
    setCoverState("loading");
    setCover(null);
    const fallbackPlan = composeStoryPlan(
      createdStory.paragraphs,
      createdStory.artDescription,
    );
    setIllustrationPlan(fallbackPlan);
    const authorizations = currentBook.current?.audioTokens;
    if (!authorizations || authorizations.length !== 6) {
      setCoverState("unavailable");
      return;
    }
    try {
      const response = await fetch("/api/crear/portada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artDescription: createdStory.artDescription,
          scenes: createdStory.paragraphs,
          authorizations,
          adultReviewed: true,
        }),
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(65000),
        ]),
      });
      const data = (await response.json()) as {
        cover?: string;
        layout?: string;
        source?: string;
        error?: string;
        illustrationPlan?: ScenePlan;
        pageImages?: (string | null)[];
      };
      if (!response.ok || (!data.cover && !data.illustrationPlan))
        throw new Error(data.error ?? "cover");
      if (requestId !== coverRequest.current) return;
      const plan = data.illustrationPlan
        ? scenePlanSchema.parse(data.illustrationPlan)
        : null;
      setIllustrationPlan(plan);
      const images = data.pageImages
        ? pageImagesSchema.parse(data.pageImages)
        : undefined;
      setPageImages(images);
      setCover(data.cover ?? null);
      setCoverIsAtlas(data.layout === "atlas");
      setCoverFromCollection(data.source === "collection");
      setCoverState(
        images?.length === 6 && images.every(Boolean) ? "ready" : "unavailable",
      );
      if (currentBook.current?.story === createdStory) {
        const updated = {
          ...currentBook.current,
          cover: data.cover ?? null,
          illustrationPlan: plan ?? undefined,
          pageImages: images,
          atlas: data.layout === "atlas",
          collection: data.source === "collection",
        };
        currentBook.current = updated;
        persistBook(updated);
      }
    } catch {
      if (requestId === coverRequest.current) {
        setIllustrationPlan(fallbackPlan);
        setCoverState("unavailable");
      }
    }
  }

  async function submitIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const safetyIssue = getStoryIdeaSafetyIssue(idea);
    if (safetyIssue) {
      setError("");
      ideaField.current?.focus();
      return;
    }
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
        audioTokens?: string[];
      };
      if (controller.signal.aborted) return;
      if (!response.ok || !data.story) {
        setGatewayUnavailable(data.code === "AI_SERVICE_ACCESS_UNAVAILABLE");
        throw new Error(data.error ?? "No pudimos crear el cuento.");
      }

      setStory(data.story);
      const initialPlan = composeStoryPlan(
        data.story.paragraphs,
        data.story.artDescription,
      );
      setIllustrationPlan(initialPlan);
      setAudioTokens(data.audioTokens ?? []);
      setIdea("");
      setPosition({ paragraph: 0, word: 0 });
      setQuestionIndex(0);
      setWrongAttempts(0);
      setSelectedAnswer(null);
      setCoverState("idle");
      setCover(null);
      setPageImages(undefined);
      setScreen("preparing");
      const saved = {
        ...makeSavedBook(data.story, level),
        audioTokens: data.audioTokens,
        illustrationPlan: initialPlan,
      };
      currentBook.current = saved;
      persistBook(saved);
      await createCover(data.story);
      if (!controller.signal.aborted) setScreen("book");
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
    currentBook.current = null;
    setWorkspace("create");
    coverRequest.current += 1;
    coverAbort.current?.abort();
    creationAbort.current?.abort();
    setCreating(false);
    stopSpeaking();
    setScreen("form");
    setStory(null);
    setIllustrationPlan(null);
    setAudioTokens([]);
    setAnimate(true);
    setCover(null);
    setPageImages(undefined);
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
    const targetIndex = Math.max(0, Math.min(next, pages.length - 1));
    const target = pages[targetIndex];
    if (target) {
      if (targetIndex !== currentPageIndex) reproducir("pagina");
      setPosition({ paragraph: target.paragraph, word: target.start });
    }
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
    if (!currentPage || !story) return;
    if (speaking || voiceLoading) {
      stopSpeaking();
      return;
    }
    const authorization = audioTokens[currentPage.paragraph];
    void speak(
      currentPage.text,
      authorization
        ? {
            source: "generated",
            paragraphText: story.paragraphs[currentPage.paragraph],
            authorization,
            start: currentPage.start,
            end: currentPage.end,
          }
        : undefined,
    );
  }

  function answerQuestion(answer: number) {
    if (selectedAnswer !== null || !currentQuestion) return;
    setSelectedAnswer(answer);
    // Only lib/sonidos.ts plays audio here: with Sonidos off, nothing sounds.
    reproducirRespuesta(answer === currentQuestion.correctIndex);
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
      <Link href="/biblioteca" className="back-link">
        <ArrowLeft size={16} aria-hidden="true" /> Volver a las historias
      </Link>

      {screen === "form" ? (
        <>
          <header className="creator-heading">
            <ReadingFriend />
            <h1 ref={activeHeading} tabIndex={-1}>
              Crea tu cuento
            </h1>
          </header>
          <div
            className="creator-workspace-tabs"
            role="group"
            aria-label="Tu espacio de cuentos"
          >
            <button
              type="button"
              disabled={creating}
              aria-pressed={workspace === "create"}
              onClick={() => setWorkspace("create")}
            >
              <Sparkles size={18} aria-hidden="true" />
              Crear
            </button>
            <button
              type="button"
              disabled={creating}
              aria-pressed={workspace === "shelf"}
              onClick={showShelf}
            >
              <BookOpen size={18} aria-hidden="true" />
              Mis libros
              {books.length ? (
                <span className="shelf-count">{books.length}</span>
              ) : null}
            </button>
          </div>
          {workspace === "shelf" ? (
            <BookShelf
              books={books}
              onOpen={openSavedBook}
              onRemove={deleteSavedBooks}
              onClear={() => deleteSavedBooks()}
              onCreate={() => setWorkspace("create")}
            />
          ) : (
            <form className="creator-form" onSubmit={submitIdea}>
              <label className="creator-label" htmlFor="story-idea">
                Mi idea
              </label>

              <p className="creator-help sr-only" id="idea-help">
                Por ejemplo: «Una tortuga busca un faro».
              </p>
              <textarea
                id="story-idea"
                ref={ideaField}
                name="idea"
                value={idea}
                onChange={(event) => {
                  setIdea(event.target.value.slice(0, 220));
                  if (error) setError("");
                }}
                maxLength={220}
                minLength={12}
                rows={3}
                aria-describedby={`idea-help idea-count${ideaSafetyIssue ? " idea-safety" : ""}`}
                aria-invalid={Boolean(ideaSafetyIssue)}
                placeholder="Un personaje, un lugar, una aventura…"
                required
              />
              <div className="creator-count" id="idea-count" aria-live="polite">
                {idea.length} de 220 caracteres
              </div>
              {ideaSafetyIssue ? (
                <p
                  className="creator-safety-warning"
                  id="idea-safety"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {storySafetyMessage(ideaSafetyIssue)}
                </p>
              ) : null}
              <details className="creator-ideas">
                <summary>Necesito una idea</summary>
                <div
                  className="idea-starters"
                  role="group"
                  aria-label="Ideas para empezar"
                >
                  {ideaStarters.map((starter, index) => (
                    <button
                      className="idea-starter"
                      type="button"
                      key={starter.art}
                      disabled={creating}
                      aria-pressed={idea === starter.idea}
                      aria-labelledby={`idea-starter-${index}-title`}
                      aria-describedby={`idea-starter-${index}-description`}
                      onClick={() => {
                        setIdea(starter.idea);
                        ideaField.current?.focus();
                      }}
                    >
                      <span className="idea-starter-art" aria-hidden="true">
                        <StoryArt variant={starter.art} />
                      </span>
                      <strong id={`idea-starter-${index}-title`}>
                        {starter.label}
                      </strong>
                      <span
                        className="sr-only"
                        id={`idea-starter-${index}-description`}
                      >
                        {starter.idea}
                      </span>
                      {idea === starter.idea ? (
                        <Check
                          size={18}
                          className="idea-starter-check"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  ))}
                </div>
              </details>

              <fieldset className="creator-levels">
                <legend>Quiero leer</legend>
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
                  <strong>Inventa personajes. No escribas tu nombre.</strong>
                  <Link href="/privacidad">Para familias</Link>
                </div>
              </aside>

              <label className="creator-adult-check">
                <input
                  type="checkbox"
                  checked={adultReviewed}
                  onChange={(event) => setAdultReviewed(event.target.checked)}
                  required
                />
                <span>Un adulto revisó mi idea y está conmigo.</span>
              </label>

              {error ? (
                <div className="creator-error-group">
                  <p className="creator-error" role="alert">
                    {error}
                  </p>
                  {gatewayUnavailable ? (
                    <Link className="creator-error-link" href="/biblioteca">
                      Leer un cuento de la biblioteca <ArrowRight size={16} />
                    </Link>
                  ) : null}
                </div>
              ) : null}

              <button
                className="button creator-submit"
                type="submit"
                disabled={creating || Boolean(ideaSafetyIssue)}
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
          )}
          {workspace === "shelf" && saveState === "unavailable" ? (
            <p className="shelf-storage-message" role="status">
              No pudimos acceder a los libros de este navegador. Puedes crear y
              leer un cuento mientras esta página esté abierta.
            </p>
          ) : null}
        </>
      ) : null}

      {screen === "preparing" && story ? (
        <section
          className="creator-preparing"
          aria-labelledby="preparing-title"
          aria-busy="true"
        >
          <LoaderCircle
            className="creator-spinner creator-preparing-spinner"
            size={42}
            aria-hidden="true"
          />
          <span className="small-label">TU CUENTO ESTÁ CASI LISTO</span>
          <h1 id="preparing-title" ref={activeHeading} tabIndex={-1}>
            Dibujamos cada escena
          </h1>
          <p>Preparamos una ilustración para cada página de «{story.title}».</p>
          <p
            className="creator-preparing-status"
            role="status"
            aria-live="polite"
          >
            Tus dibujos aparecerán junto con el cuento.
          </p>
          <button className="text-button" type="button" onClick={resetCreator}>
            Cancelar
          </button>
        </section>
      ) : null}

      {story && screen === "book" ? (
        <section
          className="creator-book-section"
          aria-labelledby="created-title"
        >
          <div className="creator-book-topline">
            <div>
              <h1 id="created-title" ref={activeHeading} tabIndex={-1}>
                {story.title}
              </h1>
            </div>
            <div className="creator-book-links">
              <button className="text-button" type="button" onClick={showShelf}>
                <BookOpen size={17} aria-hidden="true" />
                Mis libros
              </button>
              <button
                className="text-button creator-new-button"
                onClick={resetCreator}
              >
                <RotateCcw size={16} aria-hidden="true" /> Crear otro cuento
              </button>
            </div>
          </div>
          <p className="book-save-status" role="status">
            {saveState === "saving"
              ? "Guardando tu libro…"
              : saveState === "saved"
                ? "Guardado por 7 días."
                : saveState === "unavailable"
                  ? "No pudimos guardarlo aquí. Puedes seguir leyendo mientras esta página esté abierta."
                  : ""}
          </p>

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
                  aria-busy={voiceLoading}
                >
                  {speaking ? <Square size={16} /> : <Volume2 size={17} />}
                  {voiceLoading
                    ? "Cancelar voz…"
                    : speaking
                      ? "Detener"
                      : "Escuchar página"}
                </button>
              ) : null}
              <ReadingSettings
                voice={voice}
                onVoiceChange={changeVoice}
                animate={animate}
                onAnimateChange={setAnimate}
              />
            </div>
          </div>

          <p className="voice-status" role="status">
            {voiceMessage}
          </p>
          <ReadingHelp
            onOpen={stopNarration}
            paragraphs={story.paragraphs}
            paragraph={currentPage?.paragraph ?? 0}
            pageKey={`${story.title}-${currentPageIndex}-${fontSize}`}
            level={level}
            authorizations={audioTokens}
          >
            <ReadingPause
              key={`${story.title}-${currentPageIndex}`}
              scene={getIllustrationScene(
                currentPage?.paragraph ?? 0,
                story.paragraphs.length,
              )}
            />
          </ReadingHelp>
          <BookSpread
            paragraphs={story.paragraphs}
            animated={animate}
            fontSize={fontSteps[fontSize].pixels}
            onNavigate={(offset) => turnPage(currentPageIndex + offset)}
            page={{
              id: `${story.title}-${fontSize}-${compact}-${currentPageIndex}`,
              book: `${story.title}-${fontSize}-${compact}`,
              number: currentPageIndex + 1,
              text: currentPage?.text ?? "",
              paragraph: currentPage?.paragraph,
              startWord: currentPage?.start,
              chapter:
                currentPageIndex === 0
                  ? "Érase una vez…"
                  : currentPageIndex === pages.length - 1
                    ? "Y al final…"
                    : "La historia continúa…",
              illustration: illustrationPlan ? (
                <GeneratedScene
                  plan={illustrationPlan}
                  images={pageImages}
                  paragraph={currentPage?.paragraph ?? 0}
                  frame={currentPageIndex}
                  showFallback={true}
                  status={coverState === "idle" ? "unavailable" : coverState}
                />
              ) : cover ? (
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

          <div className="creator-cover-status">
            {coverState === "loading" ? (
              <p role="status" aria-live="polite">
                <LoaderCircle
                  className="creator-spinner"
                  size={16}
                  aria-hidden="true"
                />
                Preparando las ilustraciones…
              </p>
            ) : coverState === "unavailable" ? (
              <p role="status">
                Algunas imágenes no llegaron. Ya hay dibujos en cada página;
                puedes intentarlo otra vez.{" "}
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
                Ilustraciones listas, una para cada escena.
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
                className="creator-answer-feedback creator-tutor-hint feedback-incorrect"
                role="status"
                aria-live="polite"
                ref={answerFeedbackRef}
                tabIndex={-1}
              >
                <span className="small-label">
                  <Sparkles size={14} aria-hidden="true" />
                  Pista de IA · {tutorHintIndex + 1} de 2
                </span>
                <strong>Aún no es la respuesta. Busquemos una pista.</strong>
                <p>{currentQuestion.hints[tutorHintIndex]}</p>
                <ReadFeedback
                  text={`Aún no es la respuesta. ${currentQuestion.hints[tutorHintIndex]}`}
                />
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
          <Link className="inline-link" href="/biblioteca">
            Explorar los cuentos de la biblioteca <ArrowRight size={16} />
          </Link>
        </section>
      ) : null}
      {/* Temporal: para probar el audio aquí hasta que esté en Ajustes. */}
      <div style={{ maxWidth: 320, margin: "32px auto 0" }}>
        <InterruptorAudio />
      </div>
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
