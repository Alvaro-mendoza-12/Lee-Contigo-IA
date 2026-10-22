# 19. Auditoría UX/UI y propuesta visual de LeeContigo IA

Fecha: 22 de octubre de 2026. Estado: propuesta para revisión, sin implementación.

## 1. Alcance y método

Se inspeccionó la web publicada en https://lee-contigo-ia.vercel.app en escritorio de 1440 × 1000 y móvil de 390 × 844. Se recorrieron inicio, biblioteca, lector, preguntas, creación, acompañamiento, privacidad y página no encontrada. Se observaron selección de nivel, respuesta correcta, reintento, tres errores repetidos y cierre de la práctica. La lectura de código complementa los estados de generación y libro creado; no se solicitó una nueva generación a los proveedores para esta auditoría.

La referencia publicada es el trabajo de la revisión `3b9998a`. Hay cambios locales anteriores a esta auditoría para el guardado de libros y la pila de portadas que todavía no están publicados. Se distinguen de las funciones actuales. Durante esta fase no se modificó el código de la aplicación ni se publicó un despliegue.

Skills aplicadas: Web Design Guidelines y React Best Practices de Vercel, Frontend Design de Anthropic, Playwright para inspección y PDF para leer las bases. Frontend Design se instaló también en el entorno personal de Codex; estará disponible en el catálogo del siguiente turno. Su contenido ya se aplicó a esta propuesta.

Se trata de una evaluación heurística, no de una prueba con niños ni de una certificación de accesibilidad o eficacia pedagógica. Los hallazgos de código se identifican como tales. No se midieron Core Web Vitals en condiciones de campo.

## 2. Conclusión

La identidad visual y el lector abierto ofrecen una base coherente. La mejora más valiosa es acercar la ayuda al momento en que el niño deja de comprender: seleccionar una palabra o frase, entenderla en contexto y practicar con una pregunta guiada. El documento 20 especifica esa función.

No hace falta reconstruir la aplicación. Conviene conservar relatos, generación, imágenes, niveles, voz, tamaño de letra, ampliación, libro animado, preguntas, pistas, guía familiar y rutas existentes, organizándolos con una jerarquía más clara.

## 3. Las diez heurísticas y la escala

Se usa la clasificación de [Jakob Nielsen, Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/):

| Código | Heurística |
|---|---|
| H1 | Visibilidad del estado del sistema |
| H2 | Correspondencia con el mundo real y el lenguaje del usuario |
| H3 | Control y libertad del usuario |
| H4 | Consistencia y estándares |
| H5 | Prevención de errores |
| H6 | Reconocimiento en lugar de recuerdo |
| H7 | Flexibilidad y eficiencia |
| H8 | Diseño estético y minimalista |
| H9 | Reconocer errores y recuperarse |
| H10 | Ayuda y documentación |

Gravedad estimada: **0** sin problema observado en este alcance; **1** baja; **2** media; **3** alta; **4** bloqueo crítico. No se confirmó un bloqueo de gravedad 4. Un 0 no acredita conformidad completa.

### Matriz por pantalla

Cada celda expresa la mayor gravedad observada para esa heurística, considerando también la navegación compartida. Los hallazgos de la tabla siguiente explican el problema y su recomendación.

| Pantalla o estado | H1 | H2 | H3 | H4 | H5 | H6 | H7 | H8 | H9 | H10 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Inicio | 2 | 1 | 3 | 2 | 0 | 2 | 2 | 2 | 0 | 1 |
| Biblioteca | 2 | 1 | 3 | 2 | 0 | 2 | 2 | 2 | 0 | 1 |
| Lector de biblioteca | 2 | 2 | 3 | 2 | 2 | 3 | 3 | 2 | 3 | 3 |
| Preguntas y pistas de biblioteca | 2 | 2 | 3 | 2 | 3 | 3 | 3 | 2 | 3 | 2 |
| Formulario de creación | 3 | 2 | 3 | 2 | 2 | 2 | 2 | 2 | 3 | 2 |
| Libro creado, revisión de componente | 2 | 2 | 3 | 2 | 2 | 3 | 3 | 2 | 3 | 3 |
| Preguntas del cuento creado, revisión de componente | 2 | 2 | 3 | 2 | 3 | 2 | 3 | 2 | 3 | 2 |
| Cierre de la práctica | 2 | 1 | 3 | 2 | 0 | 2 | 2 | 1 | 1 | 2 |
| Para acompañar | 2 | 1 | 3 | 2 | 0 | 2 | 2 | 2 | 1 | 2 |
| Privacidad | 2 | 2 | 3 | 3 | 2 | 2 | 2 | 2 | 2 | 3 |
| Página no encontrada | 1 | 1 | 3 | 1 | 0 | 1 | 1 | 0 | 1 | 1 |

H3 alta en varias pantallas incluye el mismo problema global de navegación móvil, no once defectos independientes. H7/H9/H10 altas en lectura y preguntas incorporan la falta de ayuda contextual y la revelación automática tras errores. No significa que los botones actuales estén rotos.

## 4. Hallazgos y recomendaciones

| ID | Gravedad y heurísticas | Evidencia | Mejora recomendada |
|---|---|---|---|
| A01 | 3 · H1, H3, H4, H6 | Bajo 760 px se oculta la navegación principal sin menú de reemplazo. El encabezado solo conserva inicio y «Vamos a leer». No se marca el enlace de página actual en escritorio. | Navegación móvil compacta con «Leer», «Crear» y «Menú»; dentro de Menú, acompañamiento y privacidad. Indicar la ubicación actual también de forma accesible. |
| A02 | 3 · H2, H6, H9, H10 | El lector no ofrece ayuda para una palabra o fragmento seleccionado. La pausa invita a reflexionar, pero no responde a la dificultad concreta. | «Ayúdame con esta parte»: explicación contextual, ejemplo y pregunta guiada, sin salir del libro. Prioridad pedagógica principal. |
| A03 | 3 · H5, H7, H9 | En producción, tres clics sobre la misma respuesta incorrecta consumen los tres intentos y muestran la explicación completa. En cuentos creados también hay revelación automática al tercer error, según el componente. | Cada nuevo error debe conducir a un apoyo adicional; no revelar automáticamente la solución. Distinguir un nuevo intento de repetir el botón sin revisar la respuesta. Conservar la explicación final en un cierre educativo voluntario o después de resolver. |
| A04 | 3 · H7, H9 | Se eligen dos niveles manuales; las tres preguntas de cada versión están fijadas. Las pistas varían por habilidad, nivel y grado, pero no existe un recorrido adaptativo de preguntas durante la lectura. | Ajustar la intensidad de ayuda y la siguiente pregunta con reglas explícitas, estado temporal y un banco revisado. Diferenciar esta lógica de la generación de texto con IA. |
| A05 | 3 · H3, H7 | En 390 × 844 y tamaño inicial de 24 px, el libro comienza aproximadamente en y=435 y «Siguiente» en y=1033: requiere desplazarse para encontrarlo. | Encabezado lector más compacto y navegación cercana a la hoja. Intentar mostrar libro y controles al tamaño inicial; permitir desplazamiento con letras muy grandes sin recortar texto. |
| A06 | 3 · H6, H9, H10 | En preguntas, la tarjeta de pistas pasa debajo de la pregunta en móvil; su acción queda fuera del primer área visible. | Botón «Necesito una pista» junto a las respuestas; abrir allí el apoyo. Conservar el panel lateral en pantallas anchas si no duplica el contenido. |
| A07 | 2 · H6, H8 | Antes de las portadas hay recorrido, título, selector, explicación de nivel, aviso de selección y promoción del creador. La biblioteca móvil ocupa unos 3197 px. La longitud no es un fallo por sí sola: el problema es el trabajo previo a elegir. | Selector compacto y confirmación breve al cambiar. Conservar «Así empieza» detrás de una acción de vista previa. Acercar las primeras portadas al inicio. |
| A08 | 3 · H1, H5, H9 | Con «Un dragón» —9 caracteres— y revisión adulta marcada, «Crear mi cuento» permanece desactivado. No se informa el mínimo de 12 caracteres. | Explicar junto al campo qué falta: «Añade qué quiere hacer tu personaje». Validación asociada al campo y foco al error. Mantener revisión adulta y límites del servidor. |
| A09 | 2 · H3, H4, H5 | En biblioteca se elige una respuesta y luego se confirma. En cuentos creados, tocar la respuesta la envía inmediatamente al tutor local. | Unificar selección y confirmación con «Comprobar mi idea»; permitir cambiar la selección antes. Conservar todas las preguntas y sus pistas. |
| A10 | 2 · H1, H3, H9 | La creación tiene estado de espera y un límite cliente de 55 segundos, pero no un control visible para cancelar la solicitud. Evidencia de código, no fallo de disponibilidad observado aquí. | «Cancelar» que conserve la idea. Mostrar pasos reales y mensajes de recuperación; evitar porcentajes ficticios y promesas de duración. |
| A11 | 3 · H4, H5, H10 | El aviso publicado describe una solicitud a un proveedor de imágenes y después afirma que el modo gratuito no la hace. La explicación mezcla modos. | Describir primero el modo activo y separar las integraciones opcionales. Cuando se publique guardado local, actualizar simultáneamente el aviso y los mensajes de la interfaz. |
| A12 | 3 · H3, H6, H9 | El libro creado publicado vive en memoria y se pierde al recargar, según el componente y el aviso. El guardado temporal está en cambios locales previos, no en producción. | Completar y revisar «Mis libros» con texto, nivel e ilustraciones, borrado visible y duración clara. No guardar la idea original ni respuestas o identidad. No prometer funcionamiento sin conexión por tener guardado local. |
| A13 | 2 · H1, H6, H8, H10 | Para acompañar ocupa unos 4170 px en móvil. Cambiar el cuento actualiza el destino del enlace, pero el ejemplo de conversación depende del objetivo y no del cuento. | Primero el plan breve; después información ampliable para adultos. Resumir cuento, nivel y objetivo elegidos. Usar ejemplos vinculados al relato. |
| A14 | 1 · H1, H4 | En la primera pregunta se rellena visualmente un segmento mientras el valor accesible del progreso es 0 de 3. Puede ser «actual» o «completado», pero ambos lenguajes no coinciden. | Diferenciar pregunta actual de preguntas terminadas y anunciarlo de la misma manera. |
| A15 | 2 · H2, H7 | Varios controles y ayudas móviles usan 10–12 px, aunque el texto del cuento es de 24 px. «Máxima» tampoco es el último de los once tamaños. | Subir la legibilidad de instrucciones y controles frecuentes. Mantener los once ajustes, con etiquetas coherentes y sin ocultar el aumento del tamaño. No se presenta esto como un incumplimiento automático de WCAG. |
| A16 | 1 · H2, H4, H9 | La página no encontrada dice «hay dos historias», pero hay cuatro. | Usar «Hay historias esperándote» y mantener la salida a la biblioteca. |
| A17 | 2 · H7 | `StoryArt` anuncia 1100 px para todas las imágenes de escritorio. En biblioteca se observó una cubierta de unos 425 px solicitada con `w=1200`; los atlas necesitan una relación distinta. | Definir tamaños por uso y por recorte del atlas; medir carga antes/después. No bajar globalmente la resolución, porque perjudicaría las escenas del libro. |
| A18 | 2 · H3, H5 | Una idea escrita puede perderse al navegar fuera del formulario. El regreso desde prácticas también reinicia estado que no se explica claramente. | Conservar borrador solo en memoria al alternar vistas; advertir antes de descartar trabajo no guardado. No persistir texto libre por defecto. |
| A19 | 2 · H1, H6, H10 | El cierre celebra terminar y lista habilidades, pero no muestra una estrategia concreta usada o una comprobación de transferencia. | Cierre breve: qué estrategia se practicó y una pregunta nueva sobre el mismo texto. Distinguir «completado» de «aprendido». |
| A20 | 2 · H2, H9 | El generador y el tutor están instruidos para 8–10 años. No hay una banda específica de apoyo inicial para lectores de 6–7 años. | Ampliar mediante habilidades lectoras y apoyos, no solo cambiar el número de edad del prompt. Escucha, frases breves y modelado con acompañante; validación docente antes de afirmar adecuación. |

### Aspectos que conviene conservar

- Libro abierto con texto e imagen, animación por acción del lector y opción de desactivarla.
- Tamaño ajustable, lectura por voz, ampliación, texto continuo y flechas de teclado en el libro.
- Niveles reflejados en la URL; se comprobó que «Un nuevo reto» cambia la versión.
- Evidencia textual y tono de reintento sin notas ni comparación con otros niños.
- Etiquetas y semántica de formularios, foco visible y enlace para saltar al contenido.
- Pistas preparadas cuando la IA no responde y procedencia de la ayuda indicada.
- En los 16 estados iniciales observados no hubo desbordamiento horizontal a 390 o 1440 px. Esto no sustituye una revisión completa de accesibilidad.

## 5. Propuesta visual

**Dirección:** conservar LeeContigo como un espacio de lectura tranquilo. El libro y el fragmento que se está comprendiendo llevan el peso visual. La ayuda aparece cuando se necesita, cerca de ese fragmento.

| Token conservado | Color | Uso |
|---|---|---|
| Papel | `#FCFAF5` | Fondo general |
| Hoja | `#FFFEFA` | Libro y superficies |
| Tinta | `#263E33` | Texto principal |
| Bosque | `#245B48` | Acción principal y estado seleccionado |
| Salvia | `#E8EEE4` | Apoyo contextual y selección suave |
| Secundario | `#5E6D63` | Información complementaria |

Contrastes calculados con estos colores sólidos: tinta/papel ≈11,07:1; bosque/hoja ≈7,81:1; secundario/papel ≈5,24:1. Son pares de diseño, no una medición de todos los fondos, transparencias y estados actuales. La referencia para texto normal es 4,5:1, con excepciones descritas por [W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Mantener Nunito Sans, alineación izquierda y espaciado cómodo. Proponer texto de lectura inicial entre 22 y 26 px, controles frecuentes de 16–18 px y superficies táctiles objetivo de 44–48 px. Es una decisión de diseño infantil; WCAG 2.5.8 usa un mínimo de 24 × 24 px con excepciones de separación, controles equivalentes y enlaces en línea, no obliga a que todos sean de 48 px. [Referencia W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

### Organización por pantalla

| Pantalla | Jerarquía propuesta |
|---|---|
| Inicio | Mensaje corto, «Elegir cuento» principal y «Crear cuento» secundario. Pila de portadas existente con pausa. La rotación se conserva como opción; sugerencia para probar: activación voluntaria, limitada al inicio. |
| Biblioteca | Título, selector compacto, portadas. Vista previa expandible. Acceso al creador sin competir con todos los libros. |
| Lector | Título y nivel; letra, escuchar y más opciones; libro; anterior/progreso/siguiente. «Necesito ayuda» disponible junto al texto. Ampliación, animación y texto continuo siguen accesibles. |
| Ayuda contextual | Fragmento seleccionado, explicación de una frase, ejemplo y una pregunta guiada. Mostrar progresivamente para no crear otra columna de texto larga. |
| Preguntas | Una pregunta, opciones, comprobación y ayuda en el mismo contexto. Feedback con evidencia; sin revelación automática por acumular errores. |
| Crear | Idea, ayudas para empezar, nivel, revisión adulta y acción. Espera cancelable. Biblioteca temporal claramente diferenciada cuando se publique. |
| Para acompañar | Preparar la lectura primero; metodología, fuentes y privacidad después, ampliables. |
| Privacidad | Resumen comprensible y detalles completos organizados por actividad. Conservar información material y políticas de proveedores. |
| Cierre y errores | Qué ocurrió, qué puede hacer el niño y una acción principal clara. Evitar diagnósticos, notas y celebraciones permanentes. |

### Esquema del lector con ayuda

```text
LeeContigo                       Leer   Crear   Para acompañar
Una luz en el bosque                      Paso a paso / Un nuevo reto
Letra − +       Escuchar                       Más opciones
┌──────────────────── LIBRO ─────────────────────────┐
│ Texto con «diminuta»       │ Ilustración del cuento │
│ seleccionado suavemente   │                        │
└───────────────────────────────────────────────────┘
Anterior                 Página 1 de 8              Siguiente

Ayuda contextual, solo cuando se pide:
«Diminuta» · Explicación breve · Ver ejemplo · Probemos juntos
```

En móvil, usar hoja vertical y panel de ayuda desplegable, con cierre y retorno al mismo lugar. No forzar dos columnas estrechas. El panel debe poder desplazarse internamente con texto grande y nunca tapar el control que permite cerrarlo.

### Movimiento

Conservar el giro de página porque comunica una acción. Mantener pausa y movimiento reducido. No añadir personajes que se muevan constantemente, confeti, sonidos automáticos ni carruseles dentro de la lectura. Una selección o pista nueva necesita feedback breve y estable, no una animación larga. La frecuencia de tres segundos de la pila pendiente debe revisarse frente a la nueva prioridad de concentración; la opción dinámica no se elimina.

## 6. Revisión técnica con las skills

Ubicaciones verificadas en la copia local; las líneas de StoryCreator incluyen los cambios locales previos, por lo que pueden diferir de la versión publicada:

### components/shell.tsx

- `components/shell.tsx:23` — enlaces principales sin ubicación activa; revisar junto con `app/globals.css:2428`, donde desaparecen en móvil. A01.

### components/library.tsx

- `components/library.tsx:61` — aviso de nivel permanente junto a otras explicaciones; reducir repetición conservando el anuncio accesible. A07.
- `components/library.tsx:107` — vista previa de cada relato; usar divulgación progresiva. A07.
- Importa el catálogo completo desde el cliente; perfilar antes de separar metadatos, vistas previas y contenido de lectura. Evitar enviar preguntas completas a vistas que solo necesitan una cubierta.

### components/practice.tsx

- `components/practice.tsx:202` — diferenciar progreso completado y pregunta actual. A14.
- `components/practice.tsx:314` — repetir envío consume intentos; revelación automática incompatible con la nueva petición. A03.
- `components/practice.tsx:343` — pistas lejos de las respuestas en móvil. A06.

### components/story-creator.tsx

- `components/story-creator.tsx:513` y `:634` — mínimo de caracteres y desactivación sin explicación específica. A08.
- `components/story-creator.tsx:418` — envío inmediato al tocar la respuesta; inconsistente con biblioteca. A09.
- Mantener cancelación de solicitudes y estado transitorio correctamente separados; la nueva ayuda no debe volver a paginar ni reconstruir todo el libro por cada pulsación.

### components/art.tsx

- `components/art.tsx:100` — `sizes` compartido para cubierta y atlas; ajustar según contenedor real y recorte. A17.

### app/not-found.tsx

- `app/not-found.tsx:8` — cantidad de relatos desactualizada. A16.

No se recomienda incorporar un framework de carruseles o un sistema visual nuevo para cuatro relatos. Reutilizar los componentes, cargar la ayuda cuando se solicita y medir red y renderizado antes de optimizaciones mayores.

## 7. Prioridades

1. Ayuda contextual dentro del lector y pistas que progresan sin revelar automáticamente la respuesta.
2. Navegación móvil, acción de ayuda visible y claridad de validación.
3. Adaptación de apoyo y pregunta de transferencia con contenido revisado.
4. Consistencia entre cuento creado y biblioteca; guardado temporal pendiente con privacidad coherente.
5. Reducción de repetición visual, organización para familias y carga de imágenes.

## 8. Referencias de diseño

- [Web Design Guidelines, Vercel](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines): se aplicaron criterios de foco, navegación, mensajes, interacción y movimiento.
- [React Best Practices, Vercel](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices): revisión de datos enviados al cliente, carga condicional y coste de imágenes. No se afirma una mejora de rendimiento sin implementarla y medirla.
- [Frontend Design, Anthropic](https://github.com/anthropics/skills/tree/main/skills/frontend-design): jerarquía, tipografía y composición específicas de un libro infantil; se conserva la identidad elegida.

Las capturas de inspección están en `output/playwright/audit-*.png` y no forman parte del código de producción. La lámina de propuesta 21 es un diseño estático; sus controles y ayudas nuevas no están implementados.
