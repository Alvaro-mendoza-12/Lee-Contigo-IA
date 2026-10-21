"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Volume2,
  Square,
  Minus,
  Plus,
  Leaf,
  BookOpen,
} from "lucide-react";
import { levels, type Story, type Level } from "@/lib/stories";
import { StoryArt } from "./art";
import { Journey } from "./journey";
export function Reader({ story, level }: { story: Story; level: Level }) {
  const [size, setSize] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  useEffect(() => {
    setCanSpeak("speechSynthesis" in window);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);
  const version = story.versions[level];
  function readAloud() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(
      story.title + ". " + version.paragraphs.join(" "),
    );
    utterance.lang = "es";
    utterance.rate = 0.85;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }
  return (
    <div className="container reader-page">
      <Journey current={2} />
      <Link href="/biblioteca" className="back-link">
        <ArrowLeft size={16} />
        Volver a las historias
      </Link>
      <div className="reading-layout">
        <article className="reading-card">
          <div className="reading-art">
            <StoryArt variant={story.art} priority />
            <span className="reading-theme">{story.theme}</span>
          </div>
          <div className="reading-content">
            <div className="reading-meta">
              <span className="small-label">UN MOMENTO PARA IMAGINAR</span>
              <span>
                <Clock3 size={15} />
                {story.minutes} min
              </span>
            </div>
            <h1>{story.title}</h1>
            <p className="story-subtitle">{story.subtitle}</p>
            <div className="reading-toolbar">
              <div
                className="font-controls"
                role="group"
                aria-label="Tamaño del texto"
              >
                <span>Letra</span>
                <button
                  aria-label="Reducir tamaño de letra"
                  disabled={size === 0}
                  onClick={() => setSize((s) => s - 1)}
                >
                  <Minus size={16} />
                </button>
                <span aria-live="polite">
                  {["Normal", "Grande", "Muy grande"][size]}
                </span>
                <button
                  aria-label="Aumentar tamaño de letra"
                  disabled={size === 2}
                  onClick={() => setSize((s) => s + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
              {canSpeak ? (
                <button
                  className="text-button audio-button"
                  onClick={readAloud}
                >
                  {speaking ? <Square size={17} /> : <Volume2 size={18} />}{" "}
                  {speaking ? "Detener lectura" : "Escuchar"}
                </button>
              ) : null}
            </div>
            <div className={"story-text font-size-" + size} id="lectura">
              {version.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="reading-end">
              <span className="end-leaf">
                <Leaf size={22} />
              </span>
              <p>
                Una historia termina.
                <br />
                <strong>Un descubrimiento comienza.</strong>
              </p>
            </div>
            <Link
              className="button full-width"
              href={"/practicar/" + story.id + "?nivel=" + level}
            >
              Ya leí, vamos a explorar <ArrowRight size={19} />
            </Link>
            <p className="reading-reassurance">
              Puedes volver a leer el relato durante las preguntas.
            </p>
          </div>
        </article>
        <aside className="reader-sidebar">
          <div className="companion-card">
            <span className="companion-icon">
              <BookOpen size={26} />
            </span>
            <span className="small-label">ESTE ES TU MOMENTO</span>
            <h2>
              No hay prisa
              <br />
              por llegar al final.
            </h2>
            <p>
              Lee con calma. Imagina el lugar, conoce a los personajes y
              disfruta el camino.
            </p>
            <div className="sidebar-check">
              <Check size={17} />
              Puedes leer más de una vez.
            </div>
            <div className="sidebar-check">
              <Check size={17} />
              Puedes cambiar la letra.
            </div>
            <div className="sidebar-check">
              <Check size={17} />
              No hay cronómetro.
            </div>
          </div>
          <div className="level-summary">
            <span className="small-label">TU FORMA DE LEER</span>
            <strong>
              <Leaf size={17} />
              {levels[level].label}
            </strong>
            <Link
              href={
                "/leer/" +
                story.id +
                "?nivel=" +
                (level === "paso" ? "reto" : "paso")
              }
            >
              Probar {level === "paso" ? "un nuevo reto" : "paso a paso"}{" "}
              <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

