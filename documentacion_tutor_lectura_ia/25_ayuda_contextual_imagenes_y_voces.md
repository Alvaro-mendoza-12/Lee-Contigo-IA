# Ayuda contextual, imágenes y elección de voz

Fecha: 22 de octubre de 2026. Rama: `codex/requisitos-mvp`.

## Qué se incorpora

- Ayuda dentro del libro del catálogo y de los libros creados. Seleccionar una palabra o una frase corta muestra «Ayúdame con esta parte». «Ayuda con este párrafo» funciona sin seleccionar y permite usar teclado o pantalla táctil.
- Tres etapas: explicación sencilla con ejemplo y pregunta guiada; otra estrategia; una pista adicional para releer. No hay chat abierto, micrófono, respuesta libre ni evaluación automática del dominio de una habilidad. El niño expresa que necesita otra pista; no se interpreta su silencio como una respuesta incorrecta.
- Selector «¿Quién te lee?» con George, Sarah y Daniel de ElevenLabs. Cambiar de voz detiene el audio. La elección se recuerda en localStorage y cada voz tiene una entrada de audio distinta en caché. Los libros nuevos y los del catálogo usan el mismo componente. Si ElevenLabs falla, se informa y se intenta la voz española disponible en el dispositivo; esta alternativa no garantiza reproducir la voz elegida.
- Nueve variables de OpenRouter admitidas, sin publicar credenciales. Se mantiene el cambio de clave solo ante autenticación inválida o un límite específico de esa clave. Un 429 o un límite de cuenta no provoca rotación de claves.
- Seis composiciones de personajes y acciones para los cuentos creados, disponibles inmediatamente. La IA puede precisar el plan de escenas. Cloudflare, cuando está configurado y disponible, genera una imagen diferente por párrafo a partir del relato autorizado. Los párrafos que se reparten en varias hojas por el tamaño de letra mantienen su ilustración y cambian el encuadre; no se promete una generación nueva por cada cambio de tipografía.
- Las seis imágenes y el plan se conservan con el libro local durante siete días. No se requiere un segundo consentimiento para ilustrar después de la revisión adulta de la idea.

## Arquitectura y archivos

| Área | Archivos principales | Controles |
|---|---|---|
| Selección y ayuda | `components/reading-help.tsx`, `app/reading-help.css`, `lib/reading-help.ts`, `app/api/lectura/ayuda/route.ts` | Selección canónica de hasta 180 caracteres y 35 palabras, tres etapas, origen, tamaño de entrada, esquema estricto, comprobación de Unicode y salida validada. |
| Integración del lector | `components/reader.tsx`, `components/story-creator.tsx`, `components/book-spread.tsx` | Solo el texto visible o continuo del libro; las copias de animación son inertes. Diálogo nativo, Escape, retorno del foco y cancelación al cambiar página. |
| Voces | `lib/narration-voices.ts`, `components/voice-picker.tsx`, `components/use-narration.ts`, `app/api/narrar/route.ts` | Lista cerrada de tres voces; no se acepta un ID arbitrario del proveedor. Párrafos reconstruidos o firmados, ninguna clave en el cliente. |
| Ilustración | `lib/story-illustrations.ts`, `components/story-scene.tsx`, `components/generated-scene.tsx`, `lib/cloudflare-images.ts`, `app/api/crear/portada/route.ts` | Seis firmas válidas antes de llamadas de imagen; categorías visuales cerradas, descripción filtrada, modelo fijo, imágenes raster acotadas y respaldo vectorial. |
| Conservación local | `lib/book-shelf.ts`, `components/book-shelf.tsx` | Máximo seis libros, siete días, borrado individual o completo. Se conservan los registros anteriores. |
| Proveedores | `lib/structured-ai.ts`, `lib/openrouter.ts` | Señal de cancelación compartida, proveedores gratuitos de respaldo, exclusión solicitada de entrenamiento y desactivación del razonamiento extenso para respuestas breves. |

## Tiempos y límites

| Función | Proveedor | Cliente | Función Vercel |
|---|---|---|---|
| Ayuda contextual | 10,5 s en total entre proveedores | 13 s | 15 s |
| Pista de preguntas | 12,5 s | 14 s | Según ruta existente |
| Voz | 12 s | 14 s | 20 s |
| Plan e imágenes | Plan hasta 12,5 s; imágenes hasta 42 s adicionales | 65 s | 90 s |

El texto y las escenas vectoriales se muestran antes de terminar las imágenes. Un error no bloquea la lectura. Workers AI recibe dos solicitudes simultáneas como máximo, seis por libro, sin reintentos ni cambio a modelos de pago. Un error de cuota o permisos detiene las nuevas solicitudes pendientes; las imágenes ya obtenidas pueden conservarse junto con el respaldo de las restantes.

Cloudflare se llama por REST con `@cf/black-forest-labs/flux-1-schnell` y cuatro pasos. Cada imagen se valida y comprime a WebP de hasta 640 × 640 y 250 KB. El cuerpo de respuesta del proveedor se limita a 8 MB antes de interpretar JSON. No se aceptan imágenes remotas ni SVG suministrados como resultado de IA. El libro guarda como máximo seis cadenas de imagen de 350 KB cada una.

La ruta de ilustración limita dos preparaciones por conexión durante diez minutos y por instancia. No es una cuota global distribuida. No se activan planes de pago, recargas ni compras de crédito. Cloudflare documenta una asignación gratuita de 10.000 neuronas por día; la cuota y el plan efectivos se consultan en su cuenta.

## Privacidad

La selección por sí sola no llama a la IA. Al pedir ayuda se envía únicamente el pasaje autorizado, la parte difícil, el nivel y la etapa de apoyo. No se reciben opciones elegidas ni respuestas abiertas. Los libros creados necesitan la autorización HMAC del párrafo exacto, vigente durante siete días. Las claves se conservan exclusivamente en el servidor y los secretos de Vercel. En este corte la firma utiliza el secreto de ElevenLabs; rotarlo invalida autorizaciones anteriores y los libros conservan las alternativas del dispositivo y las ayudas preparadas.

La caché de ayuda del servidor conserva solo resultados del catálogo, hasta 60 entradas y diez minutos. Los libros creados no se cachean en esa ruta. Las ilustraciones generadas se conservan en el navegador, sin biblioteca pública ni perfil del niño. Los proveedores tienen sus propias condiciones de procesamiento y retención; no se ofrece una garantía general de retención cero.

## Criterios de aceptación

1. Una selección válida abre explicación, ejemplo y reflexión sin salir del libro.
2. Se puede pedir ayuda del párrafo completo sin seleccionar texto.
3. Cada nueva etapa ofrece una estrategia distinta; no muestra automáticamente una opción correcta del cuestionario.
4. Un fallo del proveedor se anuncia como «Ayuda preparada» y permite continuar.
5. Se puede elegir una de las tres voces y escucharla. Cambiar voz, página o nivel detiene la narración anterior; volver al mismo texto y voz reutiliza audio de sesión.
6. El libro comienza con ilustración de respaldo; las imágenes disponibles se sustituyen al terminar y se conservan al recargar.
7. El lector, la selección, el diálogo y los controles funcionan en escritorio y en la emulación móvil sin desbordamiento horizontal.
8. Orígenes ajenos, firmas falsas, rangos inexistentes, texto abierto y voces no permitidas son rechazados antes de consumir IA.

## Comprobaciones de este corte

- 28 pruebas unitarias: catálogo, firmas, rangos, Unicode, esquemas, etapas, voces, cuotas y generación de seis imágenes con proveedor simulado.
- Compilación de producción y TypeScript aprobados.
- Se detectó y corrigió un desbordamiento de la barra de voz en móvil. Suite completa aprobada: 42/42 recorridos en escritorio y móvil, con selección, foco, axe, narración, guardado de imágenes y compatibilidad con libros anteriores.
- ElevenLabs real: George ya comprobado en producción; Sarah y Daniel respondieron HTTP 200 con audio MPEG en español mediante frases de prueba breves, 25.538 y 26.374 bytes respectivamente. Las pruebas de interfaz usan WAV sintético para no consumir créditos.
- OpenRouter real: las cinco claves nuevas son reconocidas. Durante la comprobación de ayuda el proveedor devolvió 429; se conserva la ayuda preparada. Las pruebas simuladas no acreditan disponibilidad permanente de IA.
- Cloudflare: token activo y cuenta configurada en los tres entornos de Vercel. Generación real de FLUX.1 schnell: HTTP 200, 687.806 bytes, 9.366 ms. Se revisó visualmente la imagen: personajes y mapa visibles. El procesado elimina el margen inferior antes de comprimir, porque el modelo puede inventar firmas incluso cuando se prohíben en el prompt.

Estas comprobaciones no sustituyen una prueba con niños, una revisión docente, pruebas de selección táctil en equipos iOS/Android reales ni una evaluación de eficacia pedagógica.

## Demostración sugerida al jurado

1. Abrir «Una luz en el bosque» en Un nuevo reto.
2. Leer «diminuta» y expresar que no se comprende; seleccionarla y pedir ayuda.
3. Mostrar explicación contextual, ejemplo distinto y pregunta de reflexión. Comprobar si el origen visible es IA o respaldo.
4. Pedir otra pista, releer la frase y explicar con palabras propias lo que significa. No presentar este gesto como dominio medido.
5. Elegir Sarah o Daniel y escuchar el pasaje.
6. Mostrar la ayuda del párrafo sin selección en móvil.
7. Crear un cuento con personajes ficticios; avanzar por escenas y recargar para abrir el libro temporal.

## Fuentes técnicas

- https://developers.cloudflare.com/workers-ai/models/flux-1-schnell/
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers-ai/platform/data-usage/
- https://elevenlabs.io/docs/api-reference/text-to-speech/convert
- https://openrouter.ai/docs/guides/best-practices/reasoning-tokens

Las heurísticas y la auditoría pedagógica previa se documentan en 19, 20, 23 y 24; este documento registra los cambios ejecutados y sus límites.
