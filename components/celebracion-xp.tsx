"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { EVENTO_CELEBRADO, EVENTO_XP, type DetalleXP } from "@/lib/progreso";
import { lanzarXP } from "./efecto-respuesta";
import "@/app/xp.css";

const ESPERA = 800;
const ESPERA_REDUCIDA = 1200;
const VUELO = 900;
const estrellas = [
  { dx: -70, dy: -36, tam: 22 },
  { dx: 64, dy: -44, tam: 24 },
  { dx: -84, dy: 18, tam: 16 },
  { dx: 80, dy: 14, tam: 18 },
  { dx: -30, dy: 52, tam: 16 },
  { dx: 34, dy: 50, tam: 14 },
];

// «Vamos a pensar» suma +30 en el lector, pero la página cambia enseguida:
// la celebración se muestra al llegar a las preguntas.
export function CelebracionXP() {
  const ruta = usePathname();
  const [pendiente, setPendiente] = useState<number | null>(null);
  const [visible, setVisible] = useState<number | null>(null);
  const caja = useRef<HTMLDivElement>(null);
  // Fuera del efecto: ocultar el «+30» no debe cancelar el aviso de llegada.
  const llegada = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(llegada.current), []);

  useEffect(() => {
    function escuchar(evento: Event) {
      const { motivo, ganada } = (evento as CustomEvent<DetalleXP>).detail;
      if (motivo === "cuento-terminado" && ganada > 0) setPendiente(ganada);
    }
    window.addEventListener(EVENTO_XP, escuchar);
    return () => window.removeEventListener(EVENTO_XP, escuchar);
  }, []);

  useEffect(() => {
    if (pendiente === null || !ruta.startsWith("/practicar/")) return;
    setVisible(pendiente);
    setPendiente(null);
  }, [pendiente, ruta]);

  useEffect(() => {
    if (visible === null) return;
    const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const salida = setTimeout(
      () => {
        lanzarXP(visible, caja.current);
        setVisible(null);
        llegada.current = setTimeout(
          () =>
            window.dispatchEvent(
              new CustomEvent(EVENTO_CELEBRADO, {
                detail: { ganada: visible },
              }),
            ),
          reducido ? 0 : VUELO,
        );
      },
      reducido ? ESPERA_REDUCIDA : ESPERA,
    );
    return () => clearTimeout(salida);
  }, [visible]);

  if (visible === null) return null;
  return (
    <div ref={caja} className="xp-celebracion" aria-hidden="true">
      {estrellas.map((estrella, i) => (
        <span
          key={i}
          className="xp-celebracion-estrella"
          style={
            {
              "--dx": `${estrella.dx}px`,
              "--dy": `${estrella.dy}px`,
              "--retraso": `${i * 50}ms`,
              fontSize: estrella.tam,
            } as CSSProperties
          }
        >
          ★
        </span>
      ))}
      <span className="xp-celebracion-numero">+{visible}</span>
    </div>
  );
}
