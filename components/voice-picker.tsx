"use client";
import { useId } from "react";
import { narrationVoices, type NarrationVoice } from "@/lib/narration-voices";

export function VoicePicker({
  value,
  onChange,
}: {
  value: NarrationVoice;
  onChange: (voice: NarrationVoice) => void;
}) {
  const id = useId();
  return (
    <div className="voice-picker">
      <label htmlFor={id}>¿Quién te lee?</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as NarrationVoice)}
      >
        {narrationVoices.map((voice) => (
          <option key={voice.value} value={voice.value}>
            {voice.label}
          </option>
        ))}
      </select>
    </div>
  );
}
