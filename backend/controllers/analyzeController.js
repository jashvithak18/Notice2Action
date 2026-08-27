import { analyzeNotice } from '../services/aiService.js';
import { saveNotice } from '../services/noticeService.js';
import { validateNoticeText } from '../utils/validation.js';

export async function analyze(req, res, next) {
  try {
    const { text, sampleId } = req.body;
    const validation = validateNoticeText(text);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const analysis = await analyzeNotice(validation.text, sampleId);
    const userId = req.user?._id || null;
    const saved = await saveNotice(validation.text, analysis, userId);

    res.json({
      ...analysis,
      rawText: validation.text,
      id: saved?._id?.toString() || null,
    });
  } catch (err) {
    next(err);
  }
}
