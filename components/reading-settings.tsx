"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Maximize2, Minimize2, SlidersHorizontal, X } from "lucide-react";
import type { NarrationVoice } from "@/lib/narration-voices";
import { VoicePicker } from "./voice-picker";
import { InterruptorAudio } from "./interruptor-audio";
import { abrirTutorial } from "./tutorial";
import type { Level } from "@/lib/stories";
import { NIVEL_RETO, reiniciarProgreso } from "@/lib/progreso";
import { useReadingProgress } from "./use-reading-progress";

export function ReadingSettings({
  voice,
  onVoiceChange,
  animate,
  onAnimateChange,
  children,
  expanded = false,
  onExpandedChange,
  level,
  onLevelChange,
}: {
  voice: NarrationVoice;
  onVoiceChange: (voice: NarrationVoice) => void;
  animate: boolean;
  onAnimateChange: (animate: boolean) => void;
  children?: ReactNode;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  level?: Level;
  onLevelChange?: (level: Level) => void;
}) {
  const progress = useReadingProgress();
  const challengeAvailable = Boolean(
    progress && (progress.demo || progress.nivel.numero >= NIVEL_RETO),
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => {
      dialog.current?.close();
      document.body.style.overflow = previous;
    };
  }, [open]);
  function close() {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }
  return (
    <div className="reading-settings">
      <button
        className="text-button"
        type="button"
        ref={trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal size={18} aria-hidden="true" /> Ajustes
      </button>
      <dialog
        ref={dialog}
        id={id}
        className="reader-settings-dialog"
        aria-labelledby={`${id}-title`}
        onCancel={close}
        onClose={() => {
          if (open) close();
        }}
      >
        <div className="reader-settings-heading">
          <h2 id={`${id}-title`}>Ajustes de lectura</h2>
          <button
            type="button"
            className="text-button"
            aria-label="Cerrar ajustes"
            onClick={close}
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>
        <div className="reader-settings-options">
          <VoicePicker value={voice} onChange={onVoiceChange} />
          <label className="book-animation-control">
            <input
              type="checkbox"
              checked={animate}
              onChange={(event) => onAnimateChange(event.target.checked)}
            />
            Animar páginas
          </label>
          {onExpandedChange ? (
            <button
              type="button"
              className="button button-outline"
              aria-pressed={expanded}
              onClick={() => {
                close();
                onExpandedChange(!expanded);
              }}
            >
              {expanded ? (
                <Minimize2 size={18} aria-hidden="true" />
              ) : (
                <Maximize2 size={18} aria-hidden="true" />
              )}
              {expanded ? "Cerrar ampliación" : "Ampliar página"}
            </button>
          ) : null}
          <InterruptorAudio />
          <button
            type="button"
            className="button button-outline"
            onClick={() => {
              close();
              onExpandedChange?.(false);
              // Wait for the native settings dialog to close before moving
              // focus to the guide, which lives outside the reader.
              requestAnimationFrame(abrirTutorial);
            }}
          >
            Ver la guía
          </button>
          {level && onLevelChange ? (
            <label className="reading-level-setting">
              Cómo leer
              <select
                value={level}
                onChange={(event) => onLevelChange(event.target.value as Level)}
              >
                <option value="paso">Paso a paso</option>
                <option
                  value="reto"
                  disabled={!challengeAvailable && level !== "reto"}
                >
                  {challengeAvailable
                    ? "Un nuevo reto"
                    : `Un nuevo reto · nivel ${NIVEL_RETO}`}
                </option>
              </select>
            </label>
          ) : null}
          {children}
          <details className="progress-reset">
            <summary>Mis puntos</summary>
            <p className="small">
              Los puntos celebran tu práctica. No son una nota escolar.
            </p>
            {confirmReset ? (
              <div>
                <p>¿Borrar tus puntos aquí? Tus libros se conservan.</p>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    reiniciarProgreso();
                    setConfirmReset(false);
                    onLevelChange?.("paso");
                  }}
                >
                  Sí, borrar puntos
                </button>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setConfirmReset(false)}
                >
                  Conservar mis puntos
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="text-button"
                onClick={() => setConfirmReset(true)}
              >
                Reiniciar progreso
              </button>
            )}
          </details>
        </div>
      </dialog>
    </div>
  );
}
