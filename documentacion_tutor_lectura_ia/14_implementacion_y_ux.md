# 14. Implementación del MVP y experiencia de uso

**Proyecto:** LeeContigo IA · **Corte:** 21 de octubre de 2026  
**Web:** https://lee-contigo-ia.vercel.app  
**Código:** https://github.com/Alvaro-mendoza-12/Lee-Contigo-IA

Este documento describe el producto construido. Los documentos 00 a 13 son el análisis y la planificación anteriores; sus propuestas de funciones futuras no implican que ya estén implementadas.

## 1. Alcance funcional disponible

| Sección      | Ruta                                     | Función                                                                                                                                                                                                                                       |
| ------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inicio       | `/`                                      | Explica la experiencia y presenta portadas apiladas con cambio suave, pausa y navegación manual.                                                                                                                                              |
| Biblioteca   | `/biblioteca`                            | Dos relatos originales, elección entre dos niveles, vista previa de la versión seleccionada y acceso a lectura.                                                                                                                               |
| Crear cuento | `/crear`                                 | Recibe una idea breve y nivel con revisión adulta; genera un relato con cuatro párrafos, tres preguntas de comprensión y dos pistas progresivas por pregunta. La portada ilustrada es opcional. La experiencia queda en memoria de la página. |
| Lectura      | `/leer/[id]?nivel=paso` o `reto`         | Libro por páginas con relato adaptado, once tamaños de letra de 12 a 44 px, voz del navegador, animación opcional y acceso a preguntas. El texto se divide en páginas más breves en móvil; se puede cambiar al relato continuo.               |
| Práctica     | `/practicar/[id]?nivel=...`              | Tres preguntas, retroalimentación, hasta tres intentos, evidencia del relato, dos grados de pista, consulta del texto y cierre sin nota.                                                                                                      |
| Guía adulta  | `/acompanar`                             | Planificador interactivo: elige cuento, nivel, objetivo de conversación y momento (antes, durante o al terminar); envía la selección a la lectura acompañada. Incluye orientación sobre IA, privacidad y alcance de demostración.             |
| Privacidad   | `/privacidad`                            | Información que procesa el recorrido y límites del prototipo.                                                                                                                                                                                 |
| Tutor        | `POST /api/tutor`                        | Valida identificadores editoriales y solicita una pista a IA Gateway.                                                                                                                                                                         |
| Cuento IA    | `POST /api/crear` y `/api/crear/portada` | Genera relato, preguntas, pistas y evidencia estructurados en una solicitud. Una segunda solicitud opcional genera la portada.                                                                                                                |
| Estado       | `GET /api/estado`                        | Indica que la aplicación responde, el modo de autenticación configurado y que el acceso del tutor no se ha comprobado; no expone claves.                                                                                                         |

### Relatos y adaptación al nivel

1. **Una luz en el bosque:** Lina, una luciérnaga, ayuda al grillo Tomás a cruzar un río.
2. **La semilla viajera:** Nico aprende a cuidar una semilla y a esperar su crecimiento.

Cada relato tiene una versión **Paso a paso**, con frases más sencillas, y otra **Un nuevo reto**, con mayor riqueza de lenguaje y relaciones que explorar. Las preguntas y las pistas de respaldo pertenecen a esa versión. La selección se conserva en la URL al pasar de biblioteca a lectura y práctica. El lector permite probar el otro nivel en el mismo relato y refleja la selección en la URL; los controles del navegador atrás/adelante recuperan el nivel.

### Libro y accesibilidad de lectura

La lectura se presenta en páginas con ilustración, número visible, controles anterior/siguiente y progreso. El tamaño se ajusta en once pasos y la cantidad de palabras por página baja al aumentar la letra. En móvil se divide en páginas más breves para facilitar el avance. La persona lectora puede desactivar la animación del cambio de página; el sistema también la desactiva cuando el dispositivo solicita movimiento reducido. La opción **Ver relato completo** ofrece una lectura continua. La voz utiliza el sintetizador del navegador y lee la página visible o el relato completo según la vista.

La vista previa de la biblioteca cambia junto con el nivel para que se aprecie la diferencia editorial antes de abrir el cuento. La guía de acompañamiento pide elegir una historia, un nivel y un objetivo —imaginar, buscar pistas o explicar—, y permite pasar entre tres momentos de conversación. Al iniciar, la selección acompaña a la persona adulta y al lector durante el cuento; la pregunta se actualiza según el párrafo.

La adaptación de los relatos de biblioteca es editorial y está incluida en el catálogo. El creador genera cuentos bajo demanda con un nivel elegido por el lector y una portada desde una segunda solicitud. El modelo no determina automáticamente el grado del niño ni diagnostica dificultades. Los niveles son opciones de práctica, no equivalencias certificadas de edad o grado escolar.

Al terminar un cuento personalizado, el quiz trabaja tres habilidades: localizar información, inferir una idea y comprender la idea principal. Cada pregunta incluye dos pistas graduadas y un párrafo de evidencia. Tras el primer y segundo error, la persona vuelve al texto e intenta otra vez; tras tres respuestas incorrectas, se muestra una explicación. Las respuestas no se envían al modelo ni se califican como nota escolar. Esto mantiene una segunda interacción pedagógica sin sumar una llamada de IA por pregunta.

La práctica de los relatos de biblioteca sigue el mismo andamiaje: el primer y segundo error invitan a revisar el texto o pedir una pista; el tercer error revela la explicación y el párrafo que la respalda, y permite continuar sin tener que acertar. Si el lector eligió «Un nuevo reto», también puede abrir voluntariamente la versión «Paso a paso». El nivel no se cambia automáticamente ni se presenta como diagnóstico.

## 2. Qué aporta la IA

El tutor recibe únicamente `storyId`, `level`, `questionId`, `tier` y `support`. Este último campo solo admite `explore` o `retry`: el modo de ayuda solicitado. No contiene la opción seleccionada ni un identificador del estudiante. Recupera el relato, las opciones y un fragmento de evidencia desde el catálogo. El prompt pide una pista de una o dos frases que oriente hacia el texto sin dar la respuesta. Para Paso a paso pide frases muy cortas; para Un nuevo reto invita a relacionar hechos.

El creador de cuentos sí acepta texto libre: una idea de hasta 220 caracteres y el nivel elegido, con confirmación de revisión adulta. La entrada se valida, se filtran algunos formatos de datos personales y se limita a dos solicitudes por diez minutos y por instancia. Gemini 3.8 Flash devuelve título, subtítulo, cuatro párrafos, descripción visual, una pregunta de localizar, una inferencial y otra sobre idea principal. Cada pregunta incluye dos pistas, explicación y párrafo de evidencia. El servidor valida habilidades, longitudes, seguridad básica y que las pistas no repitan textualmente las respuestas largas. El quiz selecciona qué pista mostrar en función del número de intentos; las respuestas nunca salen del navegador ni provocan otra solicitud al modelo. La portada es opcional: solo se envía una segunda solicitud al confirmar que la persona adulta revisó el aviso y acepta el costo y las condiciones. Usa únicamente la descripción visual generada para producir una imagen vertical. FLUX 3 Image figura en USD 0.05 por imagen en el catálogo actual de Vercel; el precio puede cambiar. La política de Black Forest Labs indica que puede usar prompts e imágenes para mejorar sus modelos. La versión no fuerza `disallowPromptTraining`; hay que revisar las condiciones del modelo de imagen y de cualquier proveedor antes del piloto. Vercel declara que AI Gateway no usa solicitudes para entrenar, pero las condiciones del proveedor que recibe cada solicitud pueden variar. El proveedor y hosting pueden procesar las solicitudes según sus términos. No se guarda el texto, cuento o portada en una base de datos ni en almacenamiento local. El lector conserva los datos en memoria mientras esa pantalla está abierta. Los filtros no reconocen todos los nombres o datos sensibles; el aviso pide no compartirlos y usar la función junto con una persona adulta.

Al confirmar una respuesta incorrecta aparece una acción para pedir apoyo. En modo `retry`, se solicita una acción concreta sobre la evidencia y una pregunta de reflexión, sin asumir la causa del error. Esto cambia la estrategia de ayuda; no clasifica ni diagnostica al niño. El modelo recibe además el objetivo de comprensión de la pregunta. La caché distingue nivel, pregunta, grado de pista y modo de apoyo.

Ejemplo de comprobación real: para la pregunta «¿Qué muestra la solución de Lina?», el modelo pidió revisar la limitación de su luz y lo que decidió hacer, y preguntó qué mostraba eso sobre el uso de lo que tenía. La respuesta provenía de AI Gateway con `source: "ai"` y `support: "retry"`. Es un ejemplo de funcionamiento, no evidencia de una mejora del aprendizaje.

**Tecnología:** Vercel AI SDK 7, AI Gateway y modelo predeterminado `google/gemini-3.8-flash`, modelo estable consultado en el catálogo el 21 de octubre de 2026 y compatible con salidas estructuradas. `reasoning: low` mantiene el flujo acotado. Las etiquetas de Gateway separan el uso de `generated-story` del `reading-tutor`, sin identificar a estudiantes. OIDC autentica el despliegue sin colocar una clave en el navegador. `AI_MODEL` permite una sustitución posterior; antes de cambiarlo deben revisarse disponibilidad, costo, términos y calidad de salida.

Controles implementados:

- Esquema estricto de entrada: no acepta texto libre, nombres ni identificadores ajenos al catálogo.
- Solicitud de hasta 1 KB; comprobación de origen cuando el navegador lo envía.
- Salida estructurada con longitud limitada a 350 caracteres y 45 palabras; filtro de URL, HTML y revelación literal de la opción correcta.
- Para pistas del catálogo, tiempo máximo de consulta de 6,5 segundos y hasta 600 tokens de salida; ante fallo se usa la pista editorial. El creador de cuentos permite un reintento limitado al fallar la estructura o el filtro de calidad, hasta 1.900 tokens de salida por intento.
- Salida del cuento con tres habilidades distintas, dos pistas cortas por pregunta, párrafo de evidencia y explicación; se rechaza si falta una habilidad o alguna pista contiene datos personales, contenido no permitido o la respuesta correcta textual.
- El quiz da hasta tres oportunidades, muestra el párrafo de evidencia y revela la explicación al acertar o después de tres intentos. No hay calificación numérica ni llamada de IA por intento.
- Caché en memoria para combinaciones editoriales repetidas. La caché no contiene respuestas del estudiante y puede desaparecer al reiniciar una instancia.
- Límite de 12 solicitudes por 10 minutos y huella de conexión por instancia. No es una cuota global para todos los servidores.
- Pista preparada ante falla, límite, indisponibilidad o rechazo de la salida. La interfaz muestra **Pista con IA** o **Pista preparada** según corresponda.
- El fragmento de evidencia siempre procede del catálogo, no de una cita inventada por el modelo.

Estos filtros no prueban que toda pista sea pedagógicamente correcta ni detectan todas las formas indirectas de revelar una respuesta. La revisión docente y una evaluación sistemática siguen siendo necesarias.

## 3. Arquitectura construida

```text
Navegador → interfaz Next.js/React
           ├─ catálogo original de relatos y preguntas
           └─ POST /api/tutor
                → validación y controles de uso
                → Vercel AI Gateway → modelo de lenguaje
                → validación de salida o pista preparada
                → pista y fragmento del relato
```

| Capa             | Implementación                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Interfaz y rutas | Next.js 16 App Router, React 19, TypeScript                                                                 |
| Estilo           | CSS adaptable, Nunito Sans, iconos Lucide                                                                   |
| Ilustraciones    | Dos imágenes originales generadas para el proyecto; Next Image con tamaños adaptables                       |
| Contenido        | `lib/stories.ts`; preguntas y evidencia vinculadas por identificador                                        |
| IA               | `app/api/tutor/route.ts`, `app/api/crear/route.ts`, `app/api/crear/portada/route.ts`, AI SDK y esquemas Zod |
| Persistencia     | Sin base de datos, cuentas, cookies de perfilado ni almacenamiento local del progreso                       |
| Publicación      | GitHub `main` conectado al proyecto Vercel `lee-contigo-ia`                                                 |
| Comprobaciones   | Node test runner, Playwright y axe; flujo de GitHub Actions                                                 |

## 4. UX y las diez heurísticas de Nielsen

| Heurística                 | Aplicación concreta                                                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Visibilidad del estado     | Recorrido de elección, lectura y práctica; nivel y versión seleccionados; número de página; pregunta actual; estado de carga al pedir pista.                             |
| Relación con el mundo real | Lenguaje cotidiano: historia, leer, pista, volver al relato; sin jerga de IA en el recorrido infantil.                                                                   |
| Control y libertad         | Volver a leer, cambiar nivel, pasar páginas en ambas direcciones, cambiar el tamaño, desactivar animación, consultar texto sin salir, detener voz y repetir la práctica. |
| Consistencia               | Mismos botones, tipografía, navegación y nombres de niveles en todas las pantallas.                                                                                      |
| Prevención de errores      | No se confirma una respuesta vacía; controles de pista deshabilitados durante la carga; opciones cerradas.                                                               |
| Reconocimiento             | El título y el texto de apoyo permanecen accesibles; las acciones tienen etiquetas visibles.                                                                             |
| Flexibilidad               | Dos niveles, once tamaños de letra, libro por páginas o texto continuo y voz opcional; uso con ratón, toque o teclado.                                                   |
| Diseño sencillo            | Una acción principal por etapa, colores suaves, contenido sin publicidad ni ranking.                                                                                     |
| Recuperación de errores    | Reintentos amables, respaldo ante fallo de IA y página de ruta desconocida con regreso a biblioteca.                                                                     |
| Ayuda                      | Planificador para docentes/familias, conversación antes/durante/después, explicación de la pista, acceso a evidencia y aviso de privacidad.                              |

### Accesibilidad implementada

Enlaces para saltar al contenido, foco visible, HTML semántico, controles de radio y selección nativos, etiquetas para iconos que actúan como botones, anuncios de estado y cambios de pregunta con manejo de foco. La experiencia se adapta a móvil y respeta la preferencia de movimiento reducido. Los botones de nivel y etapa anuncian cuál está seleccionado; las páginas y el tamaño se pueden controlar por toque o teclado. Se corrigieron textos pequeños con contraste insuficiente detectados en la revisión automática.

Las portadas cambian cada siete segundos con un movimiento de 850 ms. Solo la portada visible se puede enfocar y abrir; las restantes están ocultas para tecnologías de apoyo e inactivas. Hay controles de anterior, siguiente y pausa. El cambio automático se detiene durante el uso con teclado, al pasar el cursor, cuando el bloque sale de pantalla o cuando se oculta la pestaña. La preferencia de movimiento reducido mantiene el cambio manual sin animación.

El resultado sin infracciones detectadas por axe no equivale a una certificación completa de accesibilidad. Falta una prueba con lectores de pantalla y personas con distintas necesidades.

Los registros de fallos de IA incluyen categoría y modelo; cuando Gateway los proporciona, también código HTTP, tipo de error e identificador de generación. Para salidas estructuradas inválidas se registra longitud de salida y uso de tokens, nunca el texto. No se registran la idea del cuento, el relato, las respuestas seleccionadas ni la pista generada.

## 5. Comprobaciones realizadas

- Compilación de producción y comprobación de TypeScript.
- Seis comprobaciones unitarias: coherencia del catálogo, entradas estrictas, manejo de niveles, plan de apoyo de reintento, filtro de pistas y conservación del texto al paginar en móvil/escritorio.
- Dieciocho comprobaciones de navegador sobre flujo completo, selección de relato/nivel, cambio de página, tamaños de letra, animación opcional, planificador de acompañamiento, accesibilidad, API, portadas, pausa y ayuda después de un error. Incluyen móvil y escritorio, siete rutas sin desbordamiento horizontal y las reglas WCAG A/AA seleccionadas por axe.
- Revisión visual de inicio, lectura y práctica en pantallas de escritorio y móvil.
- Una comprobación real anterior observó una respuesta de tutor con `source: "ai"`; eso confirma que el flujo llegó a funcionar, no que esté disponible ahora.
- Ocho comprobaciones de navegador adicionales dirigidas a la URL pública: todas aprobadas. Se verificaron además pistas reales de ambas historias y de los dos niveles, y GitHub Actions terminó con resultado satisfactorio para la versión publicada.

Una solicitud de producción anterior a la corrección de manejo devolvió HTTP 502 desde la aplicación, pero el registro del SDK de AI Gateway muestra que la respuesta subyacente fue HTTP 403, `type: internal_server_error` e `isRetryable: false`, sin identificador de generación. La idea superó la validación local y la petición llegó al Gateway; no es evidencia de un problema de conexión del navegador. La configuración consultada confirma `oidcTokenConfig.enabled: true` con emisor del equipo y no hay una variable `AI_GATEWAY_API_KEY` configurada. La ruta `/api/estado` confirma que la aplicación responde y que usa OIDC, pero declara `tutorAvailability: not_checked`: no prueba que el Gateway autorice la generación.

El 403 confirma una negativa del lado del Gateway, pero el registro disponible conserva un tipo genérico y no su mensaje interno, por lo que no permite distinguir entre restricciones de cuenta/equipo, créditos o políticas de acceso. Vercel documenta USD 5 de crédito mensual para probar modelos disponibles, así que no se debe atribuir el error a que Gemini 3.8 Flash esté necesariamente excluido del nivel gratuito. Sí existe un antecedente publicado por personal de Vercel de errores `403 RestrictedModelsError` por una restricción temporal en cuentas con créditos gratuitos; es una explicación posible, no una confirmación de este incidente. La versión actual de `POST /api/crear` traduce un 403 a HTTP 503 y muestra una alternativa para abrir la biblioteca; no expone información técnica al niño. Para confirmar la causa hay que revisar en el panel AI Gateway el equipo activo, saldo/estado de créditos y permisos del proyecto o consultar a Vercel con el registro de error. No se han comprado créditos ni habilitado recarga automática.

El alcance de estas comprobaciones es técnico. No son resultados de un piloto educativo ni demuestran mejora en comprensión lectora.

## 6. Operación y costos

El plan gratuito de AI Gateway incluye créditos mensuales, sujeto a límites y disponibilidad. El catálogo de Vercel consultado el 21 de octubre de 2026 mostraba Gemini 3.8 Flash a USD 0.75 por millón de tokens de entrada y USD 3.75 por millón de salida, con descuento promocional visible; no es un costo medido por cuento y puede cambiar. Un cuento tiene un máximo configurado de 1.900 tokens de salida por intento y puede reintentarse una vez; el costo real depende del uso reportado por Gateway. Cada portada añade una solicitud de generación de imagen; FLUX 3 Image figura actualmente a USD 0.05 por imagen en el catálogo, precio que puede cambiar. Una portada no se genera automáticamente al abrir el formulario; se solicita cuando se crea el cuento y el fallo no bloquea la lectura. No se compraron créditos ni se habilitó recarga automática desde el proyecto. El código no garantiza disponibilidad del proveedor.

El modelo de ingresos sigue siendo una hipótesis: **licencias institucionales** para escuelas u organizaciones y **acceso patrocinado** para estudiantes. El MVP no realiza cobros. Para comercializar se deben validar comprador, precio, costos de soporte y contenido, condiciones del hosting y protección de datos. Vercel Hobby no debe asumirse como plan para explotación comercial.

## 7. Límites y siguiente etapa

Antes de un piloto educativo: revisión por docente, definición curricular, autorizaciones y protocolo de evaluación. Propuesta: piloto de cuatro semanas con una institución voluntaria; medir finalización, comprensión con ejercicios equivalentes antes/después, revisión de pistas, latencia y costo por sesión. No hay institución, muestra, ventas ni resultados confirmados.

Antes de mayor tráfico: protección global de uso y presupuesto, monitoreo de errores sin información de menores, evaluación de prompts, políticas de retención del proveedor y revisión de seguridad. Cuentas, panel docente, historial, más relatos y cobros pertenecen a una versión posterior.

## 8. Correspondencia con las bases

| Solicitud de Fase 2               | Entregable o evidencia                                                                       |
| --------------------------------- | -------------------------------------------------------------------------------------------- |
| MVP funcional aplicado al desafío | Biblioteca, relatos por nivel, práctica y pistas con IA                                      |
| Acceso web                        | https://lee-contigo-ia.vercel.app                                                            |
| Pitch de 3 a 5 diapositivas       | Presentación de cinco diapositivas en `entregables/`                                         |
| Anonimato en web y pitch          | Nombre de equipo LeeContigo; sin nombres de participantes, universidades ni países de origen |
| Sustentación                      | Evidencia oficial, recorrido demostrable, límites y modelo de sostenibilidad propuesto       |

La selección y el registro de integrantes y el envío en la plataforma no se realizan desde esta aplicación. Deben completarse por el equipo en los plazos de las bases. No se ha enviado la participación.

### Criterios de calificación de Fase 2

| Criterio             | Peso | Cómo se sustenta                                                                                                       |
| -------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------- |
| Solución al desafío  | 50 % | Mostrar relatos por nivel y una pista generada por IA en el producto real; explicar qué falta validar pedagógicamente. |
| Pitch y presentación | 20 % | Cinco diapositivas con necesidad, enfoque técnico y funcionamiento, apoyadas por una demo breve.                       |
| Facilidad de uso     | 20 % | Recorrido corto, reintentos, regreso al texto, controles accesibles y comprobaciones en móvil/escritorio.              |
| Difusión             | 10 % | Se calcula con los referidos acumulados por los integrantes en la inscripción; no lo genera la aplicación.             |

Las bases excluyen difusión de la calificación del Demo Day, que se calcula sobre 90 %. La calidad del MVP no garantiza la selección o un premio.

## Fuentes técnicas y de operación

- https://vercel.com/docs/ai-gateway/pricing
- https://vercel.com/ai-gateway/models?freeTier=true
- https://ai-sdk.dev/providers/ai-sdk-providers/google
- https://umc.minedu.gob.pe/resultadosenla2024/
- Bases locales: `fuentes/bases_hackathon_futurx_2026.pdf`.
