# 06. Diseño de IA, contenido y supervisión

## Trabajo asignado a la IA

La IA ajusta la forma de presentar un fragmento y ofrece pistas de comprensión. No diagnostica dificultades de aprendizaje ni reemplaza la valoración del docente.

En el creador de cuentos, una sola generación produce el relato, tres preguntas alineadas con habilidades distintas y dos pistas progresivas por pregunta. Al responder, la interfaz decide cuál pista mostrar y conserva la opción solo en memoria; no vuelve a llamar al modelo con la respuesta del niño. En las lecturas editoriales, el tutor sí puede generar una pista desde el servidor porque el contenido ya está aprobado.

### Funciones apropiadas

- Reformular vocabulario o longitud dentro de una banda de lectura preaprobada.
- Dar una pista gradual para encontrar una idea o inferencia.
- Explicar qué parte del relato conviene revisar.
- Proponer otra pregunta para practicar la misma habilidad, siempre basada en el relato.
- Resumir para un adulto tendencias agregadas de habilidades practicadas en un piloto autorizado.

### Fuera del alcance

- Chat abierto o tutor de compañía emocional.
- Consejos médicos, psicológicos, legales o personales.
- Diagnóstico de dislexia, discapacidad, inteligencia o nivel escolar oficial.
- Calificación automática de ensayos libres.
- Perfilado, publicidad o recomendaciones comerciales dirigidas al niño.
- Generación y publicación automática de relatos sin revisión humana.

## Método de respuesta recomendado

1. Revisar el relato y la habilidad antes de incorporarlos al catálogo.
2. Preparar preguntas y respuestas esperadas como contenido controlado.
3. Enviar a la IA solo el relato aprobado, la pregunta, la banda de dificultad y el tipo de pista.
4. Solicitar una respuesta corta que apunte al texto.
5. Validar longitud, formato y relación con evidencia del relato.
6. Revisar muestras de salida por una persona durante el piloto.
7. Sustituir la salida por una pista preparada ante errores, contenido fuera de tema o latencia alta.
8. Enrutar primero a Gemini 3.8 Flash y permitir el respaldo GPT-5.4 Nano si falla el modelo principal. El catálogo consultado no marca las rutas disponibles de estos modelos como compatibles con el filtro de no entrenamiento, por eso no se activa. Se informa que la política del proveedor seleccionado aplica; si no hay ruta disponible, el producto conserva su alternativa preparada o lleva a la biblioteca.

### Diseño de preguntas y pistas para cuentos generados

- Pregunta 1: localizar información explícita en un párrafo.
- Pregunta 2: inferir una causa, motivo o consecuencia usando el texto.
- Pregunta 3: expresar la idea principal o el aprendizaje global del relato.
- Guardar `evidenceParagraph` para que el tutor muestre al niño dónde buscar.
- Adjuntar `evidenceQuote`, una frase literal del párrafo elegido. El servidor comprueba que la cita aparezca en ese mismo párrafo antes de entregar el cuento; después de acertar o de tres intentos se muestra la frase y se puede abrir el párrafo completo.
- Pista 1: invita a volver al párrafo y observar una señal concreta.
- Pista 2: sugiere una operación mental (comparar, relacionar causa y efecto o resumir el cambio), sin nombrar la opción correcta.
- Si la respuesta sigue sin coincidir después de tres intentos, se revela la explicación vinculada a la evidencia. No se asigna nota ni se guarda el historial.

En el MVP, las respuestas del estudiante deben ser seleccionables o activarse con botones. Así se evita enviar texto libre de menores al modelo. Un modo de escritura libre solo se considerará después de revisión de privacidad y pedagogía.

## Controles de calidad

- Preparar ejemplos para cada relato, nivel y tipo de pregunta.
- Hacer que la pista señale una frase o párrafo del relato.
- No permitir que añada hechos externos.
- Rechazar salidas que den la respuesta sin ayudar a encontrar evidencia.
- Comprobar que el cuento cubra las tres habilidades y que cada pregunta tenga dos pistas cortas y un párrafo de evidencia válido.
- Mostrar la explicación después de acertar o de tres intentos, nunca como primera respuesta al error.
- Mantener opciones e intentos en el navegador; no incluirlos en prompts, registros ni analítica del MVP.
- Registrar versión del modelo e instrucciones para reproducir la evaluación.
- Probar preguntas ambiguas, errores intencionales, temas ajenos y mensajes inapropiados.
- Ofrecer a adultos un mecanismo para reportar respuestas problemáticas.
- Revisar textos, vocabulario y preguntas antes de usar con niños.
- Desactivar generación en tiempo real ante incidentes y mostrar contenido preparado.

## Estrategia de contenido

- Priorizar relatos originales o con licencia que permita reutilización y adaptación.
- Anotar autoría, licencia, idioma, edad aproximada, tema, habilidad, longitud y vocabulario.
- Mantener trazabilidad entre el texto original y sus versiones adaptadas.
- No copiar cuentos protegidos sin permiso.
- Revisar representación cultural, estereotipos y adecuación para la comunidad piloto.
- Para una futura lengua originaria, involucrar hablantes y especialistas; no publicar traducción automática sin validación comunitaria.

## Comprobar que la IA aporta valor

La IA tiene sentido si la adaptación y las pistas personalizadas mejoran la experiencia frente a una página estática con el mismo relato y preguntas. El piloto debe medir tiempo de preparación, uso de pistas, vuelta al texto, errores y costo por sesión. Si la IA no mejora el resultado o agrega gasto sin valor, una versión estática preparada por docentes es una alternativa válida. No usar IA solo como etiqueta promocional.

El diseño se inspira en guías de comprensión lectora para primaria que recomiendan enseñar estrategias, guiar inferencias, revisar la comprensión y ayudar a justificar ideas usando evidencia del texto. La IA prepara el andamiaje; no sustituye la instrucción docente ni prueba por sí sola que hubo aprendizaje. Para una implementación con menores también se deben revisar las recomendaciones de UNICEF sobre seguridad, privacidad, transparencia, inclusión y bienestar infantil.
