import { z } from 'zod';

export const analysisSchema = z.object({
  summary: z.string().min(1),
  deadlines: z.array(
    z.object({
      date: z.string().min(1),
      description: z.string().min(1),
    })
  ),
  eligibility: z.array(z.string()),
  checklist: z.array(z.string().min(1)),
  quickTake: z
    .object({
      deadline: z.string().optional(),
      action: z.string().optional(),
      eligibility: z.string().optional(),
    })
    .optional(),
});

export function validateAnalysis(data) {
  return analysisSchema.safeParse(data);
}

export const MIN_NOTICE_LENGTH = 50;

export function validateNoticeText(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, message: 'Please provide notice text to analyze.' };
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'Please paste or upload a notice before analyzing.' };
  }
  if (trimmed.length < MIN_NOTICE_LENGTH) {
    return {
      valid: false,
      message: `This notice seems too short. Please provide at least ${MIN_NOTICE_LENGTH} characters.`,
    };
  }
  return { valid: true, text: trimmed };
}
