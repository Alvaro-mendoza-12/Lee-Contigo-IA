"use client";

let audio: AudioContext | null = null;

function tone(notes: [number, number][], type: OscillatorType) {
  try {
    audio ??= new AudioContext();
    if (audio.state === "suspended") void audio.resume();
    let at = audio.currentTime;
    for (const [frequency, duration] of notes) {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.18, at);
      gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(at);
      oscillator.stop(at + duration);
      at += duration * 0.9;
    }
  } catch {
    // Sound is a bonus: colours and text still show the result.
  }
}

/** Happy rising arpeggio. */
export function playCorrect() {
  tone(
    [
      [523, 0.12],
      [659, 0.12],
      [784, 0.12],
      [1047, 0.3],
    ],
    "triangle",
  );
}

/** Low, falling "uh-oh". */
export function playWrong() {
  tone(
    [
      [311, 0.22],
      [233, 0.4],
    ],
    "square",
  );
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Picks a Spanish voice explicitly: with only `lang = "es"`, several
 * browsers (Chrome on Windows, some Android) read with an English voice.
 */
function spanishVoice() {
  const voices = window.speechSynthesis.getVoices();
  const spanish = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("es"),
  );
  return (
    spanish.find((voice) => /419|MX|US|CO|PE|AR|CL/i.test(voice.lang)) ??
    spanish.find((voice) => voice.localService) ??
    spanish[0]
  );
}

if (canSpeak()) {
  // Chrome loads voices asynchronously; ask early so they are ready.
  window.speechSynthesis.getVoices();
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

export function speak(text: string, onEnd?: () => void) {
  if (!canSpeak()) return;
  const synth = window.speechSynthesis;
  const busy = synth.speaking || synth.pending;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = spanishVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? "es-419";
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  if (!busy) {
    // Speak inside the tap itself: iOS Safari only allows it there.
    synth.speak(utterance);
    return;
  }
  // Chrome on Android drops speak() called in the same tick as cancel().
  window.setTimeout(() => {
    synth.resume();
    synth.speak(utterance);
  }, 60);
}
