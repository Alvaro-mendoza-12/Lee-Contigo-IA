"use client";
import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  estaActivo,
  estaMusicaActiva,
  reproducir,
  setActivo,
  setMusicaActiva,
  suscribir,
} from "@/lib/sonidos";
import "@/app/inicio-extras.css";

const apagado = () => false;

// Usa las mismas preferencias que Ajustes, así ambos quedan sincronizados.
// Apagar silencia efectos y música; encender solo activa los efectos.
export function BotonSonido() {
  const efectos = useSyncExternalStore(suscribir, estaActivo, apagado);
  const musica = useSyncExternalStore(suscribir, estaMusicaActiva, apagado);
  const encendido = efectos || musica;
  const Icono = encendido ? Volume2 : VolumeX;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={encendido}
      aria-label="Sonido"
      className="boton-sonido"
      onClick={() => {
        if (encendido) {
          setActivo(false);
          setMusicaActiva(false);
          return;
        }
        setActivo(true);
        reproducir("boton");
      }}
    >
      <Icono size={22} aria-hidden="true" />
      <span className="boton-sonido-texto" aria-hidden="true">
        Sonido: {encendido ? "sí" : "no"}
      </span>
    </button>
  );
}
