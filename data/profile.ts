// Single source of truth for the site AND the assistant.
// Everything here is shown on the page and indexed by the RAG assistant
// (see server/utils/knowledge.ts), so keep it factual.
//
// Text that changes with the language is written as { en: "...", fr: "..." }.
// Interface strings (buttons, section titles) live in i18n/locales/*.json.
//
// TODO(Romain): replace every entry marked TODO with your real data.

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
type L<T> = Record<Locale, T>;

export type TokenColor = 1 | 2 | 3 | 4 | 5 | 6;

export interface Token {
  text: string;
  id: number;
  color: TokenColor;
  /** Hero attention arcs: [target token index, weight]. */
  attends?: [number, number][];
  /** Headline line this token sits on (0, 1, 2…). */
  line?: number;
}

export interface ProfileLink {
  key: string;
  label: string;
  description: string;
  url: string;
  badge: string;
  color: TokenColor;
  /** Share in the "where to reach me" softmax. All weights + emailWeight should sum to 1. */
  weight: number;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  /** Longer write-up used by the assistant (not shown on the card). */
  details: string;
  tags: { label: string; color: TokenColor }[];
  categories: ("rag" | "agent" | "vision" | "ml")[];
  result?: { value: string; label: string };
  url?: string;
}

export interface Service {
  title: string;
  summary: string;
  deliverables: string[];
  duration: string;
  color: TokenColor;
}

// ---------------------------------------------------------------------------

const name = "Romain Giraud";

const headlines: L<{ tokens: Token[]; focus: number }> = {
  en: {
    focus: 5,
    tokens: [
      { text: "Rom", id: 22041, color: 1, line: 0, attends: [[1, 0.5], [2, 0.2], [3, 0.2], [4, 0.1]] },
      { text: "ain", id: 467, color: 2, line: 0, attends: [[0, 0.6], [3, 0.25], [2, 0.15]] },
      { text: " Gir", id: 15426, color: 3, line: 0, attends: [[3, 0.55], [0, 0.25], [1, 0.2]] },
      { text: "aud", id: 6567, color: 4, line: 0, attends: [[2, 0.5], [1, 0.3], [0, 0.2]] },
      { text: " builds", id: 22890, color: 5, line: 1, attends: [[0, 0.35], [5, 0.35], [3, 0.2], [7, 0.1]] },
      { text: " AI", id: 15592, color: 6, line: 1, attends: [[4, 0.45], [7, 0.35], [0, 0.1], [6, 0.1]] },
      { text: " That", id: 430, color: 1, line: 2, attends: [[5, 0.5], [4, 0.3], [7, 0.2]] },
      { text: " works", id: 4375, color: 2, line: 2, attends: [[5, 0.45], [4, 0.35], [6, 0.2]] },
      { text: ".", id: 13, color: 3, line: 2, attends: [[7, 0.4], [4, 0.3], [5, 0.2], [0, 0.1]] },
    ],
  },
  fr: {
    focus: 6,
    tokens: [
      { text: "Rom", id: 22041, color: 1, line: 0, attends: [[1, 0.5], [2, 0.2], [3, 0.2], [4, 0.1]] },
      { text: "ain", id: 467, color: 2, line: 0, attends: [[0, 0.6], [3, 0.25], [2, 0.15]] },
      { text: " Gir", id: 15426, color: 3, line: 0, attends: [[3, 0.55], [0, 0.25], [1, 0.2]] },
      { text: "aud", id: 6567, color: 4, line: 0, attends: [[2, 0.5], [1, 0.3], [0, 0.2]] },
      { text: " crée", id: 87312, color: 5, line: 1, attends: [[0, 0.35], [6, 0.35], [3, 0.2], [8, 0.1]] },
      { text: " des", id: 951, color: 6, line: 1, attends: [[6, 0.6], [4, 0.3], [7, 0.1]] },
      { text: " IA", id: 41293, color: 1, line: 1, attends: [[4, 0.4], [5, 0.25], [8, 0.25], [0, 0.1]] },
      { text: " qui", id: 7930, color: 2, line: 2, attends: [[6, 0.5], [8, 0.3], [4, 0.2]] },
      { text: " fonction", id: 34515, color: 3, line: 2, attends: [[9, 0.4], [6, 0.35], [7, 0.25]] },
      { text: "nent", id: 23210, color: 4, line: 2, attends: [[8, 0.6], [6, 0.25], [7, 0.15]] },
      { text: ".", id: 13, color: 5, line: 2, attends: [[8, 0.4], [4, 0.3], [6, 0.2], [0, 0.1]] },
    ],
  },
};

const links: (Omit<ProfileLink, "description"> & { description: L<string> })[] = [
  // TODO(Romain): paste your real Malt, Codeur.com and Fiverr profile URLs.
  { key: "malt", label: "Malt", url: "https://www.malt.fr/", badge: "Ma", color: 3, weight: 0.31,
    description: { en: "Book a mission · reviews", fr: "Réserver une mission · avis" } },
  { key: "codeur", label: "Codeur.com", url: "https://www.codeur.com/", badge: "Co", color: 4, weight: 0.22,
    description: { en: "Send me a project brief", fr: "M'envoyer un brief de projet" } },
  { key: "fiverr", label: "Fiverr", url: "https://www.fiverr.com/", badge: "Fi", color: 5, weight: 0.16,
    description: { en: "Fixed-price AI gigs", fr: "Prestations IA à prix fixe" } },
  { key: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/romain-paul-giraud/", badge: "Li", color: 2, weight: 0.14,
    description: { en: "Experience and recommendations", fr: "Parcours et recommandations" } },
  { key: "github", label: "GitHub", url: "https://github.com/OxiiLB", badge: "Gh", color: 1, weight: 0.09,
    description: { en: "Code and open source", fr: "Code et open source" } },
];

// TODO(Romain): these are EXAMPLE projects. Replace them with your real ones
// before going live, otherwise the assistant will talk about them as real.
const projects: (Omit<Project, "title" | "summary" | "details" | "result"> & {
  title: L<string>;
  summary: L<string>;
  details: L<string>;
  result?: { value: string; label: L<string> };
})[] = [
  {
    slug: "contract-qa",
    title: { en: "Contract Q&A over 4,000 PDFs", fr: "Questions-réponses sur 4 000 contrats PDF" },
    summary: {
      en: "Lawyers ask in plain French and get answers with the exact clause cited.",
      fr: "Les avocats posent leurs questions en français courant et obtiennent une réponse qui cite la clause exacte.",
    },
    details: {
      en: "Retrieval-augmented assistant over a law firm's contract archive. Documents are chunked by clause, embedded and stored in pgvector, with a reranker before generation. Every answer cites the clause it comes from. Evaluated on 200 real questions.",
      fr: "Assistant RAG sur les archives de contrats d'un cabinet d'avocats. Les documents sont découpés par clause, vectorisés et stockés dans pgvector, avec un reranker avant la génération. Chaque réponse cite la clause d'origine. Évalué sur 200 vraies questions.",
    },
    tags: [{ label: "RAG", color: 1 }, { label: "pgvector", color: 4 }, { label: "reranker", color: 2 }],
    categories: ["rag"],
    result: { value: "92%", label: { en: "answer accuracy", fr: "de réponses exactes" } },
  },
  {
    slug: "invoice-agent",
    title: { en: "Invoice extraction agent", fr: "Agent d'extraction de factures" },
    summary: {
      en: "Reads supplier invoices and fills the accounting software, with human review on low confidence.",
      fr: "Lit les factures fournisseurs et remplit le logiciel comptable, avec une validation humaine en cas de doute.",
    },
    details: {
      en: "An LLM agent with vision that reads PDF and photographed invoices, extracts structured fields and pushes them to the accounting tool through its API. Low-confidence extractions go to a human review queue.",
      fr: "Un agent LLM avec vision qui lit les factures en PDF ou en photo, extrait les champs structurés et les envoie au logiciel comptable via son API. Les extractions incertaines partent dans une file de validation humaine.",
    },
    tags: [{ label: "agent", color: 3 }, { label: "vision LLM", color: 5 }],
    categories: ["agent", "vision"],
    result: { value: "11 h", label: { en: "saved per week", fr: "gagnées par semaine" } },
  },
  {
    slug: "eshop-support",
    title: { en: "Support assistant for an e-shop", fr: "Assistant SAV pour une boutique en ligne" },
    summary: {
      en: "Answers order and return questions, hands off to a human when needed.",
      fr: "Répond aux questions sur les commandes et les retours, et passe la main à un humain si besoin.",
    },
    details: {
      en: "Chat widget built in Nuxt. The model uses tools to look up orders and the returns policy, and escalates to a human agent when it cannot help.",
      fr: "Widget de chat développé avec Nuxt. Le modèle utilise des outils pour consulter les commandes et la politique de retour, et transmet à un conseiller humain quand il ne peut pas aider.",
    },
    tags: [{ label: "chatbot", color: 6 }, { label: "tool calling", color: 2 }, { label: "Nuxt", color: 4 }],
    categories: ["agent", "rag"],
    result: { value: "38%", label: { en: "tickets deflected", fr: "de tickets évités" } },
  },
  {
    slug: "portfolio-rag",
    title: { en: "This portfolio's assistant", fr: "L'assistant de ce portfolio" },
    summary: {
      en: "A small RAG over my own profile. Ask it anything about my work.",
      fr: "Un petit RAG sur mon propre profil. Posez-lui vos questions sur mon travail.",
    },
    details: {
      en: "The assistant on this website. It splits Romain's profile, projects and services into passages, retrieves the most relevant ones with BM25 keyword search, and asks Claude to answer using only those passages. Sources are shown under each answer.",
      fr: "L'assistant de ce site. Il découpe le profil, les projets et les services de Romain en passages, retrouve les plus pertinents par recherche de mots-clés BM25, et demande à Claude de répondre uniquement à partir de ces passages. Les sources sont affichées sous chaque réponse.",
    },
    tags: [{ label: "RAG", color: 2 }, { label: "Claude", color: 6 }, { label: "Nuxt", color: 1 }],
    categories: ["rag"],
    url: "https://github.com/OxiiLB",
  },
];

// TODO(Romain): adjust offers and durations to what you actually sell.
const services: (Omit<Service, "title" | "summary" | "deliverables" | "duration"> & {
  title: L<string>;
  summary: L<string>;
  deliverables: L<string[]>;
  duration: L<string>;
})[] = [
  {
    title: { en: "RAG assistant", fr: "Assistant RAG" },
    summary: {
      en: "A chatbot that answers from your documents and cites them.",
      fr: "Un chatbot qui répond à partir de vos documents et les cite.",
    },
    deliverables: {
      en: ["Document ingestion and search", "Chat widget or internal tool", "Accuracy test set"],
      fr: ["Ingestion et recherche de documents", "Widget de chat ou outil interne", "Jeu de tests de précision"],
    },
    duration: { en: "usually 2–4 weeks", fr: "en général 2 à 4 semaines" },
    color: 1,
  },
  {
    title: { en: "AI agent & automation", fr: "Agent IA et automatisation" },
    summary: {
      en: "An LLM that does a repetitive task end to end.",
      fr: "Un LLM qui réalise une tâche répétitive de bout en bout.",
    },
    deliverables: {
      en: ["Email, invoice or form processing", "Connected to your tools", "Human review where it matters"],
      fr: ["Traitement d'e-mails, de factures ou de formulaires", "Connecté à vos outils", "Validation humaine là où c'est important"],
    },
    duration: { en: "usually 3–6 weeks", fr: "en général 3 à 6 semaines" },
    color: 3,
  },
  {
    title: { en: "AI in your app", fr: "L'IA dans votre application" },
    summary: {
      en: "AI features added to a web app you already run.",
      fr: "Des fonctionnalités IA ajoutées à une application web existante.",
    },
    deliverables: {
      en: ["Search, summaries, classification", "Vue / Nuxt front end", "Cost and latency kept in check"],
      fr: ["Recherche, résumés, classification", "Front-end Vue / Nuxt", "Coûts et latence maîtrisés"],
    },
    duration: { en: "usually 1–3 weeks", fr: "en général 1 à 3 semaines" },
    color: 4,
  },
];

const text: L<{
  role: string;
  location: string;
  languages: string[];
  availability: string | null;
  photoAlt: string;
  lede: string;
  suggestedQuestions: string[];
}> = {
  en: {
    role: "Freelance AI engineer",
    location: "France",
    languages: ["French", "English"],
    // TODO(Romain): update or set to null to hide the badge.
    availability: "Available for missions",
    photoAlt: "Portrait of Romain Giraud",
    lede: "Freelance AI engineer. I build RAG assistants on your documents, LLM agents that take repetitive work off your team, and AI features inside the apps you already have.",
    suggestedQuestions: [
      "What kind of AI projects do you take?",
      "Are you available for a mission?",
      "Have you built a RAG system before?",
      "How does this assistant work?",
    ],
  },
  fr: {
    role: "Ingénieur IA freelance",
    location: "France",
    languages: ["français", "anglais"],
    availability: "Disponible pour des missions",
    photoAlt: "Portrait de Romain Giraud",
    lede: "Ingénieur IA freelance. Je crée des assistants RAG sur vos documents, des agents LLM qui libèrent votre équipe des tâches répétitives, et des fonctionnalités IA dans les applications que vous utilisez déjà.",
    suggestedQuestions: [
      "Quels types de projets IA acceptez-vous ?",
      "Êtes-vous disponible pour une mission ?",
      "Avez-vous déjà créé un système RAG ?",
      "Comment fonctionne cet assistant ?",
    ],
  },
};

/** The whole profile, resolved for one language. */
export function getProfile(locale: Locale) {
  const t = text[locale] ?? text.en;
  const h = headlines[locale] ?? headlines.en;
  return {
    name,
    ...t,
    email: "romaingiraud86130@gmail.com",
    emailWeight: 0.08,
    photo: { src: "/romain-giraud.jpg", alt: t.photoAlt, width: 579, height: 600 },
    headline: h.tokens,
    /** Token the attention arcs start from before the visitor hovers anything. */
    headlineFocus: h.focus,
    /** Labelled clusters drawn in the background "embedding map". */
    latentClusters: ["RAG", "agents", "LLMs", "vision", "Nuxt", "C++"],
    links: links.map((l): ProfileLink => ({ ...l, description: l.description[locale] })),
    projects: projects.map(
      (p): Project => ({
        ...p,
        title: p.title[locale],
        summary: p.summary[locale],
        details: p.details[locale],
        result: p.result && { value: p.result.value, label: p.result.label[locale] },
      }),
    ),
    services: services.map(
      (s): Service => ({
        ...s,
        title: s.title[locale],
        summary: s.summary[locale],
        deliverables: s.deliverables[locale],
        duration: s.duration[locale],
      }),
    ),
  };
}

export type Profile = ReturnType<typeof getProfile>;

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}
