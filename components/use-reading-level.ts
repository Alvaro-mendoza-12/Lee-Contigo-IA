"use client";
import { useEffect, useState } from "react";
import { getLevel, type Level } from "@/lib/stories";

export function useReadingLevel(initialLevel: Level) {
  const [level, setLevel] = useState(initialLevel);
  useEffect(() => {
    const restore = () =>
      setLevel(
        getLevel(
          new URLSearchParams(window.location.search).get("nivel") ?? undefined,
        ),
      );
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  function changeLevel(next: Level) {
    if (next === level) return;
    setLevel(next);
    const url = new URL(window.location.href);
    url.searchParams.set("nivel", next);
    window.history.pushState(null, "", url.pathname + url.search + url.hash);
  }
  return [level, changeLevel] as const;
}
