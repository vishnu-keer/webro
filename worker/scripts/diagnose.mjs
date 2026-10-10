/**
 * Diagnoses the Gemini connection from your own machine, step by step.
 *
 *   GEMINI_API_KEY=... node scripts/diagnose.mjs
 *
 * Prints only status codes, model names and Google's error messages.
 * Never prints the key. Sends only a fixed test sentence — no customer data.
 */
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const key = (process.env.GEMINI_API_KEY ?? '').trim();
const model = (process.env.GEMINI_MODEL ?? 'gemini-3.8-flash').trim();
const hide = (text) => String(text).split(key).join('[KEY]').slice(0, 600);

if (!key) {
  console.log('✖ GEMINI_API_KEY is empty.');
  process.exit(1);
}
console.log(`Key length: ${key.length} characters, starts with "${key.slice(0, 4)}…"`);
console.log(`Model: ${model}\n`);

const ai = new GoogleGenAI({ apiKey: key, httpOptions: { timeout: 20000 } });

async function step(name, fn) {
  try {
    const out = await fn();
    console.log(`✔ ${name}${out ? `\n  ${out}` : ''}`);
    return true;
  } catch (error) {
    console.log(
      `✖ ${name}\n  status: ${error?.status ?? 'n/a'}\n  ${hide(error?.message ?? error)}`,
    );
    return false;
  }
}

const keyOk = await step('1. Key accepted and models listed', async () => {
  const names = [];
  const pager = await ai.models.list({ config: { pageSize: 100 } });
  for await (const m of pager) names.push(m.name?.replace('models/', ''));
  const flash = names.filter((n) => n?.includes('flash')).slice(0, 12);
  const found = names.includes(model) ? `"${model}" is available.` : `"${model}" NOT in your list.`;
  return `${found}\n  Flash models on this key: ${flash.join(', ') || '(none)'}`;
});

if (keyOk) {
  await step('2. Plain text generation', async () => {
    const r = await ai.models.generateContent({
      model,
      contents: 'Reply with the single word OK.',
    });
    return `reply: ${hide(r.text ?? '(empty)')}`;
  });

  const fallback = (process.env.GEMINI_FALLBACK_MODEL ?? 'gemini-2.5-flash').trim();
  for (const m of [model, fallback]) {
    await step(`3. Worker settings on ${m} (JSON + lowest thinking)`, async () => {
      const started = Date.now();
      const r = await ai.models.generateContent({
        model: m,
        contents: 'Customer notes: "Website built in two weeks, one deadline missed."',
        config: {
          systemInstruction: 'Rewrite the notes as a short honest review. Return JSON.',
          temperature: 0.3,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
          responseJsonSchema: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['draft', 'need_more'] },
              draft: { type: 'string', maxLength: 1200 },
              question: { type: 'string', maxLength: 300 },
            },
            required: ['status'],
          },
          thinkingConfig: /^gemini-2\./.test(m)
            ? { thinkingBudget: 0 }
            : { thinkingLevel: ThinkingLevel.LOW },
        },
      });
      return `${((Date.now() - started) / 1000).toFixed(1)}s — reply: ${hide(r.text ?? '(empty)')}`;
    });
  }
}
