"use client";

import { useEffect, useState } from "react";
import {
  defaultFontSize,
  fontSteps,
  fontPreferenceKey,
  migrateFontSize,
  nearestFontSize,
} from "@/lib/reading";

export function useReadingFont() {
  const [size, setSize] = useState(defaultFontSize);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(fontPreferenceKey);
      if (saved !== null) {
        setSize(nearestFontSize(Number(saved)));
        return;
      }
      const legacy = localStorage.getItem("lee-contigo-font-size");
      if (legacy !== null) {
        const migrated = migrateFontSize(Number(legacy));
        setSize(migrated);
        localStorage.setItem(
          fontPreferenceKey,
          String(fontSteps[migrated].pixels),
        );
      }
    } catch {
      // Reading remains available when storage is restricted.
    }
  }, []);
  function changeSize(next: number) {
    const valid = Math.max(0, Math.min(fontSteps.length - 1, next));
    setSize(valid);
    try {
      localStorage.setItem(fontPreferenceKey, String(fontSteps[valid].pixels));
    } catch {
      // The preference is optional and contains no personal information.
    }
  }
  return [size, changeSize] as const;
}
