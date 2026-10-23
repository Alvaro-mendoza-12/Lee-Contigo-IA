# Diagnóstico técnico y pedagógico de LeeContigo IA

**Alcance:** revisión del código actual y del documento compartido en Drive para el desafío 5 de futurX 2026. El público de esta revisión son estudiantes de 8 a 10 años. Este documento es una auditoría y propuesta; excepto por la preferencia de animación ya solicitada, no implementa las mejoras descritas aquí.

## Resumen

La aplicación ya ofrece cuentos generados con IA, dos niveles de lectura, ilustraciones, lectura en voz alta del navegador, preguntas de comprensión y pistas. La biblioteca y las pistas permiten una demostración funcional del acompañamiento, pero hoy la ayuda se concentra en preguntas preparadas: el niño no puede pedir una explicación sobre la palabra o el párrafo que le cuesta.

La prioridad técnica es alinear el límite de espera del navegador con el del servidor y mejorar la observabilidad de los proveedores. La prioridad pedagógica es añadir una ayuda contextual acotada al texto canónico, accesible con selección o con un botón de ayuda para el párrafo, seguida de una reflexión y pistas progresivas. La app debe presentar las habilidades como practicadas, no como dominadas.

La lectura de voz actual usa `SpeechSynthesisUtterance` del navegador. ElevenLabs puede ofrecer una narración más natural, pero requiere una clave de API propia, guardada en el servidor, y sus condiciones gratuitas no incluyen uso comercial.

## Contraste con el documento de mejoras

| Requisito del documento | Estado observado | Recomendación |
|---|---|---|
| Biblioteca visual y selección de cuentos | Existe en `/biblioteca`; el catálogo integrado contiene cuatro cuentos. | Conservar el catálogo. Llegar a diez títulos solo con cuentos revisados, preguntas y pistas coherentes; no rellenar con material sin control pedagógico. |
| Configuración anónima de tema, región y edad | El creador pide una idea, un nivel y confirmación adulta; no necesita perfil. | Ofrecer tema y contexto narrativo opcionales. No pedir ubicación real ni edad exacta; usar el nivel lector seleccionado. |
| Cuento adaptado por IA | Existe el generador estructurado, con validación de entrada y salida y límites de generación. | Mantener la arquitectura y revisar que cada nivel cambie vocabulario y longitud de forma verificable. |
| Lectura en voz alta | Existe mediante la síntesis de voz del sistema operativo/navegador. | Probar disponibilidad, acento español, velocidad, pausa y cancelación en móviles. Considerar proveedor externo opcional solo después de verificar coste, licencia y privacidad. |
| Tres preguntas oralmente transcritas y evaluadas | Actualmente hay preguntas de opción múltiple; no se encontró captura/transcripción de voz del estudiante. | Dejar la entrada por voz para una etapa posterior. Agrega tratamiento de audio infantil y nuevos errores de reconocimiento; no es necesaria para demostrar ayuda contextual. |
| Pistas graduales | Existen pistas de exploración y de reintento; algunas se generan al pedirlas y hay alternativas preparadas. | Reforzar la progresión con una estrategia distinta en cada nivel y retirar la revelación automática tras tres errores repetidos. |
| Cierre con medallas y consejos para padres | Hay una pantalla de cierre, pero el indicador de habilidades puede parecer un logro/mastery por completar preguntas. | Mostrar “Hoy practicaste…” con acciones observables (consultó una palabra, pidió una pista, respondió sin pista). Evitar medallas que sugieran dominio. Añadir consejo breve opcional para adulto. |
| Experiencia simple, directa y móvil | Diseño visual de libro y navegación por cuentos existen; en pantallas estrechas hay controles y pistas que quedan debajo del primer pliegue. | Mantener una acción principal, mejorar accesos a biblioteca/práctica y llevar controles de ayuda al contexto de lectura. Medir y corregir los recorridos móviles. |
| Fallo claro mediante audio y color | La práctica muestra estados de respuesta y retroalimentación; la voz se limita al lector. | Explicar el error con texto accesible y una pista; no usar color o sonido como único indicador. Sonido de error opcional, nunca automático. |
| Respaldo local | Hay preguntas/pistas preparadas cuando la generación no está disponible. | Mantenerlo y hacer visible “pista preparada” frente a “pista con IA”. Nunca etiquetar una respuesta de respaldo como generación en vivo. |

### Decisiones para que el alcance siga siendo viable

- El documento propone personalización por región. En esta demo conviene escoger un tema (animales, aventura, naturaleza) y evitar una ubicación identificable. Si se necesita contexto cultural, usar una selección amplia y opcional, sin almacenarla.
- El requisito de menos de ocho segundos debe medirse como tiempo de interfaz hasta una ayuda útil, no solo como latencia del modelo. La respuesta preparada permite acompañar al niño si la llamada excede el límite.
- La meta de costo menor a USD 0.02 por sesión es una hipótesis del documento, no un costo comprobado. Faltan mediciones de caracteres por cuento, llamadas por sesión, cache, proveedores y uso mensual. Antes de afirmar esa cifra, instrumentar estos contadores sin registrar texto infantil y calcularla con tarifas vigentes.
- Las diez historias son un requisito de amplitud de catálogo, no una función pedagógica por sí sola. Cada historia debe tener nivel revisado, preguntas, evidencias textuales, pistas y una ilustración legible en móvil.

## Hallazgos priorizados

### P0 — Esperas del tutor y disponibilidad real

**Evidencia en código:** `components/practice.tsx` aborta la petición del navegador a los 9 s; `app/api/tutor/route.ts` permite 12,5 s para el proveedor y declara 15 s de duración máxima. El cliente puede cancelar antes de que la ruta termine, aunque el proveedor aún tenga tiempo para responder. La ruta no pasa explícitamente `request.signal` a la operación de generación.

**Evidencia de producción (22 de octubre de 2026, hora de Bogotá):** una pista real llegó en 1,755 ms desde la llamada del navegador. Otra petición real de servidor duró 10,956 ms y terminó con una pista preparada. El registro de esa ejecución confirma intento con Gateway y posterior intento con OpenRouter, pero no expone estado/categoría de error de OpenRouter. En una simulación controlada, retrasé una respuesta válida etiquetada como IA a 10 s y el cliente ya mostró la pista preparada a los 9,515 ms; esa fue una simulación, no una medición del proveedor.

**Prueba adicional:** una llamada directa a OpenRouter con una clave configurada recibió HTTP 200 del proveedor (modelo efectivo `xingchen-agi/xing4.0-29b-a4b:free`, 3,878 ms), pero la salida no superó la validación de esquema y se rechazó. Esto demuestra conectividad/autenticación en esa prueba, no que todas las salidas sean utilizables. La petición directa no fue idéntica a la petición de producción.

**Recomendación:** definir presupuestos compartidos y ordenados: proveedor < generación de ruta < cliente con margen de red < máximo de función. Propagar cancelación cuando el runtime permita detectar la desconexión. Mostrar respuesta preparada y permitir continuar leyendo. Registrar proveedor, modelo efectivo, duración, tipo/categoría de error y cache-hit con identificador de correlación; nunca registrar claves, texto seleccionado, respuestas ni prompts.

**Archivos candidatos:** `components/practice.tsx`, `app/api/tutor/route.ts`, `lib/structured-ai.ts`, `lib/openrouter.ts`, `lib/ai-diagnostics.ts`, pruebas asociadas.

### P1 — Ayuda contextual dentro del lector

**Estado:** no hay interacción para seleccionar una palabra/frase y pedir explicación contextual; tampoco un control accesible para pedir ayuda sobre el párrafo entero.

**Recomendación:** incorporar en el lector un panel cerrado y bajo demanda. Al seleccionar una parte, mostrar “Ayúdame con esta parte”; siempre ofrecer “Ayuda con este párrafo” para móvil, teclado o selección difícil. El servidor reconstruye el fragmento desde el cuento canónico, no acepta una pregunta libre. Devuelve una explicación corta, un ejemplo claramente separado del relato y una pregunta de reflexión. Si la respuesta del niño indica que sigue con dudas, ofrecer una segunda estrategia o pista. No abrir chat libre ni revelar automáticamente la respuesta tras repetir errores.

**Archivos candidatos:** `components/reader.tsx`, nuevo `components/reading-help.tsx`, nueva ruta `app/api/lectura/ayuda/route.ts`, nuevo `lib/reading-help.ts`, y pruebas unitarias/E2E. Reutilizar validaciones y funciones de proveedor actuales sin cambiar el contrato `/api/tutor`.

### P1 — Progreso que no atribuya dominio

**Evidencia:** `components/practice.tsx` suma intentos por pregunta; `components/story-creator.tsx` revela respuesta tras tres errores. El resumen usa iconografía de logro asociada a preguntas completadas, sin distinguir respuesta autónoma, respuesta con pista o respuesta revelada.

**Recomendación:** registrar solo eventos mínimos en estado temporal de la sesión y mostrar “Habilidades que practicaste”: vocabulario consultado, búsqueda de pistas, inferencia practicada. Distinguir “respondió sin pista”, “respondió con apoyo” y “sigue practicando”; no inferir comprensión de una respuesta abierta marcada por el niño como “ya lo pensé”. No guardar estas métricas en el perfil, en la nube ni en el almacenamiento persistente de libros.

**Archivos candidatos:** `components/practice.tsx`, `components/story-creator.tsx`, `lib/reading.ts` y un estado de sesión local y efímero.

### P2 — Catálogo, móvil, lector de voz y feedback

- **Catálogo:** se observan cuatro cuentos integrados, debajo del mínimo de diez que propone el documento. Añadir seis solo tras revisión editorial de texto, preguntas, evidencia, nivel y pistas.
- **Móvil:** el libro y los botones ocupan más de una pantalla en anchuras pequeñas; la ayuda se encuentra lejos del pasaje que la necesita. La solución contextual debe aparecer junto al lector en escritorio y como hoja/panel accesible en móvil, manteniendo el pasaje visible y el foco controlado.
- **Voz:** `reader.tsx` y `story-creator.tsx` usan `window.speechSynthesis`; `onerror` puede dejar el control sin explicación. Añadir estado accesible y una alternativa silenciosa. La síntesis es distinta de transcribir la voz del niño.
- **Feedback de error:** texto claro con icono/estado accesible; color y sonidos como apoyo opcional. No avergonzar al estudiante ni indicar la respuesta solo con rojo/verde.

**Archivos candidatos:** `components/reader.tsx`, `components/story-creator.tsx`, `components/book-shelf.tsx`, `app/globals.css`, `components/practice.tsx` y páginas de catálogo.

## Diez heurísticas de Nielsen aplicadas al tutor

| Heurística | Evaluación actual | Mejora prioritaria |
|---|---|---|
| 1. Visibilidad del estado | La práctica distingue pista IA/preparada; la disponibilidad global y las esperas no muestran con precisión el proveedor ni el estado. | Mostrar “Buscando una pista”, “Pista lista” o alternativa preparada; no prometer IA disponible solo por tener una clave. |
| 2. Correspondencia con el mundo real | “Paso a paso”, “nuevo reto” y preguntas son comprensibles, pero falta lenguaje directo para pedir ayuda en una palabra o párrafo. | Usar instrucciones cortas, ejemplos concretos y vocabulario apropiado para 8–10 años. |
| 3. Control y libertad | Puede navegar el libro y pedir pista; la revelación automática tras tres intentos reduce control pedagógico. | Permitir detener voz, cerrar ayuda y volver al mismo punto; evitar revelar automáticamente la solución. |
| 4. Consistencia y estándares | El flujo de práctica de biblioteca y el de cuento creado no son idénticos; estados y navegación difieren. | Compartir patrón visual y de estados sin reconstruir el lector ni romper funcionalidades actuales. |
| 5. Prevención de errores | Validación estructurada y solicitudes cerradas limitan entradas; repetir el mismo clic puede contarse como nuevos errores. | Contar nuevos intentos de respuesta, no dobles clics; limitar longitud y rango de selección en servidor. |
| 6. Reconocimiento en vez de recuerdo | El cuento está presente y hay pistas, pero la ayuda contextual aún no se ancla visualmente al texto. | Mostrar palabra/frase/párrafo consultado y mantenerlo visible mientras llega la explicación. |
| 7. Flexibilidad y eficiencia | Hay dos niveles y voz opcional; no existe ruta sencilla de ayuda para párrafo completo o teclado. | Dar selección, botón de párrafo, teclado/touch y opción de lectura en voz. |
| 8. Diseño estético y minimalista | Identidad visual de libro, ilustraciones y controles están; algunas pantallas móviles son largas. | Panel de ayuda bajo demanda, menos texto periférico y una acción principal por paso. |
| 9. Ayudar a reconocer, diagnosticar y recuperarse de errores | Hay respaldo preparado, pero el tiempo agotado puede sentirse como fallo sin causa clara. | Comunicar que el cuento sigue disponible, ofrecer pista preparada/reintento y no bloquear la lectura. |
| 10. Ayuda y documentación | Ya hay guía y privacidad; falta orientación inmediata durante una palabra o idea difícil. | Añadir ayuda breve situada y una pregunta guiada, sin manual largo ni chat libre. |

## Privacidad y seguridad infantil

- No pedir nombre, correo, teléfono, colegio, dirección ni ubicación precisa del niño.
- No recoger audio del estudiante en esta etapa. La narración TTS envía texto del cuento al proveedor de voz; enviar solo el pasaje necesario, nunca respuestas o identificadores.
- Mantener las claves de proveedor en variables secretas del servidor (por ejemplo, Vercel), nunca en el navegador ni en Git.
- Limitar peticiones, tamaño de selección, tiempo y gasto; tener una alternativa preparada para error/rate limit.
- La voz del navegador no requiere mandar el cuento a un proveedor remoto. ElevenLabs ofrece TTS en español, pero exige clave propia; el plan gratuito tiene uso no comercial y requiere atribución al publicar audio. Para una plataforma que pueda monetizarse, verificar licencia comercial vigente antes de usar sus salidas en producción. Fuentes: [TTS de ElevenLabs](https://elevenlabs.io/docs/es/overview/capabilities/text-to-speech), [condiciones del plan gratuito](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform).
- La selección de fragmento debe validarse contra el texto canónico por índices, con límites, normalización Unicode y sin aceptar prompts arbitrarios.
- No persistir eventos de sesión; las métricas describen acciones de esta lectura, no un diagnóstico ni un nivel de dominio.

## Criterios de aceptación para cambios futuros

1. Ayuda contextual funciona por selección y por botón “Ayuda con este párrafo”; al usar teclado o 320 px no depende de arrastrar texto.
2. La API acepta únicamente historia, nivel, versión, párrafo, rango canónico y etapa permitida. Rechaza texto, nombre, respuesta libre, prompt extra, índices fuera de rango y cuentos desconocidos.
3. La explicación responde al contexto, incluye ejemplo identificado como ejemplo y pregunta guiada; cita un fragmento exacto del relato cuando corresponda.
4. Un segundo pedido de ayuda ofrece una estrategia progresiva y no da la respuesta completa solo por acumular errores. La explicación final queda a elección pedagógica explícita.
5. Fallos de IA, respuesta inválida, 401/402/403/429/500, timeout, offline y cancelación llevan a un estado comprensible y a pista preparada cuando existe.
6. Los tiempos quedan ordenados: el límite proveedor/cascada termina antes de la ruta; cliente espera más que el servidor con margen, y el máximo de función queda por encima. El niño puede cancelar o seguir leyendo.
7. El resumen de sesión distingue consultó, intentó, respondió con apoyo y respondió sin pista. Completar el cuestionario no muestra “dominio” ni medalla de aprendizaje garantizado.
8. Recargar o cambiar cuento borra resumen y datos de la sesión; no se envían datos personales ni se guardan fragmentos/respuestas.
9. Lector de voz detiene/continúa en la página actual, expone errores y mantiene una alternativa accesible. La opción ElevenLabs requiere límite de caracteres/uso y clave solo en servidor.
10. Biblioteca alcanza diez cuentos solo cuando cada nuevo elemento tiene revisión de nivel, lectura, comprensión, pistas y legibilidad móvil.

## Pruebas necesarias cuando se autoricen cambios

- **Unitarias:** esquema Zod, reconstrucción de fragmentos Unicode, límites de palabras/caracteres, selección del párrafo, niveles/etapas, filtros anti-revelación, resumen de acciones observables y borrado de estado.
- **API:** historias/versión/índices inválidos, exceso de longitud, input con campos abiertos, salida fuera de esquema, quote que no existe, contexto correcto, hit de caché y deduplicación concurrente.
- **Resiliencia:** gateway lento, OpenRouter lento, 401, 402, 403, 429 con Retry-After, 5xx, offline, cancelación/navegación, JSON inválido y retraso simulado por encima del timeout. Separar simulaciones de pruebas de inferencia real.
- **E2E con Playwright:** crear/abrir cuento, seleccionar palabra, pedir ayuda, solicitar ayuda del párrafo sin selección, seguir pista progresiva, continuar pregunta, lector de voz, cerrar panel y conservar posición.
- **Accesibilidad:** teclado y lector de pantalla, foco al abrir/cerrar, `aria-live` de estados, zoom 200–400%, móvil de 320–390 px, targets táctiles y `prefers-reduced-motion`; axe automatizado como señal, no certificación.
- **Integración IA real:** una solicitud controlada con contenido editorial fijo, créditos limitados, sin texto infantil, validación del proveedor efectivo y reporte sin claves/prompts. Mantener pruebas simuladas para CI; HTTP 200 por sí solo no demuestra inferencia válida.
- **Voz ElevenLabs:** si se agrega, prueba de API con audio corto de cuento editorial, límite de caracteres/coste, voz/acento español, detener/reanudar, fallback de síntesis del navegador y ausencia de clave en bundles/logs.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Una pista parece correcta pero revela la respuesta parafraseada. | Revisión pedagógica de ejemplos; no confiar solo en filtros léxicos; prueba de fuga semántica con preguntas conocidas. |
| El texto generado por niño incluye datos personales. | Recordatorio antes de enviar; filtros existentes; ofrecer solo tema/idea y no pedir identificadores; evitar registrar contenido. |
| Tiempos de IA superan el foco del niño o la ruta se cancela temprano. | Presupuestos alineados, estado inmediato, lectura continúa y fallback útil. |
| Cuatro proveedores/keys no multiplican cuota y pueden agotar la cuenta compartida. | Un presupuesto global y límites por dispositivo/ventana; no tratar la rotación como capacidad extra. |
| Modelo/modelo gratuito produce JSON inválido o no elegible. | Validación estricta, fallback editorial seguro y telemetría con proveedor/categoría, sin datos de niño. |
| TTS externo suma gasto o restricciones de licencia. | TTS del navegador como fallback; cuota y caché; usar ElevenLabs en demo solo dentro de sus condiciones y con atribución; licencia comercial para monetizar. |
| Las estrellas se interpretan como diagnóstico o dominio. | Presentar práctica observable, no rangos ni premios por acierto; explicar el progreso al adulto sin perfilado. |
| Agregar diez cuentos sin revisar aumenta errores pedagógicos. | Gate editorial por cuento; no cumplir cantidad a costa de calidad. |

## Recorrido recomendado para la demostración

1. Abrir un cuento y elegir un nivel lector, sin crear cuenta.
2. Encontrar una palabra que dificulta comprender la escena; seleccionarla y pulsar “Ayúdame con esta parte”.
3. Ver una explicación breve, un ejemplo separado del cuento y una pregunta que invita a observar una pista.
4. Si el niño sigue confundido, pedir otra ayuda y recibir una pista diferente, no la solución completa.
5. Activar ayuda para el párrafo completo como alternativa accesible; volver al mismo lugar del libro.
6. Contestar una pregunta usando la pista textual y recibir retroalimentación clara.
7. Cerrar con “Hoy practicaste vocabulario y búsqueda de pistas”, dejando claro que es registro de esta sesión, no prueba de dominio.

Hasta que se implemente la ayuda contextual, presentar los pasos 2–5 como propuesta, no como función operativa. La voz de ElevenLabs es una mejora de narración y no sustituye el acompañamiento de comprensión.

## Fuentes de diseño y pedagogía

- [10 heurísticas de usabilidad de Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Guía del What Works Clearinghouse sobre comprensión lectora](https://ies.ed.gov/ncee/wwc/PracticeGuide/14/Published)
- [WCAG 2.2: contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 2.2: tamaño de objetivos táctiles](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Vercel AI Gateway: autenticación](https://vercel.com/docs/ai-gateway/authentication-and-byok)
- [OpenRouter: límites de cuenta/API](https://openrouter.ai/docs/api_reference/limits)
- [OpenRouter: salidas estructuradas](https://openrouter.ai/docs/guides/features/structured-outputs)
