import { z } from "zod";
import type { Level, StoryId } from "./stories.ts";

// Reparto de cuentos por nivel de lector. El equipo puede editarlo aquí.
// Las pruebas comprueban que cada cuento del catálogo aparezca una sola vez.
export const DESBLOQUEOS = {
  1: [
    "luz-del-bosque",
    "semilla-viajera",
    "camino-al-faro",
    "cometa-en-equipo",
    "puente-de-ardillas",
    "nube-perdida",
    "mapa-sonidos",
  ],
  2: ["barco-de-papel", "tambor-lluvia", "pan-abuela", "botella-mar"],
  3: ["sendero-huellas", "buzon-bosque", "dragon-de-flores", "estrella-de-mar"],
  4: [
    "cohete-de-carton",
    "gallina-cuenta",
    "paraguas-de-colores",
    "orquesta-del-bosque",
  ],
} as const satisfies Record<1 | 2 | 3 | 4, readonly StoryId[]>;

export const NIVELES = [
  { numero: 1, titulo: "Lector Semilla", xpMinima: 0 },
  { numero: 2, titulo: "Lector Brote", xpMinima: 60 },
  { numero: 3, titulo: "Explorador de Cuentos", xpMinima: 150 },
  { numero: 4, titulo: "Guardián de Historias", xpMinima: 300 },
  { numero: 5, titulo: "Gran Lector LeeContigo", xpMinima: 500 },
] as const;

export const RECOMPENSAS = {
  "pregunta-primer-intento": 10,
  "pregunta-con-pista": 5,
  "cuento-terminado": 30,
  "preguntas-completas": 20,
  "cuento-creado": 15,
} as const;

// Nivel de lector desde el que se puede elegir «Un nuevo reto».
export const NIVEL_RETO = 2;
// Solo los primeros cuentos creados dan experiencia.
export const MAXIMO_CUENTOS_CREADOS = 3;
export const CLAVE = "lee-contigo-progreso";
export const CLAVE_DEMO = "lee-contigo-progreso-demo";
export const MARCA_DEMO = "lee-contigo-demo";
export const EVENTO_XP = "xp:ganada";
// Se emite cuando el «+30» de un cuento terminado llega a la pastilla.
export const EVENTO_CELEBRADO = "xp:celebrado";

export type NivelLector = (typeof NIVELES)[number];
export type MotivoXP = keyof typeof RECOMPENSAS;
export type DetalleXP = {
  motivo: MotivoXP | "reinicio";
  ganada: number;
  total: number;
  subioDeNivel: boolean;
  nivel: NivelLector;
};

const progresoSchema = z.object({
  version: z.literal(1),
  xp: z.number().int().nonnegative(),
  recompensas: z.array(z.string().max(200)).max(5000),
});
type Progreso = z.infer<typeof progresoSchema>;

function progresoVacio(): Progreso {
  return { version: 1, xp: 0, recompensas: [] };
}

// ?demo=1 activa el modo demo durante la pestaña; ?demo=0 lo apaga.
export function modoDemo() {
  let parametro: string | null = null;
  try {
    if (typeof window !== "undefined")
      parametro = new URLSearchParams(window.location.search).get("demo");
  } catch {}
  try {
    if (parametro === "1") sessionStorage.setItem(MARCA_DEMO, "1");
    else if (parametro === "0") sessionStorage.removeItem(MARCA_DEMO);
    else return sessionStorage.getItem(MARCA_DEMO) === "1";
  } catch {}
  return parametro === "1";
}

function claveActiva() {
  return modoDemo() ? CLAVE_DEMO : CLAVE;
}

function leer(clave: string): Progreso {
  try {
    const guardado = localStorage.getItem(clave);
    if (!guardado) return progresoVacio();
    const resultado = progresoSchema.safeParse(JSON.parse(guardado));
    return resultado.success ? resultado.data : progresoVacio();
  } catch {
    return progresoVacio();
  }
}

function escribir(clave: string, progreso: Progreso) {
  try {
    localStorage.setItem(clave, JSON.stringify(progreso));
  } catch {}
}

function avisar(detalle: DetalleXP) {
  try {
    window.dispatchEvent(new CustomEvent(EVENTO_XP, { detail: detalle }));
  } catch {}
}

export function nivelPorXP(xp: number): NivelLector {
  return NIVELES.findLast((nivel) => xp >= nivel.xpMinima) ?? NIVELES[0];
}

export function obtenerProgreso() {
  const { xp } = leer(claveActiva());
  const nivel = nivelPorXP(xp);
  const siguiente = NIVELES.find((item) => item.xpMinima > xp) ?? null;
  const porcentaje = siguiente
    ? Math.floor(
        ((xp - nivel.xpMinima) / (siguiente.xpMinima - nivel.xpMinima)) * 100,
      )
    : 100;
  return { xp, nivel, siguiente, porcentaje };
}

export function nivelActual() {
  return nivelPorXP(leer(claveActiva()).xp);
}

export function sumarXP(
  motivo: MotivoXP,
  idCuento: string,
  nivel: Level,
  idPregunta?: string,
): DetalleXP {
  const clave = claveActiva();
  const progreso = leer(clave);
  const anterior = nivelPorXP(progreso.xp);
  // Una pregunta paga una sola vez: +10 o +5, nunca ambas.
  const grupo = motivo.startsWith("pregunta-") ? "pregunta" : motivo;
  const recompensa = [grupo, idCuento, nivel, idPregunta ?? ""].join(":");
  const creados = progreso.recompensas.filter((item) =>
    item.startsWith("cuento-creado:"),
  ).length;
  if (
    progreso.recompensas.includes(recompensa) ||
    (motivo === "cuento-creado" && creados >= MAXIMO_CUENTOS_CREADOS)
  )
    return {
      motivo,
      ganada: 0,
      total: progreso.xp,
      subioDeNivel: false,
      nivel: anterior,
    };

  const ganada = RECOMPENSAS[motivo];
  const total = progreso.xp + ganada;
  escribir(clave, {
    version: 1,
    xp: total,
    recompensas: [...progreso.recompensas, recompensa],
  });
  const actual = nivelPorXP(total);
  const detalle = {
    motivo,
    ganada,
    total,
    subioDeNivel: actual.numero > anterior.numero,
    nivel: actual,
  };
  avisar(detalle);
  return detalle;
}

export function nivelParaCuento(id: string): NivelLector | undefined {
  const entrada = Object.entries(DESBLOQUEOS).find(([, ids]) =>
    (ids as readonly string[]).includes(id),
  );
  return entrada ? NIVELES[Number(entrada[0]) - 1] : undefined;
}

// Los cuentos creados por el niño no están en la tabla: siempre se pueden abrir.
export function cuentoDesbloqueado(id: string) {
  if (modoDemo()) return true;
  const requerido = nivelParaCuento(id);
  return !requerido || nivelActual().numero >= requerido.numero;
}

// Mensaje de candado para cada cuento que el nivel indicado aún no abre.
export function cuentosBloqueados(numeroNivel: number) {
  const bloqueados: Record<string, string> = {};
  for (const nivel of NIVELES) {
    if (nivel.numero <= numeroNivel) continue;
    const ids: readonly string[] =
      DESBLOQUEOS[nivel.numero as keyof typeof DESBLOQUEOS] ?? [];
    for (const id of ids)
      bloqueados[id] = `Se desbloquea al ser ${nivel.titulo}`;
  }
  return bloqueados;
}

export function retoDesbloqueado() {
  return modoDemo() || nivelActual().numero >= NIVEL_RETO;
}

export function reiniciarProgreso() {
  try {
    localStorage.removeItem(claveActiva());
  } catch {}
  avisar({
    motivo: "reinicio",
    ganada: 0,
    total: 0,
    subioDeNivel: false,
    nivel: NIVELES[0],
  });
}
