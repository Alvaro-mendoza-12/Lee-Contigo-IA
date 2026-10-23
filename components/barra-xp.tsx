"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Bean, Compass, Crown, Gift, Shield, Sprout, Star } from "lucide-react";
import {
  DESBLOQUEOS,
  EVENTO_XP,
  NIVELES,
  NIVEL_RETO,
  obtenerProgreso,
  type DetalleXP,
  type NivelLector,
} from "@/lib/progreso";
import "@/app/xp.css";

const iconos = [Bean, Sprout, Compass, Shield, Crown];
const tamanosIcono = { grande: 44, mediana: 34, mini: 20, aviso: 54 };

type Progreso = ReturnType<typeof obtenerProgreso>;

// Lo que se abre al llegar a un nivel, por ejemplo «Un nuevo reto» y 4 cuentos nuevos.
export function premiosDeNivel(nivel: NivelLector) {
  const cuentos: number =
    DESBLOQUEOS[nivel.numero as keyof typeof DESBLOQUEOS]?.length ?? 0;
  const partes = [];
  if (nivel.numero === NIVEL_RETO) partes.push("«Un nuevo reto»");
  if (cuentos)
    partes.push(cuentos === 1 ? "1 cuento nuevo" : `${cuentos} cuentos nuevos`);
  return partes.join(" y ");
}

export function InsigniaXP({
  nivel,
  porcentaje,
  tamano,
}: {
  nivel: NivelLector;
  porcentaje: number;
  tamano: keyof typeof tamanosIcono;
}) {
  const Icono = iconos[nivel.numero - 1] ?? Bean;
  return (
    <span
      className="xp-insignia"
      data-nivel={nivel.numero}
      data-tamano={tamano}
      style={{ "--xp-pct": porcentaje } as CSSProperties}
      aria-hidden="true"
    >
      <span className="xp-insignia-centro">
        <Icono size={tamanosIcono[tamano]} strokeWidth={2.2} />
      </span>
    </span>
  );
}

function useProgresoXP() {
  const [progreso, setProgreso] = useState<Progreso | null>(null);
  const [ganancia, setGanancia] = useState<{ id: number; xp: number } | null>(
    null,
  );

  useEffect(() => {
    let temporizador: ReturnType<typeof setTimeout> | undefined;
    setProgreso(obtenerProgreso());
    function actualizar(evento: Event) {
      const { ganada } = (evento as CustomEvent<DetalleXP>).detail;
      setProgreso(obtenerProgreso());
      if (ganada <= 0) return;
      setGanancia({ id: Date.now(), xp: ganada });
      clearTimeout(temporizador);
      temporizador = setTimeout(() => setGanancia(null), 1800);
    }
    window.addEventListener(EVENTO_XP, actualizar);
    return () => {
      window.removeEventListener(EVENTO_XP, actualizar);
      clearTimeout(temporizador);
    };
  }, []);

  // Hasta leer el navegador se muestra el primer nivel vacío.
  const datos = progreso ?? {
    xp: 0,
    nivel: NIVELES[0],
    siguiente: NIVELES[1],
    porcentaje: 0,
  };
  return { listo: progreso !== null, ganancia, ...datos };
}

function textoProximo({ siguiente }: Pick<Progreso, "siguiente">) {
  if (!siguiente) return "¡Eres Gran Lector! Ya abriste todos los cuentos.";
  const premios = premiosDeNivel(siguiente) || "una insignia nueva";
  return `Próximo: ${siguiente.titulo} → ${premios}`;
}

function BarraProgreso({ xp, nivel, siguiente }: Progreso) {
  const meta = siguiente?.xpMinima ?? xp;
  const porcentaje = siguiente
    ? ((xp - nivel.xpMinima) / (meta - nivel.xpMinima)) * 100
    : 100;
  return (
    <div
      className="xp-riel"
      role="progressbar"
      aria-label={`Avance hacia ${siguiente?.titulo ?? "el nivel más alto"}`}
      aria-valuemin={nivel.xpMinima}
      aria-valuemax={meta}
      aria-valuenow={xp}
      aria-valuetext={
        siguiente
          ? `${xp} de ${meta} XP, faltan ${meta - xp} para ${siguiente.titulo}`
          : `${xp} XP, nivel más alto`
      }
    >
      <span className="xp-relleno" style={{ width: `${porcentaje}%` }} />
    </div>
  );
}

function FichaXP({ tituloId, ...progreso }: Progreso & { tituloId?: string }) {
  const { xp, nivel, siguiente } = progreso;
  return (
    <>
      <p className="xp-etiqueta">Nivel {nivel.numero}</p>
      <p className="xp-titulo" id={tituloId}>
        {nivel.titulo}
      </p>
      <p className="xp-pastilla">
        <Star size={18} fill="currentColor" aria-hidden="true" />
        {siguiente ? `${xp} / ${siguiente.xpMinima} XP` : `${xp} XP`}
      </p>
      <BarraProgreso {...progreso} />
      <p className="xp-proximo">
        <Gift size={18} aria-hidden="true" />
        <span>{textoProximo(progreso)}</span>
      </p>
    </>
  );
}

// Estrellas que salen alrededor del «+10» y vuelan hacia la insignia.
const estrellas = [
  { dx: -58, dy: -44, tam: 18 },
  { dx: 54, dy: -50, tam: 20 },
  { dx: -66, dy: 8, tam: 14 },
  { dx: 62, dy: 4, tam: 16 },
  { dx: 0, dy: -72, tam: 18 },
];

function EfectoGanancia({
  ganancia,
}: {
  ganancia: { id: number; xp: number };
}) {
  return (
    <span className="xp-efecto" aria-hidden="true">
      {estrellas.map((estrella, i) => (
        <span
          key={i}
          className="xp-estrella"
          style={
            {
              "--dx": `${estrella.dx}px`,
              "--dy": `${estrella.dy}px`,
              "--retraso": `${i * 60}ms`,
              fontSize: estrella.tam,
            } as CSSProperties
          }
        >
          ★
        </span>
      ))}
      <span className="xp-ganada">+{ganancia.xp}</span>
    </span>
  );
}

function AnuncioXP({
  ganancia,
  xp,
}: {
  ganancia: { xp: number } | null;
  xp: number;
}) {
  return (
    <span className="sr-only" role="status">
      {ganancia ? `Ganaste ${ganancia.xp} de experiencia. Llevas ${xp}.` : ""}
    </span>
  );
}

function PastillaXP({
  listo,
  ganancia,
  progreso,
}: {
  listo: boolean;
  ganancia: { id: number; xp: number } | null;
  progreso: Progreso;
}) {
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const { xp, nivel, porcentaje } = progreso;

  useEffect(() => {
    if (!abierto) return;
    panel.current?.focus({ preventScroll: true });
    function cerrar(devolverFoco: boolean) {
      setAbierto(false);
      if (devolverFoco) boton.current?.focus({ preventScroll: true });
    }
    function tocarFuera(evento: PointerEvent) {
      const objetivo = evento.target as Node;
      if (
        !panel.current?.contains(objetivo) &&
        !boton.current?.contains(objetivo)
      )
        cerrar(false);
    }
    function teclear(evento: KeyboardEvent) {
      if (evento.key === "Escape") cerrar(true);
    }
    document.addEventListener("pointerdown", tocarFuera);
    document.addEventListener("keydown", teclear);
    return () => {
      document.removeEventListener("pointerdown", tocarFuera);
      document.removeEventListener("keydown", teclear);
    };
  }, [abierto]);

  return (
    <div className="xp-barra-compacta" data-listo={listo}>
      <button
        ref={boton}
        type="button"
        className="xp-pastilla-lector"
        aria-expanded={abierto}
        aria-controls={id}
        aria-label={`${nivel.titulo}, ${xp} XP. Ver mi progreso`}
        onClick={() => setAbierto((valor) => !valor)}
      >
        <span
          className="xp-insignia-zona"
          data-latido={ganancia ? ganancia.id : undefined}
        >
          <InsigniaXP nivel={nivel} porcentaje={porcentaje} tamano="mini" />
          {ganancia ? (
            <EfectoGanancia key={ganancia.id} ganancia={ganancia} />
          ) : null}
        </span>
        <span aria-hidden="true">{xp} XP</span>
      </button>
      {abierto ? <span className="xp-panel-velo" aria-hidden="true" /> : null}
      <div
        ref={panel}
        id={id}
        className="xp-panel"
        role="dialog"
        aria-labelledby={`${id}-titulo`}
        tabIndex={-1}
        hidden={!abierto}
      >
        <InsigniaXP nivel={nivel} porcentaje={porcentaje} tamano="mediana" />
        <div className="xp-contenido">
          <FichaXP {...progreso} tituloId={`${id}-titulo`} />
        </div>
        <button
          type="button"
          className="xp-panel-boton"
          onClick={() => {
            setAbierto(false);
            boton.current?.focus({ preventScroll: true });
          }}
        >
          Seguir leyendo
        </button>
      </div>
      <AnuncioXP ganancia={ganancia} xp={xp} />
    </div>
  );
}

export function BarraXP({
  variante = "grande",
}: {
  variante?: "grande" | "compacta";
}) {
  const { listo, ganancia, ...progreso } = useProgresoXP();

  if (variante === "compacta")
    return <PastillaXP listo={listo} ganancia={ganancia} progreso={progreso} />;

  return (
    <section
      className="xp-barra xp-barra-grande"
      data-tutorial="barra-xp"
      aria-label="Mi experiencia de lectura"
      data-listo={listo}
    >
      <div
        className="xp-insignia-zona"
        data-latido={ganancia ? ganancia.id : undefined}
      >
        <InsigniaXP
          nivel={progreso.nivel}
          porcentaje={progreso.porcentaje}
          tamano="grande"
        />
        {ganancia ? (
          <EfectoGanancia key={ganancia.id} ganancia={ganancia} />
        ) : null}
      </div>
      <div className="xp-contenido">
        <FichaXP {...progreso} />
      </div>
      <AnuncioXP ganancia={ganancia} xp={progreso.xp} />
    </section>
  );
}
