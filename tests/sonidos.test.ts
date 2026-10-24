import { test } from "node:test";
import assert from "node:assert/strict";

type Sonidos = typeof import("../lib/sonidos.ts");

// ── Navegador simulado ──────────────────────────────────────────────────
class Parametro {
  value = 0;
  setValueAtTime(valor: number) {
    this.value = valor;
  }
  linearRampToValueAtTime(valor: number) {
    this.value = valor;
  }
  exponentialRampToValueAtTime(valor: number) {
    this.value = valor;
  }
  cancelScheduledValues() {}
}
class Nodo {
  context?: ContextoFalso;
  constructor(context?: ContextoFalso) {
    this.context = context;
  }
  connect(destino: Nodo) {
    return destino;
  }
  disconnect() {}
}
class Ganancia extends Nodo {
  gain = new Parametro();
}

type Registro = {
  contextos: number;
  inicios: number[];
  finales: number[];
  suspendido: boolean;
  pistas: AudioFalso[];
};
let registro: Registro;

class Oscilador extends Nodo {
  type = "sine";
  frequency = new Parametro();
  onended: (() => void) | null = null;
  start(cuando: number) {
    registro.inicios.push(cuando);
  }
  stop(cuando: number) {
    registro.finales.push(cuando);
  }
}
// El pase de página usa ruido: buffer, fuente de buffer y filtro.
class FuenteFalsa extends Oscilador {
  buffer: unknown = null;
}
class FiltroFalso extends Nodo {
  type = "lowpass";
  frequency = new Parametro();
  Q = new Parametro();
}
class ContextoFalso {
  currentTime = 0;
  sampleRate = 48000;
  destination = new Nodo();
  constructor() {
    registro.contextos++;
  }
  createGain() {
    return new Ganancia(this);
  }
  createOscillator() {
    return new Oscilador(this);
  }
  createBuffer(_canales: number, muestras: number) {
    const datos = new Float32Array(muestras);
    return { getChannelData: () => datos };
  }
  createBufferSource() {
    return new FuenteFalsa(this);
  }
  createBiquadFilter() {
    return new FiltroFalso(this);
  }
  resume() {
    registro.suspendido = false;
    return Promise.resolve();
  }
  suspend() {
    registro.suspendido = true;
    return Promise.resolve();
  }
}
class AudioFalso extends EventTarget {
  static falla = false;
  preload = "";
  loop = false;
  volume = 1;
  src = "";
  paused = true;
  constructor() {
    super();
    registro.pistas.push(this);
  }
  canPlayType(tipo: string) {
    return tipo === "audio/ogg" ? "maybe" : "";
  }
  play() {
    if (AudioFalso.falla) {
      this.dispatchEvent(new Event("error"));
      return Promise.reject(
        Object.assign(new Error("sin archivo"), { name: "NotSupportedError" }),
      );
    }
    this.paused = false;
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
}

function almacenamiento(rompe = false) {
  const datos = new Map<string, string>();
  return {
    getItem(clave: string) {
      if (rompe) throw new Error("bloqueado");
      return datos.get(clave) ?? null;
    },
    setItem(clave: string, valor: string) {
      if (rompe) throw new Error("bloqueado");
      datos.set(clave, valor);
    },
  };
}

let copia = 0;
/** Prepara un navegador nuevo y carga una copia nueva del módulo. */
async function cargar({
  storage = almacenamiento(),
}: { storage?: ReturnType<typeof almacenamiento> } = {}) {
  registro = {
    contextos: 0,
    inicios: [],
    finales: [],
    suspendido: false,
    pistas: [],
  };
  AudioFalso.falla = false;
  const ventana = Object.assign(new EventTarget(), {
    localStorage: storage,
    AudioContext: ContextoFalso,
  });
  const documento = Object.assign(new EventTarget(), {
    visibilityState: "visible",
  });
  Object.assign(globalThis, {
    window: ventana,
    document: documento,
    Audio: AudioFalso,
  });
  const url = new URL("../lib/sonidos.ts", import.meta.url);
  url.search = `?copia=${++copia}`;
  const modulo = (await import(url.href)) as Sonidos;
  return { modulo, ventana, documento, storage };
}
const tocar = (ventana: EventTarget) =>
  ventana.dispatchEvent(new Event("pointerdown"));
const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Pruebas ─────────────────────────────────────────────────────────────
test("el audio empieza apagado y no crea un AudioContext", async () => {
  const { modulo, ventana } = await cargar();
  assert.equal(modulo.estaActivo(), false);
  assert.equal(modulo.estaMusicaActiva(), false);
  tocar(ventana);
  modulo.reproducir("correcta");
  modulo.activarMusica();
  assert.equal(registro.contextos, 0);
  assert.equal(registro.pistas.length, 0);
});

test("la preferencia se guarda y se recuerda en la siguiente visita", async () => {
  const primera = await cargar();
  primera.modulo.setActivo(true);
  primera.modulo.setMusicaActiva(true);
  primera.modulo.pausarMusica();
  assert.equal(primera.storage.getItem("audio-activo"), "true");
  assert.equal(primera.storage.getItem("musica-activa"), "true");

  const segunda = await cargar({ storage: primera.storage });
  assert.equal(segunda.modulo.estaActivo(), true);
  assert.equal(segunda.modulo.estaMusicaActiva(), true);
  segunda.modulo.setMusicaActiva(false);
});

test("reproducir no hace nada apagado y suena corto al encenderlo", async () => {
  const { modulo, ventana } = await cargar();
  tocar(ventana);
  modulo.reproducir("pagina");
  assert.equal(registro.inicios.length, 0);

  modulo.setActivo(true);
  for (const nombre of [
    "pagina",
    "correcta",
    "incorrecta",
    "pista",
    "nivel",
    "boton",
  ] as const) {
    registro.inicios = [];
    registro.finales = [];
    modulo.reproducir(nombre);
    assert.ok(registro.inicios.length > 0, nombre);
    const duracion =
      Math.max(...registro.finales) - Math.min(...registro.inicios);
    // Solo la fanfarria de «nivel» puede durar hasta 1 s.
    const limite = nombre === "nivel" ? 1.02 : 0.42;
    assert.ok(duracion <= limite, `${nombre} dura ${duracion}s`);
  }
  assert.equal(registro.contextos, 1, "un único AudioContext");
});

test("silenciar() detiene la música", async () => {
  const { modulo } = await cargar();
  modulo.setMusicaActiva(true);
  const pista = registro.pistas[0];
  assert.equal(pista.paused, false);
  assert.equal(pista.loop, true);
  assert.equal(pista.preload, "none");
  assert.equal(pista.src, "/sonidos/musica.ogg");
  modulo.silenciar();
  assert.equal(pista.paused, true);
  assert.equal(modulo.estaMusicaActiva(), true, "la preferencia no cambia");
  modulo.setMusicaActiva(false);
});

test("la música baja mientras habla la voz y vuelve después", async () => {
  const { modulo, ventana } = await cargar();
  modulo.setMusicaActiva(true);
  const pista = registro.pistas[0];
  await esperar(500);
  assert.ok(Math.abs(pista.volume - 0.15) < 0.01, `volumen ${pista.volume}`);
  ventana.dispatchEvent(new Event("voz:inicio"));
  await esperar(600);
  assert.ok(Math.abs(pista.volume - 0.03) < 0.01, `con voz ${pista.volume}`);
  ventana.dispatchEvent(new Event("voz:fin"));
  await esperar(600);
  assert.ok(Math.abs(pista.volume - 0.15) < 0.01, `sin voz ${pista.volume}`);
  modulo.setMusicaActiva(false);
});

test("al ocultar la pestaña se pausa y al volver se reanuda", async () => {
  const { modulo, documento } = await cargar();
  modulo.setMusicaActiva(true);
  const pista = registro.pistas[0];
  documento.visibilityState = "hidden";
  documento.dispatchEvent(new Event("visibilitychange"));
  assert.equal(pista.paused, true);
  documento.visibilityState = "visible";
  documento.dispatchEvent(new Event("visibilitychange"));
  assert.equal(pista.paused, false);
  modulo.setMusicaActiva(false);
});

test("si falta el archivo de música suena la caja musical", async () => {
  const { modulo } = await cargar();
  AudioFalso.falla = true;
  modulo.setMusicaActiva(true);
  await esperar(300);
  assert.equal(registro.contextos, 1);
  assert.ok(registro.inicios.length > 0, "la caja musical programó notas");
  modulo.pausarMusica();
});

test("no lanza errores si localStorage falla", async () => {
  const { modulo, ventana } = await cargar({ storage: almacenamiento(true) });
  assert.equal(modulo.estaActivo(), false);
  assert.doesNotThrow(() => {
    modulo.setActivo(true);
    tocar(ventana);
    modulo.reproducir("boton");
    modulo.setMusicaActiva(true);
    modulo.silenciar();
    modulo.setMusicaActiva(false);
  });
  assert.equal(modulo.estaActivo(), true, "funciona durante la visita");
});

test("responder en Crear no suena nada con Sonidos apagado", async () => {
  const { modulo, ventana } = await cargar();
  tocar(ventana);
  modulo.reproducirRespuesta(true);
  modulo.reproducirRespuesta(false);
  await esperar(modulo.configuracion.esperaAntesDePista * 1000 + 150);
  assert.equal(registro.inicios.length, 0);
  assert.equal(registro.contextos, 0);
});

test("con Sonidos encendido, fallar suena y luego anuncia la pista", async () => {
  const { modulo } = await cargar();
  modulo.setActivo(true);
  modulo.reproducirRespuesta(false);
  const despuesDelError = registro.inicios.length;
  assert.ok(despuesDelError > 0, "suena «incorrecta»");
  await esperar(modulo.configuracion.esperaAntesDePista * 1000 + 150);
  assert.ok(registro.inicios.length > despuesDelError, "suena «pista»");
});

test("Crear usa solo lib/sonidos.ts, sin los tonos anteriores", async () => {
  const { readFile } = await import("node:fs/promises");
  const creador = await readFile(
    new URL("../components/story-creator.tsx", import.meta.url),
    "utf8",
  );
  for (const anterior of ["useAnswerSound", "SoundControl", "answerSound"])
    assert.equal(creador.includes(anterior), false, anterior);
  assert.ok(creador.includes("reproducirRespuesta("));
});

test("la configuración mantiene los efectos cortos y suaves", async () => {
  const { modulo } = await cargar();
  const { efectos, musica } = modulo.configuracion;
  const picoMusica = musica.notas.bajo * musica.refuerzoCajaMusical * musica.volumen;
  for (const [nombre, efecto] of Object.entries(efectos)) {
    const limite = nombre === "nivel" ? 1 : 0.4;
    assert.ok(efecto.duracion <= limite, `${nombre} dura hasta ${limite} s`);
    assert.ok(
      efecto.volumen <= picoMusica * 2,
      `${nombre} no pasa del doble de la música`,
    );
  }
  assert.ok(efectos.incorrecta.volumen < efectos.correcta.volumen);
  assert.ok(efectos.incorrecta.duracion <= 0.25, "«incorrecta» es corta");
});
