"use client";

import { useRef, useState } from "react";
import { Check, Lightbulb } from "lucide-react";

const prompts = [
  {
    title: "Imagina",
    text: "Mira la escena y el comienzo. ¿Qué crees que le gustaría conseguir al personaje?",
  },
  {
    title: "Busca una pista",
    text: "Elige un detalle de esta parte. ¿Qué te ayuda a entender lo que está pasando?",
  },
  {
    title: "Conecta las ideas",
    text: "¿Por qué crees que el personaje hace eso? Busca una frase que te ayude a explicarlo.",
  },
  {
    title: "Cuéntalo a tu manera",
    text: "¿Qué cambió desde el principio? Cuenta la aventura con tus propias palabras.",
  },
];

export function ReadingPause({ scene }: { scene: number }) {
  const [done, setDone] = useState(false);
  const details = useRef<HTMLDetailsElement>(null);
  const prompt = prompts[Math.min(3, Math.max(0, scene))];
  return (
    <details className="reading-pause" ref={details}>
      <summary>
        {done ? (
          <Check size={18} aria-hidden="true" />
        ) : (
          <Lightbulb size={18} aria-hidden="true" />
        )}
        {done ? "Ya te detuviste a pensar" : "Una pausa para descubrir"}
        <span>{prompt.title}</span>
      </summary>
      <div>
        <p>{prompt.text}</p>
        <p className="small muted">
          Piénsalo o cuéntaselo a quien lee contigo.
        </p>
        <button
          type="button"
          className="text-button"
          onClick={() => {
            setDone(true);
            if (details.current) {
              details.current.open = false;
              details.current.querySelector("summary")?.focus();
            }
          }}
        >
          <Check size={17} aria-hidden="true" />
          Ya lo pensé
        </button>
      </div>
    </details>
  );
}
