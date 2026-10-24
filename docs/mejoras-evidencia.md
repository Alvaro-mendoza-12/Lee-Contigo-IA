# Mejoras basadas en evidencia y garantías verificables

LeeContigo IA busca apoyar la comprensión lectora de niños de 6 a 10 años. Este documento resume
qué se implementó en la rama `ivan/mejoras-evidencia`, en qué evidencia se apoya, qué garantías
quedan comprobadas por pruebas automáticas y qué queda como próximo paso.

> **Alcance honesto.** Las fuentes citadas orientan el diseño; no prueban que la app mejore la
> comprensión. Eso requiere un piloto con estudiantes (ver `documentacion_tutor_lectura_ia/09_validacion_y_metricas.md`).
> Las referencias numeradas [n] corresponden a `documentacion_tutor_lectura_ia/13_fuentes.md`.
> Donde el documento de evidencia del equipo aporta otra fuente, se indica «completar».

## Qué se implementó

| Bloque | Qué hace | Evidencia que lo respalda |
| --- | --- | --- |
| Tutorial sin scroll | Mientras la guía está abierta, la página no se mueve con rueda, teclado ni dedo (también en iPhone); al cerrar vuelve a la posición exacta. | Accesibilidad y foco predecible: WCAG 2.2 [14]. |
| Garantías verificables | Pruebas automáticas G1–G5 (abajo). Se corrigió una pista que contenía la respuesta (`gallina-cuenta`, reto, q1). | Pistas que apoyan sin resolver: apoyo gradual al lector [9]. |
| Fiesta al terminar un cuento | Luciérnaga y tres personajes originales celebran con «¡Terminaste el cuento!» y +30 XP; luego aparecen las preguntas. Sin +30 si el cuento ya se había leído. | Motivación para completar lecturas: supuesto 1 del proyecto (`02_problema_y_evidencia.md`), por validar en piloto. |
| Mejora 1 · Explicar la respuesta | Tras usar las 2 pistas, el siguiente error muestra la respuesta, su explicación y el párrafo resaltado, con tono amable y 0 XP. También en cuentos creados (con su cita verificada). | Señalar partes del texto y pedir razones [23]; monitoreo y clarificación [9]. |
| Mejora 2 · Nada que distraiga | En las páginas del cuento no aparece ni suena nada automático; avisos y +XP esperan a las preguntas. | Completar con el documento de evidencia del equipo. |
| Mejora 5 · Narración en el momento justo | Al fallar: «Escuchar esta parte del cuento». En «No entendí»: «Escuchar este párrafo». Nunca suena sola; usa la voz del servidor o la del dispositivo. | Apoyo gradual y clarificación [9]; completar con el documento de evidencia del equipo. |

## Garantías verificables

Cada garantía es una prueba automática que corre en cada cambio (`npm test` y Playwright en
escritorio y celular, sin claves de IA ni de voz).

| Garantía | Qué se comprueba | Dónde |
| --- | --- | --- |
| **G1 · Todo cuento se puede leer y practicar** | Los 19 cuentos abren en ambos niveles con texto y 3 preguntas; dos cuentos se leen hasta el final, se pulsa «Vamos a pensar» y se responden las 3 preguntas. | `tests/e2e/garantias-lectura.spec.ts` |
| **G2 · Toda pregunta está bien construida** | Una sola respuesta correcta (opciones únicas), explicación no vacía, párrafo de evidencia real y no vacío, 3 habilidades distintas por cuento, y ninguna pista contiene la respuesta. | `tests/garantias-lectura.test.ts` y `tests/tutor.test.ts` |
| **G3 · El niño nunca queda sin salida** | Tras agotar las pistas ve la respuesta con su explicación y el párrafo, y puede seguir. | `tests/e2e/garantias-lectura.spec.ts` |
| **G4 · La experiencia solo se gana leyendo y comprendiendo** | +30 solo al llegar al final, sin duplicados, máximo 3 cuentos creados con XP, 0 XP en una pregunta revelada. | `tests/progreso.test.ts` y `tests/e2e/garantias-lectura.spec.ts` |
| **G5 · Accesible y legible** | Sin infracciones de axe en `/`, `/leer`, `/practicar` y `/acompanar`; texto del cuento de al menos 16 px (el mínimo es 18 px); sin scroll horizontal a 320 px. | `tests/e2e/reading.spec.ts`, `tests/garantias-lectura.test.ts` y `tests/e2e/garantias-lectura.spec.ts` |

Además: `tests/e2e/tutorial-scroll.spec.ts` (scroll bloqueado y restaurado),
`tests/e2e/lectura-sin-distracciones.spec.ts` (mejora 2) y `tests/e2e/narracion-justa.spec.ts`
(mejora 5).

## Cómo se medirá con el panel del adulto (próximo paso)

El panel no se implementó en esta entrega. La propuesta:

- Contar en el navegador, por habilidad (*Encontrar información*, *Leer entre líneas*, *Descubrir
  la idea*, *Vocabulario en contexto*), las preguntas respondidas y las acertadas al primer intento.
  Sin nombres, sin respuestas elegidas y sin enviar nada al servidor.
- En **Acompañar**, una sección «Cómo va la comprensión» con el porcentaje de aciertos a la primera
  por habilidad, los cuentos leídos y una frase de orientación para el adulto. Sin notas, rankings
  ni comparaciones.
- «Borrar mi progreso» también borraría estos datos, y el texto de privacidad lo mencionaría.

Con eso, un piloto podría observar si el porcentaje de aciertos a la primera sube por habilidad a
lo largo de varias lecturas, y si las respuestas reveladas (G3) bajan con el tiempo. El apoyo
adulto eleva el uso de tutores de IA, pero no garantiza mejor logro lector [24]: por eso el panel
orienta la conversación y no reemplaza la evaluación.

## Próximos pasos

- **Panel de progreso para el adulto** (descrito arriba).
- **Mejoras 3, 4, 6 y 7 del documento de evidencia:** pendientes. Completar sus títulos y su
  evidencia desde el documento de evidencia del equipo.
- **Texto de privacidad:** la página aún dice que no se guarda nada en el navegador; Piero tiene
  una propuesta que menciona la experiencia de lectura (y, si se hace el panel, los contadores por
  habilidad).
- **Validar con estudiantes:** las garantías aseguran que la experiencia funciona como se diseñó;
  no miden aprendizaje.
