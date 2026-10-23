/**
 * Lógica del tutorial guiado por la luciérnaga lectora (sin IA ni DOM
 * propio, para poder probarla en Node). components/tutorial.tsx la dibuja.
 *
 * Cada paso apunta a un elemento con data-tutorial="…". Mientras esos
 * atributos no existan, se usa un respaldo: los enlaces del menú principal
 * o de las tarjetas del inicio. Si no hay ningún elemento, el paso se salta.
 */

export type PasoId = "bienvenida" | "cuentos" | "crear" | "acompanar" | "barra-xp";
export type Paso = {
  id: PasoId;
  titulo: string;
  texto: string;
  /** Valor de data-tutorial; sin objetivo, el globo va centrado. */
  objetivo?: Exclude<PasoId, "bienvenida">;
  /** Selectores de respaldo, en orden, si aún no existe data-tutorial. */
  respaldos?: string[];
};

export const CLAVE_VISTO = "tutorial-visto";
export const EVENTO_ABRIR = "tutorial:abrir";

// Solo dentro del menú o de las tarjetas del inicio: el logo también
// enlaza a "/" y no debe confundirse con «Cuentos».
const zonas = ['nav[aria-label="Navegación principal"]', ".home-destinations"];
const enlaces = (...rutas: string[]) =>
  zonas.flatMap((zona) => rutas.map((ruta) => `${zona} a[href="${ruta}"]`));

export const pasos: Paso[] = [
  {
    id: "bienvenida",
    titulo: "¡Hola! Soy tu luciérnaga lectora",
    texto: "Te muestro en un ratito cómo funciona todo. ¿Vamos?",
  },
  {
    id: "cuentos",
    titulo: "Cuentos",
    texto: "Aquí están los cuentos. Toca una portada y empieza a leer.",
    objetivo: "cuentos",
    respaldos: enlaces("#cuentos", "/", "/biblioteca"),
  },
  {
    id: "crear",
    titulo: "Crear",
    texto: "Aquí inventas tu propio cuento con tus ideas.",
    objetivo: "crear",
    respaldos: enlaces("/crear"),
  },
  {
    id: "acompanar",
    titulo: "Acompañar",
    texto: "Este lugar es para la persona grande que lee contigo.",
    objetivo: "acompanar",
    respaldos: enlaces("/acompanar", "/adultos"),
  },
  {
    id: "barra-xp",
    titulo: "Tu barra de lectura",
    texto: "Cada vez que lees, tu barra crece. ¡Mira cuánto avanzas!",
    objetivo: "barra-xp",
  },
];

/** Lo mínimo del DOM que se necesita: así las pruebas usan un documento falso. */
export type Raiz = { querySelectorAll(selector: string): ArrayLike<Element> };
export type EsVisible = (elemento: Element) => boolean;

export const esVisiblePorDefecto: EsVisible = (elemento) =>
  elemento.getClientRects().length > 0;

export function selectoresDe(paso: Paso): string[] {
  if (!paso.objetivo) return [];
  return [`[data-tutorial="${paso.objetivo}"]`, ...(paso.respaldos ?? [])];
}

/** Primer elemento visible del paso: data-tutorial primero, luego respaldos. */
export function buscarObjetivo(
  paso: Paso,
  raiz: Raiz,
  esVisible: EsVisible = esVisiblePorDefecto,
): Element | null {
  for (const selector of selectoresDe(paso)) {
    let encontrados: ArrayLike<Element>;
    try {
      encontrados = raiz.querySelectorAll(selector);
    } catch {
      continue; // Un selector inválido nunca rompe el tutorial.
    }
    for (const elemento of Array.from(encontrados))
      if (esVisible(elemento)) return elemento;
  }
  return null;
}

/** Pasos que se pueden mostrar: la bienvenida siempre y los demás si hay elemento. */
export function pasosDisponibles(
  raiz: Raiz,
  esVisible: EsVisible = esVisiblePorDefecto,
): Paso[] {
  return pasos.filter(
    (paso) => !paso.objetivo || buscarObjetivo(paso, raiz, esVisible) !== null,
  );
}

type Almacen = Pick<Storage, "getItem" | "setItem">;
function almacen(): Almacen | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function yaVisto(storage: Almacen | null = almacen()): boolean {
  try {
    return storage?.getItem(CLAVE_VISTO) === "true";
  } catch {
    return false;
  }
}

/** Se muestra solo en la primera visita. */
export function debeMostrarse(storage: Almacen | null = almacen()): boolean {
  return !yaVisto(storage);
}

/** Al saltar o terminar: no vuelve a abrirse solo. */
export function marcarVisto(storage: Almacen | null = almacen()) {
  try {
    storage?.setItem(CLAVE_VISTO, "true");
  } catch {
    /* Sin almacenamiento: el tutorial podría volver a salir, nada más. */
  }
}

/** Vuelve a abrir el tutorial desde un botón «?» o desde Ajustes. */
export function abrirTutorial() {
  try {
    window.dispatchEvent(new CustomEvent(EVENTO_ABRIR));
  } catch {
    /* Fuera del navegador no hay nada que abrir. */
  }
}
