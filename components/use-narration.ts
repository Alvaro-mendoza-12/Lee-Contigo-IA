"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NarrationInput } from "@/lib/narration";
import { isNarrationVoice, type NarrationVoice } from "@/lib/narration-voices";

export function useNarration() {
  const [voice, setVoice] = useState<NarrationVoice>("george");
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [provider, setProvider] = useState<"elevenlabs" | "device" | null>(
    null,
  );
  const generation = useRef(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const abort = useRef<AbortController | null>(null);
  const cached = useRef(new Map<string, string>());
  const stop = useCallback(() => {
    generation.current++;
    abort.current?.abort();
    if (audio.current) {
      audio.current.pause();
      audio.current.onended = null;
      audio.current.onerror = null;
    }
    audio.current = null;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setLoading(false);
  }, []);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lee-contigo-voice");
      if (isNarrationVoice(saved)) setVoice(saved);
    } catch {
      /* Reading stays available when storage is blocked. */
    }
  }, []);
  function changeVoice(next: NarrationVoice) {
    stop();
    setVoice(next);
    setProvider(null);
    setMessage("Voz elegida.");
    try {
      localStorage.setItem("lee-contigo-voice", next);
    } catch {
      /* Optional preference. */
    }
  }
  useEffect(
    () => () => {
      stop();
      for (const url of cached.current.values()) URL.revokeObjectURL(url);
      cached.current.clear();
    },
    [stop],
  );

  async function speak(text: string, input?: NarrationInput) {
    stop();
    setMessage("");
    setProvider(null);
    const id = generation.current;
    function device() {
      if (generation.current !== id) return;
      if (!window.speechSynthesis?.speak) {
        setMessage(
          "Este dispositivo no tiene voz disponible. Puedes seguir leyendo.",
        );
        return;
      }
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es";
        utterance.rate = 0.85;
        const voice = window.speechSynthesis
          .getVoices()
          .find((v) => /^es([-_]|$)/i.test(v.lang));
        if (voice) utterance.voice = voice;
        utterance.onend = () => {
          if (generation.current === id) setSpeaking(false);
        };
        utterance.onerror = (e) => {
          if (generation.current === id) {
            setSpeaking(false);
            if (e.error !== "canceled" && e.error !== "interrupted")
              setMessage(
                "No pudimos reproducir la voz. Puedes seguir leyendo o intentarlo otra vez.",
              );
          }
        };
        setProvider("device");
        setSpeaking(true);
        setMessage(input ? "Usamos la voz del dispositivo." : "");
        window.speechSynthesis.speak(utterance);
      } catch {
        setSpeaking(false);
        setMessage(
          "No pudimos reproducir la voz. Puedes seguir leyendo o intentarlo otra vez.",
        );
      }
    }
    if (!input) {
      device();
      return;
    }
    const key = JSON.stringify({ ...input, voice });
    let url = cached.current.get(key);
    if (!url) {
      setLoading(true);
      const controller = new AbortController();
      abort.current = controller;
      try {
        const response = await fetch("/api/narrar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: key,
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(22000),
          ]),
        });
        if (
          !response.ok ||
          !response.headers.get("content-type")?.includes("audio/")
        )
          throw new Error("VoiceUnavailable");
        const blob = await response.blob();
        if (generation.current !== id) return;
        url = URL.createObjectURL(blob);
        if (cached.current.size >= 6) {
          const oldest = cached.current.keys().next().value!;
          URL.revokeObjectURL(cached.current.get(oldest)!);
          cached.current.delete(oldest);
        }
        cached.current.set(key, url);
      } catch {
        if (generation.current === id) {
          setLoading(false);
          device();
        }
        return;
      }
    }
    if (generation.current !== id) return;
    setLoading(false);
    const player = new Audio(url);
    // Keep attribution with generated audio metadata; the child-facing controls
    // do not render a provider badge.
    player.title = "Narración del cuento — elevenlabs.io";
    audio.current = player;
    player.onended = () => {
      if (generation.current === id) setSpeaking(false);
    };
    player.onerror = () => {
      if (generation.current === id) device();
    };
    try {
      await player.play();
      if (generation.current === id) {
        setSpeaking(true);
        setProvider("elevenlabs");
      } else player.pause();
    } catch {
      if (generation.current === id)
        setMessage(
          "La voz está lista. Toca Escuchar otra vez para reproducirla.",
        );
    }
  }
  return {
    speaking,
    loading,
    message,
    provider,
    voice,
    changeVoice,
    speak,
    stop,
  };
}
