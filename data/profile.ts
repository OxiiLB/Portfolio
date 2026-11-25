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
}

export type ProjectCategory = "rag" | "automation" | "vision" | "web" | "games";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  /** Longer write-up used by the assistant (not shown on the card). */
  details: string;
  /** Where or when it was built, e.g. "Freelance, 2026". */
  context: string;
  tags: { label: string; color: TokenColor }[];
  categories: ProjectCategory[];
  /** Preview shown on the card (screenshot, demo still). Not read by the assistant. */
  image: string;
  result?: { value: string; label: string };
  url?: string;
}

export type SideKind = "project" | "association" | "media" | "student";

export interface SideProject {
  slug: string;
  kind: SideKind;
  title: string;
  /** When or where, e.g. "High school" or "EPITECH". */
  context: string;
  summary: string;
  link?: { url: string; label: string };
  color: TokenColor;
}

export interface Service {
  title: string;
  summary: string;
  deliverables: string[];
  color: TokenColor;
}

/** One package of the document-assistant offer (same packages as the Fiverr gig). */
export interface PricingTier {
  /** "Basic", "Standard" or "Premium". */
  tier: string;
  name: string;
  /** Price in US dollars. */
  price: number;
  summary: string;
  deliveryDays: number;
  revisions: number;
  /** Every feature of the offer, with whether this package includes it. */
  features: { label: string; included: boolean }[];
  /** The package highlighted on the page. */
  recommended: boolean;
}

/** One service with its three fixed packages. */
export interface PricingOffer {
  key: string;
  title: string;
  summary: string;
  tiers: PricingTier[];
  /** Whether the "more documents" extra applies (document assistants only). */
  docsExtra: boolean;
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
  { key: "malt", label: "Malt", url: "https://www.malt.com/profile/romaingiraud3", badge: "Ma", color: 3,
    description: { en: "Book a mission and read reviews", fr: "Réserver une mission, lire les avis" } },
  { key: "codeur", label: "Codeur.com", url: "https://www.codeur.com/-romaingiraud", badge: "Co", color: 4,
    description: { en: "Send me a project brief", fr: "M'envoyer un brief de projet" } },
  { key: "fiverr", label: "Fiverr", url: "https://www.fiverr.com/s/9dGvX2A", badge: "Fi", color: 5,
    description: { en: "Fixed-price AI gigs", fr: "Prestations IA à prix fixe" } },
  { key: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/romain-paul-giraud/", badge: "Li", color: 2,
    description: { en: "Experience and recommendations", fr: "Parcours et recommandations" } },
  { key: "github", label: "GitHub", url: "https://github.com/OxiiLB", badge: "Gh", color: 1,
    description: { en: "Code and open source", fr: "Code et open source" } },
];

// Projects and services are written from Romain's CV (Outreach EN, Nov. 2026).
// Client names stay private; only results stated in the CV are shown.
// Projects = school work and AI development. Personal projects and
// associations live in sideProjects below.
// TODO(Romain): add links (GitHub, demo) where you have them.
// TODO(Romain): replace the placeholder images with real screenshots or demo
// stills (put them in public/projects/ and use "/projects/<slug>.webp").
/** Grey placeholder photo from Lorem Picsum, stable per project. */
const placeholder = (slug: string) => `https://picsum.photos/seed/${slug}/1200/750?grayscale`;

const projects: (Omit<Project, "title" | "summary" | "details" | "context" | "result"> & {
  title: L<string>;
  summary: L<string>;
  details: L<string>;
  context: L<string>;
  result?: { value: string; label: L<string> };
})[] = [
  {
    slug: "rag-assistant",
    image: placeholder("rag-assistant"),
    context: { en: "Open source, 2026", fr: "Open source, 2026" },
    title: { en: "Multi-document RAG assistant with citations", fr: "Assistant RAG multi-documents avec citations" },
    summary: {
      en: "Ask questions about your PDFs: the answer streams in and cites the exact document and page, with clickable sources.",
      fr: "Posez vos questions sur vos PDF : la réponse s'affiche en direct et cite le document et la page exacts, avec des sources cliquables.",
    },
    details: {
      en: "An open-source multi-document RAG assistant. PDFs are ingested in the background with page-by-page extraction and overlapping chunks. Search is hybrid: multilingual embeddings computed locally (multilingual-e5-small) fused with a BM25 index through Reciprocal Rank Fusion. Claude Sonnet 5 answers only from the retrieved passages, streams token by token and cites its sources; each citation opens the exact passage and page. Built with Angular, Tailwind CSS, Node.js and Fastify, with Qdrant as an optional vector store.",
      fr: "Un assistant RAG multi-documents open source. Les PDF sont indexés en arrière-plan, page par page, avec un découpage qui se chevauche. La recherche est hybride : des embeddings multilingues calculés en local (multilingual-e5-small) fusionnés avec un index BM25 par Reciprocal Rank Fusion. Claude Sonnet 5 répond uniquement à partir des passages trouvés, en streaming, et cite ses sources ; chaque citation ouvre le passage et la page exacts. Construit avec Angular, Tailwind CSS, Node.js et Fastify, avec Qdrant en base vectorielle optionnelle.",
    },
    tags: [{ label: "RAG", color: 1 }, { label: "hybrid search", color: 2 }, { label: "Claude", color: 6 }, { label: "Angular", color: 4 }],
    categories: ["rag", "web"],
    url: "https://github.com/OxiiLB/rag-assistant",
  },
  {
    slug: "ai-visuals",
    image: placeholder("ai-visuals"),
    context: { en: "Freelance, 2026", fr: "Freelance, 2026" },
    title: { en: "AI image generation pipeline", fr: "Chaîne de génération d'images par IA" },
    summary: {
      en: "Produces a finished visual in about 40 seconds, where manual retouching took several hours.",
      fr: "Produit un visuel fini en environ 40 secondes, là où la retouche manuelle prenait plusieurs heures.",
    },
    details: {
      en: "AI image generation and editing for clients, built with Stable Diffusion, ControlNet and LoRA. One visual is produced in about 40 seconds, versus several hours of manual retouching.",
      fr: "Génération et retouche d'images par IA pour des clients, avec Stable Diffusion, ControlNet et LoRA. Un visuel est produit en environ 40 secondes, contre plusieurs heures de retouche manuelle.",
    },
    tags: [{ label: "Stable Diffusion", color: 6 }, { label: "ControlNet", color: 3 }, { label: "LoRA", color: 4 }],
    categories: ["vision"],
    result: { value: "40 s", label: { en: "per visual, instead of hours", fr: "par visuel, au lieu d'heures" } },
  },
  {
    slug: "rag-extraction",
    image: placeholder("rag-extraction"),
    context: { en: "Freelance, 2026", fr: "Freelance, 2026" },
    title: { en: "Document assistants & extraction agents", fr: "Assistants documentaires et agents d'extraction" },
    summary: {
      en: "RAG assistants that answer from a company's own documents, and agents that pull structured data out of them.",
      fr: "Des assistants RAG qui répondent à partir des documents d'une entreprise, et des agents qui en extraient des données structurées.",
    },
    details: {
      en: "Freelance work for small businesses and agencies: RAG document assistants answering from the client's own documents, data extraction and structuring agents, and AI features integrated into existing products.",
      fr: "Missions freelance pour des petites entreprises et des agences : assistants documentaires RAG qui répondent à partir des documents du client, agents d'extraction et de structuration de données, et fonctionnalités IA intégrées à des produits existants.",
    },
    tags: [{ label: "RAG", color: 1 }, { label: "extraction agents", color: 2 }, { label: "AI integration", color: 5 }],
    categories: ["rag", "automation"],
    url: "https://github.com/OxiiLB/Paperly",
  },
  {
    slug: "rhinov",
    image: placeholder("rhinov"),
    context: { en: "Rhinov, AI R&D, 2025", fr: "Rhinov, R&D IA, 2025" },
    title: { en: "AI editing for photorealistic 3D renders", fr: "Édition par IA de rendus 3D photoréalistes" },
    summary: {
      en: "Research tools to improve photorealistic rendering in Unreal Engine, and an interface to edit 3D renders with AI.",
      fr: "Des outils de R&D pour améliorer le rendu photoréaliste sous Unreal Engine, et une interface d'édition de rendus 3D par IA.",
    },
    details: {
      en: "As an AI R&D developer at Rhinov (March to August 2025), Romain researched and developed tools that improve photorealistic rendering in Unreal Engine, and built an interface for editing 3D renders with AI.",
      fr: "En tant que développeur R&D IA chez Rhinov (mars à août 2025), Romain a recherché et développé des outils améliorant le rendu photoréaliste sous Unreal Engine, et créé une interface d'édition de rendus 3D par IA.",
    },
    tags: [{ label: "Unreal Engine", color: 4 }, { label: "image AI", color: 6 }, { label: "R&D", color: 2 }],
    categories: ["vision"],
  },
  {
    slug: "area",
    image: placeholder("area"),
    context: { en: "EPITECH project", fr: "Projet EPITECH" },
    title: { en: "Area, an automation platform", fr: "Area, une plateforme d'automatisation" },
    summary: {
      en: "Web and mobile platform in the style of IFTTT or Zapier: connect your services and trigger actions on events.",
      fr: "Plateforme web et mobile dans le style d'IFTTT ou Zapier : connectez vos services et déclenchez des actions sur des événements.",
    },
    details: {
      en: "Area is a web and mobile automation platform with SSO connection to third-party services and event-triggered actions, in the style of IFTTT or Zapier.",
      fr: "Area est une plateforme d'automatisation web et mobile, avec connexion SSO à des services tiers et actions déclenchées par des événements, dans le style d'IFTTT ou Zapier.",
    },
    tags: [{ label: "automation", color: 2 }, { label: "SSO", color: 1 }, { label: "web + mobile", color: 5 }],
    categories: ["automation", "web"],
    url: "https://github.com/JsuisSayker/Area51",
  },
  {
    slug: "game-engines",
    image: placeholder("game-engines"),
    context: { en: "EPITECH projects", fr: "Projets EPITECH" },
    title: { en: "Pikselite Engine", fr: "Pikselite Engine" },
    summary: {
      en: "Two 2D game engines in C++: one with per-pixel physics, one with an ECS architecture and networked multiplayer.",
      fr: "Deux moteurs de jeu 2D en C++ : l'un avec une physique au pixel près, l'autre avec une architecture ECS et un multijoueur en réseau.",
    },
    details: {
      en: "Pikselite Engine is a game engines: per-pixel physics, with a C++ ECS architecture.",
      fr: "Pikselite Engine est un moteur de jeu 2D : physique au pixel près, avec une architecture ECS en C++.",
    },
    tags: [{ label: "C++", color: 3 }, { label: "ECS", color: 1 }, { label: "networking", color: 4 }],
    categories: ["games"],
    url: "https://github.com/JsuisSayker/Pikselite",
  },
  {
    slug: "portfolio-rag",
    image: placeholder("portfolio-rag"),
    context: { en: "This website", fr: "Ce site" },
    title: { en: "This portfolio's assistant", fr: "L'assistant de ce portfolio" },
    summary: {
      en: "A small RAG over my own profile, built with Nuxt and Claude. Ask it anything about my work.",
      fr: "Un petit RAG sur mon propre profil, construit avec Nuxt et Claude. Posez-lui vos questions sur mon travail.",
    },
    details: {
      en: "The assistant on this website. It splits Romain's profile, projects and services into passages, retrieves the most relevant ones with BM25 keyword search, and asks Claude to answer using only those passages. Sources are shown under each answer, and a monthly budget caps its cost.",
      fr: "L'assistant de ce site. Il découpe le profil, les projets et les services de Romain en passages, retrouve les plus pertinents par recherche de mots-clés BM25, et demande à Claude de répondre uniquement à partir de ces passages. Les sources sont affichées sous chaque réponse, et un budget mensuel plafonne son coût.",
    },
    tags: [{ label: "RAG", color: 2 }, { label: "Claude", color: 6 }, { label: "Nuxt", color: 1 }],
    categories: ["rag", "web"],
    url: "https://github.com/OxiiLB",
  },
];

// Side projects: things outside school and work, and associations.
// TODO(Romain): describe VideoSync, add the dates, your role in each
// association, and the Spotify link for (Hi)story.
const sideProjects: (Omit<SideProject, "title" | "context" | "summary" | "link"> & {
  title: L<string>;
  context: L<string>;
  summary: L<string>;
  link?: { url: string; label: L<string> };
})[] = [
  {
    slug: "videosync",
    kind: "project",
    title: { en: "VideoSync", fr: "VideoSync" },
    context: { en: "On my own time", fr: "Sur mon temps libre" },
    summary: {
      en: "A personal project I build on my own time, outside school and client work.",
      fr: "Un projet personnel que je développe sur mon temps libre, en dehors de l'école et des missions.",
    },
    color: 4,
  },
  {
    slug: "history-podcast",
    kind: "media",
    title: { en: "(Hi)story", fr: "(Hi)story" },
    context: { en: "Podcast & live radio", fr: "Podcast et radio en direct" },
    summary: {
      en: "My podcast on Spotify, also broadcast as a live radio show.",
      fr: "Mon podcast sur Spotify, aussi diffusé en direct comme émission de radio.",
    },
    color: 6,
  },
  {
    slug: "bde",
    kind: "student",
    title: { en: "Student union (BDE)", fr: "Bureau des étudiants (BDE)" },
    context: { en: "EPITECH", fr: "EPITECH" },
    summary: {
      en: "Member of my school's student union, which organizes events and student life.",
      fr: "Membre du bureau des étudiants de mon école, qui organise les événements et la vie étudiante.",
    },
    color: 1,
  },
  {
    slug: "bloque",
    kind: "association",
    title: { en: "Bloqué", fr: "Bloqué" },
    context: { en: "High school association", fr: "Association du lycée" },
    summary: {
      en: "An association where we designed and built escape games.",
      fr: "Une association où nous concevions et construisions des escape games.",
    },
    color: 3,
  },
  {
    slug: "jobs-report",
    kind: "association",
    title: { en: "Jobs Report", fr: "Jobs Report" },
    context: { en: "High school association", fr: "Association du lycée" },
    summary: {
      en: "A student journalism association: finding stories, writing and publishing them.",
      fr: "Une association de journalisme étudiant : trouver des sujets, les écrire et les publier.",
    },
    color: 5,
  },
];

const services: (Omit<Service, "title" | "summary" | "deliverables"> & {
  title: L<string>;
  summary: L<string>;
  deliverables: L<string[]>;
})[] = [
  {
    title: { en: "AI assistants & chatbots", fr: "Assistants IA et chatbots" },
    summary: {
      en: "Customer support, internal FAQ or knowledge base, powered by your own documents (RAG).",
      fr: "Support client, FAQ interne ou base de connaissances, alimentés par vos propres documents (RAG).",
    },
    deliverables: {
      en: ["Answers from your own documents", "For your customers or your team", "Sources shown with each answer"],
      fr: ["Des réponses issues de vos documents", "Pour vos clients ou votre équipe", "Les sources affichées avec chaque réponse"],
    },
    color: 1,
  },
  {
    title: { en: "Automation", fr: "Automatisation" },
    summary: {
      en: "Take repetitive work off your team.",
      fr: "Libérez votre équipe des tâches répétitives.",
    },
    deliverables: {
      en: ["Data extraction and structuring", "Automatic follow-ups", "Workflows connecting your tools and services"],
      fr: ["Extraction et structuration de données", "Relances automatiques", "Workflows reliant vos outils et services"],
    },
    color: 2,
  },
  {
    title: { en: "AI integration", fr: "Intégration IA" },
    summary: {
      en: "AI features added to the website, app or software you already have.",
      fr: "Des fonctionnalités IA ajoutées au site, à l'application ou au logiciel que vous avez déjà.",
    },
    deliverables: {
      en: ["Existing websites and web apps", "Software products", "Built around how your team works"],
      fr: ["Sites et applications web existants", "Logiciels et produits", "Pensé autour de la façon dont votre équipe travaille"],
    },
    color: 4,
  },
  {
    title: { en: "Web development", fr: "Développement web" },
    summary: {
      en: "Custom websites and web apps, or improvements to the code you already run.",
      fr: "Des sites et applications web sur mesure, ou l'amélioration du code que vous avez déjà.",
    },
    deliverables: {
      en: ["Vue.js, Nuxt or Angular", "Migration of existing code", "Performance optimization"],
      fr: ["Vue.js, Nuxt ou Angular", "Migration de code existant", "Optimisation des performances"],
    },
    color: 5,
  },
];

// Fixed packages for every service: Basic / Standard / Premium, Standard is the
// recommended one. Student rates set in Nov. 2026 (see the pricing audit).
// The document assistant packages are the same as Romain's Fiverr RAG gig;
// keep the two in sync. `service` is the index of the matching entry in
// `services` above, which gives each offer its title and summary.
type TierData = {
  tier: "Basic" | "Standard" | "Premium";
  name: L<string>;
  /** US dollars. */
  price: number;
  summary: L<string>;
  deliveryDays: number;
  revisions: number;
  /** Indexes into the offer's `features` that this package includes. */
  includes: number[];
};

const offers: { key: string; service: number; features: L<string>[]; tiers: TierData[]; docsExtra?: boolean }[] = [
  {
    key: "rag",
    service: 0,
    docsExtra: true,
    features: [
      { en: "AI model integration", fr: "Intégration d'un modèle d'IA" },
      { en: "Answers from your documents (RAG)", fr: "Réponses à partir de vos documents (RAG)" },
      { en: "Guided conversation flow", fr: "Parcours de conversation prédéfini" },
      { en: "CRM or database integration", fr: "Intégration CRM ou base de données" },
      { en: "User login", fr: "Connexion des utilisateurs" },
      { en: "Multi-language support", fr: "Support multilingue" },
      { en: "Source code included", fr: "Code source fourni" },
    ],
    tiers: [
      {
        tier: "Basic",
        name: { en: "Document Q&A bot", fr: "Bot questions-réponses" },
        price: 150,
        summary: {
          en: "A chatbot that answers from up to 10 of your documents, with cited sources and a simple web chat.",
          fr: "Un chatbot qui répond à partir de 10 de vos documents maximum, avec les sources citées et un chat web simple.",
        },
        deliveryDays: 5,
        revisions: 1,
        includes: [0, 1],
      },
      {
        tier: "Standard",
        name: { en: "Website chatbot", fr: "Chatbot pour votre site" },
        price: 350,
        summary: {
          en: "A chatbot trained on up to 50 documents or web pages, embedded on your site, in your tone, in several languages.",
          fr: "Un chatbot entraîné sur 50 documents ou pages web maximum, intégré à votre site, avec votre ton, en plusieurs langues.",
        },
        deliveryDays: 7,
        revisions: 2,
        includes: [0, 1, 2, 5],
      },
      {
        tier: "Premium",
        name: { en: "Business assistant", fr: "Assistant métier" },
        price: 700,
        summary: {
          en: "A full assistant on up to 200 documents, connected to your CRM or app, with user login, source code and 30 days of support.",
          fr: "Un assistant complet sur 200 documents maximum, connecté à votre CRM ou application, avec connexion des utilisateurs, code source et 30 jours de support.",
        },
        deliveryDays: 14,
        revisions: 3,
        includes: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    key: "automation",
    service: 1,
    features: [
      { en: "Workflow connecting your tools", fr: "Workflow reliant vos outils" },
      { en: "AI data extraction", fr: "Extraction de données par IA" },
      { en: "Error alerts", fr: "Alertes en cas d'erreur" },
      { en: "Custom API code", fr: "Code sur mesure pour les API" },
      { en: "Activity log", fr: "Journal d'activité" },
      { en: "Documentation", fr: "Documentation" },
      { en: "30-day support", fr: "Support de 30 jours" },
    ],
    tiers: [
      {
        tier: "Basic",
        name: { en: "Single automation", fr: "Automatisation simple" },
        price: 80,
        summary: {
          en: "One workflow connecting 2 of your tools, up to 5 steps.",
          fr: "Un workflow reliant 2 de vos outils, jusqu'à 5 étapes.",
        },
        deliveryDays: 3,
        revisions: 1,
        includes: [0],
      },
      {
        tier: "Standard",
        name: { en: "Business workflow", fr: "Workflow métier" },
        price: 200,
        summary: {
          en: "Up to 3 workflows across your tools, with AI that pulls data out of emails and files, and alerts if something fails.",
          fr: "Jusqu'à 3 workflows entre vos outils, avec une IA qui extrait les données des e-mails et fichiers, et des alertes en cas d'échec.",
        },
        deliveryDays: 5,
        revisions: 2,
        includes: [0, 1, 2],
      },
      {
        tier: "Premium",
        name: { en: "Automation system", fr: "Système d'automatisation" },
        price: 450,
        summary: {
          en: "Up to 6 workflows, custom code for any API, an activity log, documentation and 30 days of support.",
          fr: "Jusqu'à 6 workflows, du code sur mesure pour n'importe quelle API, un journal d'activité, une documentation et 30 jours de support.",
        },
        deliveryDays: 10,
        revisions: 3,
        includes: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    key: "integration",
    service: 2,
    features: [
      { en: "AI feature in your site or app", fr: "Fonctionnalité IA dans votre site ou app" },
      { en: "Prompt design", fr: "Conception des prompts" },
      { en: "Interface component", fr: "Composant d'interface" },
      { en: "Spending limits", fr: "Plafonds de dépenses" },
      { en: "AI agent or multi-step workflow", fr: "Agent IA ou workflow en plusieurs étapes" },
      { en: "User roles and cost monitoring", fr: "Rôles utilisateurs et suivi des coûts" },
      { en: "30-day support", fr: "Support de 30 jours" },
    ],
    tiers: [
      {
        tier: "Basic",
        name: { en: "One AI feature", fr: "Une fonctionnalité IA" },
        price: 120,
        summary: {
          en: "One AI feature (summary, text generation or classification) added to your site or app through an API.",
          fr: "Une fonctionnalité IA (résumé, génération de texte ou classification) ajoutée à votre site ou application via une API.",
        },
        deliveryDays: 5,
        revisions: 1,
        includes: [0],
      },
      {
        tier: "Standard",
        name: { en: "AI feature set", fr: "Ensemble de fonctionnalités IA" },
        price: 300,
        summary: {
          en: "Two or three AI features with tuned prompts, a ready-made interface component and spending limits.",
          fr: "Deux ou trois fonctionnalités IA avec des prompts ajustés, un composant d'interface prêt à l'emploi et des plafonds de dépenses.",
        },
        deliveryDays: 7,
        revisions: 2,
        includes: [0, 1, 2, 3],
      },
      {
        tier: "Premium",
        name: { en: "AI module", fr: "Module IA" },
        price: 600,
        summary: {
          en: "A complete AI module, such as an agent or a multi-step workflow, with user roles, cost monitoring and 30 days of support.",
          fr: "Un module IA complet, comme un agent ou un workflow en plusieurs étapes, avec rôles utilisateurs, suivi des coûts et 30 jours de support.",
        },
        deliveryDays: 14,
        revisions: 3,
        includes: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    key: "web",
    service: 3,
    features: [
      { en: "Responsive design", fr: "Design adapté au mobile" },
      { en: "Contact form", fr: "Formulaire de contact" },
      { en: "SEO basics", fr: "Bases du référencement (SEO)" },
      { en: "Bilingual site", fr: "Site bilingue" },
      { en: "Performance optimization", fr: "Optimisation des performances" },
      { en: "Login and database", fr: "Connexion et base de données" },
      { en: "30-day support", fr: "Support de 30 jours" },
    ],
    tiers: [
      {
        tier: "Basic",
        name: { en: "Landing page", fr: "Page d'accueil" },
        price: 150,
        summary: {
          en: "One responsive page with a contact form and SEO basics.",
          fr: "Une page responsive avec formulaire de contact et bases du référencement.",
        },
        deliveryDays: 5,
        revisions: 1,
        includes: [0, 1, 2],
      },
      {
        tier: "Standard",
        name: { en: "Business website", fr: "Site vitrine" },
        price: 400,
        summary: {
          en: "A website of up to 5 pages, in two languages, fast and easy to find on search engines.",
          fr: "Un site jusqu'à 5 pages, en deux langues, rapide et bien référencé.",
        },
        deliveryDays: 10,
        revisions: 2,
        includes: [0, 1, 2, 3, 4],
      },
      {
        tier: "Premium",
        name: { en: "Simple web app", fr: "Application web simple" },
        price: 800,
        summary: {
          en: "A web app of up to 3 screens with login and a database, or a migration of existing code to Vue.js or Nuxt, with 30 days of support.",
          fr: "Une application web jusqu'à 3 écrans avec connexion et base de données, ou une migration de code existant vers Vue.js ou Nuxt, avec 30 jours de support.",
        },
        deliveryDays: 21,
        revisions: 3,
        includes: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
  },
];

/** Paid extras in US dollars, the same for every offer (documents: RAG only). */
const extras = { expressPercent: 30, revision: 25, maintenancePerMonth: 49, docs: { count: 50, price: 50 } };

// ---------------------------------------------------------------------------
// About, values and process: the "who I am and how I work" part of the page.
// About and skills are written from Romain's CV (Outreach EN, Nov. 2026).
// TODO(Romain): values and process are still drafts; rewrite them in your own words.

const about: L<{ paragraphs: string[]; facts: { label: string; value: string }[] }> = {
  en: {
    paragraphs: [
      "I'm Romain, a freelance developer who helps small businesses, agencies and solo entrepreneurs save time with AI: assistants that answer from your own documents, automations for repetitive tasks, AI features added to the tools you already use, and custom websites.",
      "I'm completing a Master's-level degree in IT at EPITECH Bordeaux (class of 2027), and I spent a year at Keimyung University in South Korea, in an English-taught program focused on game development. I learned by building: 2D game engines in C++ with per-pixel physics and networked multiplayer, and Area, a web and mobile automation platform in the spirit of IFTTT and Zapier.",
      "In companies, I was a full-stack developer at BestConsultant, where I migrated the product to Vue.js and optimized the backend. I then joined Rhinov as an AI R&D developer, building tools to improve photorealistic rendering in Unreal Engine and an interface to edit 3D renders with AI.",
      "Since September 2026 I've been freelancing, with France's national student-entrepreneur status granted by the PÉPITE PSL committee. I design RAG document assistants, data extraction agents and AI image pipelines: one of them produces a finished visual in 40 seconds instead of several hours of manual retouching. I work fully remotely and adapt to European, American and Asian time zones.",
      "Outside of code, I love video games and how they are designed, cooking and trying new cuisines, and animals.",
    ],
    facts: [
      { label: "Based in", value: "France, fully remote" },
      { label: "Time zones", value: "Europe, Americas, Asia" },
      { label: "Languages", value: "French (native), English (professional), Korean (basic), Spanish (A2)" },
      { label: "Education", value: "EPITECH Bordeaux (Master's level, 2027) and Keimyung University (South Korea)" },
      { label: "Experience", value: "Rhinov (AI R&D) and BestConsultant (full-stack)" },
      { label: "Status", value: "Student-entrepreneur (PÉPITE PSL)" },
    ],
  },
  fr: {
    paragraphs: [
      "Je suis Romain, développeur freelance. J'aide les petites entreprises, les agences et les entrepreneurs indépendants à gagner du temps grâce à l'IA : des assistants qui répondent à partir de vos propres documents, l'automatisation des tâches répétitives, des fonctionnalités IA ajoutées à vos outils existants, et des sites web sur mesure.",
      "Je termine un diplôme de niveau Master en informatique à EPITECH Bordeaux (promotion 2027), et j'ai passé un an à l'université Keimyung en Corée du Sud, dans un programme enseigné en anglais et spécialisé en développement de jeux vidéo. J'ai appris en construisant : des moteurs de jeu 2D en C++ avec physique au pixel près et multijoueur en réseau, et Area, une plateforme d'automatisation web et mobile dans l'esprit d'IFTTT et Zapier.",
      "En entreprise, j'ai été développeur full-stack chez BestConsultant, où j'ai migré le produit vers Vue.js et optimisé le backend. J'ai ensuite rejoint Rhinov comme développeur R&D IA, pour créer des outils améliorant le rendu photoréaliste sous Unreal Engine et une interface d'édition de rendus 3D par IA.",
      "Depuis septembre 2026, je suis freelance, avec le statut national d'étudiant-entrepreneur accordé par le comité PÉPITE PSL. Je conçois des assistants documentaires RAG, des agents d'extraction de données et des chaînes de génération d'images par IA : l'une d'elles produit un visuel fini en 40 secondes, au lieu de plusieurs heures de retouche manuelle. Je travaille entièrement à distance et je m'adapte aux fuseaux horaires européens, américains et asiatiques.",
      "En dehors du code, j'adore les jeux vidéo et leur game design, la cuisine et la découverte de nouvelles cuisines, et les animaux.",
    ],
    facts: [
      { label: "Basé en", value: "France, 100 % à distance" },
      { label: "Fuseaux", value: "Europe, Amériques, Asie" },
      { label: "Langues", value: "français (natif), anglais (professionnel), coréen (notions), espagnol (A2)" },
      { label: "Formation", value: "EPITECH Bordeaux (niveau Master, 2027) et Université Keimyung (Corée du Sud)" },
      { label: "Expérience", value: "Rhinov (R&D IA) et BestConsultant (full-stack)" },
      { label: "Statut", value: "Étudiant-entrepreneur (PÉPITE PSL)" },
    ],
  },
};

const skills: { label: string; color: TokenColor }[] = [
  { label: "RAG", color: 1 },
  { label: "Data extraction agents", color: 2 },
  { label: "Stable Diffusion", color: 6 },
  { label: "ControlNet", color: 3 },
  { label: "LoRA", color: 4 },
  { label: "Python", color: 5 },
  { label: "JavaScript", color: 5 },
  { label: "Vue.js", color: 2 },
  { label: "Nuxt", color: 2 },
  { label: "Angular", color: 6 },
  { label: "Tailwind CSS", color: 4 },
  { label: "Express / Fastify", color: 1 },
  { label: "C / C++", color: 3 },
  { label: "Docker", color: 4 },
  { label: "Unreal Engine", color: 1 },
];

export interface Value {
  keyword: string;
  title: string;
  text: string;
  color: TokenColor;
}

const values: { keyword: L<string>; title: L<string>; text: L<string>; color: TokenColor }[] = [
  {
    keyword: { en: "useful", fr: "utile" },
    title: { en: "Useful before impressive", fr: "Utile avant d'être impressionnant" },
    text: {
      en: "I add AI where it saves real time or money. If a simple script or an existing tool does the job better, I'll tell you, even if it means a smaller project.",
      fr: "J'ajoute de l'IA là où elle fait gagner du temps ou de l'argent. Si un simple script ou un outil existant fait mieux l'affaire, je vous le dis, même si le projet devient plus petit.",
    },
    color: 1,
  },
  {
    keyword: { en: "demo", fr: "démo" },
    title: { en: "Show, don't promise", fr: "Montrer plutôt que promettre" },
    text: {
      en: "You get a working version on your own data early, so you judge the results yourself before investing further. No long slide decks.",
      fr: "Vous avez rapidement une version qui fonctionne sur vos propres données, pour juger les résultats vous-même avant d'aller plus loin. Pas de longues présentations.",
    },
    color: 2,
  },
  {
    keyword: { en: "privacy", fr: "confidentialité" },
    title: { en: "Your data stays yours", fr: "Vos données restent les vôtres" },
    text: {
      en: "I only access what the project needs, I'm clear about where your data goes and which services see it, and I pick providers that don't train on it.",
      fr: "J'accède uniquement à ce dont le projet a besoin, je vous dis clairement où vont vos données et quels services les voient, et je choisis des fournisseurs qui ne s'entraînent pas dessus.",
    },
    color: 3,
  },
  {
    keyword: { en: "ownership", fr: "propriété" },
    title: { en: "You own what you pay for", fr: "Vous possédez ce que vous payez" },
    text: {
      en: "Code, prompts and documentation are handed over at the end, written so another developer can pick them up. You're never locked in with me.",
      fr: "Code, prompts et documentation vous sont remis à la fin, écrits pour qu'un autre développeur puisse les reprendre. Vous n'êtes jamais dépendant de moi.",
    },
    color: 4,
  },
];

export interface Step {
  title: string;
  text: string;
}

const processSteps: { title: L<string>; text: L<string> }[] = [
  {
    title: { en: "Intro call", fr: "Premier appel" },
    text: {
      en: "We talk about your problem, your data and your constraints. I tell you honestly whether AI is the right tool for it.",
      fr: "On parle de votre problème, de vos données et de vos contraintes. Je vous dis honnêtement si l'IA est le bon outil.",
    },
  },
  {
    title: { en: "Clear proposal", fr: "Proposition claire" },
    text: {
      en: "A written scope, timeline and fixed quote, so you know exactly what you get and when.",
      fr: "Un périmètre, un planning et un devis fixe par écrit, pour savoir exactement ce que vous obtenez et quand.",
    },
  },
  {
    title: { en: "Early demo", fr: "Démo rapide" },
    text: {
      en: "A first working version on your real data, then short iterations based on your feedback.",
      fr: "Une première version fonctionnelle sur vos vraies données, puis de courtes itérations selon vos retours.",
    },
  },
  {
    title: { en: "Delivery & handover", fr: "Livraison et passation" },
    text: {
      en: "Deployment, documentation and a walkthrough with your team. I stay available for questions afterwards.",
      fr: "Mise en production, documentation et présentation à votre équipe. Je reste disponible pour vos questions ensuite.",
    },
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
    role: "Freelance developer, AI integration and automation",
    location: "France",
    languages: ["French (native)", "English (professional)", "Korean (basic)", "Spanish (A2)"],
    // TODO(Romain): update or set to null to hide the badge.
    availability: "Available for missions",
    photoAlt: "Portrait of Romain Giraud",
    lede: "Freelance developer. I help small businesses, agencies and solo entrepreneurs save time with AI: assistants that answer from your own documents, automation of repetitive tasks, AI in the tools you already use, and custom websites.",
    suggestedQuestions: [
      "What could you automate for my business?",
      "Have you built a document assistant before?",
      "Can you add AI to my existing website?",
      "Are you available for a mission?",
    ],
  },
  fr: {
    role: "Développeur freelance, intégration IA et automatisation",
    location: "France",
    languages: ["français (natif)", "anglais (professionnel)", "coréen (notions)", "espagnol (A2)"],
    availability: "Disponible pour des missions",
    photoAlt: "Portrait de Romain Giraud",
    lede: "Développeur freelance. J'aide les petites entreprises, les agences et les indépendants à gagner du temps grâce à l'IA : des assistants qui répondent à partir de vos documents, l'automatisation des tâches répétitives, l'IA dans vos outils existants, et des sites web sur mesure.",
    suggestedQuestions: [
      "Que pourriez-vous automatiser dans mon entreprise ?",
      "Avez-vous déjà créé un assistant documentaire ?",
      "Pouvez-vous ajouter de l'IA à mon site existant ?",
      "Êtes-vous disponible pour une mission ?",
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
    photo: { src: "/romain-giraud.jpg", alt: t.photoAlt, width: 579, height: 600 },
    headline: h.tokens,
    /** Token the attention arcs start from before the visitor hovers anything. */
    headlineFocus: h.focus,
    links: links.map((l): ProfileLink => ({ ...l, description: l.description[locale] })),
    projects: projects.map(
      (p): Project => ({
        ...p,
        title: p.title[locale],
        summary: p.summary[locale],
        details: p.details[locale],
        context: p.context[locale],
        result: p.result && { value: p.result.value, label: p.result.label[locale] },
      }),
    ),
    sideProjects: sideProjects.map(
      (p): SideProject => ({
        ...p,
        title: p.title[locale],
        context: p.context[locale],
        summary: p.summary[locale],
        link: p.link && { url: p.link.url, label: p.link.label[locale] },
      }),
    ),
    about: about[locale],
    skills,
    values: values.map(
      (v): Value => ({ keyword: v.keyword[locale], title: v.title[locale], text: v.text[locale], color: v.color }),
    ),
    process: processSteps.map((s): Step => ({ title: s.title[locale], text: s.text[locale] })),
    services: services.map(
      (s): Service => ({
        ...s,
        title: s.title[locale],
        summary: s.summary[locale],
        deliverables: s.deliverables[locale],
      }),
    ),
    offers: offers.map(
      (o): PricingOffer => ({
        key: o.key,
        title: services[o.service]!.title[locale],
        summary: services[o.service]!.summary[locale],
        docsExtra: !!o.docsExtra,
        tiers: o.tiers.map(
          (p): PricingTier => ({
            tier: p.tier,
            name: p.name[locale],
            price: p.price,
            summary: p.summary[locale],
            deliveryDays: p.deliveryDays,
            revisions: p.revisions,
            features: o.features.map((f, i) => ({ label: f[locale], included: p.includes.includes(i) })),
            recommended: p.tier === "Standard",
          }),
        ),
      }),
    ),
    extras,
  };
}

export type Profile = ReturnType<typeof getProfile>;

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}
