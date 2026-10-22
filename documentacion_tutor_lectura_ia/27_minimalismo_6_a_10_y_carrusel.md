# Menos texto, biblioteca por categorías y lectura táctil

Fecha: 22 de octubre de 2026. Rama: `codex/requisitos-mvp`.

## Objetivo y alcance

Simplificar la interfaz para niños de aproximadamente 6 a 10 años, sin recortar los cuentos ni eliminar el acompañamiento pedagógico. Los niveles dependen de la habilidad lectora, no de la edad declarada. No se añade registro, edad, perfil ni información personal.

Se aplicaron las skills `frontend-design`, `web-design-guidelines` y `vercel-react-best-practices`. Se conserva Next.js, React, el catálogo editorial, el generador de libros, la ayuda contextual cerrada, las pistas, las voces y el guardado temporal.

## Cambios visibles

- Inicio: «¿Leemos un cuento?», una acción principal de lectura y dos destinos con iconos. Se eliminaron lemas, etiquetas y notas flotantes repetidas.
- Menú móvil: una sola fila de 72 px, con marca, iconos y nombres visibles «Cuentos» y «Crear». El destino actual conserva su resaltado y `aria-current`. Los iconos no reemplazan las etiquetas.
- Biblioteca: diez cuentos únicos, agrupados en **Amigos** (3), **Naturaleza** (3) y **Descubrimientos** (4). Filas horizontales con ajuste de tarjetas, una portada parcialmente visible para indicar continuidad y desplazamiento nativo con el dedo. Hay flechas de 44 px cuando la fila desborda, límites desactivados y acceso por teclado. Las filas no avanzan automáticamente.
- Lector: «Escuchar», «Ampliar» y «No entendí» siguen visibles. Voces, animación y texto completo están en «Ajustes». Se conservan once tamaños de letra y dos niveles. El último paso invita a «Vamos a pensar».
- Ayuda: seleccionar texto mantiene la explicación, ejemplo y reflexión con tres etapas. «No entendí» ayuda con el párrafo completo. El párrafo original se puede consultar en «Ver el texto», evitando duplicarlo al abrir la ayuda.
- Creación: instrucciones breves y opciones secundarias bajo demanda; se mantienen revisión adulta, prevención de datos personales, ilustraciones y seis libros locales durante siete días.
- Práctica: se quitaron instrucciones redundantes y etiquetas técnicas de habilidad antes de responder. Las habilidades practicadas continúan en el resultado, sin afirmar dominio. Se conservan el aviso de error, audio, reintento, evidencia y pistas; los detalles sobre el origen y la revisión de una pista se despliegan en «Sobre esta pista».
- Familias y privacidad siguen accesibles desde el pie.

## Portadas cada dos segundos

El intervalo es de **2.000 ms**, con una transición de **850 ms**: la portada delantera se aparta y pasa atrás mientras avanza la siguiente. Se conservan los puntos, flechas y pausa.

La rotación se suspende al ocultar la pestaña, salir de pantalla o situar el ratón encima. Navegar con teclado o elegir una portada la pausa hasta pulsar «Animar». Los toques no se interpretan como un hover permanente. Las diapositivas posteriores son inertes y no reciben foco.

Con `prefers-reduced-motion: reduce`, las portadas cambian sin animación. Pulsar «Animar» permite activar expresamente la transición. El lector conserva «Animar páginas» activado inicialmente, como solicitó el usuario, y permite desactivarlo en Ajustes.

## Tablet y gestos

En tablet horizontal, el libro mantiene dos caras, pliegue central y texto e imagen alternados. Entre 700 y 1.200 px en horizontal, la altura se adapta al espacio disponible. La orientación responde al giro del dispositivo; no se bloquea ni se fuerza la pantalla.

Deslizar horizontalmente **sobre la ilustración** pasa hojas hacia delante o atrás, tanto en cuentos editoriales como en libros creados. Se exige un desplazamiento de al menos 60 px, predominantemente horizontal y menor de 1,6 segundos. Los límites del libro siguen bajo el control de cada lector.

El texto queda disponible para seleccionar palabras y solicitar ayuda. No se intercepta su gesto de selección. La ilustración admite desplazamiento vertical y zoom con dos dedos; los eventos cancelados no cambian página. Se conservan botones y flechas del teclado como alternativas al gesto.

## Medición del texto periférico

Comparación en Chrome, antes en producción y después con la compilación local. Se contaron palabras visibles en `main`, excluyendo el relato, las opciones de respuesta, el enunciado de la pregunta, contenido cerrado, elementos ocultos y diapositivas posteriores. El pie y el menú no forman parte de este conteo.

| Pantalla   | Antes móvil, 390 px | Después móvil | Antes escritorio, 1.440 px | Después escritorio |
| ---------- | ------------------: | ------------: | -------------------------: | -----------------: |
| Inicio     |                  45 |            17 |                         52 |                 17 |
| Biblioteca |                 116 |            64 |                        153 |                 64 |
| Crear      |                  87 |            46 |                         87 |                 46 |
| Lector     |                  61 |            34 |                         68 |                 34 |
| Preguntas  |                  44 |            28 |                         54 |                 28 |

El conteo de biblioteca incluye las diez tarjetas existentes aunque algunas requieran desplazamiento horizontal. Esta medición describe reducción de texto, no demuestra facilidad de uso ni mejora de comprensión. Las capturas y los resultados locales están en `output/minimalismo/`, ignorado por Git. No se observó desbordamiento horizontal del documento en las diez capturas.

## Aplicación de las diez heurísticas de Nielsen

| Heurística                      | Aplicación                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1. Estado visible               | Destino resaltado, número de página, carga de voz/IA y progreso de preguntas.                              |
| 2. Lenguaje familiar            | Cuentos, crear, amigos, naturaleza y la metáfora del libro abierto.                                        |
| 3. Control y libertad           | Pausar portadas, volver, desactivar animación, detener voz y cerrar ayuda.                                 |
| 4. Consistencia                 | Mismos controles y gestos en libros editoriales y creados; ajustes compartidos.                            |
| 5. Prevención de errores        | Flechas de categoría desactivadas en límites; gesto con umbral; revisión adulta y validaciones existentes. |
| 6. Reconocer antes que recordar | Portadas, categorías, iconos acompañados de palabras y una tarjeta parcialmente visible.                   |
| 7. Flexibilidad                 | Dedo, ratón, teclado y botones; voz, tamaños y orientación libre.                                          |
| 8. Diseño minimalista           | Menos lemas y duplicación, menú de una fila, opciones secundarias bajo demanda.                            |
| 9. Recuperación                 | Error claro, reintento y pistas graduadas; el cuento permanece disponible ante fallos de IA.               |
| 10. Ayuda                       | «No entendí», selección contextual, ejemplo, reflexión y pistas adicionales sin chat abierto.              |

## Archivos principales

- `app/page.tsx`, `components/story-showcase.tsx`: inicio y portadas.
- `components/library.tsx`, `components/story-shelf-row.tsx`: categorías y desplazamiento accesible.
- `components/book-spread.tsx`: gestos compartidos del libro.
- `components/reading-settings.tsx`, `components/reader.tsx`, `components/story-creator.tsx`: controles secundarios compartidos.
- `components/reading-help.tsx`, `components/reading-pause.tsx`, `components/practice.tsx`: acompañamiento y textos breves.
- `components/primary-navigation.tsx`, `components/shell.tsx`, `components/journey.tsx`: navegación y ubicación.
- `app/child-minimal.css`, `app/layout.tsx`: composición móvil, tablet y estilos.
- `tests/e2e/mobile-library.spec.ts`, `tests/e2e/showcase.spec.ts` y pruebas existentes actualizadas.

## Verificación

- Compilación de producción: correcta.
- TypeScript: sin errores.
- Pruebas unitarias: **30/30**.
- Playwright: **52/52**, proyectos de escritorio y móvil.
- Reloj controlado: la portada sigue igual tras 1.999 ms y cambia al sumar 1 ms; se verifican ambas animaciones y la pausa durante 15 segundos.
- Movimiento reducido: cambio sin animación y activación explícita mediante «Animar».
- Gestos: eventos táctiles de Chrome para las filas y para el libro; navegación hacia ambos lados, selección de texto conservada y arrastre de una ilustración en un libro creado.
- Menú sin desbordar a 320 px; tablet comprobada al cambiar de 768×1.024 a 1.024×768, conservando el tamaño de letra.
- En tablet se observaron caras de 478 px en un libro de 956 px y texto visible sin desbordamiento en la muestra de 28 px.
- Comprobaciones automáticas de accesibilidad con axe para WCAG A/AA, incluidos catálogo, lector, ayuda, práctica y creación; sin incidencias en las pantallas probadas.

Son pruebas automatizadas y emulación en Chrome, no pruebas con teléfonos/tablets físicos ni estudios con niños. La accesibilidad automática no sustituye la evaluación manual con tecnologías de asistencia. La integración de IA no cambió en este bloque: creación, audio y ayudas usan los proveedores y las validaciones existentes; las rutas se cubren con respuestas controladas y pruebas de rechazo. No se afirma una nueva validación pedagógica o de eficacia educativa.

## Fuentes consultadas

- [NN/g: Designing for Kids — Cognitive Considerations](https://www.nngroup.com/articles/kids-cognition/): lenguaje concreto, instrucciones adaptadas y diferencias entre edades.
- [W3C: Use Icons that Help the User](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p07-icons-used/): símbolos familiares junto a sus etiquetas, sin saturación.
- [W3C: Carousels Tutorial](https://www.w3.org/WAI/tutorials/carousels/): estructura semántica, teclado y control de reproducción.
- [MDN: CSS scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap): ajuste nativo de tarjetas al desplazarse.
- [MDN: Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events): gestos, captura, cancelación y convivencia con el desplazamiento del navegador.
- [Vercel: Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines): etiquetas, foco, movimiento y objetivos táctiles.
