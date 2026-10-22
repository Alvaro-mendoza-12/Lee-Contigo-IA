import { extraStories } from "./extra-stories.ts";
import { moreStories } from "./more-stories.ts";
import { longStories } from "./long-stories.ts";

export type Level = "paso" | "reto";
export type StoryArtVariant =
  | "night"
  | "seed"
  | "lighthouse"
  | "kite"
  | "dragon"
  | "ocean"
  | "space"
  | "farm"
  | "rain"
  | "music"
  | "boat";
export const storyIds = [
  "luz-del-bosque",
  "semilla-viajera",
  "camino-al-faro",
  "cometa-en-equipo",
  "dragon-de-flores",
  "estrella-de-mar",
  "cohete-de-carton",
  "gallina-cuenta",
  "paraguas-de-colores",
  "orquesta-del-bosque",
  "barco-de-papel",
] as const;
export type StoryId = (typeof storyIds)[number];
export type Question = {
  id: string;
  skill: string;
  prompt: string;
  options: string[];
  correct: number;
  paragraph: number;
  explanation: string;
  hints: [string, string];
};
export type StoryVersion = { paragraphs: string[]; questions: Question[] };
export type Story = {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  art: StoryArtVariant;
  /** Library shelf the story is listed on; defaults to "paso". */
  shelf?: Level;
  minutes: number;
  description: string;
  versions: Record<Level, StoryVersion>;
};
export const levels: Record<
  Level,
  { label: string; description: string; details: string }
> = {
  paso: {
    label: "Paso a paso",
    description: "Frases cortas.",
    details:
      "Un cuento corto, con frases sencillas y palabras fáciles. Ideal para quienes empiezan a leer solos. Las preguntas piden encontrar datos en el texto.",
  },
  reto: {
    label: "Un nuevo reto",
    description: "Más largo.",
    details:
      "Un cuento más largo, con frases más completas y palabras nuevas. Para quienes ya leen con soltura. Las preguntas invitan a pensar y relacionar ideas.",
  },
};
export const stories: Story[] = [
  {
    id: "luz-del-bosque",
    title: "Una luz en el bosque",
    subtitle: "Las pequeñas cosas también iluminan.",
    theme: "Amistad y naturaleza",
    art: "night",
    minutes: 4,
    description:
      "Lina descubre que, para ayudar, no hace falta tener la luz más grande.",
    versions: {
      paso: {
        paragraphs: [
          "Lina era una luciérnaga pequeña. Cada noche encendía su luz junto al río. Su luz era suave, pero a Lina le gustaba verla brillar.",
          "Una noche encontró a Tomás, un grillo. Él no podía cruzar el río porque no veía las piedras. La luna estaba escondida detrás de las nubes.",
          "Lina voló sobre la primera piedra y encendió su luz. Después fue hasta la segunda. Tomás la siguió con cuidado, dando un salto a la vez.",
          "Al llegar al otro lado, Tomás sonrió. «Tu luz me ayudó a encontrar el camino», dijo. Lina comprendió que una luz pequeña podía hacer una gran diferencia.",
        ],
        questions: [
          {
            id: "q1",
            skill: "Encontrar información",
            prompt: "¿Por qué Tomás no podía cruzar el río?",
            options: [
              "Porque no veía las piedras.",
              "Porque quería buscar a la luna.",
              "Porque estaba esperando a sus amigos.",
            ],
            correct: 0,
            paragraph: 1,
            explanation:
              "La luna estaba detrás de las nubes y Tomás no podía ver las piedras para saltar.",
            hints: [
              "Vuelve al segundo párrafo. ¿Qué le faltaba a Tomás para saber dónde saltar?",
              "Imagina el río de noche. Busca la frase que cuenta qué no podía ver Tomás.",
            ],
          },
          {
            id: "q2",
            skill: "Leer entre líneas",
            prompt: "¿Por qué Lina iluminó una piedra a la vez?",
            options: [
              "Para que Tomás siguiera el camino con cuidado.",
              "Para esconderse de Tomás.",
              "Para que las nubes se fueran.",
            ],
            correct: 0,
            paragraph: 2,
            explanation:
              "Lina fue de una piedra a otra. Así Tomás pudo seguirla y cruzar poco a poco.",
            hints: [
              "Piensa en cómo avanzaba Tomás cuando Lina se movía a la siguiente piedra.",
              "Lina marcó el camino paso a paso. ¿Qué conseguía Tomás con esa ayuda?",
            ],
          },
          {
            id: "q3",
            skill: "Descubrir la idea",
            prompt: "¿Qué descubre Lina al final?",
            options: [
              "Que solo la luna puede iluminar.",
              "Que una pequeña ayuda puede ser importante.",
              "Que todos los grillos saben volar.",
            ],
            correct: 1,
            paragraph: 3,
            explanation:
              "Aunque la luz de Lina era pequeña, fue suficiente para ayudar a su amigo.",
            hints: [
              "Lee la última frase. ¿Qué cambió para Tomás gracias a Lina?",
              "La luz no creció, pero ayudó mucho. ¿Qué nos enseña eso sobre las pequeñas ayudas?",
            ],
          },
        ],
      },
      reto: {
        paragraphs: [
          "Cada anochecer, Lina encendía su diminuta luz a la orilla del río. A su alrededor, la luna iluminaba las copas de los árboles. «Mi luz apenas se nota», pensaba la luciérnaga, sin imaginar que pronto alguien la necesitaría.",
          "Una noche, las nubes cubrieron la luna. Entre las hojas apareció Tomás, un grillo que debía regresar a casa. El río separaba las dos orillas y, con tanta oscuridad, no distinguía las piedras que formaban el paso.",
          "Lina se acercó. Su luz no alcanzaba para iluminar todo el río, así que tuvo una idea: volaría hasta cada piedra y esperaría a que Tomás llegara. Cruzaron despacio, entre el sonido del agua y el canto de los grillos.",
          "Cuando alcanzaron la otra orilla, Tomás le dio las gracias. Lina miró su luz, que seguía siendo tan pequeña como siempre. Ahora la veía de otra manera: no necesitaba iluminar el bosque entero para ser valiosa.",
        ],
        questions: [
          {
            id: "q1",
            skill: "Vocabulario en contexto",
            prompt:
              "En la historia, «no distinguía las piedras» significa que Tomás…",
            options: [
              "no lograba verlas con claridad.",
              "no sabía cuántos años tenían.",
              "no quería tocarlas.",
            ],
            correct: 0,
            paragraph: 1,
            explanation:
              "La oscuridad impedía que Tomás viera las piedras con claridad. Ese es el sentido de «distinguía» aquí.",
            hints: [
              "Busca qué ocurrió con la luna antes de que Tomás llegara al río.",
              "Prueba cambiar «distinguía» por cada opción. ¿Cuál encaja con una noche oscura?",
            ],
          },
          {
            id: "q2",
            skill: "Leer entre líneas",
            prompt: "¿Qué muestra la solución de Lina?",
            options: [
              "Que esperó a que alguien resolviera el problema.",
              "Que encontró una forma de ayudar con lo que tenía.",
              "Que podía iluminar todo el bosque.",
            ],
            correct: 1,
            paragraph: 2,
            explanation:
              "Lina no cambió su luz: encontró una forma de usarla, iluminando una piedra y esperando a Tomás.",
            hints: [
              "Su luz no llegaba a todo el río. ¿Qué decidió hacer en lugar de rendirse?",
              "Fíjate en la diferencia entre iluminar todo el río y guiar a alguien de una piedra a otra.",
            ],
          },
          {
            id: "q3",
            skill: "Descubrir la idea",
            prompt: "¿Qué cambia en Lina al final del relato?",
            options: [
              "La intensidad de su luz.",
              "El lugar donde vive.",
              "La forma en que valora su propia luz.",
            ],
            correct: 2,
            paragraph: 3,
            explanation:
              "Su luz seguía igual. Lo que cambió fue la forma de verla: ahora entendía lo valiosa que podía ser.",
            hints: [
              "Compara lo que Lina piensa al principio con lo que piensa al final.",
              "El texto dice que su luz seguía siendo pequeña. Entonces, ¿qué había cambiado de verdad?",
            ],
          },
        ],
      },
    },
  },
  {
    id: "semilla-viajera",
    title: "La semilla viajera",
    subtitle: "Crecer también es aprender a esperar.",
    theme: "Curiosidad y cuidado",
    art: "seed",
    minutes: 5,
    description:
      "Un hallazgo en el bolsillo de Nico se convierte en una sorpresa llena de vida.",
    versions: {
      paso: {
        paragraphs: [
          "Nico encontró una semilla en el bolsillo de su abrigo. Era pequeña y marrón. No sabía de dónde había venido, pero quiso descubrir qué podía crecer de ella.",
          "La puso en una maceta con tierra. Su abuela le dijo que necesitaba un poco de agua, luz y tiempo. Nico dejó la maceta cerca de la ventana.",
          "Durante varios días, Nico miró la tierra. Como no veía nada, quiso sacar la semilla. Su abuela le explicó que primero crecen las raíces, aunque no podamos verlas.",
          "Nico decidió esperar. Una mañana apareció un brote verde. Lo miró con alegría y comprendió que, a veces, las cosas crecen antes de que podamos verlas.",
        ],
        questions: [
          {
            id: "q1",
            skill: "Encontrar información",
            prompt: "¿Dónde puso Nico la maceta?",
            options: [
              "Dentro de su abrigo.",
              "Cerca de la ventana.",
              "Debajo de su cama.",
            ],
            correct: 1,
            paragraph: 1,
            explanation:
              "Nico dejó la maceta cerca de la ventana para que recibiera luz.",
            hints: [
              "Busca en el segundo párrafo dónde podía llegar la luz.",
              "La abuela dijo que hacía falta luz. ¿Qué lugar de la casa eligió Nico?",
            ],
          },
          {
            id: "q2",
            skill: "Leer entre líneas",
            prompt: "¿Por qué Nico quería sacar la semilla?",
            options: [
              "Porque no veía que estuviera creciendo.",
              "Porque necesitaba otra maceta.",
              "Porque ya era un árbol grande.",
            ],
            correct: 0,
            paragraph: 2,
            explanation:
              "Nico no veía cambios en la tierra y todavía no sabía que las raíces crecían debajo.",
            hints: [
              "Piensa en lo que Nico podía ver y en lo que ocurría debajo de la tierra.",
              "Vuelve al tercer párrafo. ¿Qué lo hizo pensar que debía sacar la semilla?",
            ],
          },
          {
            id: "q3",
            skill: "Descubrir la idea",
            prompt: "¿Qué aprendió Nico?",
            options: [
              "Que una planta crece sin agua.",
              "Que hay que sacar la semilla cada día.",
              "Que cuidar y tener paciencia ayuda a crecer.",
            ],
            correct: 2,
            paragraph: 3,
            explanation:
              "Nico cuidó la semilla y esperó. Aunque no veía las raíces, la planta estaba creciendo.",
            hints: [
              "Al principio quería sacar la semilla. Al final, ¿qué decidió hacer?",
              "Recuerda las palabras de la abuela: agua, luz y tiempo. ¿Qué enseña la historia?",
            ],
          },
        ],
      },
      reto: {
        paragraphs: [
          "Al guardar su abrigo, Nico descubrió una semilla en el bolsillo. ¿Habría llegado de la plaza, del jardín o pegada a sus zapatos? En lugar de tirarla, decidió averiguar qué secreto llevaba dentro.",
          "Llenó una maceta con tierra, enterró la semilla y la dejó junto a la ventana. Su abuela le recordó que no debía inundarla: un poco de agua, luz y paciencia serían suficientes para empezar.",
          "Pasaron varios días sin que asomara nada. Nico pensó que había fallado y acercó los dedos a la tierra. «Todavía no la saques», dijo su abuela. «Las raíces trabajan primero, escondidas. No todo lo que crece se ve de inmediato».",
          "Nico siguió cuidando la maceta. Una mañana descubrió un brote que se inclinaba hacia la luz. Comprendió que esperar no era olvidarse de la semilla, sino acompañar un cambio que aún no podía ver.",
        ],
        questions: [
          {
            id: "q1",
            skill: "Vocabulario en contexto",
            prompt: "¿Qué significa «asomara» en el tercer párrafo?",
            options: [
              "Que empezara a aparecer sobre la tierra.",
              "Que desapareciera de la maceta.",
              "Que necesitara más agua.",
            ],
            correct: 0,
            paragraph: 2,
            explanation:
              "Nico esperaba ver la planta aparecer por encima de la tierra. En ese contexto, eso significa «asomar».",
            hints: [
              "¿Qué esperaba ver Nico cuando miraba la superficie de la maceta?",
              "Imagina el primer momento en que un brote sale de la tierra. ¿Qué palabra describe eso?",
            ],
          },
          {
            id: "q2",
            skill: "Leer entre líneas",
            prompt: "¿Por qué la abuela le pide que no saque la semilla?",
            options: [
              "Porque había perdido la maceta.",
              "Porque la planta podía estar creciendo bajo tierra.",
              "Porque las semillas no necesitan cuidados.",
            ],
            correct: 1,
            paragraph: 2,
            explanation:
              "La abuela sabía que las raíces podían crecer antes de que apareciera el brote.",
            hints: [
              "La abuela menciona una parte de la planta que no se ve desde fuera.",
              "Que no aparezca un brote todavía no significa que no esté pasando nada. ¿Qué estaba creciendo primero?",
            ],
          },
          {
            id: "q3",
            skill: "Descubrir la idea",
            prompt: "¿Qué idea expresa mejor el final?",
            options: [
              "Esperar significa dejar de cuidar.",
              "Solo vale la pena cuidar cuando hay resultados.",
              "Cuidar también es confiar en cambios que todavía no vemos.",
            ],
            correct: 2,
            paragraph: 3,
            explanation:
              "Nico siguió cuidando la maceta sin ver resultados inmediatos. Aprendió que crecer puede tomar tiempo.",
            hints: [
              "El último párrafo dice que esperar no era olvidarse. ¿Qué hizo Nico mientras esperaba?",
              "Compara «dejar de cuidar» con «acompañar un cambio». ¿Cuál se parece a la actitud final de Nico?",
            ],
          },
        ],
      },
    },
  },
  ...extraStories,
  ...moreStories,
  ...longStories,
];
export function storiesForShelf(level: Level) {
  return stories.filter((story) => (story.shelf ?? "paso") === level);
}
export function getStory(id: string) {
  return stories.find((story) => story.id === id);
}
export function getLevel(value?: string | string[]): Level {
  return value === "reto" ? "reto" : "paso";
}
