"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { StoryArt } from "./art";
import type { StoryArtVariant } from "@/lib/stories";

type Cover = { id: string; title: string; art: StoryArtVariant };

export function StoryShowcase({ covers }: { covers: Cover[] }) {
  const [active, setActive] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [departing, setDeparting] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [inView, setInView] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const region = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    if (region.current) observer.observe(region.current);
    return () => {
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (
      !playing ||
      reducedMotion ||
      hovered ||
      !visible ||
      !inView ||
      covers.length < 2
    )
      return;
    const timer = window.setTimeout(() => {
      setHasMoved(true);
      setDeparting(active);
      setActive((current) => (current + 1) % covers.length);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [active, playing, reducedMotion, hovered, visible, inView, covers.length]);

  useEffect(() => {
    if (departing === null) return;
    const timer = window.setTimeout(() => setDeparting(null), 850);
    return () => window.clearTimeout(timer);
  }, [departing]);

  function goTo(next: number) {
    setPlaying(false);
    if (next === active) return;
    setHasMoved(true);
    setDeparting(reducedMotion ? null : active);
    setActive(next);
    setAnnouncement(
      `${covers[next].title}. Historia ${next + 1} de ${covers.length}.`,
    );
  }

  if (!covers.length) return null;

  return (
    <div
      ref={region}
      className="hero-visual"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Cuentos para descubrir"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest("[data-rotation-control]"))
          setPlaying(false);
      }}
    >
      <div className="floating-note note-top" aria-hidden="true">
        <span className="note-icon">
          <Sparkles size={18} />
        </span>
        <span>
          <strong>¿Abrimos este?</strong>
        </span>
      </div>
      <div className="hero-deck-stage">
        <div className={"hero-book-stack" + (hasMoved ? " has-moved" : "")}>
          {covers.map((cover, index) => {
            const front = index === active;
            const depth = (index - active + covers.length) % covers.length;
            return (
              <article
                key={cover.id}
                className={
                  "hero-story " +
                  (front ? "is-front" : "is-behind") +
                  (departing === index ? " is-departing" : "")
                }
                style={
                  {
                    "--depth": depth,
                    "--stack-z": covers.length - depth,
                  } as CSSProperties
                }
                aria-roledescription="diapositiva"
                aria-label={`${index + 1} de ${covers.length}`}
                aria-hidden={!front}
                inert={!front}
              >
                <Link
                  className="hero-story-link"
                  href={`/leer/${cover.id}?nivel=paso`}
                  aria-label={`Leer ${cover.title}`}
                >
                  <div className="hero-art">
                    <StoryArt variant={cover.art} priority={index === 0} />
                  </div>
                  <div className="hero-book-caption">
                    <div>
                      <span className="small-label">Un cuento para ti</span>
                      <h2>{cover.title}</h2>
                    </div>
                    <span className="circle-link" aria-hidden="true">
                      <ArrowRight size={23} />
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
      <div className="floating-note note-bottom" aria-hidden="true">
        <span className="note-icon warm">
          <BookOpen size={18} />
        </span>
        <span>
          <strong>A tu ritmo</strong>
        </span>
      </div>
      {covers.length > 1 ? (
        <div className="book-deck-controls">
          <div className="book-deck-navigation">
            <button
              type="button"
              className="book-deck-control"
              onClick={() => goTo((active - 1 + covers.length) % covers.length)}
              aria-label="Ver cuento anterior"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <div
              className="book-deck-dots"
              role="group"
              aria-label="Elegir cuento"
            >
              {covers.map((cover, index) => (
                <button
                  key={cover.id}
                  type="button"
                  aria-label={`Ir al cuento ${index + 1}: ${cover.title}`}
                  aria-pressed={index === active}
                  onClick={() => goTo(index)}
                >
                  <span />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="book-deck-control"
              onClick={() => goTo((active + 1) % covers.length)}
              aria-label="Ver siguiente cuento"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
          {!reducedMotion ? (
            <button
              type="button"
              className="book-deck-play"
              data-rotation-control
              onClick={() => setPlaying((current) => !current)}
              aria-label={
                playing
                  ? "Pausar cambio automático de cuentos"
                  : "Activar cambio automático de cuentos"
              }
            >
              {playing ? (
                <Pause size={15} aria-hidden="true" />
              ) : (
                <Play size={15} aria-hidden="true" />
              )}
              {playing ? "Pausar" : "Animar"}
            </button>
          ) : (
            <span className="book-deck-manual">A tu ritmo</span>
          )}
        </div>
      ) : null}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
