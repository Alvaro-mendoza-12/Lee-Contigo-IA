# LeeContigo IA

Tutor web de comprensión lectora para niños de aproximadamente 8 a 10 años. MVP del desafío de lectura de la Hackathon futurX 2026.

- **Web:** https://lee-contigo-ia.vercel.app
- **Repositorio:** https://github.com/Alvaro-mendoza-12/Lee-Contigo-IA
- **Carpeta local:** `D:\LeeContigo IA`

## Qué incluye

Dos relatos originales, cada uno adaptado editorialmente a dos niveles: **Paso a paso** y **Un nuevo reto**. La lectura se presenta como un libro por páginas, con once tamaños de letra, voz opcional, animación de cambio de página que se puede desactivar y acceso al texto continuo. En móvil, el relato se reparte en páginas más cortas. La biblioteca muestra cómo empieza el cuento según el nivel elegido.

En **Para acompañar**, una persona adulta puede elegir cuento, nivel y objetivo de conversación; la guía propone preguntas para antes, durante y al terminar. Esas opciones continúan en la lectura. El estudiante explora tres preguntas. El tutor genera pistas breves con IA según el relato, la pregunta y el nivel. Tras un error, el modo de reintento pide otra estrategia para buscar evidencia, sin enviar la respuesta seleccionada. Cada pista permite consultar la evidencia en el texto.

En **Crea tu cuento**, el niño propone una idea breve y elige un nivel. Una persona adulta debe revisar la idea. AI Gateway genera un relato con tres preguntas: localizar información, inferir e identificar la idea principal. Cada pregunta incluye dos pistas graduales ligadas a un párrafo del cuento. Al equivocarse, el niño ve una pista y puede intentarlo otra vez; su respuesta se queda en el navegador y no provoca otra llamada a IA. La explicación aparece al acertar o tras tres intentos. La ilustración de portada es opcional y requiere una segunda confirmación adulta: se genera con FLUX 3 Image, que actualmente figura a USD 0.05 por imagen y cuya política permite usar prompts e imágenes para mejorar modelos. Revisa el aviso en pantalla antes de solicitarla. La lectura aparece como libro con cambio de página, tamaño ajustable y voz opcional. El texto y la ilustración se conservan solo en memoria mientras la página está abierta; no se guardan en una cuenta ni una base de datos. Si falla el proveedor o faltan créditos, se puede leer el cuento igualmente.

La portada presenta los cuentos apilados, con un intercambio suave cada siete segundos. Incluye navegación manual y pausa; se detiene con foco de teclado, al pasar el cursor, al salir de pantalla o al ocultar la pestaña. Con movimiento reducido no hay reproducción automática ni animación.

Los relatos de biblioteca están preparados en el catálogo; la IA reformula las pistas durante la práctica y puede crear relatos e ilustraciones a partir de una idea del usuario. El contenido generado puede contener errores y debe revisarlo una persona adulta; no se afirma que el producto ya haya demostrado mejorar el aprendizaje. El contenido está pendiente de revisión docente.

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

Comprobación registrada en este corte: seis pruebas unitarias y 18 recorridos de navegador en escritorio y móvil, incluidos los flujos de libro y acompañamiento.

Para las comprobaciones de navegador hay que instalar Chromium con `npx.cmd playwright install chromium`. Se pueden dirigir al despliegue público mediante `TEST_BASE_URL`.

## IA y configuración

Se usa Vercel AI SDK con AI Gateway. Modelo predeterminado: `google/gemini-3.8-flash`, consultado en el catálogo oficial el 21 de octubre de 2026. Las etiquetas de AI Gateway separan generación de cuentos y pistas editoriales para revisar uso y costo. La disponibilidad y el precio pueden cambiar; verificar catálogo y saldo antes de una demo.

En Vercel se usa autenticación OIDC del proyecto. Para desarrollo se puede usar `vercel env pull .env.local` con una sesión autorizada o definir `AI_GATEWAY_API_KEY` en `.env.local`. La variable opcional `AI_MODEL` permite cambiar el modelo. Ver `.env.example`. Nunca subir claves, tokens ni `.env.local` a GitHub.

Si la IA no está configurada, se agota el saldo, hay un límite de uso o la salida no pasa los controles, se muestra una **pista preparada** claramente identificada. Una pista de respaldo no se presenta como generación de IA.

AI Gateway ofrece una asignación gratuita limitada a modelos elegibles; no es uso ilimitado. No se ha comprado saldo ni activado recarga automática desde el proyecto. Condiciones vigentes: https://vercel.com/docs/ai-gateway/pricing.

## Privacidad y alcance

La biblioteca y el tutor no solicitan texto libre; el tutor recibe identificadores editoriales, no las respuestas. El creador sí envía la idea escrita a AI Gateway para generar el relato, y envía al modelo de imagen una descripción visual derivada del cuento. No escribir nombres reales, colegio, dirección, teléfono, correo ni ubicación: los filtros no detectan todos los datos personales. El servidor solicita enrutamiento sin entrenamiento cuando hay un proveedor compatible; las reglas de retención dependen del proveedor. El texto y la imagen quedan en memoria de la página y no se guardan en una base de datos. El hosting y el proveedor de IA pueden procesar datos técnicos de conexión. El límite de solicitudes es temporal y por instancia; no sustituye protección distribuida para un lanzamiento masivo.

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
