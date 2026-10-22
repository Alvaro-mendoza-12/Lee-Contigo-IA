# LeeContigo IA

Tutor web de comprensión lectora para niños de aproximadamente 8 a 10 años. MVP del desafío de lectura de la Hackathon futurX 2026.

- **Web:** https://lee-contigo-ia.vercel.app
- **Repositorio:** https://github.com/Alvaro-mendoza-12/Lee-Contigo-IA
- **Carpeta local:** `D:\LeeContigo IA`

## Qué incluye

**Inicio infantil:** portada de libro con lomo verde, papel soleado y portadas que cambian. Una acción principal para leer y dos destinos con iconos: biblioteca e inventar un cuento. En móvil hay menos texto periférico y un creador más compacto. Ver `documentacion_tutor_lectura_ia/26_portada_infantil_y_movil.md`.

**Lector rediseñado:** libro abierto a todo el ancho, pliegue y hojas con volumen, giro de 180 grados, texto e ilustración que alternan de lado y ocho escenas interiores en los cuatro cuentos iniciales y cuatro escenas en cada cuento nuevo. En teléfonos se usa una hoja vertical legible. Los controles se simplificaron y la caja permanece estable al avanzar. Ver `documentacion_tutor_lectura_ia/18_lector_editorial_y_validacion.md`.

Diez relatos originales, cada uno adaptado editorialmente a dos niveles: **Paso a paso** y **Un nuevo reto**. La lectura se presenta como un libro por páginas, con once tamaños de letra, voz opcional, animación de cambio de página que se puede desactivar y acceso al texto continuo. En móvil, el relato se reparte en páginas más cortas. La biblioteca usa una sola tarjeta por destino y el inicio abre directamente un cuento.

En **Para acompañar**, una persona adulta puede elegir cuento, nivel y objetivo de conversación; la guía propone preguntas para antes, durante y al terminar. Esas opciones continúan en la lectura. El estudiante explora tres preguntas. El tutor genera una pista estructurada con IA: una acción de lectura y una pregunta de reflexión, adaptadas a la habilidad, el nivel y el momento de apoyo. Tras un error, propone otra estrategia sin enviar la respuesta elegida ni las opciones al modelo. Cada pista permite consultar la evidencia en el texto. La respuesta incorrecta muestra un aviso claro, color de apoyo, un sonido breve que se puede silenciar y una pista audible. No se revela automáticamente la solución al tercer error.

En **Crea tu cuento**, el niño propone una idea breve y elige un nivel. Una persona adulta debe revisar la idea. Con AI Gateway y respaldo gratuito de OpenRouter, genera un relato de seis párrafos con tres preguntas: localizar información, inferir e identificar la idea principal. Cada pregunta incluye dos pistas graduales y una cita literal verificada contra el párrafo señalado. Las respuestas e intentos quedan en memoria. El libro incorpora de inmediato escenas vectoriales con personajes y objetos del relato; puede ajustar su plan con IA. Con Cloudflare configurado, genera seis imágenes distintas, una por párrafo, mientras el niño puede seguir leyendo. Si un párrafo ocupa varias hojas por el tamaño de letra, su ilustración conserva la escena y varía el encuadre. Los seis libros más recientes, sus ilustraciones y sus autorizaciones se guardan durante siete días en IndexedDB, sin la idea original, respuestas ni perfiles. Se pueden borrar desde Mis libros. Se conservan los libros anteriores con sus imágenes de colección.

La portada presenta los cuentos apilados, con un intercambio suave cada tres segundos. Incluye navegación manual y pausa; se detiene con foco de teclado, al pasar el cursor, al salir de pantalla o al ocultar la pestaña. Con movimiento reducido no hay reproducción automática ni animación.

Los relatos de biblioteca están preparados en el catálogo; durante la práctica, la IA genera una acción de lectura y una pregunta de reflexión alineadas con la habilidad y el nivel. Dentro de ambos lectores, seleccionar una palabra o frase permite pedir una explicación, un ejemplo y una pregunta guiada. «Ayuda con este párrafo» ofrece una alternativa sin selección. Hay tres etapas de apoyo y ayudas preparadas ante fallos, identificadas por su origen. No hay chat abierto ni envío de respuestas libres. El contenido generado puede contener errores y necesita revisión adulta y pedagógica; no se afirma una mejora educativa ya demostrada.

## Ejecutar en local

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
npm.cmd test
npx.cmd playwright test
```

Comprobación del corte actual: 30 pruebas unitarias y 44 recorridos de navegador en escritorio y móvil aprobados contra una compilación de producción. Incluyen accesibilidad automática con axe, selección y ayuda contextual, cambio de nivel, animación, elección de voz, respaldo audible y guardado local de ilustraciones simuladas. Se comprobaron las tres voces mediante ElevenLabs real; la generación real de Cloudflare respondió correctamente y OpenRouter devolvió un límite de disponibilidad en la última comprobación. Las pruebas simuladas no garantizan disponibilidad de proveedores ni eficacia educativa. Los documentos 18, 24 y 25 distinguen comprobaciones anteriores y actuales.

Para las comprobaciones de navegador hay que instalar Chromium con `npx.cmd playwright install chromium`. Se pueden dirigir al despliegue público mediante `TEST_BASE_URL`.

## IA y configuración

Copiar las variables necesarias de .env.example a .env.local (ignorado por Git). AI Gateway usa OIDC de Vercel o AI_GATEWAY_API_KEY. El modelo principal y su respaldo se configuran con AI_MODEL y AI_FALLBACK_MODEL.

OpenRouter es un respaldo de texto del servidor. Admite OPENROUTER_API_KEY y las variables con sufijos _2 a _9. Solo permite modelos :free u openrouter/free y precio máximo cero. Las credenciales secundarias se prueban ante autenticación inválida o un límite específico de clave; un 429 general o saldo de cuenta agotado no provoca cambio de clave. Varias claves no multiplican la cuota de una cuenta. Se pide data_collection=deny y formato JSON Schema; si el proveedor no puede cumplir, se conserva la alternativa editorial.

Los libros nuevos usan escenas vectoriales y pueden solicitar seis imágenes a Cloudflare con las variables indicadas más abajo. AI_IMAGE_MODE=collection se conserva para el recorrido anterior de portadas; su opción generated requiere acceso a modelos de imágenes de AI Gateway. No se ha comprado saldo ni activado recarga automática. El token y la cuenta de Cloudflare están configurados; una generación real de FLUX.1 schnell devolvió una imagen JPEG válida en 9,4 segundos. Ante fallos o cuotas se mantiene el respaldo vectorial.

Las claves nunca llevan el prefijo NEXT_PUBLIC_, nunca se escriben en Git y en producción se guardan como secretos de Vercel. Toda clave compartida en un chat debe revocarse y reemplazarse mediante las variables del servidor.

## Privacidad y alcance

La biblioteca y el tutor no solicitan texto libre; el tutor recibe identificadores editoriales, el relato aprobado, la pregunta, su habilidad y la evidencia, nunca la respuesta ni sus opciones. El creador sí envía la idea escrita a AI Gateway para generar el relato, con un modelo de respaldo si falla el principal. En el modo gratuito actual no envía la historia a un modelo de imágenes. No escribir nombres reales, colegio, dirección, teléfono, correo ni ubicación: los filtros no detectan todos los datos personales. Los proveedores de texto pueden procesar o conservar solicitudes conforme a sus propias condiciones; revisa sus políticas antes de usar la función con menores. El texto y la imagen quedan en memoria de la página y no se guardan en una base de datos. El hosting y el proveedor de IA pueden procesar datos técnicos de conexión. El límite de solicitudes es temporal y por instancia; no sustituye protección distribuida para un lanzamiento masivo.

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

El selector «¿Quién te lee?» permite elegir George, Sarah o Daniel, y recuerda únicamente esa preferencia en el dispositivo. Cambiar de voz detiene el audio y la caché distingue cada voz.

Cloudflare necesita `CLOUDFLARE_API_TOKEN` con acceso de Workers AI y `CLOUDFLARE_ACCOUNT_ID` en servidor. Se usa exclusivamente `@cf/black-forest-labs/flux-1-schnell`, cuatro pasos y dos solicitudes simultáneas; no activa planes ni compra créditos. Las imágenes se comprimen a WebP y se guardan con el libro local. La disponibilidad depende del permiso y la cuota de la cuenta. Sin configuración, o ante un fallo, siguen las ilustraciones vectoriales.

Los detalles de ayuda contextual, imágenes, voces, límites y comprobaciones de este corte están en `documentacion_tutor_lectura_ia/25_ayuda_contextual_imagenes_y_voces.md`.

Cloudflare también respalda el texto si los otros proveedores fallan: Llama 3.3 70B en JSON Mode, con el mismo esquema y las mismas validaciones pedagógicas. Se reserva tiempo dentro del plazo total de cada función; no abre un chat ni cambia de clave ante límites de cuenta. El texto y las imágenes comparten la asignación de Workers AI. La ruta publicada de imágenes se comprobó con seis resultados distintos para un cuento en 17 segundos.
