# Ayuda breve, voz y catálogo ampliado

Fecha: 22 de octubre de 2026. Cambios implementados para primaria; la eficacia educativa sigue pendiente de un piloto.

## Cambios

- **No entendí:** explicación de hasta 24 palabras, ejemplo de hasta 14 y pregunta guiada de hasta 12. Se piden frases completas y vocabulario cotidiano. La explicación y la pregunta aparecen primero; «Ver un ejemplo» despliega el ejemplo. Se conservan selección de fragmentos, ayuda del párrafo y tres etapas sin chat abierto.
- **Escuchar ayuda:** ElevenLabs narra explicación, ejemplo y pregunta con la voz elegida para el libro. Abrir la ayuda detiene la lectura. Cerrar, cambiar de página o pedir otra pista detiene su audio. Si el servicio falla se conserva la voz española del dispositivo.
- **Dos cuentos originales:** El sendero de las huellas y El buzón del bosque. Cada uno tiene dos textos según nivel, cuatro párrafos, cuatro escenas y tres preguntas con dos pistas y evidencia. El catálogo tiene doce relatos.
- **Portadas completas:** las flechas avanzan por tarjetas enteras. Dos por fila en teléfono, tres en tablet y cuatro en escritorio. Se conservan dedo y teclado.
- **Formato estable:** títulos largos con ajuste de línea, tarjetas consistentes y encabezados que se adaptan sin imponer alturas vacías en móvil. La paginación considera palabras y caracteres y conserva los rangos de voz y selección.

## Arquitectura y privacidad

Se mantiene navegador → `/api/lectura/ayuda` → AI Gateway, OpenRouter o Cloudflare → validación → ayuda contextual. Las entradas siguen restringidas a identificadores editoriales, selecciones acotadas o párrafos creados con autorización. No se reciben respuestas libres ni se añade un perfil del niño.

El servidor firma el texto exacto que se puede narrar mediante HMAC, durante diez minutos y con un dominio separado del de los cuentos. `/api/narrar` verifica firma, texto, rango y voz: un permiso de libro no autoriza otra ayuda ni viceversa. No se guardan dudas ni audio de ayuda en la caché editorial del servidor. La página de privacidad explica el envío del contenido de la ayuda a ElevenLabs. Las claves permanecen en variables del servidor.

| Operación | Espera del cliente | Límite de función | Presupuesto del proveedor |
| --- | --- | --- | --- |
| Ayuda | 22 s | 20 s | 10,5 s compartidos entre proveedores |
| Voz | 22 s | 20 s | 12 s |

El margen evita abandonar antes de la respuesta del servidor. La cancelación explícita y los límites por instancia se conservan. Las frases recortadas o inseguras usan ayuda preparada, identificada por su origen. La disponibilidad de proveedores gratuitos puede variar.

## Cómo incorporar más cuentos

`Story.category` es obligatorio. `Library` recorre `storyCategories` y distribuye los relatos por ese campo, sin listas manuales de identificadores por fila. Un cuento nuevo adopta la tarjeta, nivel y navegación de su categoría.

1. Agregar un objeto `Story` al catálogo e incluirlo en `stories`.
2. Registrar su identificador en `storyIds`, usado por las validaciones del servidor.
3. Incluir categoría, título, arte, dos textos distintos, tres preguntas por nivel, párrafo de evidencia y dos pistas por pregunta.
4. Registrar las imágenes y sus descripciones accesibles en `components/art.tsx`. Las nuevas láminas tienen cuatro escenas en una cuadrícula 2 × 2.
5. Comprobar lectura, categorías, preguntas, voz y correspondencia de ilustraciones. Solicitar revisión docente antes de un piloto.

Los libros personales mantienen el guardado local existente: seis libros durante siete días. No se publican automáticamente en el catálogo compartido.

## Archivos afectados

| Área | Archivos principales |
| --- | --- |
| Ayuda | `lib/reading-help.ts`, `lib/reading-help-copy.ts`, `app/api/lectura/ayuda/route.ts`, `components/reading-help.tsx`, `app/reading-help.css` |
| Voz | `lib/narration.ts`, `components/answer-audio.tsx`, `components/use-narration.ts`, ambos lectores, privacidad |
| Relatos e ilustraciones | `lib/discovery-stories.ts`, catálogo y módulos editoriales, `components/art.tsx`, `public/images` |
| Biblioteca y lectura | `components/library.tsx`, `components/story-shelf-row.tsx`, `lib/reading.ts`, estilos de libro y catálogo |

## Aceptación y pruebas

| Criterio | Comprobación |
| --- | --- |
| Ayuda breve y progresiva, ejemplo desplegable | Unitarias y `reading-help.spec.ts` |
| Voz elegida sin solapar narraciones | Navegador con audio y llamada real a ElevenLabs |
| Autorización del texto exacto | HMAC, expiración, alteración, separación de permisos y rechazo de texto abierto |
| Doce cuentos, dos niveles y evidencia | Unitarias y recorrido por los doce lectores |
| Flechas de portadas completas | Regresión a 320, 390, 768 y 1440 px, dedo y teclado |
| Cuatro escenas por cuento nuevo | Recorrido de ambos relatos en escritorio y móvil |
| Paginación sin perder texto | Unitarias con palabras largas y límites visuales del texto |
| Accesibilidad | axe WCAG 2 A/AA, 2.1 AA y 2.2 AA; foco, etiquetas y alternativa a gestos |

Primera ejecución: 35 pruebas unitarias y 60 recorridos de navegador aprobados; compilación y TypeScript correctos. La inspección visual detectó y corrigió una separación excesiva del encabezado móvil.

Prueba real local: explicación de IA en 4,5 s y audio ElevenLabs/Daniel válido en 5,4 s. Una ayuda adicional sin puntuación final activó el respaldo de validación. Se reforzó la instrucción de usar punto final manteniendo el rechazo de frases recortadas. El cierre de entrega consigna las comprobaciones finales y de producción.

## Recorrido para el jurado

Abrir Un nuevo reto → Una luz en el bosque. Marcar «diminuta» y pedir ayuda; en móvil también existe «No entendí». Leer la explicación corta, desplegar el ejemplo y escucharla. Pedir otra pista, volver al pasaje y explicar su sentido con palabras propias. En la práctica, mostrar el aviso de error, buscar evidencia y reintentar. El cierre muestra habilidades practicadas sin atribuir dominio por completar preguntas.

Las pruebas técnicas y la demostración no sustituyen validación pedagógica con estudiantes.

### Cierre de verificación

- Compilación y TypeScript correctos; 35 unitarias y 60 recorridos completos de navegador aprobados tras corregir el encabezado móvil.
- 12 comprobaciones adicionales aprobadas en la URL pública: ayuda, voz, selección, portadas completas y ambos cuentos nuevos, en escritorio y móvil.
- En producción se recibieron dos ayudas reales de IA en 2,35 s y 1,13 s, y audio ElevenLabs/Daniel válido en 1,17 s. Son observaciones puntuales, no garantías de latencia.
- La revisión de esas respuestas motivó una validación adicional: una sola pregunta por reflexión y rechazo de preguntas que terminen dando la respuesta con «verdad». Se añadieron instrucciones para evitar exageraciones imprecisas. Tras el ajuste pasaron nuevamente las 35 unitarias y ocho recorridos específicos de ayuda, además de compilación y TypeScript.
- Se inspeccionaron capturas de escritorio y móvil y se buscaron las 62 credenciales configuradas en fuentes y archivos de JavaScript públicos, sin encontrarlas. Las capturas, audio de prueba y reportes temporales quedan en `output/playwright`, excluido de Git y del despliegue.
