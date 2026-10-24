"use client";
import type { CSSProperties } from "react";
import "@/app/respuestas.css";

// Estrellas que salen del check al acertar; con movimiento reducido no se ven.
const estrellas = [
  { dx: -34, dy: -30, tam: 16 },
  { dx: 30, dy: -34, tam: 18 },
  { dx: 44, dy: 2, tam: 14 },
  { dx: 26, dy: 32, tam: 16 },
  { dx: -30, dy: 30, tam: 14 },
  { dx: -44, dy: -2, tam: 12 },
];

export function EstallidoEstrellas() {
  return (
    <span className="respuesta-estallido" aria-hidden="true">
      {estrellas.map((estrella, i) => (
        <span
          key={i}
          style={
            {
              "--dx": `${estrella.dx}px`,
              "--dy": `${estrella.dy}px`,
              "--retraso": `${i * 40}ms`,
              fontSize: estrella.tam,
            } as CSSProperties
          }
        >
          ★
        </span>
      ))}
    </span>
  );
}

// El «+10» vuela desde la respuesta hasta la insignia de la pastilla de XP.
export function lanzarXP(ganada: number, origen: Element | null) {
  try {
    if (!origen || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const destino = document.querySelector(".xp-pastilla-lector .xp-insignia");
    if (!destino) return;
    const desde = origen.getBoundingClientRect();
    const hasta = destino.getBoundingClientRect();
    const x = desde.left + desde.width / 2;
    const y = desde.top + desde.height / 2;
    const dx = hasta.left + hasta.width / 2 - x;
    const dy = hasta.top + hasta.height / 2 - y;

    const vuelo = document.createElement("span");
    vuelo.className = "respuesta-vuelo";
    vuelo.textContent = `+${ganada}`;
    vuelo.setAttribute("aria-hidden", "true");
    vuelo.style.left = `${x}px`;
    vuelo.style.top = `${y}px`;
    document.body.append(vuelo);

    const animacion = vuelo.animate(
      [
        { transform: "translate(-50%, -50%) scale(0.6)", opacity: 0 },
        {
          transform: "translate(-50%, calc(-50% - 28px)) scale(1.3)",
          opacity: 1,
          offset: 0.25,
        },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.5)`,
          opacity: 0.3,
        },
      ],
      { duration: 900, easing: "cubic-bezier(0.5, 0, 0.3, 1)" },
    );
    const quitar = () => vuelo.remove();
    animacion.onfinish = quitar;
    animacion.oncancel = quitar;
  } catch {
    /* La animación es un extra: la experiencia ya se sumó. */
  }
}
