import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buscarPalabraProhibida,
  mensajePalabraProhibida,
  normalizar,
} from "../lib/filtro-palabras.ts";
import { getStoryIdeaSafetyIssue } from "../lib/story-creator.ts";

test("un texto limpio no tiene palabras prohibidas", () => {
  for (const texto of [
    "Una tortuga curiosa busca un faro junto al mar",
    "¡Hola! ¿Jugamos con el gato?",
    "Un niño de 7 años y su abuela hornean pan",
    "",
  ])
    assert.equal(buscarPalabraProhibida(texto), null, texto);
});

test("detecta una palabra prohibida directa y la devuelve como se escribió", () => {
  assert.equal(buscarPalabraProhibida("Un tonto pierde su pelota"), "tonto");
  assert.equal(buscarPalabraProhibida("qué mierda de día"), "mierda");
  assert.equal(buscarPalabraProhibida("Los idiotas del cuento"), "idiotas");
});

test("detecta palabras con tildes y mayúsculas", () => {
  assert.equal(buscarPalabraProhibida("Un TÓNTO en el parque"), "TÓNTO");
  assert.equal(buscarPalabraProhibida("Es un Imbécil"), "Imbécil");
  assert.equal(buscarPalabraProhibida("Qué ESTÚPIDA idea"), "ESTÚPIDA");
});

test("detecta trucos con números y símbolos (leet)", () => {
  for (const [texto, palabra] of [
    ["Un t0nt0 pierde la pelota", "t0nt0"],
    ["Un s0ns0 en el parque", "s0ns0"],
    ["put@ madre", "put@"],
    ["qué 1d10t4", "1d10t4"],
    ["m!erda", "m!erda"],
    ["e$tupido", "e$tupido"],
  ])
    assert.equal(buscarPalabraProhibida(texto), palabra, texto);
});

test("detecta letras repetidas y letras separadas", () => {
  assert.equal(buscarPalabraProhibida("Un tooonto muy tonnnto"), "tooonto");
  assert.equal(buscarPalabraProhibida("Un sooonso"), "sooonso");
  assert.equal(buscarPalabraProhibida("un s.o.n.s.o pierde"), "s.o.n.s.o");
  assert.equal(buscarPalabraProhibida("p u t a"), "p u t a");
});

test("los signos al final de la palabra no se leen como letras", () => {
  assert.equal(buscarPalabraProhibida("¡tonto!"), "tonto");
  assert.equal(buscarPalabraProhibida("¡Qué lindo!"), null);
});

test("no bloquea palabras inocentes que contienen una prohibida adentro", () => {
  for (const texto of [
    "La computadora de la escuela",
    "Un disputa entre dos amigos se resuelve",
    "El escaparate de la tienda",
    "Un armadillo y un pájaro",
    "La mamá culebra cuida sus huevos",
    "Una tontería muy divertida",
    "Encontró conchas en la playa",
    "Una polla de agua nada en el lago",
  ])
    assert.equal(buscarPalabraProhibida(texto), null, texto);
});

test("palabras con rr y ll no se confunden al colapsar letras", () => {
  for (const texto of [
    "El perro juega en la calle",
    "Un carro rojo y una llama blanca",
    "La gallina y el burro",
    "Pero el caro sombrero",
  ])
    assert.equal(buscarPalabraProhibida(texto), null, texto);
  // La lista y el texto se normalizan igual.
  assert.equal(normalizar("perro"), normalizar("pero"));
  assert.equal(normalizar("Ñandú"), "ñandu");
});

test("el mensaje muestra la palabra escrita por el niño", () => {
  assert.equal(
    mensajePalabraProhibida("t0nt0"),
    "La palabra «t0nt0» no se puede usar. Prueba con otra.",
  );
});

test("el servidor rechaza un texto con una palabra prohibida", () => {
  assert.equal(
    getStoryIdeaSafetyIssue("Un t0nt0 pierde su pelota en el parque"),
    "profanity",
  );
  assert.equal(
    getStoryIdeaSafetyIssue("Un perro juega en la calle con una llama"),
    null,
  );
});
