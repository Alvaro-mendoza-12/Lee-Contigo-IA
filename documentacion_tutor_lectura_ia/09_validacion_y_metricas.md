# 09. Validación y métricas

## Qué probar

### Problema y utilidad

- ¿Docentes y familias reconocen la necesidad de práctica personalizada?
- ¿Qué habilidades de lectura priorizan?
- ¿Cuánto tiempo pueden dedicar a una actividad digital?
- ¿Qué herramientas usan y qué limitaciones encuentran?

### Experiencia de usuario

- ¿El estudiante entiende cómo comenzar?
- ¿Puede leer y contestar sin ayuda continua?
- ¿Las pistas lo ayudan a volver al texto?
- ¿Completa la lectura y desea continuar?

### Calidad educativa

- ¿Las preguntas miden la habilidad declarada?
- ¿La frase presentada como evidencia aparece literalmente en el párrafo señalado y ayuda a justificar la respuesta?
- ¿La pista impulsa comprensión o entrega la respuesta?
- ¿La adaptación conserva sentido y nivel apropiado?
- ¿El docente considera útil el resumen agregado?

### Viabilidad técnica y económica

- ¿Funciona en dispositivos disponibles?
- ¿Qué proporción de sesiones se completa?
- ¿Cuántas llamadas al modelo se necesitan?
- ¿Cuál es el costo por sesión y por grupo?
- ¿Qué porcentaje de salidas requiere corrección o fallback?

## Métricas

| Métrica                   | Cálculo                                                             | Para qué sirve                                                                                    |
| ------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Inicio                    | Sesiones iniciadas / visitantes del recorrido                       | Claridad de la propuesta.                                                                         |
| Finalización              | Sesiones completadas / sesiones iniciadas                           | Fricción del flujo.                                                                               |
| Uso de pista              | Solicitudes de pista / preguntas respondidas                        | Utilidad y comprensión de la ayuda.                                                               |
| Reintento con pista       | Respuestas correctas tras una o dos pistas / preguntas reintentadas | Señal de si la ayuda permite revisar el texto y continuar; no demuestra aprendizaje transferible. |
| Respuesta alineada        | Pistas aceptadas por revisión pedagógica / pistas revisadas         | Calidad de IA.                                                                                    |
| Fallback                  | Sesiones con pista preparada / sesiones iniciadas                   | Frecuencia de fallos del modelo.                                                                  |
| Comprensión antes-después | Resultado en instrumento breve revisado por educador                | Señal exploratoria; no prueba causalidad en muestra pequeña.                                      |
| Satisfacción docente      | Entrevista o escala acordada                                        | Valor para acompañante y comprador.                                                               |
| Acceso                    | Uso por tipo de dispositivo, sin identificar estudiantes            | Barreras de acceso.                                                                               |
| Costo IA                  | Costo total de modelo / sesiones completadas                        | Sostenibilidad.                                                                                   |
| Incidentes                | Reportes de seguridad por periodo                                   | Activar corrección o pausa.                                                                       |

## Metas internas para aceptar el MVP

Son objetivos de trabajo, no resultados ya alcanzados:

- Al menos 8 de cada 10 sesiones de demostración se completan sin ayuda técnica.
- Cada pista se vincula claramente al relato o activa fallback.
- No se muestra salida fuera del tema en los casos de revisión acordados.
- La página funciona en móvil y no expone llaves.
- Se mide latencia y se muestra una alternativa si el modelo tarda.
- Un docente entiende el objetivo y la retroalimentación tras una demostración.
- El recorrido se completa sin iniciar sesión.

## Diseño de piloto

- Empezar con un grupo pequeño acordado con una institución y responsables adultos.
- Obtener aprobación institucional y consentimiento aplicable antes de incluir niños.
- Usar medida breve de comprensión antes y después, revisada por docentes.
- Complementar resultados con observación, entrevistas y sesiones completadas.
- Reportar tamaño, características, duración, limitaciones y resultados negativos.
- No afirmar causalidad ni mejora nacional a partir de un piloto pequeño.
- Detener el uso si aparece contenido dañino, se comprometen datos o empeora la experiencia educativa.
