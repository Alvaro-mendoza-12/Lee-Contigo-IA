"use client";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Square } from "lucide-react";
import { useNarration } from "./use-narration";

export function useAnswerSound() {
  const [sound, setSound] = useState(true);
  const context = useRef<AudioContext | null>(null);
  useEffect(
    () => () => {
      void context.current?.close();
    },
    [],
  );
  function play(correct: boolean) {
    if (!sound || !("AudioContext" in window)) return;
    try {
      const audio = (context.current ??= new AudioContext());
      void audio.resume().catch(() => undefined);
      [correct ? 440 : 330, correct ? 554 : 277].forEach((frequency, i) => {
        const oscillator = audio.createOscillator(),
          gain = audio.createGain();
        const start = audio.currentTime + i * 0.12;
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.045, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.2);
        oscillator.onended = () => {
          oscillator.disconnect();
          gain.disconnect();
        };
      });
    } catch {
      /* The visible message remains available when audio is unsupported. */
    }
  }
  return { sound, setSound, play };
}
export function SoundControl({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      className="text-button sound-control"
      type="button"
      aria-pressed={enabled}
      onClick={() => onChange(!enabled)}
    >
      {enabled ? (
        <Volume2 size={17} aria-hidden="true" />
      ) : (
        <VolumeX size={17} aria-hidden="true" />
      )}
      Sonido {enabled ? "activado" : "desactivado"}
    </button>
  );
}
export function ReadFeedback({
  text,
  authorization,
}: {
  text: string;
  authorization?: string;
}) {
  const { speaking, loading, speak, stop, message } = useNarration();
  return (
    <>
      <button
        type="button"
        className="text-button feedback-listen"
        aria-busy={loading}
        onClick={() =>
          speaking || loading
            ? stop()
            : void speak(
                text,
                authorization
                  ? {
                      source: "help",
                      helpText: text,
                      authorization,
                      start: 0,
                      end: text.trim().split(/\s+/).length,
                    }
                  : undefined,
              )
        }
      >
        {speaking ? (
          <Square size={17} aria-hidden="true" />
        ) : (
          <Volume2 size={17} aria-hidden="true" />
        )}
        {loading
          ? "Cancelar voz…"
          : speaking
            ? "Detener ayuda"
            : "Escuchar ayuda"}
      </button>
      {message ? (
        <p role="status" className="voice-status">
          {message}
        </p>
      ) : null}
    </>
  );
}
