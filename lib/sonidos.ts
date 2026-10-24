/**
 * Efectos de sonido y música de fondo para niños. Todo está apagado por
 * defecto y se enciende desde el interruptor de audio.
 *
 * - Los efectos se generan con Web Audio (sin archivos ni licencias).
 * - La música usa public/sonidos/musica.ogg (o .mp3). Si el archivo no
 *   existe, suena una canción de cuna tipo caja musical generada por código.
 * - Un único AudioContext, creado solo después de que el niño toque la
 *   pantalla: los navegadores bloquean el audio automático.
 * - Ninguna función lanza errores: el audio es un extra, nunca un bloqueo.
 *
 * Eventos que escucha en window:
 * - "voz:inicio" / "voz:fin": baja la música mientras habla la narración.
 */

export type Sonido =
  | "pagina"
  | "correcta"
  | "incorrecta"
  | "pista"
  | "nivel"
  | "boton"
  | "fiesta";

/**
 * Todos los volúmenes y duraciones en un solo lugar, para afinarlos
 * después de escucharlos. Volumen: 0 = silencio, 1 = máximo del navegador.
 * Duración: segundos, de principio a fin del efecto (todas < 0,4 s, salvo
 * la fanfarria de «nivel», que suena una vez por nivel y dura hasta 1 s).
 */
export const configuracion = {
  musica: {
    /** Volumen normal del archivo musica.ogg/.mp3. */
    volumen: 0.15,
    /** Volumen mientras habla la narración (eventos voz:inicio/voz:fin). */
    volumenConVoz: 0.03,
    /** Tiempo de la rampa al bajar o subir el volumen. */
    rampa: 0.4,
    /**
     * La caja musical generada suena más bajo que un archivo; este factor
     * la iguala. Su pico real es notas.bajo × refuerzo × volumen ≈ 0,03.
     */
    refuerzoCajaMusical: 3,
    /** Pulsos por minuto de la caja musical (más bajo = más tranquila). */
    tempo: 76,
    /** Volumen de cada nota de la caja musical, antes del refuerzo. */
    notas: { bajo: 0.07, acorde: 0.035, melodia: 0.05 },
  },
  /**
   * Los efectos quedan como mucho al doble del pico de la caja musical:
   * lo justo para oírse por encima de la música, sin sobresaltar.
   */
  efectos: {
    /** Hoja de papel al pasar página: ruido filtrado que sube de 1800 a 4200 Hz. */
    pagina: { volumen: 0.055, duracion: 0.25 },
    /** Campanita de tres notas que suben (Do, Mi y Sol agudos). */
    correcta: { volumen: 0.06, duracion: 0.36 },
    /**
     * Respuesta incorrecta: un «boing» de dos notas que bajan (Sol y Mi),
     * cada una con un pequeño deslizamiento. Invita a probar otra vez, sin
     * sonar a castigo.
     */
    incorrecta: { volumen: 0.045, duracion: 0.24 },
    /** Nota suave que anuncia la pista. */
    pista: { volumen: 0.035, duracion: 0.3 },
    /** Fanfarria corta: Sol-Do-Mi y un Sol agudo largo. */
    nivel: { volumen: 0.055, duracion: 0.9 },
    /** Clic muy suave al tocar los interruptores. */
    boton: { volumen: 0.03, duracion: 0.05 },
    /** Fiesta al terminar un cuento: cuatro notas rápidas y un brillo. */
    fiesta: { volumen: 0.06, duracion: 0.38 },
  },
  /** Espera entre el sonido de «incorrecta» y la nota de la pista. */
  esperaAntesDePista: 0.42,
} as const;

const claveEfectos = "audio-activo";
const claveMusica = "musica-activa";
const archivosMusica = [
  { src: "/sonidos/musica.ogg", tipo: "audio/ogg" },
  { src: "/sonidos/musica.mp3", tipo: "audio/mpeg" },
];

let efectosActivos = false;
let musicaEncendida = false;
let preferenciasLeidas = false;
let instalado = false;
let interactuado = false;
let conVoz = false;
let sonando = false;
let pausadaPorPestana = false;
const oyentes = new Set<() => void>();

let contexto: AudioContext | null = null;
let salidaEfectos: GainNode | null = null;
let salidaMusica: GainNode | null = null;
let pista: HTMLAudioElement | null = null;
let archivoNoDisponible = false;
let temporizadorCuna: ReturnType<typeof setInterval> | undefined;
let temporizadorVolumen: ReturnType<typeof setInterval> | undefined;

function hayNavegador() {
  return typeof window !== "undefined";
}

function leer(clave: string) {
  try {
    return window.localStorage.getItem(clave) === "true";
  } catch {
    return false; // Modo incógnito o almacenamiento bloqueado.
  }
}
function guardar(clave: string, valor: boolean) {
  try {
    window.localStorage.setItem(clave, String(valor));
  } catch {
    /* La preferencia dura solo esta visita. */
  }
}
function leerPreferencias() {
  if (preferenciasLeidas || !hayNavegador()) return;
  preferenciasLeidas = true;
  efectosActivos = leer(claveEfectos);
  musicaEncendida = leer(claveMusica);
}
function avisar() {
  oyentes.forEach((oyente) => oyente());
}

function instalar() {
  if (instalado || !hayNavegador()) return;
  instalado = true;
  leerPreferencias();
  const primerToque = () => {
    interactuado = true;
    if (musicaEncendida) activarMusica();
  };
  for (const evento of ["pointerdown", "keydown", "touchstart"])
    window.addEventListener(evento, primerToque, { once: true });
  window.addEventListener("voz:inicio", () => {
    conVoz = true;
    ajustarVolumen();
  });
  window.addEventListener("voz:fin", () => {
    conVoz = false;
    ajustarVolumen();
  });
  if (typeof document !== "undefined")
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        pausadaPorPestana = sonando;
        detenerReproduccion();
      } else if (pausadaPorPestana && musicaEncendida) {
        pausadaPorPestana = false;
        activarMusica();
      }
    });
}
if (hayNavegador()) instalar();

function obtenerContexto() {
  if (contexto || !interactuado || !hayNavegador()) return contexto;
  const Contexto =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Contexto) return null;
  try {
    contexto = new Contexto();
    salidaEfectos = contexto.createGain();
    salidaEfectos.gain.value = 1;
    salidaEfectos.connect(contexto.destination);
    salidaMusica = contexto.createGain();
    salidaMusica.gain.value = 0;
    salidaMusica.connect(contexto.destination);
  } catch {
    contexto = null;
  }
  return contexto;
}

// ── Preferencias ────────────────────────────────────────────────────────
/** ¿Están encendidos los efectos de sonido? */
export function estaActivo() {
  instalar();
  return efectosActivos;
}
export function setActivo(valor: boolean) {
  instalar();
  efectosActivos = valor;
  guardar(claveEfectos, valor);
  avisar();
}
/** ¿Está encendida la música de fondo? */
export function estaMusicaActiva() {
  instalar();
  return musicaEncendida;
}
export function setMusicaActiva(valor: boolean) {
  instalar();
  musicaEncendida = valor;
  guardar(claveMusica, valor);
  avisar();
  if (valor) {
    interactuado = true; // Se llama desde un toque en el interruptor.
    activarMusica();
  } else pausarMusica();
}
/** Para que la interfaz se actualice cuando cambian las preferencias. */
export function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}

// ── Efectos ─────────────────────────────────────────────────────────────
function nota(
  salida: GainNode,
  frecuencia: number,
  inicio: number,
  duracion: number,
  volumen: number,
  forma: OscillatorType = "sine",
  frecuenciaFinal?: number,
) {
  const audio = salida.context;
  const oscilador = audio.createOscillator();
  const ganancia = audio.createGain();
  oscilador.type = forma;
  oscilador.frequency.setValueAtTime(frecuencia, inicio);
  if (frecuenciaFinal)
    oscilador.frequency.exponentialRampToValueAtTime(
      frecuenciaFinal,
      inicio + duracion,
    );
  ganancia.gain.setValueAtTime(0, inicio);
  ganancia.gain.linearRampToValueAtTime(volumen, inicio + 0.01);
  ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);
  oscilador.connect(ganancia);
  ganancia.connect(salida);
  oscilador.start(inicio);
  oscilador.stop(inicio + duracion + 0.02);
  oscilador.onended = () => {
    oscilador.disconnect();
    ganancia.disconnect();
  };
}

/** Ruido corto con un filtro que se mueve: suena como una hoja de papel. */
function hoja(
  salida: GainNode,
  inicio: number,
  duracion: number,
  volumen: number,
) {
  const audio = salida.context;
  const muestras = Math.max(1, Math.floor(audio.sampleRate * duracion));
  const buffer = audio.createBuffer(1, muestras, audio.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < muestras; i++) datos[i] = Math.random() * 2 - 1;
  const fuente = audio.createBufferSource();
  fuente.buffer = buffer;
  const filtro = audio.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.Q.value = 0.9;
  filtro.frequency.setValueAtTime(1800, inicio);
  filtro.frequency.exponentialRampToValueAtTime(4200, inicio + duracion);
  const ganancia = audio.createGain();
  ganancia.gain.setValueAtTime(0, inicio);
  ganancia.gain.linearRampToValueAtTime(volumen, inicio + duracion * 0.25);
  ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);
  fuente.connect(filtro);
  filtro.connect(ganancia);
  ganancia.connect(salida);
  fuente.start(inicio);
  fuente.stop(inicio + duracion + 0.02);
  fuente.onended = () => {
    fuente.disconnect();
    filtro.disconnect();
    ganancia.disconnect();
  };
}

/** Reproduce un efecto corto si los sonidos están activos. */
export function reproducir(nombre: Sonido) {
  instalar();
  if (!efectosActivos) return;
  try {
    interactuado = true; // Los efectos siempre responden a un toque.
    const audio = obtenerContexto();
    if (!audio || !salidaEfectos) return;
    void audio.resume?.().catch(() => undefined);
    const t = audio.currentTime + 0.01;
    const salida = salidaEfectos;
    const { volumen: v, duracion: d } = configuracion.efectos[nombre];
    switch (nombre) {
      case "pagina":
        hoja(salida, t, d, v);
        break;
      case "correcta": {
        // Campanita: cada nota suma un armónico suave al doble de frecuencia.
        const separacion = d * 0.2;
        const largo = d - separacion * 2;
        [1047, 1319, 1568].forEach((frecuencia, i) => {
          const inicio = t + i * separacion;
          nota(salida, frecuencia, inicio, largo, v);
          nota(salida, frecuencia * 2, inicio, largo * 0.6, v * 0.25);
        });
        break;
      }
      case "incorrecta": // seno: más suave que el triángulo
        nota(salida, 392, t, d * 0.45, v, "sine", 349);
        nota(salida, 330, t + d * 0.5, d * 0.5, v, "sine", 262);
        break;
      case "pista":
        nota(salida, 880, t, d, v);
        break;
      case "nivel": {
        // Tres notas cortas de entrada y una final larga con su octava.
        const corta = d * 0.16;
        [392, 523, 659].forEach((frecuencia, i) =>
          nota(salida, frecuencia, t + i * d * 0.14, corta, v, "triangle"),
        );
        const final = t + d * 0.42;
        nota(salida, 784, final, d * 0.56, v, "triangle");
        nota(salida, 1568, final, d * 0.4, v * 0.2);
        break;
      }
      case "boton":
        nota(salida, 1200, t, d, v, "sine", 800);
        break;
      case "fiesta": {
        const paso = d * 0.13;
        [523, 659, 784, 1047].forEach((frecuencia, i) =>
          nota(salida, frecuencia, t + i * paso, paso * 1.4, v, "triangle"),
        );
        nota(salida, 2093, t + paso * 4, d - paso * 4, v * 0.3);
        break;
      }
    }
  } catch {
    /* Si el audio falla, el niño sigue viendo los colores y textos. */
  }
}

/**
 * Sonido al responder: «correcta» o «incorrecta» y, tras un error, la nota
 * de «pista» cuando aparece la ayuda. Apagado no suena nada.
 */
export function reproducirRespuesta(acerto: boolean) {
  reproducir(acerto ? "correcta" : "incorrecta");
  if (!acerto && efectosActivos)
    setTimeout(
      () => reproducir("pista"),
      configuracion.esperaAntesDePista * 1000,
    );
}

// ── Música ──────────────────────────────────────────────────────────────
function volumenObjetivo() {
  const { volumen, volumenConVoz } = configuracion.musica;
  return conVoz ? volumenConVoz : volumen;
}

function ajustarVolumen() {
  const objetivo = volumenObjetivo();
  const { rampa, refuerzoCajaMusical } = configuracion.musica;
  try {
    if (salidaMusica && contexto) {
      const ahora = contexto.currentTime;
      salidaMusica.gain.cancelScheduledValues(ahora);
      salidaMusica.gain.setValueAtTime(salidaMusica.gain.value, ahora);
      salidaMusica.gain.linearRampToValueAtTime(
        objetivo * refuerzoCajaMusical,
        ahora + rampa,
      );
    }
    if (pista) {
      // Rampa lineal para que el cambio no se note.
      if (temporizadorVolumen) clearInterval(temporizadorVolumen);
      const elemento = pista;
      const desde = elemento.volume;
      const inicio = Date.now();
      temporizadorVolumen = setInterval(() => {
        const avance = Math.min(1, (Date.now() - inicio) / (rampa * 1000));
        elemento.volume = desde + (objetivo - desde) * avance;
        if (avance === 1) {
          clearInterval(temporizadorVolumen);
          temporizadorVolumen = undefined;
        }
      }, 40);
    }
  } catch {
    /* Nada que hacer: el volumen se queda como estaba. */
  }
}

function usarCuna() {
  archivoNoDisponible = true;
  pista = null;
  if (sonando) iniciarCuna();
}

function iniciarArchivo() {
  try {
    if (!pista) {
      const elemento = new Audio();
      elemento.preload = "none";
      elemento.loop = true;
      elemento.volume = volumenObjetivo();
      const archivo =
        archivosMusica.find((opcion) => elemento.canPlayType?.(opcion.tipo)) ??
        archivosMusica[1];
      elemento.src = archivo.src;
      // Marcador: mientras no exista el archivo, suena la caja musical.
      elemento.addEventListener("error", usarCuna, { once: true });
      pista = elemento;
    }
    const intento = pista.play();
    void intento?.catch?.((error: unknown) => {
      const nombre = (error as { name?: string } | null)?.name;
      // Sin toque previo el navegador dice NotAllowedError: se espera.
      if (nombre === "NotSupportedError") usarCuna();
    });
  } catch {
    usarCuna();
  }
}

/** Enciende la música si el niño la activó (y ya tocó la pantalla). */
export function activarMusica() {
  instalar();
  if (!musicaEncendida || !interactuado || sonando) return;
  sonando = true;
  if (archivoNoDisponible) iniciarCuna();
  else iniciarArchivo();
}

function detenerReproduccion() {
  sonando = false;
  try {
    pista?.pause();
  } catch {
    /* Ya estaba detenida. */
  }
  if (temporizadorCuna) clearInterval(temporizadorCuna);
  temporizadorCuna = undefined;
  if (salidaMusica && contexto)
    try {
      salidaMusica.gain.cancelScheduledValues(contexto.currentTime);
      salidaMusica.gain.setValueAtTime(0, contexto.currentTime);
    } catch {
      /* Sin contexto activo. */
    }
}

/** Pausa la música sin cambiar la preferencia del niño. */
export function pausarMusica() {
  instalar();
  pausadaPorPestana = false;
  detenerReproduccion();
}

/** Detiene todo lo que suena ahora mismo (música incluida). */
export function silenciar() {
  pausarMusica();
  try {
    void contexto?.suspend?.();
  } catch {
    /* Nada sonaba. */
  }
}

// Caja musical generada: C – Am – F – G con una melodía pentatónica suave.
const acordes = [
  [48, 55, 64],
  [45, 52, 60],
  [41, 48, 57],
  [43, 50, 59],
];
const melodia = [72, 74, 76, 79, 81, 84];
const frecuenciaDe = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
let paso = 0;
let siguiente = 0;
let posicion = 2;

function campana(frecuencia: number, inicio: number, volumen: number) {
  if (!salidaMusica) return;
  nota(salidaMusica, frecuencia, inicio, 1.6, volumen);
  nota(salidaMusica, frecuencia * 2, inicio, 0.8, volumen * 0.2);
}

function programarCuna() {
  try {
    programarCompases();
  } catch {
    // Nunca dejar errores sueltos en el temporizador: se apaga la caja.
    if (temporizadorCuna) clearInterval(temporizadorCuna);
    temporizadorCuna = undefined;
  }
}

function programarCompases() {
  if (!contexto) return;
  const { tempo, notas } = configuracion.musica;
  const corchea = 60 / tempo / 2;
  while (siguiente < contexto.currentTime + 0.4) {
    const acorde = acordes[Math.floor(paso / 8) % acordes.length];
    const enCompas = paso % 8;
    if (enCompas === 0) {
      campana(frecuenciaDe(acorde[0]), siguiente, notas.bajo);
      const segunda = siguiente + corchea * 2;
      campana(frecuenciaDe(acorde[1] + 12), segunda, notas.acorde);
      const tercera = siguiente + corchea * 4;
      campana(frecuenciaDe(acorde[2] + 12), tercera, notas.acorde);
    }
    if (Math.random() > (enCompas % 2 ? 0.75 : 0.35)) {
      const salto = [-1, -1, 0, 1, 1, 2, -2][Math.floor(Math.random() * 7)];
      posicion = Math.max(0, Math.min(melodia.length - 1, posicion + salto));
      campana(frecuenciaDe(melodia[posicion]), siguiente, notas.melodia);
    }
    paso++;
    siguiente += corchea;
  }
}

function iniciarCuna() {
  try {
    const audio = obtenerContexto();
    if (!audio || temporizadorCuna) return;
    void audio.resume?.().catch(() => undefined);
    ajustarVolumen();
    siguiente = audio.currentTime + 0.1;
    temporizadorCuna = setInterval(programarCuna, 120);
  } catch {
    /* Sin Web Audio: la lectura sigue en silencio. */
  }
}
