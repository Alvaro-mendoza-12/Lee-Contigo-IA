"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { EVENTO_XP, type DetalleXP, type NivelLector } from "@/lib/progreso";
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
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    function escuchar(evento: Event) {
      const detalle = (evento as CustomEvent<DetalleXP>).detail;
      if (detalle.subioDeNivel) {
        setNivel(detalle.nivel);
        reproducir("nivel");
      }
    }
    window.addEventListener(EVENTO_XP, escuchar);
    return () => window.removeEventListener(EVENTO_XP, escuchar);
  }, []);

  useEffect(() => {
    if (!nivel) return;
    const anterior = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    // Let the browser finish its modal autofocus before placing focus on the
    // single, child-friendly action.
    const focusFrame = requestAnimationFrame(() =>
      boton.current?.focus({ preventScroll: true }),
    );
    const gestionarTeclado = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setNivel(null);
        return;
      }
      if (evento.key !== "Tab") return;
      const elementos = Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((elemento) => elemento.getClientRects().length > 0);
      if (elementos.length <= 1) {
        evento.preventDefault();
        elementos[0]?.focus({ preventScroll: true });
        return;
      }
      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };
    const temporizador = setTimeout(() => setNivel(null), DURACION);
    window.addEventListener("keydown", gestionarTeclado);
    return () => {
      clearTimeout(temporizador);
      cancelAnimationFrame(focusFrame);
      if (dialog.current?.open) dialog.current.close();
      window.removeEventListener("keydown", gestionarTeclado);
      const destino = anterior?.isConnected
        ? anterior
        : document.querySelector<HTMLElement>("#contenido h1");
      destino?.focus({ preventScroll: true });
    };
  }, [nivel]);

  if (!nivel) return null;
  return (
    <dialog
      ref={dialog}
      className="xp-aviso-fondo"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="xp-aviso-titulo"
      aria-describedby="xp-aviso-detalle"
      onCancel={() => setNivel(null)}
    >
      <section
        key={nivel.numero}
        className="xp-aviso"
        data-nivel={nivel.numero}
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
          autoFocus
          type="button"
          className="xp-aviso-boton"
          onClick={() => setNivel(null)}
        >
          ¡Genial!
        </button>
      </section>
    </dialog>
  );
}
