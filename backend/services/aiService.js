import OpenAI from 'openai';
import { validateAnalysis } from '../utils/validation.js';
import { getSampleByText, getSampleById } from '../data/sampleNotices.js';
import { SAMPLE_ANALYSES } from '../data/sampleAnalyses.js';

const SYSTEM_PROMPT = `You are an information extraction and action-planning assistant.

Given an official notice, your job is to convert bureaucratic language into clear, actionable information.

Follow these rules strictly:
1. Understand the actual purpose of the notice.
2. Produce a concise plain-language summary (3–5 sentences maximum).
3. Extract EVERY deadline, date, relative timeframe, or conditional time window that requires action. This includes:
   a) Fixed calendar dates (e.g. "30 September 2026", "15 October 2026").
   b) Relative timeframes (e.g. "45 days before renewal", "within 30 days of receipt", "within 15 days of notice").
   c) Conditional deadlines tied to specific events or triggers (e.g. "within 15 days of notice if a claim over Rs 1,00,000 was made").
   - For relative or conditional deadlines, state the time frame clearly in the "date" field (e.g. "45 days before renewal", "Within 15 days of notice") and explain the requirement and trigger condition in the "description" field.
   - Never skip a deadline or requirement window simply because it is relative, pre-renewal, or conditional.
4. Explain what each deadline refers to clearly.
5. Extract eligibility requirements ONLY when explicitly stated in the notice.
6. Convert requirements into concrete, executable action items for a checklist. Every checklist item MUST be a clear, non-empty actionable sentence starting with an imperative verb (e.g. Pay, Submit, Schedule, Confirm, Contact).
7. NEVER return empty strings, blank strings, null, or placeholder items in array fields (checklist, deadlines, eligibility).
8. Never invent information not present in the notice.
9. Never assume the reader is eligible.
10. If information is missing, use empty arrays — do not fabricate or return empty string elements.
11. Preserve important dates and amounts exactly as written in the notice.
12. Return valid JSON only matching this structure:
{
  "summary": "string",
  "deadlines": [
    { "date": "string", "description": "string" }
  ],
  "eligibility": [ "string" ],
  "checklist": [ "string" ],
  "quickTake": {
    "deadline": "string",
    "action": "string",
    "eligibility": "string"
  }
}

Include a "quickTake" object with fields extracted from the notice:
- "deadline": most urgent explicit or relative deadline in short form (e.g. "15 Sep 2026" or "45 days before renewal"), or omit
- "action": single most important action in a few words, or omit
- "eligibility": brief phrase describing who it applies to, or omit`;

const JSON_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    deadlines: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['date', 'description'],
        additionalProperties: false,
      },
    },
    eligibility: {
      type: 'array',
      items: { type: 'string' },
    },
    checklist: {
      type: 'array',
      items: { type: 'string' },
    },
    quickTake: {
      type: 'object',
      properties: {
        deadline: { type: 'string' },
        action: { type: 'string' },
        eligibility: { type: 'string' },
      },
      additionalProperties: false,
    },
  },
  required: ['summary', 'deadlines', 'eligibility', 'checklist'],
  additionalProperties: false,
};

let openaiClient = null;

function getApiKey() {
  return process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
}

function getClient() {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return null;
  }
  if (!openaiClient) {
    const config = { apiKey };
    const baseURL = process.env.OPENAI_BASE_URL || (apiKey.startsWith('gsk_') ? 'https://api.groq.com/openai/v1' : undefined);
    if (baseURL) {
      config.baseURL = baseURL;
    }
    openaiClient = new OpenAI(config);
  }
  return openaiClient;
}

function cleanQuickTake(quickTake) {
  if (!quickTake || typeof quickTake !== 'object') return undefined;
  const cleaned = {};
  for (const key of ['deadline', 'action', 'eligibility']) {
    if (quickTake[key] && String(quickTake[key]).trim()) {
      cleaned[key] = String(quickTake[key]).trim();
    }
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

function normalizeDeadlines(deadlines) {
  if (!Array.isArray(deadlines)) return [];
  return deadlines
    .map((item) => {
      if (typeof item === 'string' && item.trim()) {
        return { date: item.trim(), description: item.trim() };
      }
      if (item && typeof item === 'object') {
        const date = String(item.date || item.deadline || '').trim();
        const description = String(item.description || item.task || item.action || item.details || date).trim();
        if (date && description) {
          return { date, description };
        }
      }
      return null;
    })
    .filter((d) => d && d.date && d.description && d.date.length > 0 && d.description.length > 0);
}

export function getSampleFallback(text, sampleId) {
  const id = (sampleId && getSampleById(sampleId)) || getSampleByText(text);
  if (id && SAMPLE_ANALYSES[id]) {
    return { ...SAMPLE_ANALYSES[id], fromFallback: true };
  }
  return null;
}

export async function analyzeNotice(text, sampleId) {
  const fallback = getSampleFallback(text, sampleId);
  const client = getClient();

  if (!client) {
    if (fallback) return fallback;
    throw new Error(
      'AI service is not configured. Please set OPENAI_API_KEY or GROQ_API_KEY in your environment.'
    );
  }

  const apiKey = getApiKey();
  const isGroq = apiKey?.startsWith('gsk_') || process.env.OPENAI_BASE_URL?.includes('groq');

  const modelsToTry = isGroq
    ? ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it']
    : [process.env.OPENAI_MODEL || 'gpt-4o-mini', 'gpt-4o'];

  let lastErr = null;

  for (const model of modelsToTry) {
    try {
      let response;
      if (isGroq) {
        response = await client.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: `Analyze the following official notice and return structured JSON:\n\n${text}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });
      } else {
        try {
          response = await client.chat.completions.create({
            model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              {
                role: 'user',
                content: `Analyze the following official notice and return structured JSON:\n\n${text}`,
              },
            ],
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'notice_analysis',
                strict: true,
                schema: JSON_SCHEMA,
              },
            },
            temperature: 0.2,
          });
        } catch (schemaErr) {
          response = await client.chat.completions.create({
            model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              {
                role: 'user',
                content: `Analyze the following official notice and return structured JSON:\n\n${text}`,
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          });
        }
      }

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI service.');
      }

      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        throw new Error('AI returned malformed data. Please try again.');
      }

      parsed.deadlines = normalizeDeadlines(parsed.deadlines);

      parsed.eligibility = (Array.isArray(parsed.eligibility) ? parsed.eligibility : [parsed.eligibility])
        .map((s) => String(s || '').trim())
        .filter((s) => s.length > 0);

      parsed.checklist = (Array.isArray(parsed.checklist) ? parsed.checklist : [parsed.checklist])
        .map((s) => String(s || '').trim())
        .filter((s) => s.length > 0);

      parsed.quickTake = cleanQuickTake(parsed.quickTake);

      const validation = validateAnalysis(parsed);
      if (!validation.success) {
        console.error('Validation failure details:', validation.error.format());
        throw new Error('AI response did not match expected format. Please try again.');
      }

      return validation.data;
    } catch (err) {
      console.warn(`Model ${model} failed:`, err.message);
      lastErr = err;
      // Try next model in list
    }
  }

  if (fallback) {
    console.warn('All AI models failed, using sample fallback');
    return fallback;
  }

  if (lastErr?.status === 429) {
    throw new Error('AI service is temporarily busy. Please wait a moment and try again.');
  }

  throw new Error(lastErr?.message || 'Unable to analyze this notice right now. Please try again later.');
}
