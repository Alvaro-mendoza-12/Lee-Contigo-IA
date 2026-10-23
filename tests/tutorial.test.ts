import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CLAVE_VISTO,
  EVENTO_ABRIR,
  abrirTutorial,
  buscarObjetivo,
  debeMostrarse,
  marcarVisto,
  pasos,
  pasosDisponibles,
  yaVisto,
  type Raiz,
} from "../lib/tutorial.ts";

function almacen() {
  const datos = new Map<string, string>();
  return {
    getItem: (clave: string) => datos.get(clave) ?? null,
    setItem: (clave: string, valor: string) => void datos.set(clave, valor),
  };
}
const roto = {
  getItem(): string | null {
    throw new Error("bloqueado");
  },
  setItem() {
    throw new Error("bloqueado");
  },
};

type Falso = { selector: string; visible: boolean };
/** Documento falso: cada elemento responde a un selector exacto. */
function documento(elementos: Falso[]): Raiz {
  return {
    querySelectorAll: (selector) =>
      elementos.filter((elemento) => elemento.selector === selector) as unknown as Element[],
  };
}
const visible = (elemento: Element) => (elemento as unknown as Falso).visible;
const ids = (raiz: Raiz) => pasosDisponibles(raiz, visible).map((p) => p.id);
const paso = (id: string) => pasos.find((p) => p.id === id)!;

test("se muestra en la primera visita", () => {
  assert.equal(debeMostrarse(almacen()), true);
});

test("no se muestra si ya se vio", () => {
  const guardado = almacen();
  guardado.setItem(CLAVE_VISTO, "true");
  assert.equal(debeMostrarse(guardado), false);
});

test("«Saltar» (o terminar) guarda el estado", () => {
  const guardado = almacen();
  marcarVisto(guardado);
  assert.equal(guardado.getItem(CLAVE_VISTO), "true");
  assert.equal(yaVisto(guardado), true);
  assert.equal(debeMostrarse(guardado), false);
});

test("se omiten los pasos sin elemento, sin errores", () => {
  // La barra XP de Iván todavía no existe: ese paso se salta.
  const raiz = documento([
    { selector: '[data-tutorial="cuentos"]', visible: true },
    { selector: '[data-tutorial="crear"]', visible: true },
    { selector: '[data-tutorial="acompanar"]', visible: true },
  ]);
  assert.deepEqual(ids(raiz), ["bienvenida", "cuentos", "crear", "acompanar"]);
  // Sin ningún elemento queda solo la bienvenida, centrada.
  assert.deepEqual(ids(documento([])), ["bienvenida"]);
});

test("los elementos ocultos no cuentan", () => {
  const raiz = documento([
    { selector: '[data-tutorial="crear"]', visible: false },
  ]);
  assert.equal(buscarObjetivo(paso("crear"), raiz, visible), null);
});

test("data-tutorial tiene prioridad sobre el respaldo por enlace", () => {
  const atributo = { selector: '[data-tutorial="crear"]', visible: true };
  const enlace = {
    selector: 'nav[aria-label="Navegación principal"] a[href="/crear"]',
    visible: true,
  };
  const raiz = documento([enlace, atributo]);
  assert.equal(buscarObjetivo(paso("crear"), raiz, visible), atributo);
});

test("sin data-tutorial usa los enlaces del menú y del inicio", () => {
  const raiz = documento([
    { selector: '.home-destinations a[href="#cuentos"]', visible: true },
    { selector: 'nav[aria-label="Navegación principal"] a[href="/crear"]', visible: true },
    { selector: 'nav[aria-label="Navegación principal"] a[href="/adultos"]', visible: true },
  ]);
  assert.deepEqual(ids(raiz), ["bienvenida", "cuentos", "crear", "acompanar"]);
});

test("el logo (que también enlaza a «/») no se toma por «Cuentos»", () => {
  const raiz = documento([{ selector: 'a[href="/"]', visible: true }]);
  assert.equal(buscarObjetivo(paso("cuentos"), raiz, visible), null);
});

test("abrirTutorial() avisa para volver a mostrarlo", () => {
  const ventana = new EventTarget();
  Object.assign(globalThis, { window: ventana });
  let abierto = 0;
  ventana.addEventListener(EVENTO_ABRIR, () => abierto++);
  abrirTutorial();
  abrirTutorial();
  assert.equal(abierto, 2);
});

test("no falla si localStorage está bloqueado", () => {
  assert.doesNotThrow(() => marcarVisto(roto));
  assert.equal(yaVisto(roto), false);
  assert.equal(debeMostrarse(roto), true);
});

test("los textos son cortos para niños de 6 a 10 años", () => {
  assert.equal(pasos[0].id, "bienvenida");
  assert.equal(pasos[0].objetivo, undefined, "la bienvenida va centrada");
  for (const { id, titulo, texto } of pasos) {
    assert.ok(titulo.length <= 40, `${id}: título corto`);
    assert.ok(texto.split(/\s+/).length <= 14, `${id}: texto corto`);
  }
});
