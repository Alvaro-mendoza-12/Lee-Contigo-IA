"use client";

import { useState } from "react";
import { Hand, Pause, Play } from "lucide-react";
import { reproducir } from "@/lib/sonidos";
import { usePageAnimation } from "./use-page-animation";
import { LumaSprite, type LumaClip } from "./luma-sprite";
import styles from "./luma.module.css";

type Context = "welcome" | "reader" | "practice" | "creator" | "complete";
const messages: Record<Context, string> = {
  welcome: "Soy Luma. ¡Leemos juntos!",
  reader: "Leemos a tu ritmo.",
  practice: "Pensemos juntos.",
  creator: "Tu idea puede ser un cuento.",
  complete: "¡Qué bien seguir descubriendo!",
};

export function LumaCompanion({
  context = "welcome",
  reaction,
  cue = 0,
  loop = false,
}: {
  context?: Context;
  reaction?: LumaClip;
  cue?: number;
  loop?: boolean;
}) {
  const [animate, changeAnimation] = usePageAnimation();
  const [greeting, setGreeting] = useState({ key: "", count: 0 });
  const reactionKey = `${context}:${reaction ?? "quieta"}:${cue}`;
  const greeted = greeting.key === reactionKey;
  const clip = greeted
    ? "saludar"
    : (reaction ?? (context === "welcome" ? "volar" : null));
  const message = greeted
    ? "¡Hola! Soy Luma. ¿Leemos un cuento?"
    : reaction === "celebrar"
      ? "¡Un descubrimiento más!"
      : reaction === "pensar" && context === "practice"
        ? "Busquemos una pista, con calma."
        : messages[context];

  return (
    <aside
      className={`${styles.companion} ${context === "welcome" ? styles.welcome : styles.compact}`}
      data-luma-context={context}
      aria-label="Luma, tu compañera de lectura"
    >
      <button
        type="button"
        className={styles.greet}
        aria-label="Saludar a Luma"
        onClick={() => {
          setGreeting((previous) => ({
            key: reactionKey,
            count: previous.count + 1,
          }));
          reproducir("saludo");
        }}
      >
        <LumaSprite
          clip={clip}
          animate={animate}
          sequence={`${reactionKey}:${greeting.count}`}
          loop={(loop || context === "welcome") && !greeted}
          onComplete={
            greeted
              ? () => setGreeting((previous) => ({ ...previous, key: "" }))
              : undefined
          }
        />
        {context === "welcome" ? (
          <span className={styles.greetLabel}>
            <Hand size={17} aria-hidden="true" /> Salúdame
          </span>
        ) : null}
      </button>
      <div className={styles.speech}>
        <p role="status" aria-live="polite">
          {message}
        </p>
      </div>
      <button
        type="button"
        className={styles.motion}
        aria-label={animate ? "Pausar animaciones" : "Activar animaciones"}
        title={animate ? "Pausar animaciones" : "Activar animaciones"}
        aria-pressed={!animate}
        onClick={() => changeAnimation(!animate)}
      >
        {animate ? (
          <Pause size={17} aria-hidden="true" />
        ) : (
          <Play size={17} aria-hidden="true" />
        )}
        {context === "welcome" ? (
          <span>{animate ? "Pausar" : "Animar"}</span>
        ) : null}
      </button>
    </aside>
  );
}

export function LumaCelebration() {
  const [animate] = usePageAnimation();
  return <LumaSprite clip="celebrar" animate={animate} />;
}

export function LumaIntroduction() {
  const [animate] = usePageAnimation();
  return <LumaSprite clip="volar" animate={animate} />;
}
