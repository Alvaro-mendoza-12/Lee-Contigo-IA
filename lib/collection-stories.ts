import type { Story, Question } from "./stories.ts";

// Original editorial stories. Each level has its own text; questions cite an
// actual paragraph in both versions and progressively point back to evidence.
function questions(items: Omit<Question, "id">[]): Question[] {
  return items.map((item, i) => ({ id: `q${i + 1}`, ...item }));
}
function version(paragraphs: string[], items: Omit<Question, "id">[]) {
  return { paragraphs, questions: questions(items) };
}
const bridgeQuestions: Omit<Question, "id">[] = [
  {
    skill: "Encontrar información",
    prompt: "¿Qué usaron para sostener la rama?",
    options: [
      "Dos piedras junto a las orillas.",
      "Hojas encima del agua.",
      "Una cesta llena de nueces.",
    ],
    correct: 0,
    paragraph: 2,
    explanation: "Colocaron piedras para impedir que la rama se moviera.",
    hints: [
      "Busca los objetos que colocan junto a las orillas.",
      "Compara cómo estaba la rama antes y después de añadir esos objetos.",
    ],
  },
  {
    skill: "Leer entre líneas",
    prompt: "¿Por qué probaron el puente sin la cesta?",
    options: [
      "Para dejar de recoger nueces.",
      "Para comprobar primero si era seguro.",
      "Para que la cesta aprendiera a flotar.",
    ],
    correct: 1,
    paragraph: 2,
    explanation:
      "Antes de llevar peso, comprobaron que la rama ya no se movía.",
    hints: [
      "Observa qué comprueban antes de transportar las nueces.",
      "¿Qué podría ocurrir si cruzaran con una cesta pesada y la rama se moviera?",
    ],
  },
  {
    skill: "Descubrir la idea",
    prompt: "¿Qué les ayudó a resolver el problema?",
    options: [
      "Cruzar sin mirar la rama.",
      "Esperar a que desapareciera el río.",
      "Observar, mejorar el puente y probarlo juntas.",
    ],
    correct: 2,
    paragraph: 3,
    explanation:
      "Las ardillas se fijaron en el movimiento de la rama, buscaron apoyo y comprobaron su idea juntas.",
    hints: [
      "Recuerda qué hicieron cuando la primera idea no funcionó.",
      "Piensa qué acciones se repiten entre el principio y el final.",
    ],
  },
];
const cloudQuestions: Omit<Question, "id">[] = [
  {
    skill: "Encontrar información",
    prompt: "¿Dónde encontró agua la nube?",
    options: [
      "En una caja del jardín.",
      "En la niebla de la montaña.",
      "En el centro del girasol.",
    ],
    correct: 1,
    paragraph: 2,
    explanation:
      "La nube llegó a la montaña y se reunió con la niebla para recoger agua.",
    hints: [
      "Busca el lugar al que viaja después de ver el jardín.",
      "Fíjate en el aire húmedo que rodea la montaña.",
    ],
  },
  {
    skill: "Leer entre líneas",
    prompt: "¿Por qué el girasol levantó las hojas al final?",
    options: [
      "Porque escuchó una canción.",
      "Porque quería esconderse.",
      "Porque recibió el agua que necesitaba.",
    ],
    correct: 2,
    paragraph: 3,
    explanation:
      "El jardín estaba seco; después de la lluvia, las plantas recuperaron su aspecto.",
    hints: [
      "Compara cómo estaba la tierra al comienzo y al final.",
      "Relaciona lo que trae la nube con lo que necesitan las plantas.",
    ],
  },
  {
    skill: "Descubrir la idea",
    prompt: "¿Cómo cambió el viaje de la nube?",
    options: [
      "De vagar sin rumbo a buscar una forma de ayudar.",
      "De cuidar plantas a olvidarse de ellas.",
      "De tener prisa a buscar un sitio para dormir.",
    ],
    correct: 0,
    paragraph: 3,
    explanation:
      "Al ver la necesidad del jardín, la nube encontró un propósito para su viaje.",
    hints: [
      "Recuerda por qué empezó a buscar agua.",
      "Compara lo que hacía antes de ver el girasol con lo que decide hacer después.",
    ],
  },
];
const drumQuestions: Omit<Question, "id">[] = [
  {
    skill: "Encontrar información",
    prompt: "¿Qué hacía sonar los recipientes?",
    options: [
      "Las piedras del sendero.",
      "El viento de una ventana.",
      "Las gotas de lluvia.",
    ],
    correct: 2,
    paragraph: 0,
    explanation: "Ari escuchó las gotas que golpeaban el cubo del patio.",
    hints: [
      "Vuelve al primer sonido que escucha Ari.",
      "Busca qué cae sobre el cubo desde el cielo.",
    ],
  },
  {
    skill: "Leer entre líneas",
    prompt: "¿Por qué Ari usó recipientes de varios tamaños?",
    options: [
      "Para comparar sus sonidos.",
      "Para impedir que lloviera.",
      "Para guardar toda el agua del pueblo.",
    ],
    correct: 0,
    paragraph: 2,
    explanation:
      "Descubrió que los recipientes producían sonidos diferentes y quiso compararlos.",
    hints: [
      "Observa qué nota al escuchar el recipiente pequeño y el grande.",
      "¿Qué puede descubrir al ponerlos juntos que no escucharía con un solo cubo?",
    ],
  },
  {
    skill: "Descubrir la idea",
    prompt: "¿Qué descubrió Ari en una tarde de lluvia?",
    options: [
      "Que solo se puede jugar cuando hace sol.",
      "Que escuchar con atención puede inspirar una creación.",
      "Que todos los recipientes suenan igual.",
    ],
    correct: 1,
    paragraph: 3,
    explanation:
      "Ari transformó los sonidos que observó en un pequeño concierto para compartir.",
    hints: [
      "Relaciona el ruido del comienzo con el concierto del final.",
      "¿Qué hizo Ari entre escuchar algo curioso y compartirlo con su amigo?",
    ],
  },
];
const mapQuestions: Omit<Question, "id">[] = [
  {
    skill: "Encontrar información",
    prompt: "¿Qué dibujó Sol para representar la fuente?",
    options: ["Una bicicleta.", "Una estrella.", "Unas gotas de agua."],
    correct: 2,
    paragraph: 1,
    explanation:
      "En el mapa, las gotas representaban el lugar donde se oía la fuente.",
    hints: [
      "Busca el dibujo que hace al lado de la fuente.",
      "¿Qué dibujo se parece a lo que produce el sonido del agua?",
    ],
  },
  {
    skill: "Leer entre líneas",
    prompt: "¿Por qué Sol volvió a escuchar antes de dibujar?",
    options: [
      "Para comprobar de dónde venía cada sonido.",
      "Para olvidar el camino de vuelta.",
      "Para esperar a que el parque quedara vacío.",
    ],
    correct: 0,
    paragraph: 2,
    explanation:
      "El sonido de una campanilla la confundió y escuchó de nuevo antes de marcar su origen.",
    hints: [
      "Busca qué la confundió durante el paseo.",
      "¿Cómo podría evitar poner un símbolo en el lugar equivocado?",
    ],
  },
  {
    skill: "Descubrir la idea",
    prompt: "¿Qué muestra el mapa de Sol?",
    options: [
      "Que todos los parques tienen los mismos sonidos.",
      "Que podemos conocer un lugar usando varios sentidos.",
      "Que los mapas solo se pueden hacer con palabras.",
    ],
    correct: 1,
    paragraph: 3,
    explanation:
      "Sol combinó lo que escuchaba con dibujos de lugares que podía observar.",
    hints: [
      "Piensa en cómo exploró el parque, además de mirarlo.",
      "Relaciona los sonidos que escuchó con los símbolos que dibujó.",
    ],
  },
];
const breadQuestions: Omit<Question, "id">[] = [
  {
    skill: "Encontrar información",
    prompt: "¿Dónde estaba la masa cuando casi no crecía?",
    options: [
      "Junto a una ventana abierta.",
      "Dentro de una cesta de pan.",
      "En una repisa templada.",
    ],
    correct: 0,
    paragraph: 1,
    explanation:
      "La masa estaba junto a la ventana abierta, donde entraba aire frío.",
    hints: [
      "Busca dónde dejaron el cuenco al principio.",
      "Fíjate en el lugar por el que entraba aire frío.",
    ],
  },
  {
    skill: "Leer entre líneas",
    prompt: "¿Por qué cambiaron el cuenco de lugar?",
    options: [
      "Para encontrar una cuchara.",
      "Para que la masa no recibiera aire frío.",
      "Para que la masa tuviera otro color.",
    ],
    correct: 1,
    paragraph: 2,
    explanation:
      "La abuela relacionó el frío de la ventana con la falta de crecimiento y buscó un lugar templado.",
    hints: [
      "Compara la ventana con la repisa elegida.",
      "¿Qué condición cambió entre el primer lugar y el segundo?",
    ],
  },
  {
    skill: "Descubrir la idea",
    prompt: "¿Qué aprendió Inés mientras esperaba el pan?",
    options: [
      "Que las recetas nunca necesitan observarse.",
      "Que hay que abandonar si algo tarda.",
      "Que observar y esperar también forman parte de preparar algo.",
    ],
    correct: 2,
    paragraph: 3,
    explanation:
      "Inés observó la masa, cambió una condición con su abuela y le dio tiempo para crecer.",
    hints: [
      "Recuerda cómo resolvieron que la masa no creciera.",
      "Además de mezclar ingredientes, ¿qué hicieron antes de hornear?",
    ],
  },
];
const seaQuestions: Omit<Question, "id">[] = [
  {
    skill: "Encontrar información",
    prompt: "¿Qué había dibujado en el papel?",
    options: [
      "Un árbol junto a una casa.",
      "Un pez y unas piedras.",
      "Una nube sobre el faro.",
    ],
    correct: 1,
    paragraph: 1,
    explanation:
      "El papel mostraba un pez junto a unas piedras y un arco de roca.",
    hints: [
      "Vuelve al momento en que abren el papel.",
      "Busca los dos dibujos que comparan luego con las pozas.",
    ],
  },
  {
    skill: "Leer entre líneas",
    prompt: "¿Por qué buscaron cerca del arco de roca?",
    options: [
      "Porque allí habían dejado la botella.",
      "Porque querían esconderse del cangrejo.",
      "Porque ese lugar coincidía con el dibujo.",
    ],
    correct: 2,
    paragraph: 2,
    explanation:
      "El arco de roca y las piedras con forma de pez aparecían tanto en el papel como en la playa.",
    hints: [
      "Compara lo que ven en el papel con lo que encuentran en la playa.",
      "¿Qué detalle les permite distinguir esa poza de las otras?",
    ],
  },
  {
    skill: "Descubrir la idea",
    prompt: "¿Qué hicieron para entender el mensaje?",
    options: [
      "Compararon las pistas y exploraron juntos.",
      "Adivinaron sin mirar el dibujo.",
      "Dejaron que la botella eligiera el camino.",
    ],
    correct: 0,
    paragraph: 3,
    explanation:
      "Nara y Tico relacionaron los símbolos con el paisaje y comprobaron su interpretación.",
    hints: [
      "Piensa en cómo pasaron de un papel misterioso a encontrar la concha.",
      "¿Cómo los ayudó comparar el dibujo con lo que veían?",
    ],
  },
];

export const collectionStories: Story[] = [
  {
    id: "puente-de-ardillas",
    category: "amigos",
    title: "El puente de las ardillas",
    subtitle: "Una idea se vuelve mejor cuando la probamos.",
    theme: "Ingenio y amistad",
    art: "bridge",
    minutes: 4,
    description:
      "Dos amigas buscan cómo llevar sus nueces al otro lado del arroyo.",
    versions: {
      paso: version(
        [
          "Lía y Noa recogían nueces en el bosque. Su casa estaba al otro lado de un arroyo. La lluvia había aumentado el agua y ya no podían saltar sobre las piedras.",
          "Lía encontró una rama gruesa. Las dos la pusieron entre las orillas. Parecía un buen puente, pero la rama se movía al tocarla. Noa dejó la cesta en el suelo para observar mejor.",
          "Juntas pusieron una piedra junto a cada extremo de la rama. Así dejaron de moverse los apoyos. Probaron el puente sin la cesta. Primero cruzó Lía despacio y después Noa. La rama estaba firme.",
          "Al final llevaron las nueces por el nuevo puente. Se sentaron a descansar junto a su casa. La primera idea no había bastado, pero observar, mejorar y probar juntas les había permitido llegar.",
        ],
        bridgeQuestions,
      ),
      reto: version(
        [
          "Cada otoño, Lía y Noa recogían nueces al otro lado del arroyo. Una mañana encontraron el agua más alta después de varios días de lluvia. Las piedras que usaban para cruzar habían desaparecido bajo la corriente. Las amigas dejaron sus cestas en la orilla y pensaron en una forma de regresar sin mojarse.",
          "Lía propuso usar una rama gruesa que había caído cerca. Entre las dos la apoyaron de una orilla a otra. Desde lejos parecía estable; sin embargo, cuando Noa presionó un extremo con una pata, la rama se balanceó. Decidieron detenerse. Una idea que parecía buena todavía necesitaba una comprobación.",
          "Al observar los extremos, descubrieron que faltaba apoyo. Colocaron dos piedras firmes junto a las orillas para sujetar la rama. Después comprobaron el puente sin llevar la cesta. Lía cruzó lentamente mientras Noa observaba si algo se movía. Luego intercambiaron sus lugares. Esta vez el paso permaneció estable.",
          "Solo entonces transportaron las nueces. Al llegar a casa, Noa pensó que el puente no era obra de una sola ardilla. Una había propuesto la rama; la otra había notado su movimiento. Juntas habían transformado una primera idea en una solución que pudieron comprobar con cuidado.",
        ],
        bridgeQuestions,
      ),
    },
  },
  {
    id: "nube-perdida",
    category: "naturaleza",
    title: "La nube que se perdió",
    subtitle: "Un viaje puede encontrar un nuevo propósito.",
    theme: "Naturaleza y cuidado",
    art: "cloud",
    minutes: 4,
    description: "Una nube encuentra un jardín que necesita un poco de lluvia.",
    versions: {
      paso: version(
        [
          "Una nube pequeña viajaba por el cielo sin saber adónde ir. Pasó sobre un jardín y vio un girasol con las hojas caídas. La tierra tenía grietas y la poza estaba seca.",
          "La nube quiso darle lluvia, pero apenas tenía agua. Se quedó un momento pensando. Desde el jardín se veía una montaña cubierta de niebla. El aire de aquel lugar parecía fresco y húmedo.",
          "La nube viajó hasta la montaña y se reunió con la niebla. Poco a poco recogió agua y creció. Entonces recordó las hojas del girasol. Volvió por el mismo camino, despacio para no perder el rumbo.",
          "Al llegar al jardín dejó caer una lluvia suave. La tierra se humedeció y el girasol levantó sus hojas. La nube ya no viajaba sin rumbo. Había encontrado un lugar donde su pequeño esfuerzo era útil.",
        ],
        cloudQuestions,
      ),
      reto: version(
        [
          "Una nube pequeña recorría el cielo sin un destino claro. A veces seguía a los pájaros y otras miraba las sombras que dibujaba sobre el suelo. Una tarde distinguió un jardín diferente de los demás: la tierra estaba agrietada, una poza se había secado y el girasol mantenía las hojas inclinadas.",
          "La nube comprendió que el jardín necesitaba agua. Intentó soltar unas gotas, pero eran demasiado pocas para humedecer la tierra. En lugar de marcharse, observó el horizonte. Una montaña cercana estaba rodeada de niebla. Recordó que allí el aire se mantenía húmedo incluso cuando el valle parecía seco.",
          "Llegó a la montaña y se reunió con la niebla. Mientras recogía agua se volvió más grande y gris. Podía continuar su viaje en otra dirección, pero recordó el jardín. Buscó las mismas lomas por las que había pasado y las siguió para regresar. Ahora cada tramo de su recorrido tenía un propósito.",
          "Sobre el girasol dejó caer una lluvia suave que duró varios minutos. Las grietas se oscurecieron con la humedad y las hojas empezaron a levantarse. La nube continuó su viaje más ligera. Aunque seguía sin tener un destino fijo, había descubierto que observar una necesidad podía ayudarla a decidir hacia dónde ir.",
        ],
        cloudQuestions,
      ),
    },
  },
  {
    id: "tambor-lluvia",
    category: "naturaleza",
    title: "El tambor de la lluvia",
    subtitle: "Hay ideas que empiezan por escuchar.",
    theme: "Música y curiosidad",
    art: "drum",
    minutes: 4,
    description:
      "Ari convierte los sonidos de una tarde lluviosa en un pequeño concierto.",
    versions: {
      paso: version(
        [
          "Ari miraba llover desde el patio cubierto. De pronto oyó un toc, toc junto a la puerta. Eran las gotas que caían sobre un cubo de metal. El sonido le hizo sonreír.",
          "Ari puso otro recipiente bajo el borde del techo. Las gotas sonaban de otra manera. Uno era pequeño y el otro grande. Acercó el oído sin salir a la lluvia para notar la diferencia.",
          "Con ayuda de una persona adulta colocó varios recipientes bajo el techo. Cambió su posición hasta escuchar un ritmo. Había sonidos graves y otros agudos. No todos los cubos hacían la misma música.",
          "Cuando llegó su amigo, Ari le pidió que escuchara. Los dos siguieron el ritmo dando suaves palmadas. La lluvia no había terminado, pero ya tenían algo nuevo que hacer: descubrir y compartir los sonidos del patio.",
        ],
        drumQuestions,
      ),
      reto: version(
        [
          "Ari pensaba que la lluvia había arruinado sus planes de jugar en el patio. Mientras esperaba bajo el techo, escuchó unos golpes regulares cerca de la puerta. No eran pasos: las gotas estaban cayendo sobre un cubo de metal. Se quedó quieto para distinguir el ritmo entre todos los sonidos del aguacero.",
          "Colocó un recipiente pequeño junto al cubo grande. Aunque recibían la misma lluvia, no sonaban igual. Uno producía golpes más agudos; el otro, un sonido profundo. Ari se acercó a escucharlos desde la parte cubierta y comenzó a imaginar cómo quedarían esos sonidos si pudiera ordenarlos como una canción.",
          "Pidió ayuda a una persona adulta para colocar distintos recipientes bajo el borde del techo. Los movieron hasta encontrar puntos donde las gotas caían con ritmos diferentes. Ari comparó los tamaños y las notas. No necesitaba que todos sonaran igual: precisamente las diferencias hacían interesante aquel pequeño concierto.",
          "Su amigo llegó cuando la lluvia empezaba a disminuir. Ari lo invitó a escuchar antes de explicarle lo que había hecho. Los dos acompañaron el ritmo con palmadas suaves. El patio seguía mojado, pero la tarde había cambiado. Ari descubrió que prestar atención a algo cotidiano podía convertirse en el comienzo de una creación.",
        ],
        drumQuestions,
      ),
    },
  },
  {
    id: "mapa-sonidos",
    category: "aventuras",
    title: "El mapa de los sonidos",
    subtitle: "Un parque también se descubre con los oídos.",
    theme: "Exploración y sentidos",
    art: "soundmap",
    minutes: 4,
    description:
      "Sol y su abuelo dibujan un mapa muy distinto durante su paseo.",
    versions: {
      paso: version(
        [
          "Sol fue al parque con su abuelo. Llevaba papel y lápices. Se sentó en un banco y cerró los ojos un momento. Oyó pájaros, agua y una campanilla. Quería dibujar un mapa de aquellos sonidos.",
          "Caminaron hasta la fuente. Sol escuchó el agua y dibujó unas gotas en su papel. Más allá, un árbol estaba lleno de pájaros. Para recordar aquel lugar dibujó una rama con un pájaro.",
          "La campanilla parecía venir de los columpios. Antes de dibujar, Sol volvió a escuchar. Vio una bicicleta junto al camino: de allí llegaba el sonido. Cambió su primera idea y marcó una rueda en el mapa.",
          "Al terminar, Sol mostró el papel a su abuelo. Los dibujos contaban lo que habían visto y oído. Juntos siguieron el recorrido una vez más. El mapa tenía pocos símbolos, pero les ayudaba a recordar un paseo lleno de detalles.",
        ],
        mapQuestions,
      ),
      reto: version(
        [
          "Sol solía dibujar los caminos del parque durante los paseos con su abuelo. Esa mañana decidió probar algo distinto. Se sentó en un banco y cerró los ojos para reconocer sonidos. Entre las voces escuchó agua, pájaros y una campanilla. Propuso crear un mapa que otra persona pudiera recorrer escuchando.",
          "Primero caminaron hacia el sonido del agua. Al encontrar la fuente, Sol dibujó unas gotas en el papel. Cerca de allí había un árbol donde varios pájaros cantaban. Marcó una rama con un pájaro para representar aquel punto. Cada símbolo tenía que ayudar a relacionar un sonido con un lugar concreto.",
          "La campanilla fue más difícil. Sol creyó que venía de los columpios, pero prefirió comprobarlo antes de dibujar. Se detuvo y escuchó de nuevo. Entonces vio una bicicleta que pasaba junto al camino. La primera impresión no había sido exacta: corrigió la dirección y dibujó una rueda donde había oído el sonido.",
          "Al volver al banco, Sol compartió su mapa con el abuelo. Lo recorrieron comparando los símbolos con lo que escuchaban y observaban. No era un plano completo del parque, pero mostraba detalles que antes ignoraban. Sol descubrió que conocer un lugar podía requerir algo más que mirar sus caminos.",
        ],
        mapQuestions,
      ),
    },
  },
  {
    id: "pan-abuela",
    category: "aventuras",
    title: "El pan de la abuela",
    subtitle: "Algunas cosas crecen cuando les damos tiempo.",
    theme: "Familia y descubrimiento",
    art: "bread",
    minutes: 4,
    description: "Inés y su abuela observan qué necesita una masa para crecer.",
    versions: {
      paso: version(
        [
          "Inés preparaba pan con su abuela. Mezclaron harina, agua y levadura en un cuenco. Después cubrieron la masa con un paño. La abuela dijo que había que esperar para que creciera.",
          "Dejaron el cuenco junto a una ventana abierta. Pasó un rato y la masa casi no cambió. Inés quiso añadir más harina. Su abuela le pidió que primero miraran y tocaran con cuidado el cuenco por fuera. Estaba frío.",
          "Cerraron la ventana y pusieron el cuenco en una repisa templada, lejos del horno. La abuela explicó que la masa necesitaba un lugar menos frío. La cubrieron otra vez y esperaron sin cambiar los ingredientes.",
          "Cuando levantaron el paño, la masa había crecido. La abuela se encargó de hornear el pan. Inés puso la mesa. Al compartir el primer trozo, recordó que observar y dar tiempo también habían sido parte de la receta.",
        ],
        breadQuestions,
      ),
      reto: version(
        [
          "Inés quería aprender la receta de pan de su abuela. Anotó la harina, el agua y la levadura, y la ayudó a mezclar todo en un cuenco. Después cubrieron la masa con un paño. Inés creyó que el trabajo había terminado, pero su abuela explicó que todavía faltaba una parte de la preparación: observar y esperar.",
          "El cuenco quedó junto a una ventana abierta. Al cabo de un rato, la masa apenas había aumentado de tamaño. Inés propuso añadir más harina enseguida. Su abuela le pidió que comprobaran primero las condiciones del lugar. Por la ventana entraba una corriente fría y la parte exterior del cuenco también estaba fría.",
          "Cerraron la ventana y trasladaron el cuenco a una repisa templada, lejos del horno. La abuela explicó que la levadura trabajaba mejor en un ambiente menos frío. No cambiaron los ingredientes: cubrieron la masa de nuevo para comprobar si el cambio de lugar ayudaba. Después continuaron preparando la mesa mientras esperaban.",
          "Esta vez, al levantar el paño, encontraron una masa más grande y esponjosa. La abuela se ocupó del horno y de sacar el pan caliente. Durante la merienda, Inés añadió una nota a su receta: antes de cambiar algo, conviene observar qué está pasando. También había aprendido que esperar puede ser una acción importante.",
        ],
        breadQuestions,
      ),
    },
  },
  {
    id: "botella-mar",
    category: "aventuras",
    title: "La botella del mar",
    subtitle: "Cada dibujo guarda una pista.",
    theme: "Aventura y cooperación",
    art: "sea",
    minutes: 4,
    description:
      "Nara y Tico siguen un mensaje dibujado que ha llegado a la playa.",
    versions: {
      paso: version(
        [
          "La tortuga Nara caminaba por la playa con Tico, el cangrejo. Vieron una botella que había dejado la marea. Dentro había un papel enrollado. Una persona adulta de la caseta les ayudó a abrirla con cuidado.",
          "El papel no tenía palabras. Había un pez dibujado junto a unas piedras y un arco de roca. Tico miró alrededor. Cerca de ellos había muchas pozas, pero ninguna coincidía todavía con todos los dibujos.",
          "Nara vio un arco de roca más adelante. Fueron hasta allí y encontraron una poza con piedras alargadas como peces. Compararon el lugar con el papel. Por fin habían encontrado todos los detalles del dibujo juntos.",
          "Junto a la poza había una concha brillante y otra nota dibujada: una sonrisa. Nara y Tico observaron el pequeño tesoro y lo dejaron allí para otras personas. Después llevaron la botella vacía a la caseta para reciclarla.",
        ],
        seaQuestions,
      ),
      reto: version(
        [
          "La marea había dejado una botella en la arena cuando Nara y Tico salieron a explorar. La tortuga distinguió un papel enrollado en su interior. En vez de golpear el vidrio, pidieron ayuda a una persona adulta de la caseta de la playa. Una vez abierta la botella, desplegaron el papel sobre una piedra seca.",
          "El mensaje estaba formado por dibujos: un pez, varias piedras y un arco de roca. Tico señaló una poza cercana, pero Nara notó que le faltaba un detalle. Había piedras, aunque ninguna se parecía al pez del papel y no se veía un arco. Decidieron seguir buscando un lugar que reuniera todas las pistas.",
          "Más adelante descubrieron un arco natural en la roca. Al acercarse vieron una poza rodeada de piedras alargadas. Algunas tenían forma de pez. Compararon de nuevo el paisaje con los dibujos del mensaje. Esta vez coincidían tanto la forma de las piedras como el arco que se levantaba detrás de ellas.",
          "En un rincón de la poza brillaba una concha junto a un dibujo de una sonrisa. Los amigos disfrutaron del hallazgo sin llevarse la concha: podía ser una sorpresa para otra persona. Antes de regresar recogieron la botella vacía para reciclarla en la caseta. Habían entendido el mensaje comparando pistas y cuidando el lugar que exploraban.",
        ],
        seaQuestions,
      ),
    },
  },
];
