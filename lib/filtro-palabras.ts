/**
 * Filtro de palabras inapropiadas para niños, compartido por el creador
 * de cuentos (en vivo, en el navegador) y por el servidor (siempre).
 * No depende del navegador ni de Node.
 *
 * Compara palabras completas, nunca subcadenas: «computadora» no contiene
 * una grosería aunque lleve «puta» dentro. La lista prohibida pasa por la
 * misma normalización que el texto del niño, así el colapso de letras
 * repetidas no crea falsos positivos (perro/pero, carro/caro, llama/lama).
 */

// Groserías e insultos en español (Perú y Latinoamérica) y algunos en
// inglés. Los plurales se agregan solos. Quedan fuera a propósito palabras
// con un uso inocente en Perú o en los cuentos: concha, polla, cabro.
export const palabrasProhibidas: readonly string[] = [
  "mierda",
  "mierdita",
  "mierdoso",
  "mierdosa",
  "mrd",
  "puta",
  "puto",
  "putita",
  "putito",
  "putazo",
  "hijueputa",
  "hijoeputa",
  "hdp",
  "ptm",
  "ctm",
  "csm",
  "conchatumare",
  "conchetumare",
  "conchesumare",
  "joder",
  "jodido",
  "jodida",
  "jodete",
  "jodanse",
  "cabron",
  "cabrona",
  "pendejo",
  "pendeja",
  "pendejada",
  "verga",
  "vergazo",
  "chingada",
  "chingado",
  "chingar",
  "chingadera",
  "carajo",
  "gonorrea",
  "malparido",
  "malparida",
  "cojones",
  "cojudo",
  "cojuda",
  "cojudez",
  "huevon",
  "huevona",
  "huevada",
  "webon",
  "webona",
  "wevon",
  "weon",
  "maricon",
  "maricona",
  "marica",
  "imbecil",
  "estupido",
  "estupida",
  "idiota",
  "tarado",
  "tarada",
  "sonso",
  "sonsa",
  "sonsito",
  "sonsita",
  "zonzo",
  "zonza",
  "zonzito",
  "zonzita",
  "tonto",
  "tonta",
  "cagar",
  "cagada",
  "cagon",
  "cagona",
  "culo",
  "culero",
  "culera",
  "pinga",
  "chucha",
  "fuck",
  "fucked",
  "fucker",
  "fucking",
  "shit",
  "bullshit",
  "bitch",
  "bastard",
  "asshole",
  "motherfucker",
];

// Letras de otros alfabetos que se ven igual que las latinas.
const homoglifos: Record<string, string> = {
  а: "a",
  е: "e",
  і: "i",
  ј: "j",
  к: "k",
  м: "m",
  н: "h",
  о: "o",
  р: "p",
  с: "c",
  т: "t",
  у: "y",
  х: "x",
  в: "b",
};
const leet: Record<string, string> = {
  "4": "a",
  "@": "a",
  "3": "e",
  "1": "i",
  "!": "i",
  "0": "o",
  "5": "s",
  $: "s",
  "7": "t",
};

/**
 * Minúsculas, sin tildes (pero con ñ), sin trucos leet ni homoglifos y con
 * las letras repetidas colapsadas: «TÓÓÓNT0» → «tonto».
 */
export function normalizar(texto: string): string {
  return texto
    .toLocaleLowerCase("es")
    .normalize("NFKD")
    .replace(/ñ/g, "ñ")
    .replace(/[\p{M}\p{Cf}]/gu, "")
    .replace(/[аевікмнорстухј]/g, (letra) => homoglifos[letra] ?? letra)
    .replace(/[4@31!05$7]/g, (signo) => leet[signo] ?? signo)
    .replace(/(\p{L})\1+/gu, "$1");
}

const prohibidas = new Set<string>();
for (const palabra of palabrasProhibidas)
  for (const forma of [
    palabra,
    palabra + "s",
    /[^aeiou]$/.test(palabra) ? palabra + "es" : palabra,
  ])
    prohibidas.add(normalizar(forma));
const longitudMaxima = Math.max(
  ...Array.from(prohibidas, (palabra) => palabra.length),
);

type Token = { texto: string; inicio: number; fin: number };

function tokenizar(texto: string): Token[] {
  const tokens: Token[] = [];
  // Letras, números y los símbolos que usa el leet (@, $, !).
  for (const coincidencia of texto.matchAll(/[\p{L}\p{M}\p{N}\p{Cf}@$!]+/gu)) {
    let inicio = coincidencia.index;
    let fin = inicio + coincidencia[0].length;
    // «¡hola!»: los signos al borde de la palabra son puntuación, no leet.
    while (inicio < fin && texto[inicio] === "!") inicio++;
    while (fin > inicio && texto[fin - 1] === "!") fin--;
    if (fin > inicio)
      tokens.push({ texto: texto.slice(inicio, fin), inicio, fin });
  }
  return tokens;
}

/**
 * Devuelve la primera palabra prohibida tal como la escribió el niño
 * (para mostrarla en el mensaje), o null si el texto está limpio.
 */
export function buscarPalabraProhibida(texto: string): string | null {
  const tokens = tokenizar(texto);
  for (const token of tokens)
    if (prohibidas.has(normalizar(token.texto))) return token.texto;

  // Match whole tokens joined across separators, including chunks such as
  // «ton-to». Never search inside a token (e.g. «computadora»).
  for (let i = 0; i < tokens.length; i++) {
    let unida = normalizar(tokens[i].texto);
    for (let j = i + 1; j < tokens.length; j++) {
      unida = normalizar(unida + normalizar(tokens[j].texto));
      if (unida.length > longitudMaxima) break;
      if (prohibidas.has(unida))
        return texto.slice(tokens[i].inicio, tokens[j].fin);
    }
  }
  return null;
}

export function mensajePalabraProhibida(palabra: string) {
  return `La palabra «${palabra}» no se puede usar. Prueba con otra.`;
}
