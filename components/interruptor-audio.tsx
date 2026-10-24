"use client";
import { useSyncExternalStore } from "react";
import styles from "./interruptor-audio.module.css";
import {
  estaActivo,
  estaMusicaActiva,
  reproducir,
  setActivo,
  setMusicaActiva,
  suscribir,
} from "@/lib/sonidos";

const apagado = () => false;

function Interruptor({
  emoji,
  etiqueta,
  encendido,
  alCambiar,
}: {
  emoji: string;
  etiqueta: string;
  encendido: boolean;
  alCambiar: (valor: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={encendido}
      className={styles.interruptor}
      onClick={() => alCambiar(!encendido)}
    >
      <span className={styles.etiqueta}>
        <span aria-hidden="true">{emoji}</span> {etiqueta}
      </span>
      <span className={styles.pista} aria-hidden="true">
        <span className={styles.perilla} />
      </span>
    </button>
  );
}

/** Interruptores de Sonidos y Música. Los dos empiezan apagados. */
export function InterruptorAudio({ compacto = false }: { compacto?: boolean }) {
  const sonidos = useSyncExternalStore(suscribir, estaActivo, apagado);
  const musica = useSyncExternalStore(suscribir, estaMusicaActiva, apagado);
  return (
    <div
      className={`${styles.grupo}${compacto ? ` ${styles.compacto}` : ""}`}
      role="group"
      aria-label="Sonido y música"
    >
      <Interruptor
        emoji="🔔"
        etiqueta="Sonidos"
        encendido={sonidos}
        alCambiar={(valor) => {
          setActivo(valor);
          reproducir("boton");
        }}
      />
      <Interruptor
        emoji="🎵"
        etiqueta="Música"
        encendido={musica}
        alCambiar={setMusicaActiva}
      />
    </div>
  );
}
