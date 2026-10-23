"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Maximize2, Minimize2, SlidersHorizontal, X } from "lucide-react";
import type { NarrationVoice } from "@/lib/narration-voices";
import { VoicePicker } from "./voice-picker";

export function ReadingSettings({
  voice,
  onVoiceChange,
  animate,
  onAnimateChange,
  children,
  expanded = false,
  onExpandedChange,
}: {
  voice: NarrationVoice;
  onVoiceChange: (voice: NarrationVoice) => void;
  animate: boolean;
  onAnimateChange: (animate: boolean) => void;
  children?: ReactNode;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}) {
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
          {/* AQUÍ: interruptor de sonido y música (Fabio). Audio apagado por defecto. */}
          {/* AQUÍ: selector de nivel y desbloqueo (Iván); conservar ?nivel= en la URL. */}
          {children}
        </div>
      </dialog>
    </div>
  );
}
