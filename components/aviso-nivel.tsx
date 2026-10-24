"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import {
  EVENTO_CELEBRADO,
  EVENTO_CUENTO_TERMINADO,
  EVENTO_XP,
  type DetalleXP,
  type NivelLector,
} from "@/lib/progreso";
import { InsigniaXP, premiosDeNivel } from "./barra-xp";
import { ReadingFriend } from "./reading-friend";
import { reproducir } from "@/lib/sonidos";
import "@/app/xp.css";

const DURACION = 7000;
const coloresConfeti = [
  "var(--xp-principal)",
  "var(--xp-acento)",
  "var(--xp-n2-fondo)",
  "var(--xp-n3-fondo)",
  "#ff8fc7",
];
// Posiciones fijas para que el servidor y el navegador dibujen lo mismo.
const confeti = Array.from({ length: 18 }, (_, i) => ({
  x: `${(i * 37 + 7) % 100}%`,
  retraso: `${(i % 6) * 0.12}s`,
  giro: `${(i % 2 ? 1 : -1) * (180 + i * 25)}deg`,
  color: coloresConfeti[i % coloresConfeti.length],
}));

function premios(nivel: NivelLector) {
  const texto = premiosDeNivel(nivel);
  return texto ? `Desbloqueaste ${texto}.` : "";
}

export function AvisoNivel() {
  const [nivel, setNivel] = useState<NivelLector | null>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const ruta = usePathname();
  // Espera mientras se leen las páginas y mientras dura la fiesta del cuento.
  const intentar = useRef<() => void>(() => {});

  useEffect(() => {
    let guardado: NivelLector | null = null;
    let enFiesta = false;
    let respaldo: ReturnType<typeof setTimeout> | undefined;
    intentar.current = () => {
      if (!guardado || enFiesta) return;
      if (window.location.pathname.startsWith("/leer/")) return;
      setNivel(guardado);
      reproducir("nivel");
      guardado = null;
    };
    function escuchar(evento: Event) {
      const detalle = (evento as CustomEvent<DetalleXP>).detail;
      if (!detalle.subioDeNivel) return;
      guardado = detalle.nivel;
      intentar.current();
    }
    function empiezaFiesta() {
      enFiesta = true;
      clearTimeout(respaldo);
      respaldo = setTimeout(terminaFiesta, 8000);
    }
    function terminaFiesta() {
      clearTimeout(respaldo);
      enFiesta = false;
      intentar.current();
    }
    window.addEventListener(EVENTO_XP, escuchar);
    window.addEventListener(EVENTO_CUENTO_TERMINADO, empiezaFiesta);
    window.addEventListener(EVENTO_CELEBRADO, terminaFiesta);
    return () => {
      window.removeEventListener(EVENTO_XP, escuchar);
      window.removeEventListener(EVENTO_CUENTO_TERMINADO, empiezaFiesta);
      window.removeEventListener(EVENTO_CELEBRADO, terminaFiesta);
      clearTimeout(respaldo);
    };
  }, []);

  useEffect(() => intentar.current(), [ruta]);

  useEffect(() => {
    if (!nivel) return;
    const anterior = document.activeElement as HTMLElement | null;
    boton.current?.focus({ preventScroll: true });
    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setNivel(null);
    };
    const temporizador = setTimeout(() => setNivel(null), DURACION);
    window.addEventListener("keydown", cerrarConEscape);
    return () => {
      clearTimeout(temporizador);
      window.removeEventListener("keydown", cerrarConEscape);
      if (anterior?.isConnected) anterior.focus({ preventScroll: true });
    };
  }, [nivel]);

  if (!nivel) return null;
  return (
    <div className="xp-aviso-fondo">
      <section
        key={nivel.numero}
        className="xp-aviso"
        data-nivel={nivel.numero}
        role="alertdialog"
        aria-labelledby="xp-aviso-titulo"
        aria-describedby="xp-aviso-detalle"
      >
        <div className="xp-aviso-decoracion" aria-hidden="true">
          {confeti.map((papel, i) => (
            <span
              key={i}
              className="xp-confeti"
              style={
                {
                  "--x": papel.x,
                  "--retraso": papel.retraso,
                  "--giro": papel.giro,
                  background: papel.color,
                } as CSSProperties
              }
            />
          ))}
          <span
            className="xp-aviso-tiempo"
            style={{ animationDuration: `${DURACION}ms` }}
          />
        </div>
        <div className="xp-aviso-amigo" aria-hidden="true">
          <ReadingFriend />
        </div>
        <InsigniaXP nivel={nivel} porcentaje={100} tamano="aviso" />
        <h2 id="xp-aviso-titulo">¡Ahora eres {nivel.titulo}!</h2>
        <p id="xp-aviso-detalle">
          Llegaste al nivel {nivel.numero}. {premios(nivel)}
        </p>
        <button
          ref={boton}
          type="button"
          className="xp-aviso-boton"
          onClick={() => setNivel(null)}
        >
          ¡Genial!
        </button>
      </section>
    </div>
  );
}
