# 18. Rediseño del lector como libro abierto

Actualización del 21 de octubre de 2026. Complementa los documentos 14 y 17.

## Decisiones de experiencia

La vista de lectura ocupa el ancho disponible y elimina la columna de mensajes repetidos. Conserva título, nivel, letra, audio, ampliación y animación. «Opciones» reúne la lectura continua y la explicación sobre movimiento reducido. El recorrido de tres pasos y el número de página permiten saber dónde se encuentra el lector.

El libro tiene dos caras, cubierta, bordes de hojas, curvatura discreta y pliegue central. Texto e imagen alternan de lado. Al avanzar, una hoja con anverso y reverso gira 180 grados sobre el pliegue durante 800 ms; al retroceder gira en sentido contrario. No es un cambio de opacidad del párrafo ni una rotación de toda la pantalla. Las capas de transición están ocultas para tecnologías de apoyo y no contienen controles activos.

La caja del libro mantiene su altura durante los cambios de página. El espacio de la acción final también se reserva, para evitar saltos al llegar al final. Al cambiar la letra, la paginación conserva la posición de lectura mediante párrafo e índice de palabra. Se prefiere terminar en un límite de oración cuando es posible; ninguna palabra se elimina al dividir el relato.

### Teléfonos y ampliación

En pantallas estrechas se presenta una hoja vertical con ilustración y texto, para que dos columnas no reduzcan la legibilidad. El cambio usa una transición horizontal breve en lugar de un gran giro tridimensional. En tabletas y escritorio se conserva el libro de dos caras. Las imágenes mantienen su proporción: se recortan sin estirar a los personajes.

La vista ampliada permite desplazamiento interno, mantiene el foco dentro del diálogo, incluye controles nativos como `summary` en el recorrido por teclado y se cierra con Escape. Al cerrar, el foco regresa al control anterior sin forzar el desplazamiento de la pantalla.

### Movimiento

Actualización solicitada el 22 de octubre: «Animar páginas» comienza activado en los libros de biblioteca y los cuentos creados, también al recargar. La preferencia del sistema ya no desmarca el control; el lector puede desactivarlo durante la lectura. No hay movimiento continuo de acercamiento o respiración de las imágenes dentro del libro. Un nuevo clic puede sustituir la transición en curso; no se acumula una cola de giros. La preferencia de movimiento reducido sigue desactivando los bucles decorativos de la portada.

## Ilustraciones

Se incorporaron cuatro láminas originales de ocho escenas cada una: **32 escenas** en total. Todos los relatos de biblioteca tienen ahora imágenes interiores diferentes, incluidos los dos primeros cuentos que antes repetían una portada.

La secuencia acompaña el progreso narrativo. Si se usa letra muy grande, una escena puede acompañar varios fragmentos con distinto encuadre: no se generan imágenes ilimitadas para cada tamaño de letra. Las imágenes de la biblioteca se generaron durante el desarrollo y se sirven como recursos estáticos. Los cuentos escritos por IA siguen usando la colección decorativa en el modo gratuito, como explica el documento 17.

La procedencia, los archivos y los prompts están en `15_recursos_visuales.md`.

## Reutilización técnica

- `components/book-spread.tsx`: representación compartida del libro, capas anterior y actual, dirección, giro y teclado.
- `components/reader.tsx`: navegación de la biblioteca, nivel, posición, audio, tamaño y diálogo.
- `components/story-creator.tsx`: reutiliza el mismo libro para cuentos generados y conserva la posición al cambiar el tamaño.
- `components/art.tsx`: escenas, recortes proporcionales y texto alternativo.
- `lib/reading.ts`: paginación conservando todas las palabras y buscando límites de oración.
- `app/book.css`: apariencia, pliegue, profundidad, estados y adaptación a dispositivos.

Se aplicaron las skills de React, composición y diseño web de Vercel, Playwright e imagegen. No se añadió una dependencia de animación ni un servicio externo para el giro de páginas.

## Verificación y alcance

- Compilación de producción y comprobación de TypeScript.
- 17 pruebas unitarias, incluidas reconstrucción íntegra del texto y paginación con un párrafo largo.
- 20 recorridos en navegador para escritorio y móvil, incluidos lectura, niveles, giro, acompañamiento, creación simulada, preguntas, rutas, accesibilidad automática y ausencia de desbordamiento.
- El recorrido del lector comprueba que el siguiente clic cambia la escena y el lado del texto sin cambiar altura, posición del libro ni desplazamiento de la ventana.
- Revisión adicional de 30 combinaciones: cinco anchos (320, 390, 768, 1024 y 1440 px) y seis tamaños de letra (24 a 44 px). En esas combinaciones no se encontró desbordamiento horizontal ni texto fuera de la hoja; la cámara de las ilustraciones mantuvo proporción cuadrada.
- Inspección visual de una hoja durante el giro y de las vistas de escritorio y teléfono.
- Recorrido adicional de 574 estados de página: los cuatro cuentos en nivel reto, anchos de 320 y 768 px y letras de 24 y 44 px. No se detectó texto fuera de la hoja ni desbordamiento horizontal en esos estados. Son estados del mismo catálogo repetidos en distintas configuraciones, no 574 relatos.

Estas comprobaciones se realizan en Chromium. No constituyen una prueba con niños, una revisión docente ni una certificación de accesibilidad. Queda pendiente observar tareas con niños y personas adultas, revisar vocabulario y pistas con docentes, comprobar uso real con lectores de pantalla y medir comprensión mediante un piloto autorizado. Un MVP técnicamente operativo puede seguir necesitando mejoras de experiencia y validación pedagógica.

## Investigación consultada

- NN/G: página pública de su investigación de UX infantil; temas de legibilidad, navegación, imágenes e interacción. No se consultó el informe de pago completo. https://www.nngroup.com/reports/children-on-the-web/
- W3C: animación de interacción desactivable y ejemplo específico de giro de páginas que respeta movimiento reducido. https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- MDN: visibilidad de las caras en transformaciones tridimensionales. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backface-visibility
- Vercel: directrices de interfaz, foco, movimiento, imágenes y adaptación del contenido. https://github.com/vercel-labs/web-interface-guidelines
