"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const pageAnimationKey = "lee-contigo-page-animation-v1";
export const pageAnimationEvent = "lee-contigo:animation-change";

export function usePageAnimation() {
  // Start without motion until the browser's own preference is known.
  const [animate, setAnimate] = useState(false);
  const explicit = useRef<boolean | null>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function readPreference() {
      try {
        const stored = localStorage.getItem(pageAnimationKey);
        explicit.current =
          stored === "true" ? true : stored === "false" ? false : null;
      } catch {
        explicit.current = null;
      }
    }
    function update() {
      setAnimate(explicit.current ?? !motion.matches);
    }
    function synchronize(event: StorageEvent) {
      if (event.key !== pageAnimationKey && event.key !== null) return;
      readPreference();
      update();
    }
    function synchronizeLocal(event: Event) {
      const value = (event as CustomEvent<boolean>).detail;
      if (typeof value !== "boolean") return;
      explicit.current = value;
      update();
    }
    readPreference();
    update();
    motion.addEventListener("change", update);
    window.addEventListener("storage", synchronize);
    window.addEventListener(pageAnimationEvent, synchronizeLocal);
    return () => {
      motion.removeEventListener("change", update);
      window.removeEventListener("storage", synchronize);
      window.removeEventListener(pageAnimationEvent, synchronizeLocal);
    };
  }, []);

  const changeAnimation = useCallback((next: boolean) => {
    explicit.current = next;
    setAnimate(next);
    try {
      localStorage.setItem(pageAnimationKey, String(next));
    } catch {
      // The current reader still honours the choice when persistence is blocked.
    }
    window.dispatchEvent(new CustomEvent(pageAnimationEvent, { detail: next }));
  }, []);
  return [animate, changeAnimation] as const;
}
