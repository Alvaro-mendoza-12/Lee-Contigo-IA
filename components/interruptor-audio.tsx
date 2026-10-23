"use client";
import { useSyncExternalStore, type CSSProperties } from "react";
import {
  estaActivo,
  estaMusicaActiva,
  reproducir,
  setActivo,
  setMusicaActiva,
  suscribir,
} from "@/lib/sonidos";

const apagado = () => false;

const estilos = {
  grupo: { display: "grid", gap: 8 } satisfies CSSProperties,
  interruptor: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",
    minHeight: 48,
    padding: "8px 14px",
    border: "2px solid #e4dcf5",
    borderRadius: 16,
    background: "#ffffff",
    color: "#23204a",
    font: "inherit",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
  } satisfies CSSProperties,
  pista: (encendido: boolean): CSSProperties => ({
    position: "relative",
    flexShrink: 0,
    width: 48,
    height: 28,
    borderRadius: 999,
    background: encendido ? "#6a3fd6" : "#c9c6d6",
  }),
  perilla: (encendido: boolean): CSSProperties => ({
    position: "absolute",
    top: 3,
    left: encendido ? 23 : 3,
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#ffffff",
    boxShadow: "0 1px 3px #0003",
  }),
};

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
      style={estilos.interruptor}
      onClick={() => alCambiar(!encendido)}
    >
      <span>
        <span aria-hidden="true">{emoji}</span> {etiqueta}
      </span>
      <span style={estilos.pista(encendido)} aria-hidden="true">
        <span style={estilos.perilla(encendido)} />
      </span>
    </button>
  );
}

/** Interruptores de Sonidos y Música. Los dos empiezan apagados. */
export function InterruptorAudio() {
  const sonidos = useSyncExternalStore(suscribir, estaActivo, apagado);
  const musica = useSyncExternalStore(suscribir, estaMusicaActiva, apagado);
  return (
    <div style={estilos.grupo} role="group" aria-label="Sonido y música">
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
