import { getProfile, isLocale, type Locale } from "~/data/profile";

export interface Passage {
  /** Short label shown to visitors under an answer, e.g. "about · Experience". */
  source: string;
  text: string;
}

// ---------- building the passages ----------

function passagesFromMarkdown(file: string, md: string): Passage[] {
  const doc = file.replace(/\.md$/, "");
  const clean = md.replace(/<!--[\s\S]*?-->/g, "");
  const parts = clean.split(/^## +/m);
  const out: Passage[] = [];
  for (const part of parts.slice(1)) {
    const [heading = "", ...body] = part.split("\n");
    const text = body.join("\n").trim();
    if (text) out.push({ source: `${doc} · ${heading.trim()}`, text: `${heading.trim()}\n${text}` });
  }
  return out;
}

const LABELS: Record<Locale, { contact: string; project: string; service: string }> = {
  en: { contact: "profile · Contact", project: "project", service: "service" },
  fr: { contact: "profil · Contact", project: "projet", service: "service" },
};

function passagesFromProfile(locale: Locale): Passage[] {
  const p = getProfile(locale);
  const lb = LABELS[locale];
  const fr = locale === "fr";
  const links = p.links.map((l) => `${l.label} (${l.description}): ${l.url}`).join("; ");

  const out: Passage[] = [
    {
      source: lb.contact,
      text: (fr
        ? [
            `${p.name} est ${p.role.toLowerCase()}, basé en ${p.location}. Langues : ${p.languages.join(", ")}.`,
            p.availability ? `Disponibilité actuelle : ${p.availability}.` : "",
            `E-mail : ${p.email}.`,
            `Profils : ${links}.`,
          ]
        : [
            `${p.name} is a ${p.role} based in ${p.location}. Languages: ${p.languages.join(", ")}.`,
            p.availability ? `Current availability: ${p.availability}.` : "",
            `Email: ${p.email}.`,
            `Profiles: ${links}.`,
          ]
      ).join("\n"),
    },
  ];
  for (const proj of p.projects) {
    const tags = proj.tags.map((t) => t.label).join(", ");
    out.push({
      source: `${lb.project} · ${proj.title}`,
      text: [
        `${fr ? "Projet" : "Project"}: ${proj.title}.`,
        proj.summary,
        proj.details,
        `${fr ? "Technologies et thèmes" : "Technologies and topics"}: ${tags}; ${proj.categories.join(", ")}.`,
        proj.result ? `${fr ? "Résultat" : "Result"}: ${proj.result.value} ${proj.result.label}.` : "",
        proj.url ? `${fr ? "Lien" : "Link"}: ${proj.url}` : "",
      ].join("\n"),
    });
  }
  for (const s of p.services) {
    out.push({
      source: `${lb.service} · ${s.title}`,
      text: fr
        ? `Service proposé : ${s.title}. ${s.summary} Comprend : ${s.deliverables.join(" ; ")}. Durée : ${s.duration}.`
        : `Service offered: ${s.title}. ${s.summary} Includes: ${s.deliverables.join("; ")}. Duration: ${s.duration}.`,
    });
  }
  return out;
}

// ---------- BM25 keyword search ----------

const STOPWORDS = new Set(
  (
    "a an and are as at be but by can do does for from has have he his how i in is it its me my of on or " +
    "so that the their them they this to was what when where which who why will with you your " +
    "le la les un une des de du et est en au aux pour par sur que qui quoi dans avec il elle vous tu je ce ces son sa ses " +
    "votre vos mon mes avez etes fait faites peut pouvez comment quel quelle quels quelles"
  ).split(" "),
);

function terms(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9+#]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map((w) => (w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w));
}

interface Index {
  passages: Passage[];
  docTerms: Map<string, number>[];
  lengths: number[];
  avgLen: number;
  df: Map<string, number>;
}

const indexes = new Map<Locale, Promise<Index>>();

async function buildIndex(locale: Locale): Promise<Index> {
  const storage = useStorage("assets:knowledge");
  // Markdown lives in server/knowledge/<locale>/*.md, so keys look like "fr:about.md".
  const keys = (await storage.getKeys()).filter((k) => k.endsWith(".md") && k.split(":")[0] === locale);
  const passages: Passage[] = passagesFromProfile(locale);
  for (const key of keys) {
    const raw = await storage.getItem(key);
    const md = typeof raw === "string" ? raw : raw ? new TextDecoder().decode(raw as ArrayBuffer) : "";
    passages.push(...passagesFromMarkdown(key.split(":").pop()!, md));
  }

  const docTerms = passages.map((p) => {
    const tf = new Map<string, number>();
    for (const t of terms(`${p.source} ${p.text}`)) tf.set(t, (tf.get(t) ?? 0) + 1);
    return tf;
  });
  const lengths = docTerms.map((tf) => [...tf.values()].reduce((a, b) => a + b, 0));
  const df = new Map<string, number>();
  for (const tf of docTerms) for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  return { passages, docTerms, lengths, avgLen: lengths.reduce((a, b) => a + b, 0) / lengths.length, df };
}

export function getIndex(locale: Locale): Promise<Index> {
  // Rebuild on every request in dev so edits to profile/knowledge show up immediately.
  if (!indexes.has(locale) || import.meta.dev) indexes.set(locale, buildIndex(locale));
  return indexes.get(locale)!;
}

export async function retrieve(
  query: string,
  locale: unknown = "en",
  k = 4,
): Promise<{ passages: Passage[]; total: number }> {
  const lang: Locale = isLocale(locale) ? locale : "en";
  const idx = await getIndex(lang);
  const q = [...new Set(terms(query))];
  const N = idx.passages.length;
  const k1 = 1.2;
  const b = 0.75;

  const scored = idx.passages.map((p, i) => {
    let score = 0;
    for (const t of q) {
      const f = idx.docTerms[i]!.get(t);
      if (!f) continue;
      const n = idx.df.get(t) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * idx.lengths[i]!) / idx.avgLen));
    }
    return { p, score };
  });

  let top = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, k).map((s) => s.p);
  // Nothing matched (e.g. "hi" or a very vague question): give the model the general profile.
  if (!top.length) {
    top = idx.passages.filter((p) => p.source === LABELS[lang].contact || p.source.startsWith("about ·")).slice(0, k);
  }
  return { passages: top, total: N };
}
