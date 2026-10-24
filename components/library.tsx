"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  HeartHandshake,
  Leaf,
  Sparkles,
  Users,
} from "lucide-react";
import { storiesForShelf, storyCategories, type Level } from "@/lib/stories";
import { useReadingLevel } from "./use-reading-level";
import { StoryShelfRow, type StoryLocks } from "./story-shelf-row";
import { BotonTutorial } from "./tutorial";

const categoryIcons = {
  amigos: Users,
  naturaleza: Leaf,
  aventuras: Compass,
};
const categoryIds = {
  amigos: "cuentos-amigos",
  naturaleza: "cuentos-naturaleza",
  aventuras: "cuentos-descubrimientos",
};

export function Library({
  initialLevel = "paso",
  experienceBar,
  lockedStories,
}: {
  initialLevel?: Level;
  experienceBar?: ReactNode;
  lockedStories?: StoryLocks;
}) {
  const [level] = useReadingLevel(initialLevel);
  const catalogue = useRef<HTMLDivElement>(null);
  const shelf = storiesForShelf(level);

  return (
    <div className="container kid-library child-library inicio-page">
      <header className="kid-hello home-welcome">
        <div className="home-welcome-copy">
          <h1>
            ¡Hola! <span aria-hidden="true">👋</span>
            <br className="kid-hello-break" />
            ¿Qué cuento leemos hoy?
          </h1>
          <BotonTutorial variante="texto" />
          <p>Historias para descubrir, imaginar y compartir a tu ritmo.</p>
        </div>
      </header>

      <div
        className="home-destinations"
        role="group"
        aria-label="¿Qué quieres hacer?"
      >
        <Link
          className="home-destination"
          href="#cuentos"
          data-tutorial="cuentos"
          aria-label="Cuentos"
          onNavigate={() => catalogue.current?.focus({ preventScroll: true })}
        >
          <BookOpen
            className="home-destination-icon"
            size={28}
            aria-hidden="true"
          />
          <span>
            <strong>Cuentos</strong>
            <small>Elige una historia</small>
          </span>
          <ArrowRight size={22} aria-hidden="true" />
        </Link>
        <Link
          className="home-destination"
          href="/crear"
          aria-label="Crear"
          data-tutorial="crear"
        >
          <Sparkles
            className="home-destination-icon"
            size={28}
            aria-hidden="true"
          />
          <span>
            <strong>Crear</strong>
            <small>Imagina tu cuento</small>
          </span>
          <ArrowRight size={22} aria-hidden="true" />
        </Link>
        <Link
          className="home-destination"
          href="/acompanar"
          data-tutorial="acompanar"
          aria-label="Acompañar"
        >
          <HeartHandshake
            className="home-destination-icon"
            size={28}
            aria-hidden="true"
          />
          <span>
            <strong>Acompañar</strong>
            <small>Lean en compañía</small>
          </span>
          <ArrowRight size={22} aria-hidden="true" />
        </Link>
      </div>

      {/* XP-IVAN: barra grande */}
      <div className="home-experience-slot" data-slot="barra-xp">
        {experienceBar}
      </div>

      <div
        ref={catalogue}
        id="cuentos"
        className="home-catalogue"
        tabIndex={-1}
      >
        <p
          id="library-level-feedback"
          className="library-level-feedback"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <BookOpen size={17} aria-hidden="true" />
          <span key={level}>
            {level === "paso"
              ? "Escoge una portada y empezamos."
              : "Tú marcas el ritmo. Escoge una portada."}
          </span>
        </p>

        <div className="story-shelves">
          {storyCategories.map((category, index) => {
            const Icon = categoryIcons[category.id];
            const books = shelf.filter(
              (story) => story.category === category.id,
            );
            return books.length ? (
              <StoryShelfRow
                key={category.id}
                id={categoryIds[category.id]}
                title={category.title}
                icon={<Icon size={20} aria-hidden="true" />}
                priority={index === 0}
                level={level}
                books={books}
                lockedStories={lockedStories}
                includeCreateCard={category.id === "aventuras"}
              />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
