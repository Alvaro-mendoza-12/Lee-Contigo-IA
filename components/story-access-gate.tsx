"use client";

import "@/app/xp.css";
import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { NIVELES, NIVEL_RETO, nivelParaCuento } from "@/lib/progreso";
import { useReadingProgress } from "./use-reading-progress";
import type { ReactNode } from "react";
import { BarraXP } from "./barra-xp";

export function StoryAccessGate({
  storyId,
  level,
  children,
}: {
  storyId: string;
  level: "paso" | "reto";
  children: ReactNode;
}) {
  const progress = useReadingProgress();
  const storyLevel = nivelParaCuento(storyId)?.numero ?? 1;
  const requiredLevel = Math.max(storyLevel, level === "reto" ? NIVEL_RETO : 1);

  if (requiredLevel === 1) return children;
  if (!progress)
    return (
      <div className="story-access-pending" role="status" aria-busy="true">
        Abriendo tu cuento…
      </div>
    );
  if (progress.demo || progress.nivel.numero >= requiredLevel) return children;

  const nextLevel = NIVELES[requiredLevel - 1];
  return (
    <section className="story-access-gate" aria-labelledby="story-access-title">
      <span className="story-access-icon" aria-hidden="true">
        <LockKeyhole size={26} />
      </span>
      <h1 id="story-access-title">¡Este cuento es un nuevo reto!</h1>
      <p>
        Se abre en <strong>{nextLevel.titulo}</strong>. Sigue leyendo y
        pensando: tus puntos te acercarán.
      </p>
      <BarraXP variante="compacta" />
      <Link className="button" href="/?nivel=reto">
        Buscar otro cuento <ArrowRight size={18} aria-hidden="true" />
      </Link>
      <Link className="story-access-step-link" href="/?nivel=paso">
        Elegir un cuento paso a paso
      </Link>
    </section>
  );
}
