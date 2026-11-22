import Anthropic from "@anthropic-ai/sdk";
import { getProfile, isLocale, type Locale } from "~/data/profile";

const profile = getProfile("en");

const SYSTEM = `You are the assistant on ${profile.name}'s portfolio website. ${profile.name} is a ${profile.role}. Visitors are mostly potential clients deciding whether to hire him.

Answer questions about ${profile.name} using only the passages given in <passages>. If the passages don't contain the answer, say you don't know and suggest contacting him by email (${profile.email}) or through the links on the site. Never invent projects, clients, numbers, prices or dates.

Speak about ${profile.name} in the third person. Reply in the language the visitor writes in (French or English); if unclear, use the language of the site version they are browsing. Keep answers short: two to four sentences, plain text, no markdown, no headings, no lists. If a visitor asks about something unrelated to ${profile.name} and his work, politely bring the conversation back to how he could help them.`;

const MESSAGES: Record<Locale, Record<string, string>> = {
  en: {
    badQuestion: "Please ask a question of up to 500 characters.",
    tooMany: "That's a lot of questions! Please wait a minute and try again.",
    off: "The assistant isn't switched on yet.",
    refusal: "I can't help with that one. Try asking about Romain's work.",
    busy: "The assistant is busy. Please try again in a minute.",
    misconfigured: "The assistant isn't configured correctly.",
    unavailable: "The assistant is unavailable right now.",
  },
  fr: {
    badQuestion: "Merci de poser une question de 500 caractères maximum.",
    tooMany: "Beaucoup de questions d'un coup ! Patientez une minute avant de réessayer.",
    off: "L'assistant n'est pas encore activé.",
    refusal: "Je ne peux pas répondre à cette question. Demandez plutôt quelque chose sur le travail de Romain.",
    busy: "L'assistant est très sollicité. Réessayez dans une minute.",
    misconfigured: "L'assistant n'est pas configuré correctement.",
    unavailable: "L'assistant n'est pas disponible pour le moment.",
  },
};

const MAX_QUESTION = 500;
const MAX_HISTORY = 6;

// Simple in-memory rate limit per IP. Good enough for a single-instance portfolio.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  const lastMinute = recent.filter((t) => now - t < 60 * 1000).length;
  return lastMinute > 8 || recent.length > 40;
}

let client: Anthropic | null = null;

export default defineEventHandler(async (event) => {
  const body = await readBody<{ question?: unknown; history?: unknown; locale?: unknown }>(event);
  const locale: Locale = isLocale(body?.locale) ? body.locale : "en";
  const msg = MESSAGES[locale];

  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (!question || question.length > MAX_QUESTION) {
    throw createError({ statusCode: 400, message: msg.badQuestion });
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
  if (rateLimited(ip)) {
    throw createError({ statusCode: 429, message: msg.tooMany });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    throw createError({ statusCode: 503, message: msg.off });
  }
  client ??= new Anthropic();

  const history: Anthropic.Beta.BetaMessageParam[] = (Array.isArray(body?.history) ? body.history : [])
    .filter(
      (m: any) =>
        (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.length < 2000,
    )
    .slice(-MAX_HISTORY)
    .map((m: any) => ({ role: m.role, content: m.content }));
  while (history.length && history[0]!.role !== "user") history.shift();

  // Retrieve with the previous question too, so follow-ups like "and the price?" still find context.
  const prevUser = [...history].reverse().find((m) => m.role === "user")?.content ?? "";
  const { passages, total } = await retrieve(`${question} ${typeof prevUser === "string" ? prevUser : ""}`, locale);
  const context = passages
    .map((p, i) => `<passage index="${i + 1}" source="${p.source}">\n${p.text}\n</passage>`)
    .join("\n");
  const siteLanguage = locale === "fr" ? "French" : "English";

  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...history,
    {
      role: "user",
      content: `<passages>\n${context}\n</passages>\n\nThe visitor is browsing the ${siteLanguage} version of the site.\nVisitor question: ${question}`,
    },
  ];

  setResponseHeaders(event, {
    "content-type": "application/x-ndjson; charset=utf-8",
    "cache-control": "no-store",
  });

  const encoder = new TextEncoder();
  const send = (controller: ReadableStreamDefaultController, data: unknown) =>
    controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));

  return new ReadableStream({
    async start(controller) {
      send(controller, { type: "meta", documents: total });
      try {
        const stream = client!.beta.messages.stream({
          model: "claude-opus-5-5",
          max_tokens: 1024, // answers are deliberately short
          output_config: { effort: "low" },
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          system: SYSTEM,
          messages,
        });
        for await (const ev of stream) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
            send(controller, { type: "text", text: ev.delta.text });
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          send(controller, { type: "error", message: msg.refusal });
        } else {
          send(controller, { type: "sources", sources: [...new Set(passages.map((p) => p.source))] });
        }
      } catch (err) {
        let message = msg.unavailable;
        if (err instanceof Anthropic.RateLimitError) message = msg.busy;
        else if (err instanceof Anthropic.AuthenticationError) message = msg.misconfigured;
        console.error("[ask]", err);
        send(controller, { type: "error", message });
      } finally {
        controller.close();
      }
    },
  });
});
