"use client";
import { useEffect, useState } from "react";
import type { Level } from "@/lib/stories";
import {
  EVENTO_XP,
  cuentosBloqueados,
  cuentosLeidos,
  modoDemo,
  nivelActual,
} from "@/lib/progreso";
import { Library } from "./library";
import { BarraXP } from "./barra-xp";
import type { StoryLocks } from "./story-shelf-row";

// Empieza con los candados del nivel 1 para no mostrar un cuento abierto por error.
export function BibliotecaXP({ initialLevel }: { initialLevel: Level }) {
  const [candados, setCandados] = useState<StoryLocks>(() =>
    cuentosBloqueados(1),
  );
  const [leidos, setLeidos] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    const actualizar = () => {
      setCandados(modoDemo() ? {} : cuentosBloqueados(nivelActual().numero));
      setLeidos(cuentosLeidos());
    };
    actualizar();
    window.addEventListener(EVENTO_XP, actualizar);
    return () => window.removeEventListener(EVENTO_XP, actualizar);
  }, []);

  return (
    <Library
      initialLevel={initialLevel}
      experienceBar={<BarraXP />}
      lockedStories={candados}
      readStories={leidos}
    />
  );
}
