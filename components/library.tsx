"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookCheck,
  BookOpen,
  Compass,
  HeartHandshake,
  Leaf,
  Sparkles,
  Users,
} from "lucide-react";
import { storyCategories, type Level } from "@/lib/story-metadata";
import type { CatalogueStory } from "@/lib/story-catalogue";
import {
  readReadingPlaces,
  readingPlaceEvent,
  type ReadingPlace,
} from "@/lib/reading-place";
import { useReadingLevel } from "./use-reading-level";
import { StoryShelfRow, type StoryLocks } from "./story-shelf-row";
import { BotonTutorial } from "./tutorial";
import { BotonSonido } from "./boton-sonido";
import { LumaCompanion } from "./luma-companion";

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
  readStories,
  catalogue: entries,
}: {
  initialLevel?: Level;
  experienceBar?: ReactNode;
  lockedStories?: StoryLocks;
  readStories?: ReadonlySet<string>;
  catalogue: CatalogueStory[];
}) {
  const [level] = useReadingLevel(initialLevel);
  const [places, setPlaces] = useState<ReadingPlace[]>([]);
  useEffect(() => {
    const update = () => setPlaces(readReadingPlaces());
    update();
    window.addEventListener(readingPlaceEvent, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(readingPlaceEvent, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  const catalogue = useRef<HTMLDivElement>(null);
  const shelf = entries.filter(
    (story) => !story.shelf || story.shelf === level,
  );
  const unread = shelf.filter((story) => !readStories?.has(story.id));
  const read = shelf.filter((story) => readStories?.has(story.id));
  const recent = places.find((place) => {
    if (
      place.source !== "catalogue" ||
      place.paragraph === 0 ||
      lockedStories?.[place.id]
    )
      return false;
    const words = entries.find((story) => story.id === place.id)
      ?.pageWordCounts[place.level][place.paragraph];
    return words !== undefined && place.word < words;
  });
  const recentStory = recent
    ? entries.find((story) => story.id === recent.id)
    : undefined;

  return (
    <div className="container kid-library child-library inicio-page">
      <header className="kid-hello home-welcome">
        <div className="home-welcome-copy">
          <h1>
            ¡Hola! <span aria-hidden="true">👋</span>
            <br className="kid-hello-break" />
            ¿Qué cuento leemos hoy?
          </h1>
          <div className="home-welcome-tools">
            <BotonTutorial variante="texto" />
            <BotonSonido />
          </div>
          <p>Historias para descubrir, imaginar y compartir a tu ritmo.</p>
        </div>
        <LumaCompanion />
      </header>

      <div
        className="home-destinations"
        role="group"
        aria-label="¿Qué quieres hacer?"
      >
        <Link
          className="home-destination"
          href={
            recent && recentStory
              ? `/leer/${recent.id}?nivel=${recent.level}`
              : "#cuentos"
          }
          data-tutorial="cuentos"
          aria-label={
            recentStory ? `Seguir leyendo ${recentStory.title}` : "Cuentos"
          }
          onNavigate={() => {
            if (!recentStory) catalogue.current?.focus({ preventScroll: true });
          }}
        >
          <BookOpen
            className="home-destination-icon"
            size={28}
            aria-hidden="true"
          />
          <span>
            <strong>{recentStory ? "Seguir leyendo" : "Cuentos"}</strong>
            <small>{recentStory?.title ?? "Elige una historia"}</small>
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
            const books = unread.filter(
              (story) => story.category === category.id,
            );
            // Aventuras keeps «Inventar mi cuento» even when all were read.
            return books.length || category.id === "aventuras" ? (
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
          {read.length ? (
            <StoryShelfRow
              id="cuentos-leidos"
              title="Ya los leíste"
              icon={<BookCheck size={20} aria-hidden="true" />}
              level={level}
              books={read}
              readMark
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
