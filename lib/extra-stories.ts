import type { Story, Question } from "./stories.ts";

export function question(
  id: string,
  skill: string,
  prompt: string,
  options: string[],
  correct: number,
  paragraph: number,
  explanation: string,
  hints: [string, string],
): Question {
  return { id, skill, prompt, options, correct, paragraph, explanation, hints };
}

export const extraStories: Story[] = [
  {
    id: "camino-al-faro",
    category: "aventuras",
    title: "El camino al faro",
    subtitle: "A veces, avanzar empieza por mirar con atención.",
    theme: "Curiosidad y descubrimiento",
    art: "lighthouse",
    minutes: 6,
    description:
      "Una tortuga descubre que observar las pequeñas señales puede llevarla muy lejos.",
    versions: {
      paso: {
        paragraphs: [
          "La tortuga Mara quería visitar el faro. Cada tarde veía su luz desde el jardín. Aquella mañana guardó una manzana en su bolso y abrió un mapa. El dibujo mostraba un camino de conchas blancas junto al mar.",
          "Al llegar a una curva encontró dos senderos. En una señal había una concha. En la otra había una hoja. Mara miró el mapa y después las señales. No quería elegir deprisa y perderse el paseo.",
          "Una gaviota pasó cerca. Le contó que el sendero de hojas llevaba al huerto. Mara recordó las conchas dibujadas en su mapa. Dio las gracias y eligió el otro camino, sin correr ni dejar de mirar.",
          "Más adelante, el viento había tapado una concha con arena. Mara estuvo a punto de volver. Entonces vio otra, un poco más lejos. Apartó la arena con una pata y apareció la concha que faltaba.",
          "Mara siguió las señales hasta ver el faro completo. Se sentó a comer su manzana junto al jardín de la entrada. La gaviota volvió y descansó a su lado. Las dos miraron cómo cambiaba el color del cielo.",
          "Cuando se encendió la luz, Mara sonrió. No había llegado por ser la más rápida. Había observado, preguntado y vuelto a mirar cuando tuvo una duda. Dobló el mapa con cuidado: aún quedaban muchos caminos por descubrir.",
        ],
        questions: [
          question(
            "q1",
            "Encontrar información",
            "¿Qué señal indicaba el camino al faro?",
            ["Una hoja verde.", "Una concha blanca.", "Una manzana roja."],
            1,
            0,
            "El mapa mostraba un camino de conchas blancas junto al mar.",
            [
              "Vuelve al comienzo y observa el dibujo del mapa.",
              "Compara lo que muestra el mapa con las dos señales de la curva.",
            ],
          ),
          question(
            "q2",
            "Leer entre líneas",
            "¿Por qué Mara apartó la arena con la pata?",
            [
              "Para buscar su manzana.",
              "Para construir otro faro.",
              "Para comprobar si había una señal escondida.",
            ],
            2,
            3,
            "Vio otra concha más lejos y pensó que la arena podía tapar la que faltaba.",
            [
              "Busca qué vio Mara antes de mover la arena.",
              "Relaciona la señal que faltaba con la que apareció más adelante.",
            ],
          ),
          question(
            "q3",
            "Descubrir la idea",
            "¿Qué ayudó a Mara a llegar al faro?",
            [
              "Mirar con atención y pedir ayuda.",
              "Correr sin detenerse.",
              "Esperar que el mapa caminara.",
            ],
            0,
            5,
            "Observó las señales, preguntó a la gaviota y comprobó su duda al encontrar arena.",
            [
              "Recuerda qué hizo Mara cada vez que tuvo una duda.",
              "Compara avanzar deprisa con observar lo que hay alrededor.",
            ],
          ),
        ],
      },
      reto: {
        paragraphs: [
          "Desde su jardín, Mara veía encenderse el faro cada atardecer. Siempre había imaginado cómo sería mirarlo de cerca. Una mañana despejada preparó una merienda y extendió un viejo mapa sobre la mesa. El recorrido estaba marcado con pequeñas conchas blancas. Antes de salir, siguió el dibujo con una pata para reconocer las curvas.",
          "El primer tramo fue sencillo, pero pronto encontró una bifurcación. Dos flechas señalaban lugares distintos: una llevaba una concha dibujada y la otra una hoja. Mara estuvo a punto de seguir la senda más ancha. Luego recordó que un camino cómodo no siempre conduce al lugar que buscamos. Se detuvo a comparar las señales con su mapa.",
          "Una gaviota aterrizó en la cerca y le explicó que el sendero de hojas terminaba en el huerto. Mara agradeció la orientación. La concha de la otra flecha coincidía con el dibujo del mapa, así que eligió esa dirección. Mientras avanzaba, empezó a notar pequeños detalles que antes había pasado por alto: huellas, flores y cambios en la arena.",
          "Más adelante, las marcas parecían desaparecer. Mara sintió ganas de regresar, hasta que distinguió otra concha a cierta distancia. El viento había formado un montículo de arena entre ambas señales. En lugar de concluir que el mapa estaba equivocado, apartó un poco de arena. Debajo encontró la marca que faltaba y pudo continuar con tranquilidad.",
          "El faro apareció al final de una loma suave. Mara llegó cuando el cielo comenzaba a teñirse de naranja y se sentó a merendar en el jardín de la entrada. La gaviota se reunió con ella. Desde allí podían reconocer el sendero por el que habían llegado, incluso el lugar donde la arena escondía las señales. El camino ya no parecía un misterio.",
          "Al encenderse la lámpara, Mara comprendió qué había hecho posible el viaje. Su paso seguía siendo lento, pero ahora confiaba en su manera de explorar. Había comparado pistas, pedido orientación y comprobado una idea antes de abandonar. Guardó el mapa y decidió que, la próxima vez, invitaría a alguien a descubrir otro camino con ella.",
        ],
        questions: [
          question(
            "q1",
            "Vocabulario en contexto",
            "En el relato, ¿qué es una «bifurcación»?",
            [
              "Un lugar donde el camino se divide.",
              "Una luz que se enciende de noche.",
              "Una merienda junto al jardín.",
            ],
            0,
            1,
            "Mara encuentra dos flechas y dos senderos diferentes: allí el camino se divide.",
            [
              "Fíjate en lo que encuentra Mara justo después de esa palabra.",
              "Imagina las dos flechas: ¿qué forma tendría el camino en ese lugar?",
            ],
          ),
          question(
            "q2",
            "Leer entre líneas",
            "¿Qué muestra Mara al buscar debajo de la arena?",
            [
              "Que prefiere volver siempre al jardín.",
              "Que comprueba una explicación antes de rendirse.",
              "Que quiere cambiar todas las señales.",
            ],
            1,
            3,
            "Relaciona la concha lejana con el montículo de arena y comprueba si hay otra marca debajo.",
            [
              "Relaciona lo que vio a distancia con lo que hizo después.",
              "Piensa qué diferencia hay entre suponer que el mapa falla y comprobar una pista.",
            ],
          ),
          question(
            "q3",
            "Descubrir la idea",
            "¿Qué aprendizaje resume mejor el viaje de Mara?",
            [
              "Los caminos anchos siempre son mejores.",
              "Solo llega quien camina deprisa.",
              "Observar y comprobar nos ayuda a avanzar.",
            ],
            2,
            5,
            "Su ritmo no cambia; aprende a usar pistas, orientación y comprobaciones para llegar.",
            [
              "Compara la inseguridad del comienzo con lo que piensa al final.",
              "Busca qué acciones repite Mara cuando el recorrido se vuelve difícil.",
            ],
          ),
        ],
      },
    },
  },
  {
    id: "cometa-en-equipo",
    category: "amigos",
    title: "La cometa que aprendió a volar",
    subtitle: "Una idea crece cuando la pensamos juntos.",
    theme: "Amistad y creatividad",
    art: "kite",
    minutes: 6,
    description:
      "Un conejo y una ardilla prueban, observan y encuentran juntos cómo hacer volar una cometa.",
    versions: {
      paso: {
        paragraphs: [
          "El conejo Teo había hecho una cometa azul. Pegó el papel a dos palitos y ató un hilo largo. Su amiga Ada, la ardilla, llegó a la mesa del jardín. Quería verla volar y llevaba unas cintas de tela para la cola.",
          "Teo eligió una cinta corta y salió al prado. La cometa subió un poquito, giró hacia un lado y volvió a la hierba. Probó otra vez. Ocurrió lo mismo. Teo bajó las orejas y pensó en guardar la cometa.",
          "Ada le pidió que esperara. En vez de correr más, los dos amigos observaron la cometa. El papel estaba entero y los palitos seguían unidos. El conejo la sujetó mientras la ardilla miraba la cola, que era muy pequeña.",
          "Ada propuso añadir una cinta más larga. Teo sostuvo el marco y ella hizo el nudo. Dejaron la cola bien centrada. Antes de probar, comprobaron juntos que el hilo no estuviera enredado entre las cintas.",
          "Una brisa movió las flores. Teo levantó la cometa y soltó un poco de hilo. Esta vez subió recta y se quedó en el aire. Ada dio un salto de alegría. La cola larga se balanceaba mientras la cometa volaba sobre el prado.",
          "Teo ofreció el hilo a su amiga para que también probara. Después se sentaron a dibujar otras cometas. Teo ya no veía aquel primer intento como un desastre. Les había dado una pista para observar, cambiar una cosa y volver a probar juntos.",
        ],
        questions: [
          question(
            "q1",
            "Encontrar información",
            "¿De qué color era la cometa de Teo?",
            ["Verde.", "Azul.", "Roja."],
            1,
            0,
            "La primera frase presenta la cometa azul que construyó Teo.",
            [
              "Busca cómo se presenta la cometa al comenzar.",
              "Lee la primera frase y observa la palabra que describe el papel.",
            ],
          ),
          question(
            "q2",
            "Leer entre líneas",
            "¿Por qué Ada pidió observar antes de volver a correr?",
            [
              "Para buscar qué podían cambiar.",
              "Para esconder el hilo.",
              "Para esperar a que lloviera.",
            ],
            0,
            2,
            "Al revisar papel, palitos y cola, pudieron elegir qué parte cambiar en el siguiente intento.",
            [
              "Piensa qué revisaron antes de atar otra cinta.",
              "Relaciona la observación de la cola con el cambio que hicieron después.",
            ],
          ),
          question(
            "q3",
            "Descubrir la idea",
            "¿Qué descubren los amigos con la cometa?",
            [
              "Que es mejor no compartir las ideas.",
              "Que todo debe salir bien al comienzo.",
              "Que observar y probar juntos ayuda a mejorar.",
            ],
            2,
            5,
            "Usaron el primer intento para encontrar una pista, cambiar la cola y probar de nuevo.",
            [
              "Compara lo que sentía Teo al caer la cometa con lo que piensa al final.",
              "Recuerda qué hicieron juntos entre el primer vuelo y el último.",
            ],
          ),
        ],
      },
      reto: {
        paragraphs: [
          "Teo había pasado la mañana construyendo una cometa azul en la mesa del jardín. Unió dos varillas, pegó el papel con cuidado y enrolló un hilo largo. Cuando llegó su amiga Ada con unas cintas de tela, él aseguró que su creación estaba lista para estrenar. Eligió una cola muy corta porque pensó que una más larga resultaría demasiado pesada.",
          "En el prado, la cometa se elevó apenas unos segundos. Se inclinó, dio una vuelta y aterrizó entre las flores. Teo repitió el intento corriendo más rápido, pero obtuvo el mismo resultado. Comenzó a pensar que la cometa estaba mal hecha y que sería mejor empezar otra desde cero. Ada le propuso detenerse antes de decidir.",
          "Los dos examinaron la cometa sobre la mesa. El papel no tenía agujeros y las varillas seguían firmes. Al observarla de frente, Ada señaló la cola diminuta. Teo recordó que durante el vuelo la cometa giraba siempre hacia un lado. Ninguno sabía todavía la solución, pero ahora tenían un detalle concreto que podían poner a prueba.",
          "Decidieron cambiar solo la cola. Teo sujetó el marco mientras Ada añadía una cinta más larga y la colocaba en el centro. Revisaron el nudo y desenredaron el hilo antes de volver al prado. Al modificar una sola parte, podrían observar si ese cambio ayudaba, en lugar de construir otra cometa sin entender qué había ocurrido.",
          "Esperaron una brisa parecida a la del primer intento. Teo levantó el marco y dejó correr el hilo. La cometa subió sin dar aquella vuelta brusca y se mantuvo en el aire. Ada aplaudió mientras la larga cola se balanceaba sobre las flores. Teo le pasó el hilo: el vuelo también era suyo, aunque no hubiera pegado el primer trozo de papel.",
          "Al terminar, dibujaron nuevas ideas en una libreta. Teo comprendió que el primer intento no había sido inútil: les había mostrado qué observar. Ada añadió que escuchar otra mirada también formaba parte de construir. Guardaron las cintas sobrantes para una próxima cometa, con ganas de volver a experimentar y descubrir juntos lo que aún no sabían.",
        ],
        questions: [
          question(
            "q1",
            "Vocabulario en contexto",
            "En el relato, «examinaron» significa que los amigos…",
            [
              "abandonaron la cometa en el prado.",
              "miraron sus partes con atención.",
              "corrieron más rápido que antes.",
            ],
            1,
            2,
            "Después de examinarla comprueban el estado del papel, las varillas y la cola.",
            [
              "Busca qué hacen con el papel y las varillas en ese párrafo.",
              "Prueba qué significado encaja con revisar cada parte del objeto.",
            ],
          ),
          question(
            "q2",
            "Leer entre líneas",
            "¿Por qué deciden cambiar solo la cola?",
            [
              "Para no compartir las cintas de tela.",
              "Porque quieren abandonar el primer diseño.",
              "Para observar si ese cambio ayuda al vuelo.",
            ],
            2,
            3,
            "Al modificar una parte pudieron relacionar el nuevo vuelo con ese cambio concreto.",
            [
              "Piensa qué sería difícil saber si cambiaran toda la cometa.",
              "Relaciona la decisión de modificar una parte con lo que querían comprobar.",
            ],
          ),
          question(
            "q3",
            "Descubrir la idea",
            "¿Qué idea une el comienzo y el final del cuento?",
            [
              "Aprender juntos incluye observar, escuchar y probar.",
              "Construir deprisa evita cualquier dificultad.",
              "Una creación solo pertenece a quien empieza.",
            ],
            0,
            5,
            "Teo aprende a usar un intento que falla, escuchar otra mirada y experimentar en equipo.",
            [
              "Compara la idea de Teo de empezar desde cero con lo que aprende al final.",
              "Recuerda cómo la observación y la ayuda cambiaron lo que ocurrió.",
            ],
          ),
        ],
      },
    },
  },
];
