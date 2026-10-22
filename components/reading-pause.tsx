"use client";

import { useRef, useState } from "react";
import { Check, Lightbulb } from "lucide-react";

const prompts = [
  {
    title: "Imagina",
    text: "¿Qué quiere hacer el personaje?",
  },
  {
    title: "Busca una pista",
    text: "¿Qué detalle te ayuda a entender?",
  },
  {
    title: "Conecta las ideas",
    text: "¿Por qué lo hizo? Busca una pista.",
  },
  {
    title: "Cuéntalo a tu manera",
    text: "¿Qué cambió al final?",
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
        {done ? "Ya lo pensé" : "Pensemos"}
      </summary>
      <div>
        <p>{prompt.text}</p>
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
