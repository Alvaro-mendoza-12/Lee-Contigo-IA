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
  | "boton";

const claveEfectos = "audio-activo";
const claveMusica = "musica-activa";
const volumenMusica = 0.15;
const volumenConVoz = 0.03;
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

/** Reproduce un efecto corto (< 400 ms) si los sonidos están activos. */
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
    switch (nombre) {
      case "pagina": // «fiu» suave
        nota(salida, 520, t, 0.22, 0.06, "sine", 1400);
        break;
      case "correcta": // dos notas alegres que suben
        nota(salida, 784, t, 0.16, 0.08, "triangle");
        nota(salida, 1175, t + 0.12, 0.24, 0.08, "triangle");
        break;
      case "incorrecta": // «boing» que baja: claro, pero no asusta
        nota(salida, 392, t, 0.34, 0.08, "triangle", 196);
        break;
      case "pista": // una nota suave
        nota(salida, 880, t, 0.3, 0.05);
        break;
      case "nivel": // arpegio corto de celebración
        [523, 659, 784, 1047].forEach((frecuencia, i) =>
          nota(salida, frecuencia, t + i * 0.07, 0.18, 0.07, "triangle"),
        );
        break;
      case "boton": // clic suave
        nota(salida, 1200, t, 0.05, 0.04, "sine", 800);
        break;
    }
  } catch {
    /* Si el audio falla, el niño sigue viendo los colores y textos. */
  }
}

// ── Música ──────────────────────────────────────────────────────────────
function volumenObjetivo() {
  return conVoz ? volumenConVoz : volumenMusica;
}

function ajustarVolumen() {
  const objetivo = volumenObjetivo();
  try {
    if (salidaMusica && contexto) {
      const ahora = contexto.currentTime;
      salidaMusica.gain.cancelScheduledValues(ahora);
      salidaMusica.gain.setValueAtTime(salidaMusica.gain.value, ahora);
      // La caja musical suena más bajo que un archivo: se compensa ×3.
      salidaMusica.gain.linearRampToValueAtTime(objetivo * 3, ahora + 0.4);
    }
    if (pista) {
      // Rampa suave en ~400 ms para que no se note el cambio.
      if (temporizadorVolumen) clearInterval(temporizadorVolumen);
      const elemento = pista;
      temporizadorVolumen = setInterval(() => {
        const diferencia = objetivo - elemento.volume;
        if (Math.abs(diferencia) < 0.006) {
          elemento.volume = objetivo;
          clearInterval(temporizadorVolumen);
          temporizadorVolumen = undefined;
        } else elemento.volume += diferencia * 0.35;
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
  const corchea = 60 / 76 / 2;
  while (siguiente < contexto.currentTime + 0.4) {
    const acorde = acordes[Math.floor(paso / 8) % acordes.length];
    const enCompas = paso % 8;
    if (enCompas === 0) {
      campana(frecuenciaDe(acorde[0]), siguiente, 0.07);
      campana(frecuenciaDe(acorde[1] + 12), siguiente + corchea * 2, 0.035);
      campana(frecuenciaDe(acorde[2] + 12), siguiente + corchea * 4, 0.035);
    }
    if (Math.random() > (enCompas % 2 ? 0.75 : 0.35)) {
      const salto = [-1, -1, 0, 1, 1, 2, -2][Math.floor(Math.random() * 7)];
      posicion = Math.max(0, Math.min(melodia.length - 1, posicion + salto));
      campana(frecuenciaDe(melodia[posicion]), siguiente, 0.05);
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
