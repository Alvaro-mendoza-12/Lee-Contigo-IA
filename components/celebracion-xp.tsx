"use client";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { usePathname } from "next/navigation";
import {
  EVENTO_CELEBRADO,
  EVENTO_CUENTO_TERMINADO,
  type DetalleXP,
} from "@/lib/progreso";
import { reproducir } from "@/lib/sonidos";
import { lanzarXP } from "./efecto-respuesta";
import { ReadingFriend } from "./reading-friend";
import { BuhoLector, GotaAlegre, SemillaBailarina } from "./personajes-fiesta";
import "@/app/xp.css";

const DURACION = 3000;
const DURACION_REPETIDO = 2000;
const VUELO = 900;
const coloresConfeti = [
  "var(--xp-principal)",
  "var(--xp-acento)",
  "#7ccf6f",
  "#6cc4f0",
  "#ff8fc7",
];
// Posiciones fijas para que el servidor y el navegador dibujen lo mismo.
const confeti = Array.from({ length: 24 }, (_, i) => ({
  x: `${(i * 41 + 5) % 100}%`,
  retraso: `${(i % 8) * 0.09}s`,
  giro: `${(i % 2 ? 1 : -1) * (200 + i * 20)}deg`,
  color: coloresConfeti[i % coloresConfeti.length],
}));
const personajes = [
  { Personaje: ReadingFriend, baile: "salta" },
  { Personaje: BuhoLector, baile: "brazos" },
  { Personaje: GotaAlegre, baile: "salta" },
  { Personaje: SemillaBailarina, baile: "baila" },
];

// «Vamos a pensar» suma +30 en el lector, pero la página cambia enseguida:
// la fiesta se celebra al llegar a las preguntas. Después vuela el +30 a la
// pastilla y, si se subió de nivel, AvisoNivel espera a «xp:celebrado».
export function CelebracionXP() {
  const ruta = usePathname();
  const id = useId();
  const [pendiente, setPendiente] = useState<number | null>(null);
  const [visible, setVisible] = useState<number | null>(null);
  const numero = useRef<HTMLParagraphElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  // Fuera del efecto: cerrar la fiesta no debe cancelar el aviso de llegada.
  const llegada = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(llegada.current), []);

  useEffect(() => {
    function escuchar(evento: Event) {
      setPendiente((evento as CustomEvent<DetalleXP>).detail.ganada);
    }
    window.addEventListener(EVENTO_CUENTO_TERMINADO, escuchar);
    return () => window.removeEventListener(EVENTO_CUENTO_TERMINADO, escuchar);
  }, []);

  useEffect(() => {
    if (pendiente === null || !ruta.startsWith("/practicar/")) return;
    setVisible(pendiente);
    setPendiente(null);
  }, [pendiente, ruta]);

  const cerrar = useCallback(() => {
    if (visible === null) return;
    const ganada = visible;
    if (ganada > 0) lanzarXP(ganada, numero.current);
    setVisible(null);
    const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    llegada.current = setTimeout(
      () =>
        window.dispatchEvent(
          new CustomEvent(EVENTO_CELEBRADO, { detail: { ganada } }),
        ),
      ganada > 0 && !reducido ? VUELO : 0,
    );
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>("main h1")
        ?.focus({ preventScroll: true }),
    );
  }, [visible]);

  useEffect(() => {
    if (visible === null) return;
    reproducir("fiesta");
    boton.current?.focus({ preventScroll: true });
    const fin = setTimeout(cerrar, visible > 0 ? DURACION : DURACION_REPETIDO);
    function teclado(evento: KeyboardEvent) {
      if (evento.key === "Escape") cerrar();
      // Un solo control: el foco se queda en «¡A pensar!».
      if (evento.key === "Tab") {
        evento.preventDefault();
        boton.current?.focus();
      }
    }
    window.addEventListener("keydown", teclado);
    return () => {
      clearTimeout(fin);
      window.removeEventListener("keydown", teclado);
    };
  }, [visible, cerrar]);

  if (visible === null) return null;
  const conXP = visible > 0;
  return (
    <div className="fiesta-fondo" onClick={cerrar}>
      <section
        className="fiesta"
        data-repetida={!conXP}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titulo`}
        aria-describedby={`${id}-detalle`}
      >
        <div className="fiesta-confeti" aria-hidden="true">
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
        </div>
        <div className="fiesta-personajes" aria-hidden="true">
          {personajes.map(({ Personaje, baile }, i) => (
            <span
              key={i}
              className="fiesta-personaje"
              data-baile={baile}
              style={{ "--retraso": `${i * 0.12}s` } as CSSProperties}
            >
              <Personaje />
            </span>
          ))}
        </div>
        <h2 id={`${id}-titulo`}>¡Terminaste el cuento!</h2>
        {conXP ? (
          <p ref={numero} className="fiesta-xp">
            +{visible} XP
          </p>
        ) : null}
        <p id={`${id}-detalle`} className="sr-only">
          {conXP
            ? `Ganaste ${visible} de experiencia. Ahora vamos a pensar sobre el cuento.`
            : "Ahora vamos a pensar sobre el cuento."}
        </p>
        <button
          ref={boton}
          type="button"
          className="fiesta-boton"
          onClick={(evento) => {
            evento.stopPropagation();
            cerrar();
          }}
        >
          ¡A pensar!
        </button>
      </section>
    </div>
  );
}
