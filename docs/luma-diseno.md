# Luma: personaje 3D de la referencia del usuario

La revisión 3 recrea en Blender 5.2.2 LTS la imagen proporcionada por el usuario. La imagen es la referencia visual del modelo; no se utiliza como plano para simular al personaje en los renders. La escena incluye geometría independiente para cabeza, cara, ojos, sonrisa, lengua, mejillas, antenas, abdomen, manos, alas, hojas del libro y marcapáginas.

## Aspecto

Se siguen la silueta de luciérnaga, la cara de vainilla con sonrisa abierta, los ojos negros brillantes, las mejillas rosadas, el cuerpo verde jade, las esferas doradas de las antenas, las cuatro alas nacaradas con nervaduras blancas y el libro verde con cinta violeta de la referencia. Las alas tienen volumen, membranas curvas, transmisión de luz, borde rosado y color azul/lila. El libro incluye hojas curvas, pliegue, renglones y un marcapáginas con corte en V.

La iluminación usa Cycles, materiales con reflejos y dispersión suave, denoising y un brillo compuesto con alfa transparente. La referencia queda junto al personaje en la escena de Blender y está empaquetada en el archivo editable.

## Animaciones e integración

Los cinco clips son **Saludar, Leer, Pensar, Celebrar y Volar**. Cada uno tiene 48 fotogramas a 24 fps. El saludo levanta la mano, la mueve tres veces, inclina la cabeza y eleva suavemente el cuerpo. El vuelo combina aleteo, balanceo, giros y desplazamiento; los renders incluyen el movimiento de las alas en profundidad.

La bienvenida muestra el vuelo. Tocar el personaje o pulsar Enter hace que salude y después vuelva a volar. La guía inicial usa el mismo modelo. El lector, el creador y la práctica muestran gestos acordes con la actividad; las decoraciones y la celebración también usan esta versión.

La web presenta secuencias transparentes WebP con 48 cuadros en seis columnas y ocho filas. Los archivos tienen sufijo `v3` para que las pestañas puedan cargar el nuevo diseño. El póster estático permite ver al personaje cuando el movimiento está desactivado o falla la carga de una secuencia. No se requiere WebGL ni se añadieron dependencias.

La animación se pausa fuera de pantalla y al ocultar la pestaña. Los controles respetan la preferencia de movimiento reducido y se sincronizan con Ajustes de lectura. El sonido del saludo utiliza las preferencias y el motor de audio existentes, apagados por defecto.

## Fuentes y regeneración

- `assets/blender/referencia-luma.png`: imagen entregada por el usuario.
- `assets/blender/crear-luma.py`: geometría, materiales, controles, cámara, iluminación, compositor y clips.
- `assets/blender/luma-referencia.blend`: escena editable con la referencia empaquetada.
- `assets/blender/luma-referencia.glb`: modelo 3D con cinco clips, para reutilización.
- `assets/blender/luma-vuelo.webp`: vista previa animada independiente.
- `assets/blender/empaquetar-luma.mjs`: optimización de los renders para la web.
- `public/characters/luma/`: póster, secuencias, manifiesto y procedencia.

Ejecutar Blender en segundo plano con `--factory-startup --python assets/blender/crear-luma.py -- --preview` para el render de revisión, y con `--python assets/blender/crear-luma.py -- --render-only` para las secuencias de la escena guardada. `--cpu` permite regenerar sin una GPU NVIDIA. Después ejecutar `node assets/blender/empaquetar-luma.mjs`.

Las imágenes intermedias se guardan en `artifacts/luma-frames`, fuera de la entrega web. `--resume` solo debe usarse si los cuadros existentes pertenecen a la misma revisión.

## Comprobaciones de entrega

La entrega se preparó sobre la versión más reciente de `origin/mejoras`, conservando sus cambios de continuidad de lectura. Pasaron la compilación de producción, TypeScript, ESLint, las 117 pruebas de lógica y diez recorridos existentes de lectura, presentación inicial, celebración, accesibilidad y movimiento reducido en escritorio y móvil.

En el navegador se comprobó el saludo con Enter, el retorno al vuelo, el silencio por defecto, el sonido opcional, la pausa fuera de pantalla, la sincronización con Ajustes, los gestos de reintento y acierto y la presencia del personaje en el creador. No hubo desbordamiento a 320, 390, 768 y 1440 px. Con movimiento reducido no se solicitaron las secuencias; activarlas expresamente funcionó.

El póster WebP pesa aproximadamente 31 KB; la secuencia de vuelo, 804 KB. Las secuencias restantes se cargan al necesitar cada gesto. Se verificaron los cinco clips del GLB y los 48 cuadros de cada secuencia. Estas son comprobaciones de funcionamiento y presentación, no una validación con niños.
