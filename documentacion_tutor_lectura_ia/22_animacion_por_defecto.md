# 22. Animar páginas activado por defecto

Solicitud del 22 de octubre de 2026. Rama: `codex/animar-paginas`.

## Cambio autorizado

Los libros de biblioteca y los cuentos creados abren con «Animar páginas» marcado. Recargar vuelve a activar ese valor inicial. Al comenzar otro cuento desde el creador también se restablece la animación.

La preferencia de movimiento reducido del sistema ya no desmarca este control. Se conserva la posibilidad de apagarlo durante la lectura y los bucles decorativos siguen respetando la preferencia del sistema. La animación ocurre al pasar una hoja, sin movimiento continuo dentro del libro.

Se eliminaron dos efectos que sobreescribían el valor inicial. Se corrigió el mensaje de opciones para describir el comportamiento actual.

## Verificación

- Compilación de producción aprobada.
- `tsc --noEmit` aprobado.
- 17 pruebas unitarias aprobadas.
- 20 recorridos Playwright aprobados en escritorio y móvil, con comprobaciones axe en las rutas existentes.
- La regresión del lector verifica el valor activo con movimiento reducido, desactivación manual, reactivación, giro de hoja y valor activo después de recargar.
- El recorrido del cuento creado verifica el valor inicial activo también con movimiento reducido.

Las comprobaciones automáticas de accesibilidad no son una certificación. Este cambio no implementa ayuda contextual, modifica los tiempos de espera ni cambia el esquema pedagógico de pistas. Esas propuestas continúan en auditoría.

La rama parte de la versión publicada `3b9998a`. El trabajo previo no publicado de guardado de libros y carrusel se conserva en el directorio principal del proyecto, sin incorporarse a este cambio.
