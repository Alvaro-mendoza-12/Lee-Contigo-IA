"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EVENTO_XP, modoDemo, obtenerProgreso } from "@/lib/progreso";

export function useReadingProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState<
    (ReturnType<typeof obtenerProgreso> & { demo: boolean }) | null
  >(null);
  useEffect(() => {
    const refresh = () =>
      setProgress({ ...obtenerProgreso(), demo: modoDemo() });
    refresh();
    window.addEventListener(EVENTO_XP, refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("popstate", refresh);
    return () => {
      window.removeEventListener(EVENTO_XP, refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("popstate", refresh);
    };
  }, [pathname]);
  return progress;
}
