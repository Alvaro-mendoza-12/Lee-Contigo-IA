"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { Level, Story } from "@/lib/stories";
import { StoryArt } from "./art";

export function StoryShelfRow({
  id,
  title,
  icon,
  books,
  level,
  priority = false,
}: {
  id: string;
  title: string;
  icon: ReactNode;
  books: Story[];
  level: Level;
  priority?: boolean;
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
  }, []);

  function move(direction: number) {
    const element = rail.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth * 0.85,
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
        tabIndex={0}
        aria-label={`Cuentos de ${title}`}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {books.map((story, index) => (
          <li key={story.id}>
            <Link
              className="story-card story-card-direct"
              href={`/leer/${story.id}?nivel=${level}`}
              aria-label={`Leer ${story.title}`}
              aria-describedby="library-level-feedback"
            >
              <div className="story-cover-link">
                <StoryArt
                  variant={story.art}
                  priority={priority && index < 2}
                />
                {level === "reto" ? (
                  <span className="story-level-ribbon" aria-hidden="true">
                    <Sparkles size={13} /> Reto
                  </span>
                ) : null}
                <span className="story-cover-open" aria-hidden="true">
                  <ArrowRight size={22} />
                </span>
              </div>
              <div className="story-card-body">
                <h3>{story.title}</h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
