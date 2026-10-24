"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole, X } from "lucide-react";
import type { Level } from "@/lib/stories";
import {
  cuentoDesbloqueado,
  nivelParaCuento,
  retoDesbloqueado,
  type NivelLector,
} from "@/lib/progreso";
import { avisoReto } from "./ajustes-xp";
import "@/app/xp.css";

type Estado =
  | { tipo: "revisando" }
  | { tipo: "abierto" }
  | { tipo: "bloqueado"; nivel: NivelLector };

// El progreso vive en el navegador: hasta leerlo no se muestra el cuento.
export function GuardiaCuento({
  storyId,
  level,
  children,
}: {
  storyId: string;
  level: Level;
  children: ReactNode;
}) {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>({ tipo: "revisando" });
  const [avisoPaso, setAvisoPaso] = useState(false);

  useEffect(() => {
    if (!cuentoDesbloqueado(storyId)) {
      const nivel = nivelParaCuento(storyId);
      if (nivel) {
        setEstado({ tipo: "bloqueado", nivel });
        return;
      }
    }
    if (level === "reto" && !retoDesbloqueado()) {
      // Sigue revisando hasta que la página llegue con ?nivel=paso.
      setAvisoPaso(true);
      const url = new URL(window.location.href);
      url.searchParams.set("nivel", "paso");
      router.replace(url.pathname + url.search + url.hash, { scroll: false });
      return;
    }
    setEstado({ tipo: "abierto" });
  }, [storyId, level, router]);

  return (
    <>
      <div className="container xp-aviso-paso-zona" role="status">
        {avisoPaso && estado.tipo === "abierto" ? (
          <div className="xp-aviso-paso">
            <p>{avisoReto} Por ahora leemos en Paso a paso.</p>
            <button
              type="button"
              className="text-button"
              aria-label="Cerrar aviso"
              onClick={() => setAvisoPaso(false)}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
      {estado.tipo === "abierto" ? (
        children
      ) : estado.tipo === "bloqueado" ? (
        <section className="container xp-cuento-bloqueado">
          <span className="xp-cuento-bloqueado-icono" aria-hidden="true">
            <LockKeyhole size={40} />
          </span>
          <h1>Este cuento se desbloquea al ser {estado.nivel.titulo}</h1>
          <p>Sigue leyendo cuentos para ganar experiencia y abrirlo.</p>
          <Link className="button" href="/#cuentos">
            <ArrowLeft size={18} aria-hidden="true" /> Volver a los cuentos
          </Link>
        </section>
      ) : (
        <div className="xp-guardia-cargando" aria-busy="true">
          <span className="sr-only">Preparando el cuento…</span>
        </div>
      )}
    </>
  );
}
