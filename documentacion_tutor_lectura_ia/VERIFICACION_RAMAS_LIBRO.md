# Revisión de ramas, lectura e ilustraciones

Base revisada: `main` en `b3e3cb3` (PR #16). Integración pendiente de aprobar: PR #17, rama `Alvaro/validacion-xp-main`.

Se compararon las 17 ramas remotas por funcionalidad y archivos, además de comprobar el historial de los PR. Un commit con identificador distinto no implica que su función falte: los PR #4, #6, #7, #8 y #12 se incorporaron mediante squash. No se sustituyeron archivos actuales por versiones antiguas.

| Rama                               | Resultado de la revisión                                                                                                                                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`                             | Incluye los PR #13–#16 mediante merge commits, en orden.                                                                                                                                                                          |
| `Alvaro/lector`                    | Lector accesible, paginación, selección de texto, ajustes y filtro incorporados por #6. Se conservan las mejoras posteriores.                                                                                                     |
| `Piero`                            | Inicio y navegación incorporados por #8.                                                                                                                                                                                          |
| `Alvaro/piero-xp-slot`             | Integración del inicio incorporada por #8; marcas de XP reemplazadas por controles funcionales.                                                                                                                                   |
| `ivan/xp-logica`                   | Lógica incorporada por #4 y ampliada por #13–#16.                                                                                                                                                                                 |
| `ivan/xp-barra`                    | Barra incorporada por #7 y ampliada por #13–#16; la página temporal de prueba fue retirada deliberadamente.                                                                                                                       |
| `feat/filtro-palabras`             | Filtro compartido incorporado por #12. La normalización actual de main también bloquea evasiones adicionales.                                                                                                                     |
| `feat/sonidos-musica`              | Sonidos y música incorporados por #12, con mejoras de volumen y pase de página posteriores.                                                                                                                                       |
| `feat/tutorial-luciernaga`         | Tutorial incorporado por #12, con bloqueo de desplazamiento y mejoras posteriores.                                                                                                                                                |
| `Alvaro/integracion-audio`         | Audio, tutorial, controles y seguridad incorporados por #12.                                                                                                                                                                      |
| `ivan/xp-desbloqueos`              | Incorporada por #13: desbloqueos, selector y guardia de acceso a cuentos.                                                                                                                                                         |
| `ivan/xp-preguntas`                | Incorporada por #14: puntos por respuestas, pastilla, sonidos y animaciones.                                                                                                                                                      |
| `ivan/xp-extras`                   | Incorporada por #15: celebración, guía, sonido y cuentos ya leídos.                                                                                                                                                               |
| `ivan/mejoras-evidencia`           | Incorporada por #16: pistas, escucha del párrafo, lectura sin interrupciones y garantías automáticas.                                                                                                                             |
| `codex/controles-audio-superiores` | Sus tres commits se recuperan en #17: controles superiores, reflexión sin duplicado y coherencia entre idea, cuento e ilustraciones. Se preserva su autoría.                                                                      |
| `Alvaro/verificacion-integral`     | Los controles de acceso y niveles ya tienen una versión posterior en main. Se recuperan en #17 el diagnóstico de proveedores y la experiencia de los cuentos creados, adaptada para no premiar ni interrumpir el pase de páginas. |
| `Alvaro/validacion-xp-main`        | Reúne los ajustes pendientes descritos aquí y las correcciones de validación/tablet del #17. No está fusionada con main.                                                                                                          |

## Libro y acompañamiento

- La biblioteca y los cuentos creados comparten `BookSpread`.
- En tablet y escritorio se verifican transformaciones 3D reales de la hoja, al avanzar y retroceder. En teléfono se verifica la transición lateral de la página.
- La animación empieza activada y puede desactivarse en Ajustes. La preferencia del dispositivo de reducir movimiento se respeta.
- Se conserva la selección de palabras y fragmentos, la ayuda del párrafo completo, las pistas progresivas y la escucha contextual.
- Los cuentos creados reciben XP al empezar las preguntas tras llegar al final, al responder correctamente y al completar la práctica. No se otorgan puntos al pasar una hoja ni por revelar una respuesta. Las recompensas no se repiten al releer el mismo libro.
- «Leer otra vez» reinicia las preguntas para que se pueda practicar de nuevo.

## Servicios de IA

Ninguna rama remota aporta una ruta API adicional ausente de main. Se mantienen AI Gateway, OpenRouter, Cloudflare para texto/imágenes y ElevenLabs para voz. `/api/estado` informa solo presencia de configuración, sin revelar claves ni enviar solicitudes a los proveedores; no certifica cuota o disponibilidad real.

Las mejoras recuperadas firman las indicaciones de ilustración junto con los párrafos y revisan que el cuento corresponda a la idea antes de responder. Las imágenes usan el pasaje concreto y las referencias de personajes. Esto mejora la coherencia, pero no garantiza que un modelo visual dibuje siempre con exactitud. No se compraron créditos ni se modificaron secretos.

## Comprobación

Las pruebas cubren giro, movimiento reducido, texto seleccionado, escucha, navegación, filtros, ilustraciones, persistencia y XP. Las pruebas de navegador de voz e imágenes usan respuestas controladas; sus resultados no equivalen a probar todos los proveedores externos con solicitudes reales.

La publicación de #17 requiere la autorización de merge indicada por el propietario. Los PR antiguos abiertos #9–#11 no necesitan fusionarse para recuperar funciones: su contenido útil ya se incluyó en #12 y evolucionó después.
