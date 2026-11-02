# LeeContigo IA

Tutor web de comprensión lectora con una interfaz orientada a niños de aproximadamente 6 a 10 años y niveles según su habilidad lectora. MVP del desafío de lectura de la Hackathon futurX 2026. Requiere acompañamiento adulto y validación pedagógica con usuarios reales.

- **Web:** https://lee-contigo-ia.vercel.app
- **Repositorio:** https://github.com/Alvaro-mendoza-12/Lee-Contigo-IA
- **Carpeta local:** `D:\LeeContigo IA`

## Qué incluye

**Inicio infantil:** tres destinos con iconos —Cuentos, Crear y Acompañar— y estanterías de Amigos, Naturaleza y Aventuras. Si hay una lectura pendiente, el primer destino ofrece «Seguir leyendo» sin añadir otro botón. Se conservan los colores, las ilustraciones y el acceso al catálogo completo. Los documentos anteriores sobre portadas y carruseles describen etapas previas del diseño.

**Lector rediseñado:** libro abierto a todo el ancho, pliegue y hojas con volumen, giro de 180 grados, texto e ilustración que alternan de lado y ocho escenas interiores en los cuatro cuentos iniciales y cuatro escenas en cada cuento nuevo. En teléfonos se usa una hoja vertical legible. Los controles se simplificaron y la caja permanece estable al avanzar. Ver `documentacion_tutor_lectura_ia/18_lector_editorial_y_validacion.md`.

Diecinueve relatos originales, cada uno adaptado editorialmente a dos niveles: **Paso a paso** y **Un nuevo reto**. Cada escena se conserva en una página que crece con su texto, con letra de 18, 22 o 26 px, voz opcional y acceso al texto continuo. El giro respeta inicialmente el movimiento reducido del dispositivo y recuerda la elección expresa de Ajustes. Las ilustraciones del lector permanecen quietas.

La biblioteca se organiza en filas horizontales de **Amigos**, **Naturaleza** y **Aventuras**, con cubiertas de lomo y fondos suaves. Se navegan con el dedo, flechas y teclado. Seleccionar **Un nuevo reto** muestra una confirmación y marca las portadas; al abrir una se lee su versión de reto y se practican sus preguntas. El menú móvil reúne iconos y nombres en una sola fila. En tablet horizontal, el libro muestra dos caras; deslizar la ilustración pasa hojas sin interceptar la selección del texto. El mismo gesto funciona en los libros creados.

Una luciérnaga lectora original acompaña el inicio y el creador. Dentro de **Necesito una idea**, tres opciones ilustradas completan el campo sin enviar ni crear automáticamente. Ver `documentacion_tutor_lectura_ia/28_mejoras_visuales_y_reto_visible.md`.

En **Para acompañar**, una persona adulta puede elegir cuento, nivel y objetivo de conversación; la guía propone preguntas para antes, durante y al terminar. Esas opciones continúan en la lectura. El estudiante explora tres preguntas. El tutor genera una acción de lectura y una pregunta de reflexión, adaptadas a la habilidad, el nivel y el momento de apoyo, sin enviar la respuesta elegida ni las opciones al modelo. Cada pista permite consultar la evidencia del texto. Si se agota el apoyo, se muestra la respuesta con su explicación y evidencia para poder continuar, sin XP en esa pregunta. Al terminar, «Cuéntalo a tu manera» invita opcionalmente a explicar o dibujar lo leído, sin recoger respuestas nuevas.

En **Crea tu cuento**, el niño propone una idea breve y elige un nivel. Una persona adulta debe revisar la idea. Con AI Gateway y respaldo gratuito de OpenRouter, genera un relato de seis párrafos con tres preguntas: localizar información, inferir e identificar la idea principal. Cada pregunta incluye dos pistas graduales y una cita literal verificada contra el párrafo señalado. Las respuestas e intentos quedan en memoria. El libro incorpora escenas vectoriales; con Cloudflare configurado puede generar seis imágenes mientras el niño sigue leyendo. Los libros, sus ilustraciones y autorizaciones se guardan siete días en IndexedDB, sin la idea original, respuestas ni perfiles. Se conservan también los libros anteriores con imágenes de colección. Borrar uno o todos requiere confirmación y devuelve el foco al cancelar.

El lector recuerda hasta ocho posiciones de catálogo y libros creados durante siete días, solo en este navegador. Cada marca contiene identificador, origen, nivel, párrafo, palabra y momento del guardado. «Leer desde el inicio» quita su marca; «Borrar mi progreso» elimina puntos y marcas. Un fallo de almacenamiento no bloquea la lectura. El aviso de privacidad ofrece un resumen breve y conserva el detalle para adultos.

Los relatos de biblioteca están preparados en el catálogo; durante la práctica, la IA genera una acción de lectura y una pregunta de reflexión alineadas con la habilidad y el nivel. Dentro de ambos lectores, seleccionar una palabra o frase permite pedir una explicación, un ejemplo y una pregunta guiada. «No entendí» ofrece ayuda sobre el párrafo sin necesitar selección. Hay tres etapas de apoyo y ayudas preparadas ante fallos, identificadas por su origen. No hay chat abierto ni envío de respuestas libres. El contenido generado puede contener errores y necesita revisión adulta y pedagógica; no se afirma una mejora educativa ya demostrada.

## Ejecutar en local

Actualización del 22 de octubre: **No entendí** ofrece explicaciones más cortas, ejemplo desplegable y voz ElevenLabs con la preferencia del lector. El catálogo tiene doce cuentos; las flechas recorren portadas enteras y los nuevos relatos se distribuyen por categoría. Detalles y guía para agregar cuentos en [ayuda, voz y catálogo](documentacion_tutor_lectura_ia/30_ayuda_primaria_voz_y_catalogo_12.md).

Requiere Node.js 22 o posterior; el proyecto se ha construido con Node.js 24.

```powershell
npm.cmd ci
npm.cmd run dev -- --hostname 127.0.0.1 --port 4173
```

Abrir http://127.0.0.1:4173. En este equipo el puerto 3000 está reservado; por eso se usa 4173.

```powershell
npm.cmd run build
npm.cmd run start -- --port 4173
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run test:e2e
npx.cmd playwright install webkit
npm.cmd run test:e2e:webkit
```

La auditoría responsive del 1 de noviembre parte del commit `c0b2a7c` de `main`, verificado contra el despliegue de producción de Vercel. La suite propia usa Node Test Runner y Playwright; no necesita las pruebas de otro producto. Los resultados, fallos reproducidos, anchos comprobados y límites están en [el informe de auditoría](docs/AUDITORIA_RESPONSIVE_2026-11-01.md). Las pruebas de voz e ilustraciones con respuestas simuladas no garantizan disponibilidad de los proveedores ni eficacia educativa.

La revisión integral posterior parte de la producción corregida `76b7436` y se publica como vista previa en la rama `mejoras`. Incluye fuentes internacionales, hallazgos, cambios, límites y prioridades en [la auditoría integral](docs/AUDITORIA_INTEGRAL_Y_MEJORAS_2026-11-01.md). Playwright utiliza su Chromium aislado y WebKit; no depende del Chrome personal del equipo. El catálogo se envía al inicio como metadatos, sin incluir todos los relatos y preguntas en su JavaScript.

Para las comprobaciones de navegador hay que instalar Chromium con `npx.cmd playwright install chromium`. Se pueden dirigir al despliegue público mediante `TEST_BASE_URL`.

El lint usa la configuración de Next.js. Se conserva `tsc` de TypeScript 7 para la comprobación de tipos y se instala la API compatible de TypeScript 6 para ESLint, siguiendo [la configuración oficial de compatibilidad](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0). `playwright.webkit.config.ts` comprueba el diseño en WebKit sin mezclar sus proyectos con los de Chrome.

## IA y configuración

Los cuentos nuevos pasan una revisión de coherencia además de la revisión de seguridad: se contrastan con la idea original, la continuidad del relato y la descripción visual. Un resultado incoherente se intenta corregir una vez dentro del plazo de creación; si no pasa, no se entrega como cuento válido y la idea permanece en el formulario.

Las ilustraciones reciben el párrafo exacto de su página y reglas para conservar las especies y los cuerpos separados. Solo se autoriza un híbrido humano-animal cuando la revisión identifica una petición explícita en la idea original; una niña con su gato, un animal que habla o un disfraz no bastan. Esa decisión se firma junto a los seis párrafos y la descripción visual para impedir que el cliente amplíe el permiso. `STORY_ILLUSTRATION_SECRET` permite usar una firma estable; si falta, se usa una credencial del servidor ya configurada. La ilustración no depende de tener ElevenLabs. Los libros anteriores conservan sus permisos de voz, pero no autorizan híbridos por defecto.

El dibujo vectorial de respaldo ya no cambia una especie desconocida por una persona, ni añade todos los protagonistas a cada escena. Las categorías de ese dibujo no se usan para guiar el modelo de imágenes: este recibe el texto aprobado. Estas comprobaciones validan el texto y las instrucciones enviadas; no son una inspección visual automática de los píxeles que devuelve el proveedor.

Copiar las variables necesarias de .env.example a .env.local (ignorado por Git). AI Gateway usa OIDC de Vercel o AI_GATEWAY_API_KEY. El modelo principal y su respaldo se configuran con AI_MODEL y AI_FALLBACK_MODEL.

OpenRouter es un respaldo de texto del servidor. Admite OPENROUTER_API_KEY, variables numeradas desde _2 sin el límite anterior de nueve y un arreglo JSON opcional en OPENROUTER_API_KEYS. Conserva primero las credenciales numeradas y después el grupo adicional, quitando duplicados y espacios. Un grupo opcional mal formado no desactiva las variables anteriores. Solo permite modelos :free u openrouter/free y precio máximo cero. Las credenciales secundarias se prueban ante autenticación inválida o un límite específico de clave; un 429 general o saldo de cuenta agotado no provoca cambio de clave. Varias claves no multiplican la cuota de una cuenta. Se pide data_collection=deny y formato JSON Schema; si el proveedor no puede cumplir, se conserva la alternativa editorial.

Los libros nuevos usan escenas vectoriales y pueden solicitar seis imágenes a Cloudflare con las variables indicadas más abajo. AI_IMAGE_MODE=collection se conserva para el recorrido anterior de portadas; su opción generated requiere acceso a modelos de imágenes de AI Gateway. No se ha comprado saldo ni activado recarga automática. El token y la cuenta de Cloudflare están configurados; una generación real de FLUX.1 schnell devolvió una imagen JPEG válida en 9,4 segundos. Ante fallos o cuotas se mantiene el respaldo vectorial.

Las claves nunca llevan el prefijo NEXT_PUBLIC_, nunca se escriben en Git y en producción se guardan como secretos de Vercel. Toda clave compartida en un chat debe revocarse y reemplazarse mediante las variables del servidor.

## Privacidad y alcance

La biblioteca y el tutor no solicitan texto libre; el tutor recibe identificadores editoriales, el relato aprobado, la pregunta, su habilidad y la evidencia, nunca la respuesta ni sus opciones. El creador envía la idea escrita al servicio de IA configurado y puede usar sus respaldos. Cloudflare puede recibir descripciones para generar ilustraciones. No escribir nombres reales, colegio, dirección, teléfono, correo ni ubicación: los filtros no detectan todos los datos personales. Los proveedores pueden procesar o conservar solicitudes según sus condiciones. Los libros e imágenes se guardan localmente en IndexedDB durante siete días; los puntos y recompensas se guardan hasta borrarlos, y las marcas de lectura tienen un límite independiente de ocho durante siete días. No se guardan respuestas elegidas ni perfiles con datos personales. Al solicitar voz, el texto autorizado puede enviarse a ElevenLabs. El hosting y los proveedores pueden procesar datos técnicos de conexión. El límite de solicitudes es temporal y por instancia; no sustituye protección distribuida para un lanzamiento masivo.

No incluye cuentas institucionales, cobros, estadísticas longitudinales ni un piloto educativo realizado. El modelo comercial propuesto es licencia institucional o acceso patrocinado; debe validarse con compradores y requiere alojamiento compatible con uso comercial.

## Documentación y entrega

- `documentacion_tutor_lectura_ia/14_implementacion_y_ux.md`: alcance real, arquitectura, experiencia, pruebas y operación.
- `documentacion_tutor_lectura_ia/15_recursos_visuales.md`: procedencia y prompts de las ilustraciones.
- `documentacion_tutor_lectura_ia/`: análisis y planificación inicial. Los documentos 00 a 13 conservan decisiones anteriores; el 14 describe lo implementado.
- `fuentes/bases_hackathon_futurx_2026.pdf`: bases usadas para preparar el MVP.
- `entregables/`: presentación y guía de entrega.
- `licencias/`: avisos de recursos de terceros.

La entrega de Fase 2 requiere URL y pitch de 3 a 5 diapositivas. La web y el pitch utilizan el nombre del equipo, sin identificar participantes, universidades o países de origen. El registro del equipo y el envío en la plataforma corresponden a sus integrantes.

## GitHub y Vercel

La rama `main` está conectada al proyecto `lee-contigo-ia` de Vercel. Los cambios enviados a esa rama generan un despliegue. GitHub Actions ejecuta comprobaciones de código, compilación y navegación. Esperar el estado **Ready** antes de presentar una versión.

## Requisitos faltantes y narración

La trazabilidad de RF-01 a RF-04 y RNF-01 a RNF-03 está en documentacion_tutor_lectura_ia/24_requisitos_faltantes_implementados.md. Las imágenes originales y sus prompts están en licencias/ILUSTRACIONES-CATALOGO-10.md.

ELEVENLABS_API_KEY se configura solo en servidor. ELEVENLABS_VOICE_ID es opcional. La ruta /api/narrar reconstruye el texto editorial o valida una autorización firmada del párrafo de un libro creado; nunca acepta un prompt libre. Si falla, utiliza la voz del navegador. El plan configurado y sus límites y licencias se revisan en ElevenLabs; el código no compra créditos.

Dentro de Ajustes, el selector «¿Quién te lee?» permite elegir George, Sarah o Daniel, y recuerda únicamente esa preferencia en el dispositivo. Cambiar de voz detiene el audio y la caché distingue cada voz.

Cloudflare necesita `CLOUDFLARE_API_TOKEN` con acceso de Workers AI y `CLOUDFLARE_ACCOUNT_ID` en servidor. Se usa exclusivamente `@cf/black-forest-labs/flux-1-schnell`, cuatro pasos y dos solicitudes simultáneas; no activa planes ni compra créditos. Las imágenes se comprimen a WebP y se guardan con el libro local. La disponibilidad depende del permiso y la cuota de la cuenta. Sin configuración, o ante un fallo, siguen las ilustraciones vectoriales.

Los detalles de ayuda contextual, imágenes, voces, límites y comprobaciones de este corte están en `documentacion_tutor_lectura_ia/25_ayuda_contextual_imagenes_y_voces.md`.

Cloudflare también respalda el texto si los otros proveedores fallan: Llama 3.3 70B en JSON Mode, con el mismo esquema y las mismas validaciones pedagógicas. Se reserva tiempo dentro del plazo total de cada función; no abre un chat ni cambia de clave ante límites de cuenta. El texto y las imágenes comparten la asignación de Workers AI. La ruta publicada de imágenes se comprobó con seis resultados distintos para un cuento en 17 segundos.
