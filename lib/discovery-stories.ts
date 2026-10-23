import type { Question, Story, StoryVersion } from "./stories.ts";

// Original editorial text. The same evidence is present in both reading levels.
function version(
  paragraphs: string[],
  questions: Omit<Question, "id">[],
): StoryVersion {
  return {
    paragraphs,
    questions: questions.map((question, index) => ({
      id: `q${index + 1}`,
      ...question,
    })),
  };
}

const tracksQuestions: Omit<Question, "id">[] = [
  {
    skill: "Encontrar información",
    prompt: "¿Qué encontraron Nina y Beto en el barro?",
    options: [
      "Huellas de tres dedos.",
      "Una cesta vacía.",
      "Una bufanda verde.",
    ],
    correct: 0,
    paragraph: 1,
    explanation:
      "Vieron huellas anchas de tres dedos y pensaron en las patas de Teo.",
    hints: [
      "Vuelve a la parte donde se agachan junto al camino.",
      "Busca la marca que habían dejado unas patas sobre el barro.",
    ],
  },
  {
    skill: "Leer entre líneas",
    prompt: "¿Por qué les sirvió encontrar la pluma?",
    options: [
      "Porque detuvo la lluvia.",
      "Porque les dio otra pista del camino de Teo.",
      "Porque era un mapa con palabras.",
    ],
    correct: 1,
    paragraph: 2,
    explanation:
      "La lluvia borraba las huellas. La pluma dorada era otra señal de que Teo había pasado por allí.",
    hints: [
      "¿Qué estaba haciendo la lluvia con las marcas del barro?",
      "Recuerda de qué color era Teo. ¿Con qué se parecía la pluma?",
    ],
  },
  {
    skill: "Descubrir la idea",
    prompt: "¿Qué les ayudó a encontrar a su amigo?",
    options: [
      "Seguir cualquier camino sin mirar.",
      "Esperar a que el bosque se quedara vacío.",
      "Observar y comparar varias pistas.",
    ],
    correct: 2,
    paragraph: 3,
    explanation:
      "Primero observaron las huellas y después la pluma. Juntas, las pistas los llevaron hasta Teo.",
    hints: [
      "Piensa en las dos cosas que encontraron antes de llegar al estanque.",
      "Una señal desaparecía, pero descubrieron otra. ¿Qué hicieron con lo que veían?",
    ],
  },
];

const mailQuestions: Omit<Question, "id">[] = [
  {
    skill: "Encontrar información",
    prompt: "¿Qué hizo que las cartas salieran del buzón?",
    options: [
      "Un pez que saltó.",
      "Una ráfaga de viento.",
      "Un sobre demasiado pequeño.",
    ],
    correct: 1,
    paragraph: 1,
    explanation:
      "El buzón estaba abierto y una ráfaga de viento sacó las cartas.",
    hints: [
      "Busca qué ocurrió justo antes de que las cartas cayeran al césped.",
      "Fíjate en lo que movía las hojas y también los sobres.",
    ],
  },
  {
    skill: "Leer entre líneas",
    prompt: "¿Para qué dejaron una abertura en la tapa?",
    options: [
      "Para que el buzón se llenara de hojas.",
      "Para guardar la bufanda de Alma.",
      "Para meter cartas sin dejar el buzón abierto.",
    ],
    correct: 2,
    paragraph: 2,
    explanation:
      "La abertura dejaba entrar las cartas mientras la tapa las protegía del viento.",
    hints: [
      "Piensa cómo podían meter un sobre con la tapa cerrada.",
      "La tapa debía proteger las cartas, pero también tenían que poder recibir más. ¿Cómo lo lograron?",
    ],
  },
  {
    skill: "Descubrir la idea",
    prompt: "¿Qué hicieron Fito y Alma cuando algo salió mal?",
    options: [
      "Miraron el problema y mejoraron su idea.",
      "Dejaron todas las cartas en el suelo.",
      "Cerraron el camino del bosque.",
    ],
    correct: 0,
    paragraph: 3,
    explanation:
      "Observaron por qué salían las cartas y añadieron una tapa. Después comprobaron que el buzón funcionaba mejor.",
    hints: [
      "Compara el buzón del comienzo con el del final.",
      "¿Se rindieron al ver las cartas en el césped o cambiaron algo?",
    ],
  },
];

export const discoveryStories: Story[] = [
  {
    id: "sendero-huellas",
    category: "aventuras",
    title: "El sendero de las huellas",
    subtitle: "Cada pista cuenta una parte del camino.",
    theme: "Observación y amistad",
    art: "tracks",
    minutes: 4,
    description:
      "Nina y Beto buscan a su amigo siguiendo pequeñas pistas del bosque.",
    versions: {
      paso: version(
        [
          "Nina, la coneja, llevaba una cesta para compartir. Beto, el erizo, caminaba a su lado. Querían visitar a Teo, un pato de plumas doradas. El sendero se dividía en dos. No sabían por dónde seguir.",
          "Nina miró el barro. Había huellas anchas con tres dedos. Beto se agachó para verlas mejor. «Se parecen a las patas de Teo», dijo. Las marcas seguían por el camino de la derecha. Los amigos fueron por allí.",
          "Empezó a llover y el agua borró algunas huellas. Los amigos se detuvieron. Debajo de unas hojas, Nina vio una pluma dorada. Era como las de Teo. Un poco más adelante encontraron otra. Siguieron esas nuevas pistas con cuidado.",
          "El camino llegó a un estanque poco profundo. Teo los esperaba junto al agua. Los tres extendieron una manta y compartieron la merienda. Nina y Beto sonrieron: mirar las huellas y las plumas les había ayudado a encontrar a su amigo.",
        ],
        tracksQuestions,
      ),
      reto: version(
        [
          "Nina, una coneja de bufanda verde, preparó una cesta para visitar a Teo. Su amigo Beto, un pequeño erizo, la acompañaba. El pato de plumas doradas vivía cerca de un estanque. Al entrar en el bosque encontraron una bifurcación: el sendero se dividía en dos caminos y ninguno tenía un cartel.",
          "En lugar de elegir al azar, Nina observó el barro. Allí había huellas anchas de tres dedos. Beto se agachó para comparar las marcas con las patas de su amigo. «Podrían ser de Teo», comentó. Las huellas avanzaban por el camino de la derecha. Decidieron seguirlas y buscar más señales durante el recorrido.",
          "Una lluvia ligera empezó a borrar las marcas. Nina y Beto se detuvieron para mirar alrededor. Bajo unas hojas secas asomaba una pluma dorada, del mismo color que las de Teo. Después encontraron otra más adelante. Las plumas estaban protegidas de la lluvia. Aunque las huellas desaparecían, todavía podían comparar otras pistas.",
          "Al salir de los árboles apareció un estanque poco profundo. Teo los esperaba junto a la orilla y los recibió con un abrazo. Extendieron una manta para compartir la merienda. Beto recordó que una sola señal no les había mostrado todo el camino. Observar las huellas y las plumas, juntas, les había permitido encontrar a su amigo.",
        ],
        tracksQuestions,
      ),
    },
  },
  {
    id: "buzon-bosque",
    category: "aventuras",
    title: "El buzón del bosque",
    subtitle: "Una buena idea también puede mejorar.",
    theme: "Cooperación y soluciones",
    art: "mail",
    minutes: 4,
    description:
      "Fito y Alma mejoran un buzón para que los mensajes lleguen a sus amigos.",
    versions: {
      paso: version(
        [
          "Fito, el zorro, puso un buzón azul junto a un árbol. Alma, la nutria, llegó con varios sobres. Querían que sus amigos del bosque dejaran allí sus mensajes. Metieron las cartas y dejaron la tapa abierta.",
          "Una ráfaga de viento movió las hojas. También sacó las cartas del buzón. Los sobres cayeron sobre el césped. Alma los recogió mientras Fito sujetaba el buzón. «Con la tapa abierta, las cartas se vuelan», dijo Alma.",
          "Los amigos colocaron una tapa de madera. Tenía una abertura estrecha, como una boca pequeña. Fito pasó un sobre por ella. La carta cayó dentro y quedó protegida. Así podían meter más cartas sin dejar la tapa abierta.",
          "El viento volvió a soplar, pero las cartas siguieron dentro. Fito y Alma abrieron juntos una invitación para una merienda. Había funcionado su cambio. Al mirar el problema y mejorar el buzón, habían encontrado una forma de compartir mensajes con sus amigos.",
        ],
        mailQuestions,
      ),
      reto: version(
        [
          "Fito llevaba un peto azul y muchas ganas de compartir una idea. Colocó un buzón junto al árbol más grande del bosque. Alma, una nutria de bufanda verde, llegó con varios sobres. Aquel sería el lugar donde sus amigos intercambiarían mensajes. Guardaron las primeras cartas y dejaron levantada la tapa del buzón.",
          "Una ráfaga de viento agitó las ramas y entró en el buzón abierto. Varias cartas salieron volando hasta el césped. Alma corrió a recoger los sobres mientras Fito sostenía el buzón. Al principio pensaron en poner algo pesado sobre cada carta. Después observaron por dónde había entrado el viento: la tapa seguía abierta.",
          "Los amigos colocaron una tapa de madera con una ranura: una abertura estrecha por la que cabía un sobre. Fito probó a introducir una carta sin levantar la tapa. El sobre cayó dentro y quedó protegido. Habían encontrado una manera de recibir nuevos mensajes sin dejar expuestas al viento las cartas que ya estaban guardadas.",
          "Cuando volvió a soplar el viento, las cartas permanecieron en su sitio. Fito y Alma abrieron una invitación ilustrada para una merienda con sus amigos. Sonrieron al recordar el primer intento. El buzón no había funcionado bien desde el principio, pero observar el problema y probar un cambio les había ayudado a mejorar su idea.",
        ],
        mailQuestions,
      ),
    },
  },
];
