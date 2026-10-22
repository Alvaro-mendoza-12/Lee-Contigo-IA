"use client";
import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { NarrationVoice } from "@/lib/narration-voices";
import { VoicePicker } from "./voice-picker";

export function ReadingSettings({
  voice,
  onVoiceChange,
  animate,
  onAnimateChange,
  children,
}: {
  voice: NarrationVoice;
  onVoiceChange: (voice: NarrationVoice) => void;
  animate: boolean;
  onAnimateChange: (animate: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <details className="book-settings reading-settings">
      <summary>
        <SlidersHorizontal size={18} aria-hidden="true" /> Ajustes
      </summary>
      <div>
        <VoicePicker value={voice} onChange={onVoiceChange} />
        <label className="book-animation-control">
          <input
            type="checkbox"
            checked={animate}
            onChange={(event) => onAnimateChange(event.target.checked)}
          />
          Animar páginas
        </label>
        {children}
      </div>
    </details>
  );
}
