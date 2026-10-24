import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CLAVE,
  CLAVE_DEMO,
  DESBLOQUEOS,
  EVENTO_XP,
  MARCA_DEMO,
  MAXIMO_CUENTOS_CREADOS,
  NIVELES,
  cuentoDesbloqueado,
  cuentosBloqueados,
  nivelActual,
  nivelParaCuento,
  obtenerProgreso,
  reiniciarProgreso,
  retoDesbloqueado,
  sumarXP,
  type DetalleXP,
} from "../lib/progreso.ts";
import { stories, storyIds } from "../lib/stories.ts";

class Memoria {
  datos = new Map<string, string>();
  getItem(clave: string) {
    return this.datos.get(clave) ?? null;
  }
  setItem(clave: string, valor: string) {
    this.datos.set(clave, valor);
  }
  removeItem(clave: string) {
    this.datos.delete(clave);
  }
}

class MemoriaRota {
  getItem(): string | null {
    throw new Error("Almacenamiento bloqueado");
  }
  setItem() {
    throw new Error("Almacenamiento bloqueado");
  }
  removeItem() {
    throw new Error("Almacenamiento bloqueado");
  }
}

function definir(nombre: string, valor: unknown) {
  Object.defineProperty(globalThis, nombre, {
    value: valor,
    configurable: true,
    writable: true,
  });
}

function preparar({
  url = "",
  local = new Memoria() as Memoria | MemoriaRota | undefined,
  session = new Memoria() as Memoria | MemoriaRota | undefined,
} = {}) {
  const ventana = Object.assign(new EventTarget(), {
    location: { search: url },
  });
  const eventos: DetalleXP[] = [];
  ventana.addEventListener(EVENTO_XP, (evento) =>
    eventos.push((evento as CustomEvent<DetalleXP>).detail),
  );
  definir("window", ventana);
  definir("localStorage", local);
  definir("sessionStorage", session);
  return { ventana, eventos, local, session };
}

function guardarXP(local: Memoria, xp: number, clave = CLAVE) {
  local.setItem(clave, JSON.stringify({ version: 1, xp, recompensas: [] }));
}

test("cada motivo suma la experiencia indicada", () => {
  preparar();
  assert.equal(
    sumarXP("pregunta-primer-intento", "luz-del-bosque", "paso", "q1").ganada,
    10,
  );
  assert.equal(
    sumarXP("pregunta-con-pista", "luz-del-bosque", "paso", "q2").ganada,
    5,
  );
  assert.equal(
    sumarXP("cuento-terminado", "luz-del-bosque", "paso").ganada,
    30,
  );
  assert.equal(
    sumarXP("preguntas-completas", "luz-del-bosque", "paso").ganada,
    20,
  );
  const creado = sumarXP("cuento-creado", "libro-propio", "paso");
  assert.equal(creado.ganada, 15);
  assert.equal(creado.total, 80);
  assert.equal(obtenerProgreso().xp, 80);
});

test("una recompensa no se repite para el mismo cuento, nivel y pregunta", () => {
  const { eventos } = preparar();
  sumarXP("pregunta-con-pista", "nube-perdida", "paso", "q1");
  const repetida = sumarXP(
    "pregunta-primer-intento",
    "nube-perdida",
    "paso",
    "q1",
  );
  assert.equal(repetida.ganada, 0);
  assert.equal(repetida.total, 5);
  sumarXP("cuento-terminado", "nube-perdida", "paso");
  assert.equal(sumarXP("cuento-terminado", "nube-perdida", "paso").ganada, 0);
  assert.equal(eventos.length, 2);

  assert.equal(
    sumarXP("pregunta-primer-intento", "nube-perdida", "paso", "q2").ganada,
    10,
  );
  assert.equal(
    sumarXP("pregunta-primer-intento", "nube-perdida", "reto", "q1").ganada,
    10,
  );
  assert.equal(sumarXP("cuento-terminado", "nube-perdida", "reto").ganada, 30);
  assert.equal(obtenerProgreso().xp, 85);
});

test("al llegar a 60 XP se sube a Lector Brote y se avisa", () => {
  const { eventos } = preparar();
  sumarXP("cuento-terminado", "luz-del-bosque", "paso");
  sumarXP("preguntas-completas", "luz-del-bosque", "paso");
  assert.equal(nivelActual().titulo, "Lector Semilla");
  const subida = sumarXP(
    "pregunta-primer-intento",
    "luz-del-bosque",
    "paso",
    "q1",
  );
  assert.equal(subida.total, 60);
  assert.equal(subida.subioDeNivel, true);
  assert.equal(subida.nivel.titulo, "Lector Brote");
  assert.deepEqual(eventos.at(-1), subida);
  assert.equal(eventos[0].subioDeNivel, false);
});

test("el porcentaje mide el avance dentro del nivel actual", () => {
  const { local } = preparar();
  const casos = [
    { xp: 0, numero: 1, porcentaje: 0 },
    { xp: 30, numero: 1, porcentaje: 50 },
    { xp: 105, numero: 2, porcentaje: 50 },
    { xp: 500, numero: 5, porcentaje: 100 },
    { xp: 920, numero: 5, porcentaje: 100 },
  ];
  for (const caso of casos) {
    guardarXP(local as Memoria, caso.xp);
    const progreso = obtenerProgreso();
    assert.equal(progreso.nivel.numero, caso.numero);
    assert.equal(progreso.porcentaje, caso.porcentaje);
  }
  assert.equal(obtenerProgreso().siguiente, null);
});

test("los cuentos y el reto se desbloquean según el nivel", () => {
  const { local } = preparar();
  assert.equal(cuentoDesbloqueado("luz-del-bosque"), true);
  assert.equal(cuentoDesbloqueado("barco-de-papel"), false);
  assert.equal(cuentoDesbloqueado("orquesta-del-bosque"), false);
  assert.equal(cuentoDesbloqueado("cuento-creado-por-mi"), true);
  assert.equal(retoDesbloqueado(), false);

  guardarXP(local as Memoria, 60);
  assert.equal(retoDesbloqueado(), true);
  assert.equal(cuentoDesbloqueado("barco-de-papel"), true);
  assert.equal(cuentoDesbloqueado("sendero-huellas"), false);

  guardarXP(local as Memoria, 300);
  assert.equal(cuentoDesbloqueado("orquesta-del-bosque"), true);
  assert.equal(
    nivelParaCuento("sendero-huellas")?.titulo,
    "Explorador de Cuentos",
  );
  assert.equal(nivelParaCuento("libro-propio"), undefined);
});

test("el reparto cubre todo el catálogo y llena cada categoría al inicio", () => {
  const repartidos: string[] = Object.values(DESBLOQUEOS).flat();
  assert.equal(repartidos.length, storyIds.length);
  assert.deepEqual([...repartidos].sort(), [...storyIds].sort());
  assert.deepEqual(
    Object.values(DESBLOQUEOS).map((ids) => ids.length),
    [7, 4, 4, 4],
  );
  assert.ok((DESBLOQUEOS[2] as readonly string[]).includes("barco-de-papel"));
  const iniciales: readonly string[] = DESBLOQUEOS[1];
  for (const categoria of new Set(stories.map((story) => story.category)))
    assert.ok(
      stories.filter(
        (story) => story.category === categoria && iniciales.includes(story.id),
      ).length >= 2,
      categoria,
    );
});

test("el modo demo desbloquea todo y suma en una clave separada", () => {
  const { local, eventos } = preparar({ url: "?demo=1" });
  guardarXP(local as Memoria, 40);
  const real = (local as Memoria).getItem(CLAVE);

  assert.equal(cuentoDesbloqueado("orquesta-del-bosque"), true);
  assert.equal(retoDesbloqueado(), true);
  assert.equal(obtenerProgreso().xp, 0);
  const ganada = sumarXP("cuento-terminado", "luz-del-bosque", "paso");
  assert.equal(ganada.ganada, 30);
  assert.equal(eventos.length, 1);
  assert.equal(obtenerProgreso().xp, 30);
  assert.ok((local as Memoria).getItem(CLAVE_DEMO));
  assert.equal((local as Memoria).getItem(CLAVE), real);

  reiniciarProgreso();
  assert.equal((local as Memoria).getItem(CLAVE_DEMO), null);
  assert.equal((local as Memoria).getItem(CLAVE), real);
  assert.equal(eventos.at(-1)?.motivo, "reinicio");
});

test("el modo demo se mantiene al navegar y ?demo=0 lo apaga", () => {
  const { ventana, session, local } = preparar({ url: "?demo=1" });
  guardarXP(local as Memoria, 40);
  assert.equal(retoDesbloqueado(), true);
  assert.equal((session as Memoria).getItem(MARCA_DEMO), "1");

  ventana.location.search = "";
  assert.equal(retoDesbloqueado(), true);
  assert.equal(obtenerProgreso().xp, 0);

  ventana.location.search = "?demo=0";
  assert.equal(retoDesbloqueado(), false);
  assert.equal((session as Memoria).getItem(MARCA_DEMO), null);
  ventana.location.search = "";
  assert.equal(obtenerProgreso().xp, 40);
});

test("sin sessionStorage el parámetro demo sigue funcionando", () => {
  const { ventana } = preparar({ url: "?demo=1", session: new MemoriaRota() });
  assert.equal(retoDesbloqueado(), true);
  ventana.location.search = "";
  assert.equal(retoDesbloqueado(), false);
});

test("no falla si localStorage no está disponible o tiene datos dañados", () => {
  for (const local of [new MemoriaRota(), undefined]) {
    preparar({ local, session: undefined });
    assert.equal(obtenerProgreso().xp, 0);
    assert.equal(
      sumarXP("cuento-terminado", "luz-del-bosque", "paso").ganada,
      30,
    );
    assert.equal(cuentoDesbloqueado("luz-del-bosque"), true);
    assert.doesNotThrow(() => reiniciarProgreso());
  }
  definir("window", undefined);
  assert.equal(obtenerProgreso().xp, 0);
  assert.doesNotThrow(() => sumarXP("cuento-creado", "libro", "paso"));

  const { local } = preparar();
  (local as Memoria).setItem(CLAVE, "{no es json");
  assert.equal(obtenerProgreso().xp, 0);
  (local as Memoria).setItem(CLAVE, JSON.stringify({ version: 1, xp: -50 }));
  assert.equal(obtenerProgreso().xp, 0);
});

test("reiniciar borra el progreso real y avisa a la barra", () => {
  const { local, eventos } = preparar();
  sumarXP("cuento-terminado", "luz-del-bosque", "paso");
  reiniciarProgreso();
  assert.equal((local as Memoria).getItem(CLAVE), null);
  assert.equal(obtenerProgreso().xp, 0);
  assert.equal(eventos.at(-1)?.total, 0);
  assert.equal(
    sumarXP("cuento-terminado", "luz-del-bosque", "paso").ganada,
    30,
  );
});

test("solo los primeros cuentos creados dan experiencia", () => {
  const { eventos } = preparar();
  for (let i = 0; i < MAXIMO_CUENTOS_CREADOS; i++)
    assert.equal(sumarXP("cuento-creado", `libro-${i}`, "paso").ganada, 15);
  const avisos = eventos.length;
  assert.equal(sumarXP("cuento-creado", "libro-extra", "reto").ganada, 0);
  assert.equal(eventos.length, avisos);
  assert.equal(obtenerProgreso().xp, 15 * MAXIMO_CUENTOS_CREADOS);
  // El tope no afecta a las demás recompensas.
  assert.equal(
    sumarXP("cuento-terminado", "luz-del-bosque", "paso").ganada,
    30,
  );
});

test("los mensajes de candado nombran el nivel que abre cada cuento", () => {
  const nivel1 = cuentosBloqueados(1);
  assert.equal(nivel1["luz-del-bosque"], undefined);
  assert.equal(nivel1["barco-de-papel"], "Se desbloquea al ser Lector Brote");
  assert.equal(
    nivel1["orquesta-del-bosque"],
    "Se desbloquea al ser Guardián de Historias",
  );
  assert.equal(
    Object.keys(nivel1).length,
    DESBLOQUEOS[2].length + DESBLOQUEOS[3].length + DESBLOQUEOS[4].length,
  );
  assert.deepEqual(Object.keys(cuentosBloqueados(3)), [...DESBLOQUEOS[4]]);
  assert.deepEqual(cuentosBloqueados(NIVELES.length), {});
});
