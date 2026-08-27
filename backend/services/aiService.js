import OpenAI from 'openai';
import { validateAnalysis } from '../utils/validation.js';
import { getSampleByText, getSampleById } from '../data/sampleNotices.js';
import { SAMPLE_ANALYSES } from '../data/sampleAnalyses.js';

const SYSTEM_PROMPT = `You are an information extraction and action-planning assistant.

Given an official notice, your job is to convert bureaucratic language into clear, actionable information.

Follow these rules strictly:
1. Understand the actual purpose of the notice.
2. Produce a concise plain-language summary (3–5 sentences maximum).
3. Extract every EXPLICIT deadline or date that requires the recipient to take action. Do not infer deadlines from vague language like "as soon as possible" or "at your earliest convenience."
4. Explain what each deadline refers to.
5. Extract eligibility requirements ONLY when explicitly stated in the notice.
6. Convert requirements into concrete, executable action items for a checklist.
7. Never invent information not present in the notice.
8. Never assume the reader is eligible.
9. Never create deadlines that aren't explicitly stated.
10. If information is missing, use empty arrays or state in the summary that it is not stated — do not fabricate.
11. Preserve important dates exactly as written in the notice.
12. Keep checklist actions specific and executable (start with verbs like Download, Gather, Complete, Submit, Contact).
13. Return valid JSON only — no markdown formatting, no commentary. The JSON output MUST match this structure:
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

Also include a "quickTake" object with ONLY fields you can extract from the notice:
- "deadline": the most urgent explicit deadline in short form (e.g. "15 Sep 2026"), or omit
- "action": the single most important action in a few words, or omit
- "eligibility": a brief phrase describing who the notice applies to, or omit

Do not include quickTake fields you cannot support from the notice text.`;

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
      if (typeof item === 'string') {
        return { date: item, description: item };
      }
      if (item && typeof item === 'object') {
        const date = item.date || item.deadline || 'Specified Date';
        const description = item.description || item.task || item.action || item.details || String(date);
        return { date: String(date), description: String(description) };
      }
      return null;
    })
    .filter((d) => d && d.date && d.description);
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
    ? ['groq/compound-mini', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b']
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

      if (parsed.deadlines) {
        parsed.deadlines = normalizeDeadlines(parsed.deadlines);
      }
      if (!Array.isArray(parsed.eligibility)) {
        parsed.eligibility = parsed.eligibility ? [String(parsed.eligibility)] : [];
      }
      if (!Array.isArray(parsed.checklist)) {
        parsed.checklist = parsed.checklist ? [String(parsed.checklist)] : [];
      }

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
