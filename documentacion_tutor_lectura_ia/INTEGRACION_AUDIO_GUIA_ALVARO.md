# Integración de audio, guía y filtro — Alvaro

Fecha: 23 de octubre de 2026. Rama: `Alvaro/integracion-audio`.

## Alcance y dependencias

Integración autorizada de los cambios de Alvaro y las conexiones pequeñas
indicadas para Piero e Iván en el mensaje de Fabio. La rama parte de
`main` (`84a4191`) e incorpora estas dependencias para que la vista previa sea
funcional:

| PR  | Trabajo de Fabio              | Commit incorporado |
| --- | ----------------------------- | ------------------ |
| #9  | Filtro de palabras compartido | `8708399`          |
| #10 | Sonidos y música opcionales   | `49f0d34`          |
| #11 | Tutorial de la luciérnaga     | `4bf2d32`          |

Los tres PR siguen abiertos. Incorporar sus commits en esta rama de trabajo
no significa que se hayan unido a `main`.

## Conexiones realizadas

| Área                  | Archivos principales                                                        | Comportamiento                                                                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preguntas y pistas    | `components/practice.tsx`                                                   | Utiliza `reproducirRespuesta` y `reproducir("pista")`. Elimina el control antiguo independiente de sonidos.                                                                               |
| Narración             | `components/use-narration.ts`                                               | Emite `voz:inicio` y `voz:fin`. Coordina las instancias activas para que un lector inactivo no restablezca el volumen durante otra narración. Al salir del lector se restaura el volumen. |
| Ajustes               | `components/reading-settings.tsx`                                           | Incluye `InterruptorAudio` y «Ver la guía». Cierra Ajustes y la ampliación antes de abrir la guía.                                                                                        |
| Paso de página        | `components/reader.tsx`                                                     | Reproduce el sonido solamente cuando cambia realmente de página, respetando la preferencia de sonidos.                                                                                    |
| Subida de nivel       | `components/aviso-nivel.tsx`                                                | Reproduce `reproducir("nivel")` al recibir el evento de subida, si los sonidos están activados.                                                                                           |
| Destinos del tutorial | `components/library.tsx`, `components/barra-xp.tsx`                         | Marca las tarjetas grandes Cuentos, Crear y Acompañar, y la barra XP grande con `data-tutorial`. Incluye el botón «?» junto al saludo.                                                    |
| Montaje global        | `app/layout.tsx`, `components/tutorial.tsx`, `components/story-creator.tsx` | Una sola instancia después de Footer; apertura automática únicamente en el inicio y en la primera visita. Elimina la instancia temporal duplicada en Crear.                               |
| Privacidad            | `app/privacidad/page.tsx`                                                   | Explica las preferencias locales de voz, letra, sonidos, música y guía.                                                                                                                   |

Los sonidos y la música empiezan apagados. La narración se solicita con el botón
Escuchar y conserva el proveedor y la alternativa del dispositivo existentes.
La guía admite teclado, Escape, cierre y retorno del foco; mientras está abierta,
el contenido de fondo queda inactivo para evitar navegar detrás del diálogo.

## Revisión del PR #9 y corrección adicional

La versión original del PR #9 permitía separar un insulto mediante caracteres
invisibles o dividirlo en grupos: por ejemplo, `so\u200bnso`, `son\u200dso` o
`ton-to`. Estos casos podían pasar tanto en el cliente como en el servidor.

La corrección `ed91914` conserva **una sola lista** en `lib/filtro-palabras.ts` y:

- Normaliza caracteres de compatibilidad, tildes y letras de otros alfabetos.
- Conserva los caracteres invisibles dentro del token hasta eliminarlos en la
  normalización, evitando que dividan la palabra.
- Comprueba grupos separados de tokens completos con un límite de longitud.
- Evita buscar insultos como subcadenas dentro de palabras inocentes.
- Mantiene la validación de contenido y de datos personales existente del
  servidor antes y después de la generación.

Las regresiones comprueban las evasiones y textos permitidos como computadora,
armadillo, heroína, vergüenza y una mención respetuosa de la palabra gay. También
se verifica el bloqueo HTTP 422 al saltarse la interfaz. La detección de palabras
no garantiza por sí sola la seguridad semántica de cualquier contenido.

No restaurar la lista antigua de `lib/story-creator.ts` al resolver otros merges.
Las palabras nuevas deben añadirse en `lib/filtro-palabras.ts`.

## Pruebas y límites de la evidencia

- Compilación de producción: correcta con `npm run build`.
- TypeScript: correcto con `npx tsc --noEmit`.
- Pruebas unitarias: **89 aprobadas**, sin fallos.
- Pruebas Playwright de escritorio y móvil: **110 aprobadas**, sin fallos
  ni reintentos en la ejecución completa (5,7 minutos).
- Formato de los archivos modificados: correcto con Prettier; `git diff --check`
  sin errores.

Las pruebas cubren silencio inicial, sonidos activados y desactivados en
Practicar, volumen durante la narración, salida de la ruta, subida de nivel,
primera visita, guía manual, foco, accesibilidad con axe, anchuras desde 320 px,
lectura, creación, ayuda contextual y seguridad. `playwright.config.ts` prepara
los recorridos habituales como lector que ya vio la guía; `tutorial.spec.ts`
restablece un navegador nuevo y comprueba la primera visita real.

Las respuestas de IA y narración se simulan en las pruebas que necesitan un
resultado determinista. Esta validación comprueba la integración y las
alternativas de error; no certifica saldo, disponibilidad ni calidad actual de
ElevenLabs, OpenRouter o AI Gateway. No se cambian sus claves ni sus proveedores
en esta entrega.

## Coordinación restante

- El interruptor temporal de audio de Crear sigue presente y comparte la misma
  preferencia que Ajustes. Fabio puede retirarlo cuando confirme la integración,
  según su mensaje. Se conserva el «?» manual en Crear.
- La conexión pequeña de XP incluye el sonido y el destino del tutorial. La
  integración completa de recompensas en los recorridos reales sigue siendo
  un trabajo independiente; no se presenta como completada aquí. La barra
  grande y la celebración se prueban en la ruta de demostración de XP.
- No se ha enviado ningún mensaje privado al equipo.
- `main` y producción requieren la aprobación de unión indicada por Alvaro:
  «une el #N». Esta rama se entrega mediante un PR y una vista previa.
