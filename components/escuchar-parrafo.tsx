"use client";
import { BookOpen, Square } from "lucide-react";
import type { NarrationInput } from "@/lib/narration";
import type { Level, StoryId } from "@/lib/stories";
import { useNarration } from "./use-narration";

// Mejora 5: el párrafo del cuento se escucha solo cuando el niño lo pide.
// Usa /api/narrar (catálogo o párrafo autorizado) y, si falla, la voz del
// dispositivo; la música baja sola mientras habla la voz.
export function EscucharParrafo({
  etiqueta,
  texto,
  paragraph,
  level,
  storyId,
  authorization,
}: {
  etiqueta: string;
  texto: string;
  paragraph: number;
  level: Level;
  storyId?: StoryId;
  authorization?: string;
}) {
  const { speaking, loading, speak, stop, message } = useNarration();
  const end = texto.split(/\s+/).length;
  const entrada: NarrationInput | undefined = storyId
    ? { source: "catalogue", storyId, level, paragraph, start: 0, end }
    : authorization
      ? {
          source: "generated",
          paragraphText: texto,
          authorization,
          start: 0,
          end,
        }
      : undefined;
  return (
    <>
      <button
        type="button"
        className="text-button feedback-listen"
        aria-busy={loading}
        onClick={() =>
          speaking || loading ? stop() : void speak(texto, entrada)
        }
      >
        {speaking ? (
          <Square size={17} aria-hidden="true" />
        ) : (
          <BookOpen size={17} aria-hidden="true" />
        )}
        {loading ? "Cancelar voz…" : speaking ? "Detener lectura" : etiqueta}
      </button>
      {message ? (
        <p role="status" className="voice-status">
          {message}
        </p>
      ) : null}
    </>
  );
}
