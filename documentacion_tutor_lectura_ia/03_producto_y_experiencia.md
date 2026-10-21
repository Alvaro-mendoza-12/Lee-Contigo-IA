# 03. Producto y experiencia web

## Nombre de trabajo

**LeeContigo IA: historias que se adaptan a tu lectura.** El nombre es provisional; antes de publicar hay que revisar dominio, redes y marca.

## Descripción

LeeContigo es una web responsiva que guía a estudiantes de primaria por lecturas breves y preguntas de comprensión. La IA ajusta una pista a la banda de lectura elegida y responde usando el relato como referencia. Docentes y familias pueden recibir orientaciones agregadas cuando exista una configuración autorizada para un piloto.

## Web, no app nativa

Las bases de Fase 2 exigen una URL web para el prototipo. Se prioriza navegador móvil y escritorio; no hace falta una app de tienda. Una PWA instalable puede estudiarse después, pero no es requisito del MVP.

## Perfiles

1. **Estudiante:** entra a una sesión guiada y trabaja con un relato.
2. **Docente o tutor:** en una versión futura selecciona lecturas y revisa tendencias agregadas.
3. **Familia:** recibe recomendaciones para acompañar en casa.
4. **Editor de contenido:** rol futuro que revisa relatos, objetivos y preguntas.

Para el prototipo de hackathon, usar un recorrido de demostración sin cuentas de menores ni respuestas personales persistentes.

## Secciones de la web

### 1. Inicio
- Explica en lenguaje sencillo qué hace el tutor.
- Presenta una acción principal: “Empezar a leer”.
- Incluye acceso secundario a “Ver cómo funciona para docentes”.
- No ofrece diagnósticos ni promete mejoras garantizadas.

### 2. Elección de nivel o reto
- Permite elegir lectura inicial, en desarrollo o desafío.
- Aclara que la opción adapta la sesión y no diagnostica capacidad, edad mental ni discapacidad.
- Permite cambiar de nivel sin penalización.

### 3. Biblioteca breve
- Presenta relatos revisados con título, tema, duración aproximada y habilidad.
- El MVP se limita a tres relatos como máximo y un grupo de edad.
- Cada texto debe ser propio o tener procedencia y licencia documentadas.

### 4. Espacio de lectura
- Muestra texto legible, párrafos cortos y avance dentro de la historia.
- Permite ampliar letra y pausar.
- Audio de lectura puede añadirse después; no es necesario para el MVP.
- Evita anuncios, enlaces externos y distracciones.

### 5. Comprueba lo que entendiste
- Ofrece de tres a cinco preguntas breves: información explícita, idea principal, inferencia y vocabulario en contexto.
- Usa respuestas seleccionables en la primera versión para reducir texto libre de menores.
- Permite solicitar una pista antes de revelar la solución.

### 6. Pistas del tutor IA
- Da una pista gradual conectada con una frase o párrafo del relato.
- No entrega automáticamente la respuesta.
- Si la salida falla controles o el servicio no responde, usa una pista preparada y revisada.

### 7. Cierre de sesión
- Resume la habilidad practicada con palabras motivadoras y específicas.
- Invita a intentar otra historia sin rankings ni vergüenza.
- En el MVP, la retroalimentación solo se muestra en pantalla y no crea un perfil individual persistente.

### 8. Espacio para docentes y familias
- Explica el propósito pedagógico, los límites de la IA y cómo acompañar.
- Las métricas agregadas pertenecen a una fase piloto posterior, con acceso adulto y revisión de privacidad.

### 9. Administración de contenidos
- Módulo futuro para que el equipo pedagógico agregue relatos, versiones, preguntas, respuestas y fuentes.
- No permite publicar contenido generado sin revisión humana.

## Recorrido del estudiante

1. Abre la URL desde teléfono, tableta o computadora.
2. Elige una banda de práctica sin registrar nombre.
3. Escoge un relato corto y lo lee a su ritmo.
4. Contesta preguntas de comprensión.
5. Solicita una pista cuando la necesita.
6. Recibe una explicación que apunta al relato.
7. Termina y puede elegir otra lectura.

## Alcance del MVP

**Incluido:** inicio; un grupo de edad; dos bandas de práctica; uno o dos relatos revisados; preguntas de respuesta seleccionable; una pista adaptada por IA; una pista de respaldo; vista móvil; aviso claro de uso de IA.

**Fuera del MVP:** cuentas de menores, perfiles de largo plazo, diagnóstico de dislexia, calificaciones escolares, chat abierto, generación ilimitada de historias, evaluación automática de ensayos, traducción a lenguas originarias, audio grabado, pagos y análisis individual de estudiantes.

