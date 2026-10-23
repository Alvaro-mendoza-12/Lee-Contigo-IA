import type { Story } from "./stories.ts";
import { question } from "./extra-stories.ts";

// Longer stories, listed on the "Un nuevo reto" shelf.
export const longStories: Story[] = [
  {
    id: "barco-de-papel",
    category: "aventuras",
    title: "El gran viaje del barco de papel",
    subtitle: "Un mensaje pequeño puede llegar muy lejos.",
    theme: "Amistad y valentía",
    art: "boat",
    shelf: "reto",
    minutes: 9,
    description: "Un barco de papel lleva un mensaje por el río.",
    versions: {
      paso: {
        paragraphs: [
          "Valeria era nueva en el barrio. No conocía a nadie. Una tarde dobló una hoja y la convirtió en un barco de papel. En la vela escribió: «¿Quieres ser mi amigo?».",
          "Llevó el barco al arroyo que pasaba detrás de su casa. Lo puso sobre el agua con cuidado. El barco se movió despacio y luego empezó a navegar.",
          "Primero pasó junto a unos patos. Los patos lo miraron con curiosidad y nadaron a su lado. Después, el barco se quedó atrapado entre unas ramas.",
          "Entonces sopló el viento. Las ramas se movieron y el barco quedó libre. Siguió su viaje y bajó por una pequeña cascada. ¡Casi se moja la vela!",
          "Al final, el barco llegó al lago del parque. Allí jugaba un niño llamado Samuel. Samuel vio el barco, lo sacó del agua y leyó el mensaje.",
          "Samuel escribió «¡Sí!» y su dirección. Al día siguiente tocó la puerta de Valeria. Desde ese día, los dos juegan juntos a hacer barcos de papel.",
        ],
        questions: [
          question(
            "q1",
            "Encontrar información",
            "¿Qué escribió Valeria en la vela del barco?",
            [
              "«¿Quieres ser mi amigo?».",
              "Su nombre y su edad.",
              "«Feliz cumpleaños».",
            ],
            0,
            0,
            "Valeria escribió en la vela: «¿Quieres ser mi amigo?».",
            [
              "Lee el primer párrafo hasta el final.",
              "Busca las palabras entre comillas «».",
            ],
          ),
          question(
            "q2",
            "Leer entre líneas",
            "¿Por qué Valeria envió el barco con un mensaje?",
            [
              "Porque quería tirar basura al agua.",
              "Porque era nueva y quería hacer un amigo.",
              "Porque los patos se lo pidieron.",
            ],
            1,
            0,
            "Valeria era nueva en el barrio y no conocía a nadie. Quería hacer un amigo.",
            [
              "¿Cómo se sentía Valeria en su barrio nuevo?",
              "Relaciona «no conocía a nadie» con lo que escribió.",
            ],
          ),
          question(
            "q3",
            "Descubrir la idea",
            "¿Qué nos enseña el viaje del barco?",
            [
              "Que los barcos de papel no sirven.",
              "Que un pequeño mensaje puede ayudar a hacer amigos.",
              "Que nunca hay que ir al parque.",
            ],
            1,
            5,
            "El mensaje de Valeria viajó hasta Samuel, y así se hicieron amigos.",
            [
              "¿Qué pasó cuando Samuel leyó el mensaje?",
              "Lee el último párrafo. ¿Qué cambió para Valeria?",
            ],
          ),
        ],
      },
      reto: {
        paragraphs: [
          "Valeria se había mudado al barrio de los sauces hacía apenas una semana. Desde la ventana de su nueva habitación veía a otros niños jugar en la calle, pero no se animaba a acercarse. Le parecía que todos ya tenían amigos y que no quedaba lugar para alguien más. Una tarde, aburrida, tomó una hoja de su cuaderno y empezó a doblarla, tal como le había enseñado su abuelo.",
          "Pliegue tras pliegue, la hoja se transformó en un barco de papel con una vela puntiaguda. Valeria lo observó un largo rato. Entonces tuvo una idea: con su lápiz azul escribió en la vela, con letras grandes y cuidadosas, «¿Quieres ser mi amigo?». Debajo dibujó una casa con una puerta roja, la misma que tenía su casa nueva.",
          "Detrás del jardín corría un arroyo de agua clara que, según decían los vecinos, terminaba en el lago del parque. Valeria se arrodilló en la orilla, sostuvo el barco unos segundos y lo soltó con suavidad. Al principio giró sobre sí mismo, indeciso, como si no supiera hacia dónde ir. Luego la corriente lo atrapó y comenzó a alejarse río abajo.",
          "El barco navegó entre piedras cubiertas de musgo hasta encontrarse con una familia de patos. La mamá pata lo examinó con desconfianza, pero los patitos nadaron a su alrededor, escoltándolo como si fuera un pequeño capitán. Más adelante, sin embargo, la corriente lo empujó contra un montón de ramas caídas y allí quedó atascado, balanceándose sin poder avanzar.",
          "Pasó un buen rato. El papel empezaba a humedecerse en los bordes y parecía que el viaje terminaría allí. De pronto, una ráfaga de viento sacudió los árboles de la orilla. Las ramas crujieron, se separaron apenas un poco y el barco se deslizó por el hueco. Libre otra vez, continuó su camino, algo inclinado pero con la vela todavía en alto.",
          "Lo esperaba la parte más difícil: una pequeña cascada donde el agua caía haciendo espuma. El barco se tambaleó en el borde, cayó dando una vuelta completa y, contra todo pronóstico, volvió a flotar. La tinta de la vela se había corrido un poco, pero el mensaje todavía podía leerse con claridad.",
          "Esa misma tarde, en el lago del parque, un niño llamado Samuel lanzaba piedritas al agua. Al ver algo blanco acercándose a la orilla, se agachó y rescató el barco empapado. Leyó la pregunta de la vela y miró con atención el dibujo de la casa de puerta roja. Samuel sonrió: conocía esa puerta, porque estaba a solo dos calles de la suya.",
          "A la mañana siguiente, alguien tocó la puerta roja. Era Samuel, con el barco seco entre las manos y la palabra «¡Sí!» escrita junto al mensaje. Valeria no podía creerlo. Esa tarde construyeron juntos una flota entera de barcos de papel. Valeria comprendió que, a veces, basta con atreverse a enviar un pequeño mensaje para que alguien, en algún lugar, lo esté esperando.",
        ],
        questions: [
          question(
            "q1",
            "Vocabulario en contexto",
            "En la historia, los patitos iban «escoltándolo». Eso quiere decir que…",
            [
              "lo acompañaban nadando a su lado.",
              "intentaban hundirlo.",
              "se lo querían comer.",
            ],
            0,
            3,
            "Los patitos nadaban alrededor del barco, acompañándolo como a un capitán: eso es escoltar.",
            [
              "Fíjate en lo que hacían los patitos alrededor del barco.",
              "Piensa en un capitán con su tripulación cerca. ¿Qué hacen los que lo escoltan?",
            ],
          ),
          question(
            "q2",
            "Leer entre líneas",
            "¿Por qué Valeria dibujó una casa con una puerta roja?",
            [
              "Porque le gustaba mucho el color rojo.",
              "Para que quien encontrara el barco supiera dónde vivía.",
              "Porque su abuelo se lo pidió.",
            ],
            1,
            6,
            "Gracias al dibujo de la puerta roja, Samuel supo dónde vivía Valeria y pudo ir a buscarla.",
            [
              "¿Qué hizo Samuel después de mirar el dibujo?",
              "Relaciona el dibujo del segundo párrafo con lo que pasa al final.",
            ],
          ),
          question(
            "q3",
            "Descubrir la idea",
            "¿Qué comprende Valeria al final del cuento?",
            [
              "Que es mejor quedarse siempre en casa.",
              "Que los barcos de papel siempre se hunden.",
              "Que atreverse a dar el primer paso puede traer un amigo.",
            ],
            2,
            7,
            "Al principio no se animaba a acercarse a nadie. Al enviar su mensaje, encontró a Samuel.",
            [
              "Compara cómo se sentía Valeria al principio y al final.",
              "Lee la última frase del cuento con atención.",
            ],
          ),
        ],
      },
    },
  },
];
