"use client";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { ReadingFriend } from "./reading-friend";
import {
  EVENTO_ABRIR,
  abrirTutorial,
  buscarObjetivo,
  debeMostrarse,
  marcarVisto,
  pasosDisponibles,
  type Paso,
} from "@/lib/tutorial";
import "@/app/tutorial.css";

export { abrirTutorial };

const MARGEN = 12;
const RELLENO = 8;
const MOVIL = 640;

type Posicion = {
  foco: CSSProperties | null;
  globo: CSSProperties;
  abajo: boolean;
};

function calcularPosicion(objetivo: Element | null, globo: HTMLElement | null) {
  const ancho = window.innerWidth;
  const alto = window.innerHeight;
  const abajo = ancho < MOVIL;
  if (!objetivo) return { foco: null, globo: {}, abajo };
  const caja = objetivo.getBoundingClientRect();
  const foco: CSSProperties = {
    top: caja.top - RELLENO,
    left: caja.left - RELLENO,
    width: caja.width + RELLENO * 2,
    height: caja.height + RELLENO * 2,
  };
  if (abajo) return { foco, globo: {}, abajo };
  const anchoGlobo = globo?.offsetWidth ?? 340;
  const altoGlobo = globo?.offsetHeight ?? 220;
  const debajo = caja.bottom + RELLENO + MARGEN;
  const top =
    debajo + altoGlobo <= alto - MARGEN
      ? debajo
      : Math.max(MARGEN, caja.top - RELLENO - MARGEN - altoGlobo);
  const left = Math.min(
    Math.max(MARGEN, caja.left + caja.width / 2 - anchoGlobo / 2),
    ancho - anchoGlobo - MARGEN,
  );
  return { foco, globo: { top, left }, abajo };
}

/**
 * Tutorial de primera visita guiado por la luciérnaga lectora.
 * - `automatico`: se abre solo si nunca se vio (en el inicio).
 * - `recordar`: al saltar o terminar guarda «tutorial-visto».
 * Siempre se puede abrir con abrirTutorial() o con <BotonTutorial />.
 */
export function Tutorial({
  automatico = true,
  recordar = true,
}: {
  automatico?: boolean;
  recordar?: boolean;
}) {
  const pathname = usePathname();
  const [pasosActivos, setPasosActivos] = useState<Paso[] | null>(null);
  const [indice, setIndice] = useState(0);
  const [posicion, setPosicion] = useState<Posicion>({
    foco: null,
    globo: {},
    abajo: false,
  });
  const globo = useRef<HTMLDivElement>(null);
  const siguiente = useRef<HTMLButtonElement>(null);
  const focoPrevio = useRef<HTMLElement | null>(null);
  const id = useId();

  const abrir = useCallback(() => {
    const disponibles = pasosDisponibles(document);
    focoPrevio.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setIndice(0);
    setPasosActivos(disponibles);
  }, []);

  const cerrar = useCallback(() => {
    if (recordar) marcarVisto();
    setPasosActivos(null);
    requestAnimationFrame(() =>
      focoPrevio.current?.focus({ preventScroll: true }),
    );
  }, [recordar]);

  useEffect(() => {
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR, abrir);
  }, [abrir]);

  useEffect(() => {
    // The layout persists between routes. A first visit to the reader or
    // creator must not interrupt the child with an automatic introduction.
    setPasosActivos(null);
    if (!automatico || pathname !== "/" || !debeMostrarse()) return;
    const espera = window.setTimeout(abrir, 400);
    return () => window.clearTimeout(espera);
  }, [abrir, automatico, pathname]);

  const paso = pasosActivos?.[indice];
  const ultimo = pasosActivos ? indice === pasosActivos.length - 1 : false;

  useLayoutEffect(() => {
    if (!pasosActivos) return;
    const outside = Array.from(document.body.children).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement &&
        !node.classList.contains("tutorial-capa"),
    );
    const before = outside.map((node) => node.inert);
    outside.forEach((node) => {
      node.inert = true;
    });
    return () => {
      outside.forEach((node, index) => {
        node.inert = before[index];
      });
    };
  }, [pasosActivos]);

  const recalcular = useCallback(() => {
    if (!paso) return;
    setPosicion(
      calcularPosicion(buscarObjetivo(paso, document), globo.current),
    );
  }, [paso]);

  // Al cambiar de paso: llevar el elemento a la vista y poner el foco.
  useLayoutEffect(() => {
    if (!paso) return;
    const objetivo = buscarObjetivo(paso, document);
    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    objetivo?.scrollIntoView?.({
      block: "center",
      behavior: suave ? "smooth" : "auto",
    });
    recalcular();
    siguiente.current?.focus({ preventScroll: true });
  }, [paso, recalcular]);

  useEffect(() => {
    if (!paso) return;
    let cuadro = 0;
    const programar = () => {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(recalcular);
    };
    window.addEventListener("resize", programar);
    window.addEventListener("scroll", programar, true);
    // El desplazamiento suave termina después: se recalcula unas veces más.
    const repasos = [150, 400, 700].map((ms) =>
      window.setTimeout(programar, ms),
    );
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("resize", programar);
      window.removeEventListener("scroll", programar, true);
      repasos.forEach((repaso) => window.clearTimeout(repaso));
    };
  }, [paso, recalcular]);

  function avanzar() {
    // Sonido al avanzar: pendiente hasta que lib/sonidos.ts esté en main
    // (ver NOTAS-INTEGRACION.md).
    if (ultimo) cerrar();
    else setIndice((actual) => actual + 1);
  }

  function teclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === "Escape") {
      evento.preventDefault();
      cerrar();
      return;
    }
    if (evento.key !== "Tab" || !globo.current) return;
    const enfocables = Array.from(
      globo.current.querySelectorAll<HTMLElement>("button:not(:disabled)"),
    );
    if (!enfocables.length) return;
    const primero = enfocables[0];
    const final = enfocables[enfocables.length - 1];
    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      final.focus();
    } else if (!evento.shiftKey && document.activeElement === final) {
      evento.preventDefault();
      primero.focus();
    }
  }

  if (!paso || !pasosActivos) return null;
  const centrado = !posicion.foco;

  return createPortal(
    <div className="tutorial-capa">
      {posicion.foco ? (
        <div
          className="tutorial-foco"
          style={posicion.foco}
          aria-hidden="true"
        />
      ) : (
        <div className="tutorial-fondo" aria-hidden="true" />
      )}
      <div
        ref={globo}
        className={
          "tutorial-globo" +
          (posicion.abajo ? " tutorial-globo--abajo" : "") +
          (centrado && !posicion.abajo ? " tutorial-globo--centro" : "")
        }
        style={posicion.abajo || centrado ? undefined : posicion.globo}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titulo`}
        aria-describedby={`${id}-texto`}
        onKeyDown={teclado}
      >
        <div className="tutorial-fila">
          <div className="tutorial-luciernaga" aria-hidden="true">
            <ReadingFriend />
          </div>
          <div className="tutorial-contenido">
            <p className="tutorial-progreso">
              Paso {indice + 1} de {pasosActivos.length}
            </p>
            <h2 id={`${id}-titulo`}>{paso.titulo}</h2>
            <p id={`${id}-texto`}>{paso.texto}</p>
          </div>
        </div>
        <div className="tutorial-botones">
          {!ultimo ? (
            <button
              type="button"
              className="tutorial-boton tutorial-boton--saltar"
              onClick={cerrar}
            >
              Saltar
            </button>
          ) : null}
          <button
            ref={siguiente}
            type="button"
            className="tutorial-boton tutorial-boton--siguiente"
            onClick={avanzar}
          >
            {ultimo ? "¡A leer!" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Botón «?» para volver a ver el tutorial. */
export function BotonTutorial({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={`tutorial-boton-ayuda ${className}`}
      aria-label="Ver la guía"
      title="Ver la guía"
      onClick={abrirTutorial}
    >
      ?
    </button>
  );
}
