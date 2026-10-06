import type { Heading } from "@/design-system/demo/project-story";

type NodeCopy = { name: string; sub: string; analogy: string };

export interface AsedioStory {
  name: string;
  oneLiner: string;
  chips: string[];
  analogy: { heading: Heading; paragraphs: string[]; dictionaryLabel: string; dictionary: { term: string; means: string }[] };
  why: { title: string; text: string };
  tryIt: { heading: Heading; lead: string; question: (covered: number) => string; yes: string; no: string; coverageLabel: string; coveredList: string; noneCovered: string; families: Record<string, string>; note: string; simulate: string; cancel: string; reset: string; error: string; idle: string };
  compare: { heading: Heading; lead: string; mine: (covered: number) => string; full: string; through: string; sentence: (mine: number, full: number) => string };
  fit: { heading: Heading; worthLabel: string; worth: string; notLabel: string; not: string };
  proves: { heading: Heading; text: string };
  engineers: { summary: string; points: string[]; repoLabel: string };
  scene: { title: string; caption: string; statusLabels: { active: string; success: string; danger: string; off: string }; tapeLabel: string; nodes: { attacks: NodeCopy; defenses: NodeCopy; assistant: NodeCopy }; tape: { served: string; rerouted: string; lost: string }; throughOf: (n: number) => string };
}

export const STORY: Record<"en" | "es", AsedioStory> = {
  en: {
    name: "Asedio",
    oneLiner: "Attacks your assistant before launch to find the door that gives way.",
    chips: ["Pre-launch testing", "2 min", "Live demo"],
    analogy: {
      heading: { before: "The", accent: "analogy" },
      paragraphs: [
        "Before you move in, you ask someone to try every door and every window. You aren't hoping everything holds; you want to know which one gives way before someone else finds out.",
        "Asedio throws a fixed set of 12 attacks at an AI assistant before it ships and records which ones got through, which ones it blocked and which ones need a person to look at.",
      ],
      dictionaryLabel: "In the diagram below",
      dictionary: [
        { term: "the house", means: "the assistant before launch" },
        { term: "the doors", means: "the kinds of attack" },
        { term: "the locks", means: "the defenses" },
        { term: "the door that gives way", means: "an attack that got through" },
      ],
    },
    why: { title: "Why I built it", text: "" },
    tryIt: {
      heading: { before: "Try", accent: "it" },
      lead: "A support assistant is about to launch. Its team has built defenses for some kinds of attack and not others yet.",
      question: (k) => `Before you run it, place a bet: with defenses for ${k} of 7 kinds of attack, does any attack get through?`,
      yes: "Yes, at least one",
      no: "No, none",
      coverageLabel: "Kinds of attack with a defense",
      coveredList: "Defended:",
      noneCovered: "No defenses yet.",
      families: {
        prompt_extraction: "revealing its instructions",
        pii_extraction: "leaking personal data",
        indirect_injection: "hidden instructions in documents",
        tool_abuse: "misusing its tools",
        jailbreak: "role-play tricks",
        encoding: "disguised text",
        harmful_content: "harmful requests",
      },
      note: "Each square is one test: ten attacks and two normal questions that look suspicious. Blue ones were flagged for a person to review, and a flag on a normal question is a false alarm.",
      simulate: "Run it",
      cancel: "Cancel",
      reset: "Start over",
      error: "The attacks could not be run.",
      idle: "Place your bet and press Run it.",
    },
    compare: {
      heading: { before: "Your defenses", accent: "or all seven" },
      lead: "Same 12 tests. The only change is how many kinds of attack have a defense.",
      mine: (k) => `Your defenses (${k} of 7)`,
      full: "All 7 defended",
      through: "attacks that got through",
      sentence: (mine, full) => {
        if (mine === 0 && full === 0) return "No attack got through, with your defenses or with all seven.";
        if (mine === full) return `Both settings let ${mine === 1 ? "one attack" : `${mine} attacks`} through.`;
        if (mine < full) return `This time full coverage did worse: ${full} against your ${mine}.`;
        return `With your defenses, ${mine === 1 ? "one attack" : `${mine} attacks`} got through. With all seven, ${full === 0 ? "none" : full}.`;
      },
    },
    fit: {
      heading: { before: "Where it", accent: "fits" },
      worthLabel: "Worth it",
      worth: "Before releasing an assistant that sees customer data or can take actions. I picture the week before a bank's chat assistant goes live, when somebody has to sign off on it.",
      notLabel: "Not needed",
      not: "For an internal prototype with no real data and nothing it can do.",
    },
    proves: {
      heading: { before: "What it", accent: "proves" },
      text: "I treated the launch as a decision with evidence: a list of attacks that got through or didn't, and not a feeling that it looks safe.",
    },
    engineers: {
      summary: "For engineers",
      points: [
        "Five detectors check every response: prompt leaks, personal data, tool-call markers, outbound URLs and harmful content with hard and gray keyword lists.",
        "Each finding gets a severity from exploitability and impact and a stable signature, so a fixed attack that comes back counts as a regression.",
        "The same 12 tests and the outcome for every level of coverage are pinned by a fixture that the TypeScript and Python suites both read.",
        "Stack: Next.js 16, TypeScript, Python, Vitest, pytest.",
      ],
      repoLabel: "Source code",
    },
    scene: {
      title: "Which doors held",
      caption: "Watch the attacks arrive three at a time, and see which ones the defenses stop.",
      statusLabels: { active: "partial defenses", success: "fully defended", danger: "an attack got through", off: "no defenses" },
      tapeLabel: "Twelve tests, in the order they ran",
      nodes: {
        attacks: { name: "Attacks", sub: "12 attempts", analogy: "trying the doors" },
        defenses: { name: "Defenses", sub: "kinds covered", analogy: "the locks" },
        assistant: { name: "Assistant", sub: "before launch", analogy: "the house" },
      },
      tape: { served: "blocked", rerouted: "flagged for review", lost: "got through" },
      throughOf: (n) => (n === 0 ? "No attack got through" : n === 1 ? "1 attack got through" : `${n} attacks got through`),
    },
  },
  es: {
    name: "Asedio",
    oneLiner: "Ataca tu asistente antes de lanzarlo para encontrar la puerta que cede.",
    chips: ["Pruebas antes del lanzamiento", "2 min", "Demo en vivo"],
    analogy: {
      heading: { before: "La", accent: "analogía" },
      paragraphs: [
        "Antes de mudarte, le pides a alguien que intente abrir cada puerta y cada ventana. No buscas que todo resista; buscas saber cuál cede antes de que lo descubra otro.",
        "Asedio le lanza un conjunto fijo de 12 ataques a un asistente de IA antes de que salga, y registra cuáles pasaron, cuáles bloqueó y cuáles necesitan que una persona los revise.",
      ],
      dictionaryLabel: "En el diagrama de abajo",
      dictionary: [
        { term: "la casa", means: "el asistente antes del lanzamiento" },
        { term: "las puertas", means: "los tipos de ataque" },
        { term: "las cerraduras", means: "las defensas" },
        { term: "la puerta que cede", means: "un ataque que pasó" },
      ],
    },
    why: { title: "Por qué lo hice", text: "" },
    tryIt: {
      heading: { accent: "Pruébalo" },
      lead: "Un asistente de soporte está por lanzarse. Su equipo ya tiene defensas para algunos tipos de ataque y para otros todavía no.",
      question: (k) => `Antes de correrlo, apuesta: con defensas para ${k} de 7 tipos de ataque, ¿pasa algún ataque?`,
      yes: "Sí, pasa alguno",
      no: "No, ninguno",
      coverageLabel: "Tipos de ataque con defensa",
      coveredList: "Con defensa:",
      noneCovered: "Todavía sin defensas.",
      families: {
        prompt_extraction: "revelar sus instrucciones",
        pii_extraction: "filtrar datos personales",
        indirect_injection: "instrucciones escondidas en documentos",
        tool_abuse: "usar mal sus herramientas",
        jailbreak: "trucos de juego de rol",
        encoding: "texto disfrazado",
        harmful_content: "peticiones dañinas",
      },
      note: "Cada cuadrito es una prueba: diez ataques y dos preguntas normales que parecen sospechosas. Los azules quedaron marcados para que una persona los revise, y una marca sobre una pregunta normal es una falsa alarma.",
      simulate: "Correr",
      cancel: "Cancelar",
      reset: "Empezar de nuevo",
      error: "No se pudieron correr los ataques.",
      idle: "Haz tu apuesta y presiona Correr.",
    },
    compare: {
      heading: { before: "Tus defensas", accent: "o las siete" },
      lead: "Las mismas 12 pruebas. Solo cambia cuántos tipos de ataque tienen defensa.",
      mine: (k) => `Tus defensas (${k} de 7)`,
      full: "Las 7 con defensa",
      through: "ataques que pasaron",
      sentence: (mine, full) => {
        if (mine === 0 && full === 0) return "No pasó ningún ataque, ni con tus defensas ni con las siete.";
        if (mine === full) return `Los dos ajustes dejaron pasar ${mine === 1 ? "un ataque" : `${mine} ataques`}.`;
        if (mine < full) return `Esta vez la cobertura completa rindió menos: ${full} contra tus ${mine}.`;
        return `Con tus defensas ${mine === 1 ? "pasó un ataque" : `pasaron ${mine} ataques`}. Con las siete, ${full === 0 ? "ninguno" : full}.`;
      },
    },
    fit: {
      heading: { before: "¿Dónde", accent: "sirve?" },
      worthLabel: "Vale la pena",
      worth: "Antes de lanzar un asistente que ve datos de clientes o que puede hacer cosas. Me imagino la semana antes de que salga el asistente de chat de un banco, cuando alguien tiene que firmar que está listo.",
      notLabel: "No hace falta",
      not: "Para un prototipo interno sin datos reales y sin nada que pueda hacer.",
    },
    proves: {
      heading: { before: "Lo que", accent: "demuestra" },
      text: "Traté el lanzamiento como una decisión con evidencia: una lista de ataques que pasaron o no, y no una impresión de que se ve seguro.",
    },
    engineers: {
      summary: "Para ingenieros",
      points: [
        "Cinco detectores revisan cada respuesta: fugas del prompt, datos personales, marcas de llamadas a herramientas, URLs salientes y contenido dañino con listas de palabras duras y grises.",
        "Cada hallazgo recibe una severidad según explotabilidad e impacto y una firma estable, así que un ataque corregido que vuelve cuenta como regresión.",
        "Las mismas 12 pruebas y el resultado de cada nivel de cobertura están fijados en un fixture que leen las suites de TypeScript y Python.",
        "Stack: Next.js 16, TypeScript, Python, Vitest, pytest.",
      ],
      repoLabel: "Código fuente",
    },
    scene: {
      title: "Qué puertas aguantaron",
      caption: "Mira cómo llegan los ataques de tres en tres, y cuáles detienen las defensas.",
      statusLabels: { active: "defensas parciales", success: "todo defendido", danger: "pasó un ataque", off: "sin defensas" },
      tapeLabel: "Doce pruebas, en el orden en que corrieron",
      nodes: {
        attacks: { name: "Ataques", sub: "12 intentos", analogy: "probar las puertas" },
        defenses: { name: "Defensas", sub: "tipos cubiertos", analogy: "las cerraduras" },
        assistant: { name: "Asistente", sub: "antes de lanzarse", analogy: "la casa" },
      },
      tape: { served: "bloqueado", rerouted: "marcado para revisión", lost: "pasó" },
      throughOf: (n) => (n === 0 ? "No pasó ningún ataque" : n === 1 ? "Pasó 1 ataque" : `Pasaron ${n} ataques`),
    },
  },
};
