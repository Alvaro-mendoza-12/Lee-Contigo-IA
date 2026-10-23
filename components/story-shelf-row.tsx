"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import type { Level, Story } from "@/lib/stories";
import { StoryArt } from "./art";

// Iván supplies the lock message per story after connecting progression.
// Missing entries stay available; this component does not calculate XP.
export type StoryLocks = Readonly<Partial<Record<string, string>>>;

export function StoryShelfRow({
  id,
  title,
  icon,
  books,
  level,
  priority = false,
  includeCreateCard = false,
  lockedStories,
}: {
  id: string;
  title: string;
  icon: ReactNode;
  books: Story[];
  level: Level;
  priority?: boolean;
  includeCreateCard?: boolean;
  lockedStories?: StoryLocks;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const [bounds, setBounds] = useState({
    overflow: false,
    start: true,
    end: true,
  });

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () =>
      setBounds({
        overflow: element.scrollWidth > element.clientWidth + 2,
        start: element.scrollLeft < 2,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
      });
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, [books.length]);

  function move(direction: number) {
    const element = rail.current;
    if (!element) return;
    const items = Array.from(element.children) as HTMLElement[];
    if (items.length < 2) return;
    const step = items[1].offsetLeft - items[0].offsetLeft;
    const columns =
      Number(getComputedStyle(element).getPropertyValue("--rail-columns")) || 2;
    const first = Math.round(element.scrollLeft / step);
    const next = Math.max(
      0,
      Math.min(items.length - columns, first + direction * columns),
    );
    element.scrollTo({
      left: items[next].offsetLeft - items[0].offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <section
      className="story-shelf-row"
      data-level={level}
      aria-labelledby={`${id}-title`}
    >
      <div className="story-shelf-heading">
        <h2 id={`${id}-title`}>
          <span className="shelf-category-icon">{icon}</span>
          {title}
        </h2>
        {bounds.overflow ? (
          <div className="story-shelf-arrows">
            <button
              type="button"
              disabled={bounds.start}
              aria-label={`Ver cuentos anteriores de ${title}`}
              aria-controls={id}
              onClick={() => move(-1)}
            >
              <ArrowLeft size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={bounds.end}
              aria-label={`Ver más cuentos de ${title}`}
              aria-controls={id}
              onClick={() => move(1)}
            >
              <ArrowRight size={19} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
      <ul
        ref={rail}
        id={id}
        className="story-rail"
        tabIndex={bounds.overflow ? 0 : undefined}
        aria-label={`Cuentos de ${title}`}
        onKeyDown={(event) => {
          if (!bounds.overflow || event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {books.map((story, index) => {
          const lockMessage = lockedStories?.[story.id];
          const content = (
            <>
              <div className="story-cover-link">
                <StoryArt
                  variant={story.art}
                  priority={priority && index < 2}
                />
                {lockMessage ? (
                  <span className="story-lock-badge" aria-hidden="true">
                    <LockKeyhole size={18} />
                  </span>
                ) : level === "reto" ? (
                  <span className="story-level-ribbon" aria-hidden="true">
                    <Sparkles size={13} /> Reto
                  </span>
                ) : null}
                {!lockMessage ? (
                  <span className="story-cover-open" aria-hidden="true">
                    <ArrowRight size={22} />
                  </span>
                ) : null}
              </div>
              <div className="story-card-body">
                <h3>{story.title}</h3>
                <span className="story-card-time">
                  <Clock3 size={14} aria-hidden="true" /> {story.minutes} min
                </span>
                {lockMessage ? (
                  <p className="story-lock-message">{lockMessage}</p>
                ) : null}
              </div>
            </>
          );
          return (
            <li
              key={story.id}
              data-story-id={story.id}
              data-locked={Boolean(lockMessage)}
            >
              {lockMessage ? (
                <div
                  className="story-card story-card-locked"
                  role="group"
                  aria-label={`${story.title}. ${lockMessage}`}
                  data-card-color={index % 6}
                >
                  {content}
                </div>
              ) : (
                <Link
                  className="story-card story-card-direct"
                  data-card-color={index % 6}
                  href={`/leer/${story.id}?nivel=${level}`}
                  aria-label={`Leer ${story.title}`}
                  aria-describedby="library-level-feedback"
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
        {includeCreateCard ? (
          <li>
            <Link
              className="story-card story-card-direct story-create-card"
              href="/crear"
              aria-label="Inventar mi cuento con inteligencia artificial"
            >
              <span className="story-create-art" aria-hidden="true">
                <Sparkles className="story-create-sparkle" size={24} />
                <span>🖍️</span>
                <BookOpen size={62} strokeWidth={1.5} />
                <span>✨</span>
              </span>
              <span className="story-card-body story-create-copy">
                <strong>Inventar mi cuento</strong>
                <span className="story-card-time">Un libro hecho por ti</span>
              </span>
              <span className="story-create-arrow" aria-hidden="true">
                <ArrowRight size={21} />
              </span>
            </Link>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
