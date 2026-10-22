"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export type BookPage = {
  id: string;
  book: string;
  number: number;
  text: string;
  chapter: string;
  illustration: ReactNode;
  paragraph?: number;
  startWord?: number;
};

/** A stable open spread, with a two-sided leaf crossing the centre binding. */
export function BookSpread({
  page,
  fontSize,
  animated,
  onNavigate,
}: {
  page: BookPage;
  fontSize: number;
  animated: boolean;
  onNavigate: (offset: number) => void;
}) {
  const latest = useRef(page);
  const [opening, setOpening] = useState(true);
  const [turn, setTurn] = useState<{
    id: string;
    previous?: BookPage;
    direction: "next" | "previous";
    sequence: number;
  }>({ id: page.id, direction: "next", sequence: 0 });

  if (turn.id !== page.id) {
    if (opening) setOpening(false);
    const previous = latest.current;
    setTurn({
      id: page.id,
      previous:
        animated &&
        previous.book === page.book &&
        previous.number !== page.number
          ? previous
          : undefined,
      direction: page.number > previous.number ? "next" : "previous",
      sequence: turn.sequence + 1,
    });
  }

  useEffect(() => {
    latest.current = page;
  });
  useEffect(() => {
    const timer = window.setTimeout(() => setOpening(false), 850);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!turn.previous) return;
    const timer = window.setTimeout(
      () => setTurn((value) => ({ ...value, previous: undefined })),
      820,
    );
    return () => window.clearTimeout(timer);
  }, [turn.sequence, turn.previous]);

  const previous = animated ? turn.previous : undefined;
  function face(item: BookPage, side: "left" | "right", copy = false) {
    const textSide = item.number % 2 === 1 ? "left" : "right";
    return side === textSide ? (
      <section
        className={`paper-face paper-${side} paper-text ${copy ? "paper-copy-text" : "book-leaf"}`}
        aria-label={copy ? undefined : `Página ${item.number}`}
      >
        <span className="book-chapter">{item.chapter}</span>
        <p
          className={copy ? "paper-copy-paragraph" : "book-page-text"}
          id={copy ? undefined : "lectura"}
          data-help-paragraph={copy ? undefined : item.paragraph}
          data-help-start={copy ? undefined : item.startWord}
        >
          {item.text}
        </p>
        <span className="paper-folio" aria-hidden="true">
          {item.number}
        </span>
      </section>
    ) : (
      <div className={`paper-face paper-${side} paper-art`}>
        {item.illustration}
        <span className="paper-art-mark" aria-hidden="true">
          Un mundo por descubrir
        </span>
      </div>
    );
  }

  return (
    <div
      className={`book-stage ${animated ? "user-motion-on" : ""} ${opening && animated ? "book-opening" : ""}`}
      style={
        {
          "--reading-font": `${fontSize}px`,
          ...(fontSize >= 32 ? { "--book-height": "600px" } : {}),
        } as CSSProperties
      }
    >
      <div
        className="paper-book"
        role="region"
        tabIndex={0}
        aria-label="Libro ilustrado. Usa las flechas para pasar páginas."
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            onNavigate(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        <div className="paper-cover" aria-hidden="true" />
        <div
          key={page.id}
          className={`paper-spread ${page.number % 2 === 1 ? "text-on-left" : "text-on-right"} ${animated && previous ? `mobile-turn-${turn.direction}` : ""}`}
        >
          {face(page, "left")}
          {face(page, "right")}
        </div>
        <div className="paper-binding" aria-hidden="true" />
        {previous ? (
          <div
            key={turn.sequence}
            className={`book-turn-layer turn-${turn.direction}`}
            aria-hidden="true"
            inert
          >
            <div className="book-stationary-leaf">
              {face(
                previous,
                turn.direction === "next" ? "left" : "right",
                true,
              )}
            </div>
            <div className={`book-turn-sheet sheet-${turn.direction}`}>
              <div className="book-sheet-face sheet-front">
                {face(
                  previous,
                  turn.direction === "next" ? "right" : "left",
                  true,
                )}
              </div>
              <div className="book-sheet-face sheet-back">
                {face(page, turn.direction === "next" ? "left" : "right", true)}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
