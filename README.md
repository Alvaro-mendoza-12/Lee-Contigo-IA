# LeeContigo IA

Tutor web de comprensión lectora para niños de aproximadamente 8 a 10 años. MVP del desafío de lectura de la Hackathon futurX 2026.

- **Web:** https://lee-contigo-ia.vercel.app
- **Repositorio:** https://github.com/Alvaro-mendoza-12/Lee-Contigo-IA
- **Carpeta local:** `D:\LeeContigo IA`

## Qué incluye

Dos relatos originales, cada uno adaptado editorialmente a dos niveles: **Paso a paso** y **Un nuevo reto**. La lectura se presenta como un libro por páginas, con once tamaños de letra, voz opcional, animación de cambio de página que se puede desactivar y acceso al texto continuo. En móvil, el relato se reparte en páginas más cortas. La biblioteca muestra cómo empieza el cuento según el nivel elegido.

En **Para acompañar**, una persona adulta puede elegir cuento, nivel y objetivo de conversación; la guía propone preguntas para antes, durante y al terminar. Esas opciones continúan en la lectura. El estudiante explora tres preguntas. El tutor genera pistas breves con IA según el relato, la pregunta y el nivel. Tras un error, el modo de reintento pide otra estrategia para buscar evidencia, sin enviar la respuesta seleccionada. Cada pista permite consultar la evidencia en el texto. En la práctica, al tercer error se muestra la explicación y el párrafo que la respalda; quien eligió **Un nuevo reto** puede optar por leer la versión **Paso a paso**.

En **Crea tu cuento**, el niño propone una idea breve y elige un nivel. Una persona adulta debe revisar la idea. Cuando AI Gateway está disponible, genera un relato con tres preguntas: localizar información, inferir e identificar la idea principal. Cada pregunta incluye dos pistas graduales y una cita literal de evidencia que el servidor verifica contra el párrafo señalado. Al acertar o tras tres intentos, el niño puede revisar esa frase y abrir el párrafo completo. Si se equivoca, ve una pista y puede intentarlo otra vez; su respuesta se queda en el navegador y no provoca otra llamada a IA. La ilustración de portada es opcional y requiere una segunda confirmación adulta. La lectura aparece como libro con cambio de página, tamaño ajustable y voz opcional. El texto y la ilustración se conservan solo en memoria mientras la página está abierta; no se guardan en una cuenta ni una base de datos. Si falla la generación, la idea permanece en el formulario y la biblioteca sigue disponible.

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

Comprobación de este corte: 12 pruebas unitarias, typecheck y build aprobados; 20 recorridos de navegador aprobados en escritorio y móvil, incluidos el creador simulado, la cita de evidencia, lectura y acompañamiento. El recorrido del creador usa una respuesta de prueba y no confirma acceso real a AI Gateway ni que el respaldo haya funcionado en producción.

Para las comprobaciones de navegador hay que instalar Chromium con `npx.cmd playwright install chromium`. Se pueden dirigir al despliegue público mediante `TEST_BASE_URL`.

## IA y configuración

Se usa Vercel AI SDK con AI Gateway. La generación de cuentos y las pistas del tutor intentan primero `google/gemini-3.8-flash` y usan `openai/gpt-5.4-nano` si falla el modelo principal. El catálogo consultado el 21 de octubre de 2026 incluye ambos modelos y el modelo de respaldo admite salida estructurada. AI Gateway cobra el modelo que logra completar la solicitud; el respaldo se intenta ante un fallo del principal. No activamos `disallowPromptTraining`: el catálogo no marca las rutas disponibles para estos modelos como compatibles con ese filtro. Las solicitudes pueden ser servidas por Google/Google Vertex, OpenAI o Azure según disponibilidad y configuración; consulta sus políticas. No se fuerza Zero Data Retention. Los modelos, proveedores y precios pueden cambiar.

En Vercel se usa autenticación OIDC del proyecto. Para desarrollo se puede usar `vercel env pull .env.local` con una sesión autorizada o definir `AI_GATEWAY_API_KEY` en `.env.local`. Las variables `AI_MODEL` y `AI_FALLBACK_MODEL` permiten cambiar el modelo principal y el de respaldo. Ver `.env.example`. Nunca subir claves, tokens ni `.env.local` a GitHub.

Si la IA no está configurada, se agota el saldo, hay un límite de uso o la salida no pasa los controles, se muestra una **pista preparada** claramente identificada. Una pista de respaldo no se presenta como generación de IA.

La documentación vigente de Vercel anuncia USD 5 de crédito mensual en el nivel gratuito y acceso a los modelos disponibles del catálogo; el consumo depende del modelo y los tokens. Esto no garantiza disponibilidad en una cuenta o equipo específicos. La última falla observada en producción fue un HTTP 403 de AI Gateway con motivo interno genérico; no está confirmado que se deba al saldo o al modelo. No se ha comprado saldo ni activado recarga automática desde el proyecto. Revisar condiciones y saldo antes de una demo: https://vercel.com/docs/ai-gateway/pricing.

## Privacidad y alcance

La biblioteca y el tutor no solicitan texto libre; el tutor recibe identificadores editoriales, no las respuestas. El creador sí envía la idea escrita a AI Gateway para generar el relato, con un modelo de respaldo si falla el principal. También envía al modelo de imagen una descripción visual derivada del cuento. No escribir nombres reales, colegio, dirección, teléfono, correo ni ubicación: los filtros no detectan todos los datos personales. Los proveedores de texto pueden procesar o conservar solicitudes conforme a sus propias condiciones; revisa sus políticas antes de usar la función con menores. El texto y la imagen quedan en memoria de la página y no se guardan en una base de datos. El hosting y el proveedor de IA pueden procesar datos técnicos de conexión. El límite de solicitudes es temporal y por instancia; no sustituye protección distribuida para un lanzamiento masivo.

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
