# Piero: inicio y navegación

Rama: `Piero`. Alcance: los tres bloques asignados a Piero en el plan del 22 de octubre de 2026.

## Cambios

- Menú compartido con Cuentos, Crear y Acompañar. La sección actual tiene fondo amarillo, subrayado y `aria-current="page"`. Cuentos también se marca durante la lectura y la práctica.
- Acompañar aparece en el menú, el pie y el título de su página.
- Tres accesos principales en el inicio. Cuentos lleva al catálogo y mueve el foco para continuar con teclado.
- Se retira el selector de nivel del inicio y la biblioteca. La apertura normal usa `paso`; los enlaces existentes con `?nivel=reto` siguen funcionando para la integración posterior del selector en Ajustes.
- Fondo decorativo existente con `background-size: cover`, sin ocupar espacio adicional ni cubrir controles. Espacios y letras fluidos con `clamp()`.
- Accesos con grilla adaptable; portadas grandes y deslizables en teléfonos, grilla con `auto-fit` en tabletas y escritorio. Se conservan flechas, gestos y teclado del catálogo.
- Estilos nuevos en `app/inicio.css`, limitados a `.inicio-page` y al menú compartido. `app/layout.tsx` solo agrega la importación del archivo.

## Puntos de integración para Iván

`Library` acepta dos propiedades opcionales:

- `experienceBar: ReactNode`: contenido del espacio `data-slot="barra-xp"`. Hay un comentario `AQUÍ: barra de experiencia (Iván)` en `components/library.tsx`. El espacio vacío se oculta hasta recibir la barra.
- `lockedStories: StoryLocks`: mapa de identificador de cuento a mensaje de bloqueo. Ejemplo: `{ "pan-abuela": "Se desbloquea al ser Lector Brote" }`. Sin entrada, el cuento sigue disponible.

`StoryShelfRow` recibe el mismo mapa. Una tarjeta bloqueada muestra el candado y el mensaje, carece de enlace y no entra en el recorrido de tabulación. Cada portada tiene `data-story-id` y `data-locked` para facilitar la integración. La lógica de XP, los requisitos de nivel y la persistencia corresponden a Iván y no se implementan aquí.

## Verificación inicial de e158ba7

- Compilación de producción y comprobación de TypeScript.
- Pruebas de navegación, foco, historial, nivel predeterminado y compatibilidad de enlaces.
- Inicio en 320, 390, 768, 1024, 1366 y 1920 px, tanto con el perfil de escritorio como con el móvil de Playwright. Capturas en `output/playwright/piero-inicio-*.png`.
- Axe en 320 y 1366 px; comprobación de ancho y accesos en las seis resoluciones.
- Actualización de las pruebas existentes que usaban el selector retirado o asumían carrusel en escritorio. El acceso a Crear dentro del catálogo se cuenta por separado de los cuentos.

Resultado: compilación y TypeScript correctos; las 28 pruebas de inicio, navegación y biblioteca pasan. La suite unitaria mantiene el mismo resultado previo: 37 pruebas correctas de 38.

Antes de los cambios, la suite unitaria ya fallaba en `tests/story-creator.test.ts`, caso «el filtro previo reconoce riesgos aunque cambien tildes o mayúsculas», para la frase «Un personaje que bebe lejía para hacer un reto». Se deja registrado sin modificar el filtro del creador.

No se modifican los componentes del lector, el creador, las rutas API, los proveedores de IA, la lógica de progreso ni los archivos asignados a Fabio e Iván. No se realizan cambios en `main`.

## Corrección posterior de CI

El check `verify` de GitHub Actions se detuvo en `npm test`: el filtro no reconocía la ingestión de lejía. Vercel sí desplegó el commit correctamente. Se añade una regla específica para ingerir productos de limpieza y una prueba que comprueba tanto el bloqueo como los usos domésticos permitidos. Este ajuste acotado de `lib/story-creator.ts` resuelve el fallo que estaba pendiente en la verificación inicial.

La ejecución completa también detectó tres problemas de las pruebas de navegador: usar un control con Ajustes cerrado, iniciar axe antes de finalizar la redirección de `/biblioteca` y buscar un mensaje de ilustraciones retirado. Ahora las pruebas abren Ajustes, esperan la página final y comprueban la imagen de colección recibida. Se conservan las comprobaciones de animación, accesibilidad, ilustraciones guardadas y comprensión.

Verificación posterior: 39 pruebas unitarias y las 68 pruebas E2E pasan, junto con TypeScript y la compilación de producción. Los componentes del lector y del creador, las APIs y las otras ramas permanecen sin cambios.
