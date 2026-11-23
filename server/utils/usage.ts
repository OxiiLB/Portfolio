// Spend guard for the assistant: a hard monthly budget in USD and a daily
// question cap. Before each call we reserve the worst-case cost of one answer;
// after the call we replace it with the real cost from the API's token usage.
// So the month can never go over budget, even with many visitors at once.

/** claude-haiku-5-5 prices in USD per token (prompts under 100K tokens). */
export const PRICE = { input: 0.1 / 1_000_000, output: 0.5 / 1_000_000 };

/** Hard cap on answer length (max_tokens) sent to the API. */
export const MAX_OUTPUT_TOKENS = 400;

/** Upper bound on one request's input: system prompt + 4 passages + trimmed history + question. */
const MAX_INPUT_TOKENS = 3_000;

/** Cost of the most expensive possible question, used as the reservation. */
export const WORST_CASE_USD = MAX_INPUT_TOKENS * PRICE.input + MAX_OUTPUT_TOKENS * PRICE.output;

interface Usage {
  usd: number;
  questions: number;
}

const storage = () => useStorage<Usage>("assistant-usage");

function periodKeys() {
  const now = new Date().toISOString(); // UTC
  return { month: `month-${now.slice(0, 7)}`, day: `day-${now.slice(0, 10)}` };
}

async function read(key: string): Promise<Usage> {
  return (await storage().getItem(key)) ?? { usd: 0, questions: 0 };
}

// Serialize read-modify-write so two requests at the same moment can't both slip under the cap.
let lock: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = lock.then(fn, fn);
  lock = run.catch(() => {});
  return run;
}

export type Reservation = { ok: true; release: (actualUsd: number) => Promise<void> } | { ok: false; reason: "month" | "day" };

/** Reserve the worst-case cost of one answer, or refuse if a cap would be crossed. */
export function reserve(monthlyBudgetUsd: number, dailyQuestions: number): Promise<Reservation> {
  return locked(async () => {
    const { month, day } = periodKeys();
    const m = await read(month);
    const d = await read(day);
    if (m.usd + WORST_CASE_USD > monthlyBudgetUsd) return { ok: false, reason: "month" };
    if (d.questions >= dailyQuestions) return { ok: false, reason: "day" };

    await storage().setItem(month, { usd: m.usd + WORST_CASE_USD, questions: m.questions + 1 });
    await storage().setItem(day, { usd: d.usd + WORST_CASE_USD, questions: d.questions + 1 });

    let settled = false;
    return {
      ok: true,
      // Swap the reservation for what the call really cost (0 if it failed before any tokens).
      release: (actualUsd: number) =>
        locked(async () => {
          if (settled) return;
          settled = true;
          const diff = actualUsd - WORST_CASE_USD;
          const m2 = await read(month);
          const d2 = await read(day);
          await storage().setItem(month, { ...m2, usd: Math.max(0, m2.usd + diff) });
          await storage().setItem(day, { ...d2, usd: Math.max(0, d2.usd + diff) });
        }),
    };
  });
}

/** Real cost of a finished call, from the usage block the API returns. */
export function costOf(usage: { input_tokens: number; output_tokens: number } | undefined): number {
  if (!usage) return WORST_CASE_USD;
  return usage.input_tokens * PRICE.input + usage.output_tokens * PRICE.output;
}
