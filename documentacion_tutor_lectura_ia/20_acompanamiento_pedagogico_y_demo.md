# 20. Acompañamiento pedagógico, ayuda contextual y demostración

Fecha: 22 de octubre de 2026. Estado: análisis y especificación; no se implementaron estas funciones nuevas.

## 1. Decisión principal

La prioridad es **«Ayúdame con esta parte»**: seleccionar una palabra o fragmento del libro, recibir una explicación en contexto con un ejemplo y practicar mediante una pregunta guiada. Si el niño vuelve a equivocarse, ofrecer una pista adicional que cambie la estrategia, sin resolverle la pregunta.

LeeContigo ya incluye IA útil en las pistas y la creación de relatos. Su mayor brecha es que buena parte del acompañamiento empieza al terminar la lectura y no en el momento de la dificultad.

## 2. Correspondencia con el desafío y las bases

La descripción del desafío 5 es la compartida por el usuario: tutor de lectura con IA y relatos adaptados al nivel para cerrar la brecha de comprensión. Las bases generales locales, versión 1.0, no enumeran ese desafío individual; establecen cómo evaluar el MVP.

Las páginas 3–4 de `fuentes/bases_hackathon_futurx_2026.pdf` asignan en Fase 2: solución al desafío 50 %, pitch 20 %, facilidad de uso 20 % y difusión 10 %. Para Demo Day excluyen difusión y puntúan sobre 90 %. La página 2 pide URL y pitch de 3 a 5 diapositivas. La entrega pública debe identificarse por equipo, sin nombres de participantes, centros de estudio o países de origen.

Por ello, la función contextual aporta principalmente a la solución al desafío; la claridad móvil aporta a facilidad de uso; mostrar el cambio de comprensión facilita explicar la propuesta. Estas son prioridades de diseño, no una predicción de puntos ni garantía de ganar. Tener más animaciones o imágenes no es un criterio independiente de la rúbrica. «Cómo lo venden» evalúa claridad e impacto del pitch: no exige implementar cobros dentro del MVP.

## 3. Qué cumple hoy y qué falta

| Funcionalidad actual | Evidencia y alcance | Evaluación |
|---|---|---|
| Cuatro relatos con dos versiones | Paso a paso y Un nuevo reto cambian texto y preguntas. Se comprobó el cambio de nivel. | Cumple adaptación editorial por banda; no mide automáticamente la habilidad del niño. |
| Creación con IA | Produce seis párrafos, tres preguntas, evidencia literal y dos pistas por pregunta según el nivel elegido. | Cumple generación adaptada por instrucción; necesita revisión docente. Crear más cuentos no sustituye acompañar la comprensión. |
| Pistas con IA en biblioteca | Acción de lectura + pregunta de reflexión, con estrategia por habilidad, nivel, primera ayuda o reintento. | Es IA pedagógicamente orientada, pero opera sobre preguntas ya definidas. |
| Pistas de cuentos creados | Se generan junto con el relato; el navegador decide cuál mostrar. | Hay apoyo progresivo preparado con IA; no hay una nueva generación adaptada a cada error. |
| Evidencia del relato | Citas y acceso al párrafo permiten comprobar una respuesta. | Base valiosa para enseñar a volver al texto. Que una cita exista no garantiza que una inferencia o distractor esté bien construido. |
| Pausas durante la lectura | Preguntas generales para imaginar, buscar pistas y conectar ideas. | Son un inicio de acompañamiento; no detectan qué palabra o frase fue difícil. |
| Voz, letra, ampliación y páginas | Apoyos de acceso al texto; preferencia de movimiento reducido. | Conservar. Escuchar puede ayudar a acceder al relato, pero no demuestra por sí solo comprensión. |
| Reintentos y explicación | Feedback amable; se revela la explicación tras tres errores. | Mejorar: la nueva petición exige una pista adicional, no revelación automática por acumular errores. |
| Guía de acompañamiento | Cuento, nivel, objetivo y preguntas para conversar. | Útil para familias; hacer las consignas más específicas del texto. |
| Ayuda para palabra seleccionada | No existe en el lector actual. | Mayor prioridad de implementación. |
| Preguntas adaptativas durante la lectura | Las secuencias actuales son fijas. | Falta decidir la siguiente pregunta según desempeño y apoyo usado. |
| Adecuación a 6–10 años | Prompts actuales orientados a 8–10. | Extender apoyos iniciales y validar con docentes; no basta cambiar la edad del prompt. |
| Privacidad | Pistas de biblioteca reciben IDs y estado de apoyo; no se envía la opción seleccionada. No hay cuenta infantil. | Conservar minimización. Alinear aviso, modos de IA y guardado local antes de publicar cambios. |

## 4. Fundamento pedagógico y límites

IES recomienda enseñar estrategias de comprensión y usar estructura, conversación centrada en el texto y textos elegidos con propósito. Sus recomendaciones tienen distintos niveles de evidencia; no todas tienen el mismo respaldo. Esta guía orienta la secuencia propuesta, pero no evalúa LeeContigo. [IES/What Works Clearinghouse, comprensión K–3](https://ies.ed.gov/ncee/wwc/PracticeGuide/14/Published).

EEF describe clarificar, inferir, preguntar y resumir como estrategias que necesitan enseñanza explícita y práctica hacia la autonomía. Ese respaldo es sobre enfoques educativos, no sobre este producto ni sobre cualquier tutor generativo. [EEF, Reading comprehension strategies](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/reading-comprehension-strategies).

Para quien comienza a leer, vocabulario, decodificación y fluidez son necesidades diferentes. La aplicación se centra en comprensión y debe ofrecer lectura compartida o voz sin presentarse como sustituto de la instrucción inicial. [IES, habilidades fundacionales K–3](https://ies.ed.gov/ncee/wwc/PracticeGuide/21/Published).

El rango 6–10 es orientativo. No se pedirá fecha de nacimiento para asignar dificultad ni se diagnosticará dislexia, capacidad o grado escolar. Los criterios de longitud indicados abajo son hipótesis editoriales para validar, no estándares clínicos o pedagógicos universales.

## 5. Función prioritaria: ayuda contextual

### Interacción

1. El niño lee la misma página y selecciona una palabra o una frase.
2. Aparece «Ayúdame con esta parte». Seleccionar por sí solo no dispara una solicitud ni cambia la página.
3. El apoyo conserva el fragmento visible y ofrece significado en ese relato, un ejemplo breve y una pregunta guiada.
4. El niño puede escuchar la explicación, probar la pregunta o cerrar y seguir leyendo.
5. Una respuesta incorrecta conduce a otra pista con una acción distinta. No se envía la opción elegida al modelo.
6. Se comprueba comprensión con otra pregunta sobre el mismo pasaje y luego se regresa al libro en el mismo lugar.

En móvil o con dificultades para seleccionar, «No entendí esta parte» permite elegir una oración de la página con botones amplios. Con teclado existe el mismo camino. No se convierte cada palabra en un pequeño botón permanente ni se elimina el copiar/seleccionar nativo.

### Ejemplo de contenido, redactado para la propuesta

Palabra: **«diminuta»**, en el inicio de Un nuevo reto de Una luz en el bosque.

- Explicación: «Aquí, diminuta significa muy pequeña. La palabra describe el tamaño de la luz de Lina».
- Ejemplo: «Una hormiga se ve diminuta junto a una mochila».
- Pregunta guiada: «¿Cómo imaginas esa luz al compararla con todo el río?».

Esto enseña vocabulario. La siguiente comprobación debe pedir una inferencia distinta, no repetir como pregunta la definición que se acaba de ofrecer. Explicar una palabra solicitada es legítimo; evitar revelar la solución significa no resolver por anticipado la pregunta de comprensión que se está practicando.

Para un fragmento difícil, la IA debe conservar la idea original, dividir la relación en pasos y señalar dónde releer. No sustituir el cuento completo ni inventar detalles sobre personajes, motivos o causas.

### Contenido de la respuesta

| Elemento | Regla propuesta |
|---|---|
| Fragmento | Solo texto del libro seleccionado y validado. Selección máxima inicial de 180 caracteres o 35 palabras, lo que ocurra primero. Si excede, pedir elegir una parte más corta. |
| Explicación | Una idea por frase; hasta unas 25 palabras en apoyo estándar. Para lectura inicial, intentar 15 palabras y permitir escuchar. |
| Ejemplo | Cotidiano, corto y claramente separado de los hechos del cuento; no introduce datos sobre el niño. |
| Pregunta | Una sola operación: localizar, comparar, conectar o explicar. No encadenar varias preguntas. |
| Evidencia | Referencia a párrafo/oración existente. Validar que coincida con el texto; no tratar coincidencia literal como garantía semántica. |
| Pista adicional | Cambia dónde mirar o qué comparar; no repite la primera con sinónimos ni incluye la respuesta u opción correcta. |
| Origen | Indicar «Ayuda con IA» o «Ayuda preparada», sin convertirlo en contenido dominante de la lectura. |

Mostrar explicación primero; ejemplo y pregunta en una secuencia breve. Los tres contenidos están disponibles, pero no se despliega un bloque largo que desplace el libro.

## 6. Pistas y adaptación

### Secuencia de apoyo

| Momento | Respuesta del sistema | Qué evita |
|---|---|---|
| Primera duda | Aclarar palabra o relación; proponer una pregunta breve. | Dar la opción correcta o resolver toda la tarea. |
| Primer error | Pista 1: indicar una oración y una acción de observación. | Atribuir una causa psicológica al error. |
| Nuevo error | Pista 2: guiar una comparación, causa/consecuencia o secuencia. | Mostrar automáticamente la explicación final. |
| Sigue costando | Ofrecer escuchar/releer, una versión más sencilla o acompañamiento adulto; permitir descansar o seguir leyendo. | Bucle infinito, castigo, contador de fallos público o revelación automática. |
| Comprende | Explicación breve vinculada a evidencia y una nueva comprobación comparable. | Confundir un acierto asistido con aprendizaje consolidado. |

Ejemplo de progresión para comprender la solución de Lina:

- Pista 1: «Relee la parte donde Lina compara su luz con el río. ¿Qué dificultad encuentra?».
- Pista 2: «Piensa en avanzar por un camino poco a poco. ¿Qué necesitaría mirar Tomás antes de dar otro salto?».

La IA no debe decir «la respuesta es B» ni parafrasear la solución completa. Los filtros literales actuales son útiles, pero no garantizan que una paráfrasis no revele la solución. Hace falta un banco de ejemplos revisado y una alternativa preparada cuando la salida sea dudosa.

### Qué será adaptativo y qué será IA

- **Reglas en el navegador:** decidir si mantener la dificultad, ofrecer apoyo más concreto o recomendar Paso a paso, considerando solo esta sesión. No cambiar el nivel sin que el niño lo sepa y pueda rechazarlo.
- **Banco revisado:** seleccionar una pregunta más directa o una inferencia equivalente, con respuesta y evidencia verificadas por una persona. Una adaptación fiable no exige generar cada pregunta en vivo.
- **IA:** explicar el fragmento en contexto y formular la acción/pregunta guiada dentro de límites claros; variar la ayuda por nivel, habilidad y etapa.
- **Comprobación:** una pregunta nueva sobre el mismo texto, de habilidad y dificultad comparables. No es una prueba de impacto longitudinal.

El servidor no conoce por qué se equivocó un niño si no recibe su respuesta; no debe fingir un diagnóstico individual. Basta conocer la habilidad solicitada y la etapa de apoyo para variar el andamiaje. La IA no toma sola decisiones de nivel escolar.

### Habilidades lectoras, sin pedir edad

| Recorrido | Apoyo previsto |
|---|---|
| Paso a paso con acompañamiento inicial | Escuchar oración o palabra, texto breve por hoja, una consigna cada vez, ejemplos concretos y adulto disponible. Revisar adecuación para lectores de 6–7 años. |
| Paso a paso con mayor autonomía | Localizar información, explicar una causa sencilla y consultar palabras cuando haga falta. |
| Un nuevo reto | Vocabulario por contexto, inferencias entre dos señales y justificación con evidencia. |

Se conservan los dos niveles actuales. El acompañamiento inicial es una intensidad de apoyo, no una etiqueta de capacidad ni un registro de edad. Una elección simple al comenzar y recomendaciones reversibles evitan añadir un examen de ingreso al MVP.

## 7. Requisitos para una implementación posterior

### Funcionales

- RF01: seleccionar palabra o fragmento del texto actual y pedir ayuda explícitamente.
- RF02: alternativa por botones y teclado para elegir una oración, sin depender de arrastrar.
- RF03: explicación contextual, ejemplo, pregunta guiada y evidencia del relato.
- RF04: pistas graduadas tras nuevos intentos, sin revelación automática de la solución.
- RF05: volver a la misma página y posición al cerrar; conservar tamaño y nivel.
- RF06: escuchar y detener la ayuda si la síntesis de voz está disponible; informar si falla.
- RF07: recomendar apoyo más sencillo de forma reversible; no cambiarlo silenciosamente.
- RF08: elegir una pregunta comparable del banco revisado para comprobar transferencia inmediata.
- RF09: ayuda preparada si la IA tarda, falla, sale del tema o no cumple el formato.
- RF10: cancelar una solicitud; ignorar respuestas tardías de una selección anterior.
- RF11: extender después el apoyo a cuentos creados, con contenido verificado y el mismo patrón visual.
- RF12: conservar creación, ilustraciones, niveles, navegación del libro, prácticas y funciones para familias.

### Calidad, accesibilidad y operación

- Feedback de solicitud inmediato, sin prometer tiempo exacto. Objetivo inicial a medir: hasta 8 segundos para ayuda en vivo; después ofrecer contenido preparado sin bloquear el libro.
- Una petición activa por ayuda; deduplicación y caché por texto/versión, selección, nivel, habilidad y etapa, nunca por identidad infantil.
- Panel con cierre visible, foco gestionado, Escape y retorno de foco; en teléfono, altura contenida y desplazamiento interno. Probar zoom y texto grande.
- Marcar selección con fondo suave y contorno además de color; no ocultar el texto original. Contraste suficiente, controles amplios y movimiento reducido.
- Salida estructurada y validada; sin HTML, enlaces, datos personales, hechos del cuento inventados ni instrucciones ajenas al texto.
- No activar herramientas externas o navegación web desde la selección. Tratar el relato generado como datos, no instrucciones.
- Medir latencia y errores con metadatos técnicos; no registrar selecciones asociadas a un niño, respuestas o conversaciones completas.
- Mantener gratuidad configurada y presupuesto vigente; no comprar créditos ni añadir un servicio de imágenes para esta función de texto.

## 8. Privacidad y límites del contexto

Para relatos de biblioteca, la petición debe llevar identificador, versión/nivel, párrafo y rango validado, habilidad y etapa de apoyo. El servidor reconstruye la selección del catálogo. No enviar nombre, edad exacta, escuela, voz, texto libre, respuesta seleccionada ni un perfil persistente.

Para cuentos generados, el servidor no conserva hoy un catálogo de cada libro. No basta confiar en un texto arbitrario enviado por el cliente: una futura integración necesita verificar que el contenido fue emitido por la aplicación, por ejemplo con un paquete firmado, limitado y con vencimiento. Eso puede evitar una base de perfiles, pero requiere su propio diseño y revisión. La primera demo debe usar el catálogo revisado; no prometer que esta verificación ya existe.

Los intentos y la intensidad de ayuda permanecen en memoria. Si se activa el guardado local pendiente, guardar solo libro, nivel e ilustraciones durante el periodo comunicado; excluir idea original, respuestas y dificultades del lector. Usar el borrado del sitio y explicar el acceso desde un navegador compartido. No equivale a sincronización ni a funcionamiento sin conexión.

## 9. Aplicación de Nielsen a la nueva ayuda

| Heurística | Decisión concreta |
|---|---|
| H1 Estado | «Preparando una ayuda…», origen y etapa; mantener el fragmento señalado. |
| H2 Lenguaje | «No entendí esta parte», explicación cotidiana y ejemplos concretos. |
| H3 Control | Pedir, cancelar, cerrar, escuchar/detener y volver al mismo lugar. |
| H4 Consistencia | Mismo patrón en biblioteca y cuento creado; mismas acciones de respuesta y comprobación. |
| H5 Prevención | Rango dentro del texto, límite de selección, no doble solicitud y validación antes de mostrar. |
| H6 Reconocimiento | Libro y evidencia accesibles junto al apoyo; no exigir recordar el pasaje de otra pantalla. |
| H7 Flexibilidad | Apoyo inicial, niveles existentes, teclado, toque y voz; recomendaciones reversibles. |
| H8 Minimalismo | Una explicación y una pregunta a la vez; sin chat vacío, avatares en movimiento o paneles permanentes. |
| H9 Recuperación | Nueva estrategia tras el error y alternativa preparada; no culpabilizar ni revelar automáticamente. |
| H10 Ayuda | Ejemplo situado en la tarea y una instrucción breve para seleccionar; detalle para adultos aparte. |

La auditoría completa por pantalla está en el documento 19.

## 10. Qué aporta más valor ante el jurado

| Prioridad propuesta | Valor observable | Esfuerzo relativo |
|---|---|---|
| 1. Ayuda contextual del catálogo | La IA interviene exactamente donde hay una dificultad y el niño vuelve a comprender el pasaje. | Medio; permite reutilizar tutor, validaciones y libro. |
| 2. Segunda pista sin solución | El apoyo cambia tras otro error; evita que «tres clics» sustituyan pensar. | Bajo a medio sobre la práctica existente. |
| 3. Pregunta adaptada y de transferencia | Muestra una consecuencia del apoyo en la siguiente tarea. | Medio con banco revisado; mayor si todo se genera en vivo. |
| 4. Navegación móvil y ayuda cercana | El niño encuentra la ayuda y regresa sin perder el libro. | Bajo a medio. |
| 5. Guardado local y continuidad | Reduce frustración al recargar y conserva el trabajo creativo. | Trabajo previo local pendiente; revisar borrado, privacidad y carreras de guardado. |

No priorizar nuevas animaciones, más portadas ni un tablero de estadísticas antes de cerrar el ciclo de comprensión. Las funciones visuales existentes se mantienen.

## 11. Recorrido propuesto de demostración, unos 3 minutos

Es un guion para la función futura, no un recorrido que ya pueda ejecutarse completo. Ajustar su duración al tiempo que indiquen los organizadores. El adulto que presenta simula el caso sin exponer datos de un niño.

| Tiempo aproximado | Acción | Evidencia que verá el jurado |
|---|---|---|
| 0:00–0:25 | Abrir Una luz en el bosque en Un nuevo reto y mostrar la frase con «diminuta». Plantear una pregunta inicial de comprensión y simular dificultad. | Hay un texto y una dificultad concreta, no solo un generador. |
| 0:25–0:55 | Seleccionar «diminuta» y pulsar «Ayúdame con esta parte». Escuchar o leer significado y ejemplo. | La explicación usa el sentido del cuento y lenguaje sencillo. |
| 0:55–1:25 | Probar una pregunta guiada de inferencia y elegir una respuesta incorrecta preparada para la demo. | La ayuda no acusa ni otorga una nota; invita a releer una oración. |
| 1:25–1:55 | Volver a equivocarse. Pedir o recibir el siguiente apoyo anunciado. | La segunda pista cambia la estrategia sin mostrar la solución completa. |
| 1:55–2:25 | Volver al fragmento, comparar dos señales y acertar. | Feedback con evidencia y explicación del razonamiento, no solo «¡bien!». |
| 2:25–2:45 | Resolver una pregunta distinta pero comparable sobre por qué Lina esperaba a Tomás en cada piedra. | Una comprobación inmediata de comprensión después del apoyo. No demuestra eficacia a largo plazo. |
| 2:45–3:00 | Mostrar que se puede seguir leyendo, cambiar apoyo o abrir un libro propio; mencionar alternativa preparada y ausencia de perfiles infantiles. | El tutor se integra al producto existente y puede recuperarse de fallos. |

Antes de la demo: revisar con docente el pasaje, ejemplos, distractores y pistas; comprobar el proveedor real y la recuperación. Si se usa una respuesta preparada, decirlo. No presentar caché o una simulación como una generación nueva en vivo. No afirmar mejoras porcentuales del aprendizaje sin un piloto.

### Qué se puede demostrar ahora

Versiones distintas, lectura ilustrada, ajuste de letra, voz disponible según navegador, ampliación, pausas reflexivas, preguntas, pistas de IA o preparadas y evidencia del texto. La selección de palabras, el nuevo esquema sin revelación automática y la adaptación de preguntas siguen siendo propuestas.

## 12. Validación posterior propuesta, sin ejecutar implementación en esta fase

1. Revisión docente: sentido de la explicación, ejemplo útil, alineación de pregunta y evidencia, progresión real y ausencia de respuesta revelada.
2. Casos de seguridad: palabra ambigua, fragmento largo, selección fuera del libro, texto manipulado, proveedor caído y salida inventada.
3. Recorrido accesible: móvil, teclado, lector de pantalla, texto grande, cierre de panel y retorno al lugar de lectura.
4. Piloto autorizado: ¿puede pedir ayuda sin instrucciones?, ¿entiende el ejemplo?, ¿responde una pregunta comparable después?, ¿vuelve al texto? Registrar solo lo indispensable con protocolo y consentimiento aplicable.
5. Medir acierto independiente, acierto con apoyo, uso de evidencia y nivel de ayuda como categorías distintas. No confundir finalizar un cuento con cerrar la brecha lectora.

## 13. Relación con el trabajo previo pendiente

El guardado local de hasta seis libros por siete días y la rotación de cuatro portadas cada tres segundos fueron preparados localmente antes de que se pidiera detener cambios y auditar. No están publicados en esta fase. Deben revisarse con esta propuesta: borrado individual con deshacer o confirmación, estado de carga de la biblioteca, aviso coherente y confirmación de guardado solo al terminar la última escritura de texto e imagen. La rotación debe seguir siendo pausable y respetar movimiento reducido; no se extiende a la lectura.

La función contextual se implementaría sobre los componentes existentes. No hay necesidad de reconstruir la aplicación, añadir cuentas infantiles, cambiar de identidad visual o contratar otro proveedor para presentar este avance.
