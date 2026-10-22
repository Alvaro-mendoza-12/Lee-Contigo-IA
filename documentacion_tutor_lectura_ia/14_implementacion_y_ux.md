# 14. Implementación del MVP y experiencia de uso

**Proyecto:** LeeContigo IA · **Corte:** 21 de octubre de 2026  
**Web:** https://lee-contigo-ia.vercel.app  
**Código:** https://github.com/Alvaro-mendoza-12/Lee-Contigo-IA

Este documento describe el producto construido. Los documentos 00 a 13 son el análisis y la planificación anteriores; sus propuestas de funciones futuras no implican que ya estén implementadas.

## 1. Alcance funcional disponible

| Sección | Ruta | Función |
|---|---|---|
| Inicio | `/` | Explica la experiencia y presenta portadas apiladas con cambio suave, pausa y navegación manual. |
| Biblioteca | `/biblioteca` | Dos relatos originales, elección entre dos niveles y acceso a lectura. |
| Lectura | `/leer/[id]?nivel=paso` o `reto` | Relato adaptado, tamaño de letra, lectura en voz del navegador y acceso a preguntas. |
| Práctica | `/practicar/[id]?nivel=...` | Tres preguntas, retroalimentación, reintentos, dos grados de pista, consulta del texto y cierre. |
| Guía adulta | `/acompanar` | Cómo acompañar, qué hace la IA, privacidad, evidencia y alcance de demostración. |
| Privacidad | `/privacidad` | Información que procesa el recorrido y límites del prototipo. |
| Tutor | `POST /api/tutor` | Valida identificadores editoriales y solicita una pista a IA Gateway. |
| Estado | `GET /api/estado` | Información básica de disponibilidad; no expone claves. |

### Relatos y adaptación al nivel

1. **Una luz en el bosque:** Lina, una luciérnaga, ayuda al grillo Tomás a cruzar un río.
2. **La semilla viajera:** Nico aprende a cuidar una semilla y a esperar su crecimiento.

Cada relato tiene una versión **Paso a paso**, con frases más sencillas, y otra **Un nuevo reto**, con mayor riqueza de lenguaje y relaciones que explorar. Las preguntas y las pistas de respaldo pertenecen a esa versión. La selección se conserva en la URL al pasar de biblioteca a lectura y práctica.

La adaptación del relato es editorial y está incluida en el catálogo. La IA genera pistas durante la práctica; no genera cuentos ilimitados, no determina automáticamente el grado del niño y no diagnostica dificultades. Los niveles son opciones de práctica, no equivalencias certificadas de edad o grado escolar.

## 2. Qué aporta la IA

El servidor recibe únicamente `storyId`, `level`, `questionId`, `tier` y `support`. Este último campo solo admite `explore` o `retry`: el modo de ayuda solicitado. No contiene la opción seleccionada ni un identificador del estudiante. Recupera el relato, las opciones y un fragmento de evidencia desde el catálogo. El prompt pide una pista de una o dos frases que oriente hacia el texto sin dar la respuesta. Para Paso a paso pide frases muy cortas; para Un nuevo reto invita a relacionar hechos.

Al confirmar una respuesta incorrecta aparece una acción para pedir apoyo. En modo `retry`, se solicita una acción concreta sobre la evidencia y una pregunta de reflexión, sin asumir la causa del error. Esto cambia la estrategia de ayuda; no clasifica ni diagnostica al niño. El modelo recibe además el objetivo de comprensión de la pregunta. La caché distingue nivel, pregunta, grado de pista y modo de apoyo.

Ejemplo de comprobación real: para la pregunta «¿Qué muestra la solución de Lina?», el modelo pidió revisar la limitación de su luz y lo que decidió hacer, y preguntó qué mostraba eso sobre el uso de lo que tenía. La respuesta provenía de AI Gateway con `source: "ai"` y `support: "retry"`. Es un ejemplo de funcionamiento, no evidencia de una mejora del aprendizaje.

**Tecnología:** Vercel AI SDK 7, AI Gateway y modelo predeterminado `google/gemini-2.5-flash`. Se eligió este modelo después de comprobar que el modelo inicial no era elegible para el saldo gratuito de la cuenta. OIDC permite autenticar el despliegue sin colocar una clave en el navegador. `AI_MODEL` permite una sustitución posterior; antes de cambiarlo deben revisarse disponibilidad, costo y calidad de salida.

Controles implementados:

- Esquema estricto de entrada: no acepta texto libre, nombres ni identificadores ajenos al catálogo.
- Solicitud de hasta 1 KB; comprobación de origen cuando el navegador lo envía.
- Salida estructurada con longitud limitada a 350 caracteres y 45 palabras; filtro de URL, HTML y revelación literal de la opción correcta.
- Tiempo máximo de consulta al modelo de 6,5 segundos, sin reintentos automáticos; hasta 600 tokens de salida.
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

| Capa | Implementación |
|---|---|
| Interfaz y rutas | Next.js 16 App Router, React 19, TypeScript |
| Estilo | CSS adaptable, Nunito Sans, iconos Lucide |
| Ilustraciones | Dos imágenes originales generadas para el proyecto; Next Image con tamaños adaptables |
| Contenido | `lib/stories.ts`; preguntas y evidencia vinculadas por identificador |
| IA | `app/api/tutor/route.ts`, AI SDK y esquema Zod |
| Persistencia | Sin base de datos, cuentas, cookies de perfilado ni almacenamiento local del progreso |
| Publicación | GitHub `main` conectado al proyecto Vercel `lee-contigo-ia` |
| Comprobaciones | Node test runner, Playwright y axe; flujo de GitHub Actions |

## 4. UX y las diez heurísticas de Nielsen

| Heurística | Aplicación concreta |
|---|---|
| Visibilidad del estado | Recorrido de elección, lectura y práctica; pregunta actual; estado de carga al pedir pista. |
| Relación con el mundo real | Lenguaje cotidiano: historia, leer, pista, volver al relato; sin jerga de IA en el recorrido infantil. |
| Control y libertad | Volver a leer, cambiar respuesta, consultar texto sin salir, detener voz y repetir la práctica. |
| Consistencia | Mismos botones, tipografía, navegación y nombres de niveles en todas las pantallas. |
| Prevención de errores | No se confirma una respuesta vacía; controles de pista deshabilitados durante la carga; opciones cerradas. |
| Reconocimiento | El título y el texto de apoyo permanecen accesibles; las acciones tienen etiquetas visibles. |
| Flexibilidad | Dos niveles, tamaño de letra y voz opcional; uso con ratón, toque o teclado. |
| Diseño sencillo | Una acción principal por etapa, colores suaves, contenido sin publicidad ni ranking. |
| Recuperación de errores | Reintentos amables, respaldo ante fallo de IA y página de ruta desconocida con regreso a biblioteca. |
| Ayuda | Guía para docentes/familias, explicación de la pista, acceso a evidencia y aviso de privacidad. |

### Accesibilidad implementada

Enlaces para saltar al contenido, foco visible, HTML semántico, respuestas con controles de radio nativos, etiquetas para iconos que actúan como botones, anuncios de estado y cambios de pregunta con manejo de foco. La experiencia se adapta a móvil y respeta la preferencia de movimiento reducido. Se corrigieron textos pequeños con contraste insuficiente detectados en la revisión automática.

Las portadas cambian cada siete segundos con un movimiento de 850 ms. Solo la portada visible se puede enfocar y abrir; las restantes están ocultas para tecnologías de apoyo e inactivas. Hay controles de anterior, siguiente y pausa. El cambio automático se detiene durante el uso con teclado, al pasar el cursor, cuando el bloque sale de pantalla o cuando se oculta la pestaña. La preferencia de movimiento reducido mantiene el cambio manual sin animación.

El resultado sin infracciones detectadas por axe no equivale a una certificación completa de accesibilidad. Falta una prueba con lectores de pantalla y personas con distintas necesidades.

## 5. Comprobaciones realizadas

- Compilación de producción y comprobación de TypeScript.
- Cinco comprobaciones unitarias: coherencia del catálogo, entradas estrictas, manejo de niveles, plan de apoyo de reintento y filtro de pistas.
- Catorce comprobaciones de navegador sobre flujo completo, selección de relato/nivel, accesibilidad, API, portadas, pausa, movimiento reducido y ayuda después de un error. Incluyen móvil y escritorio, seis rutas sin desbordamiento horizontal y las reglas WCAG A/AA seleccionadas por axe.
- Revisión visual de inicio, lectura y práctica en pantallas de escritorio y móvil.
- Solicitud real a AI Gateway después de habilitar los créditos; la respuesta del tutor se identifica con `source: "ai"`. Las respuestas preparadas se identifican por separado.
- Ocho comprobaciones de navegador adicionales dirigidas a la URL pública: todas aprobadas. Se verificaron además pistas reales de ambas historias y de los dos niveles, y GitHub Actions terminó con resultado satisfactorio para la versión publicada.

El alcance de estas comprobaciones es técnico. No son resultados de un piloto educativo ni demuestran mejora en comprensión lectora.

## 6. Operación y costos

El plan gratuito de AI Gateway incluye USD 5 mensuales para modelos elegibles, sujeto a límites. Se comprobó saldo habilitado de USD 5 antes de las solicitudes de demostración. No se compraron créditos ni se habilitó recarga automática. El saldo y las condiciones deben revisarse antes del concurso; el código no garantiza disponibilidad del proveedor.

El modelo de ingresos sigue siendo una hipótesis: **licencias institucionales** para escuelas u organizaciones y **acceso patrocinado** para estudiantes. El MVP no realiza cobros. Para comercializar se deben validar comprador, precio, costos de soporte y contenido, condiciones del hosting y protección de datos. Vercel Hobby no debe asumirse como plan para explotación comercial.

## 7. Límites y siguiente etapa

Antes de un piloto educativo: revisión por docente, definición curricular, autorizaciones y protocolo de evaluación. Propuesta: piloto de cuatro semanas con una institución voluntaria; medir finalización, comprensión con ejercicios equivalentes antes/después, revisión de pistas, latencia y costo por sesión. No hay institución, muestra, ventas ni resultados confirmados.

Antes de mayor tráfico: protección global de uso y presupuesto, monitoreo de errores sin información de menores, evaluación de prompts, políticas de retención del proveedor y revisión de seguridad. Cuentas, panel docente, historial, más relatos y cobros pertenecen a una versión posterior.

## 8. Correspondencia con las bases

| Solicitud de Fase 2 | Entregable o evidencia |
|---|---|
| MVP funcional aplicado al desafío | Biblioteca, relatos por nivel, práctica y pistas con IA |
| Acceso web | https://lee-contigo-ia.vercel.app |
| Pitch de 3 a 5 diapositivas | Presentación de cinco diapositivas en `entregables/` |
| Anonimato en web y pitch | Nombre de equipo LeeContigo; sin nombres de participantes, universidades ni países de origen |
| Sustentación | Evidencia oficial, recorrido demostrable, límites y modelo de sostenibilidad propuesto |

La selección y el registro de integrantes y el envío en la plataforma no se realizan desde esta aplicación. Deben completarse por el equipo en los plazos de las bases. No se ha enviado la participación.

### Criterios de calificación de Fase 2

| Criterio | Peso | Cómo se sustenta |
|---|---|---|
| Solución al desafío | 50 % | Mostrar relatos por nivel y una pista generada por IA en el producto real; explicar qué falta validar pedagógicamente. |
| Pitch y presentación | 20 % | Cinco diapositivas con necesidad, enfoque técnico y funcionamiento, apoyadas por una demo breve. |
| Facilidad de uso | 20 % | Recorrido corto, reintentos, regreso al texto, controles accesibles y comprobaciones en móvil/escritorio. |
| Difusión | 10 % | Se calcula con los referidos acumulados por los integrantes en la inscripción; no lo genera la aplicación. |

Las bases excluyen difusión de la calificación del Demo Day, que se calcula sobre 90 %. La calidad del MVP no garantiza la selección o un premio.

## Fuentes técnicas y de operación

- https://vercel.com/docs/ai-gateway/pricing
- https://vercel.com/ai-gateway/models?freeTier=true
- https://ai-sdk.dev/providers/ai-sdk-providers/google
- https://umc.minedu.gob.pe/resultadosenla2024/
- Bases locales: `fuentes/bases_hackathon_futurx_2026.pdf`.
