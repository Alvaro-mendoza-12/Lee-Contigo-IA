"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, RotateCcw } from "lucide-react";
import { levels, type Level } from "@/lib/stories";
import {
  EVENTO_XP,
  NIVELES,
  NIVEL_RETO,
  reiniciarProgreso,
  retoDesbloqueado,
} from "@/lib/progreso";
import "@/app/xp.css";

export const avisoReto = `Un nuevo reto se abre al ser ${NIVELES[NIVEL_RETO - 1].titulo}.`;

function useRetoAbierto() {
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    const actualizar = () => setAbierto(retoDesbloqueado());
    actualizar();
    window.addEventListener(EVENTO_XP, actualizar);
    return () => window.removeEventListener(EVENTO_XP, actualizar);
  }, []);
  return abierto;
}

// Cambia ?nivel= y la página vuelve a abrir el cuento con ese texto.
export function SelectorNivel({ nivel }: { nivel: Level }) {
  const router = useRouter();
  const retoAbierto = useRetoAbierto();
  const nota = useId();

  function cambiar(siguiente: Level) {
    const url = new URL(window.location.href);
    url.searchParams.set("nivel", siguiente);
    router.replace(url.pathname + url.search + url.hash, { scroll: false });
  }

  return (
    <fieldset className="xp-selector-nivel">
      <legend>Quiero leer</legend>
      {(Object.keys(levels) as Level[]).map((id) => {
        const bloqueado = id === "reto" && !retoAbierto;
        return (
          <label key={id} className="xp-opcion-nivel">
            <input
              type="radio"
              name="nivel-lectura"
              value={id}
              checked={nivel === id}
              disabled={bloqueado}
              aria-describedby={bloqueado ? nota : undefined}
              onChange={() => cambiar(id)}
            />
            {levels[id].label}
            {bloqueado ? <LockKeyhole size={18} aria-hidden="true" /> : null}
          </label>
        );
      })}
      {retoAbierto ? null : (
        <p id={nota} className="xp-nota">
          {avisoReto}
        </p>
      )}
    </fieldset>
  );
}

export function BorrarProgreso() {
  const [confirmando, setConfirmando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const boton = useRef<HTMLButtonElement>(null);
  const cancelar = useRef<HTMLButtonElement>(null);
  const pregunta = useId();

  useEffect(() => {
    if (confirmando) cancelar.current?.focus({ preventScroll: true });
  }, [confirmando]);

  function cerrar(texto: string) {
    setConfirmando(false);
    setMensaje(texto);
    requestAnimationFrame(() => boton.current?.focus({ preventScroll: true }));
  }

  return (
    <div className="xp-borrar">
      {confirmando ? (
        <div role="group" aria-labelledby={pregunta}>
          <p id={pregunta} className="xp-nota">
            ¿Seguro? Tu experiencia volverá a 0 y los cuentos nuevos se cerrarán
            otra vez.
          </p>
          <div className="xp-borrar-acciones">
            <button
              type="button"
              className="button"
              onClick={() => {
                reiniciarProgreso();
                cerrar("Listo. Tu progreso empezó de nuevo.");
              }}
            >
              Sí, borrar
            </button>
            <button
              ref={cancelar}
              type="button"
              className="button button-outline"
              onClick={() => cerrar("")}
            >
              No, mantenerlo
            </button>
          </div>
        </div>
      ) : (
        <button
          ref={boton}
          type="button"
          className="button button-outline"
          onClick={() => {
            setMensaje("");
            setConfirmando(true);
          }}
        >
          <RotateCcw size={18} aria-hidden="true" /> Borrar mi progreso
        </button>
      )}
      <p className="xp-nota" role="status">
        {mensaje}
      </p>
    </div>
  );
}
