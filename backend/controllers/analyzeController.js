import { analyzeNotice } from '../services/aiService.js';
import { saveNotice } from '../services/noticeService.js';
import { validateNoticeText } from '../utils/validation.js';

// Allow up to 50,000 characters for long 1400+ line notices
const MAX_TEXT_CHARS = 50_000;

export async function analyze(req, res, next) {
  try {
    const { text, sampleId } = req.body;
    const validation = validateNoticeText(text);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    // Truncate to 80 000 chars to stay well under the nginx 1 MB body ceiling
    const safeText = validation.text.slice(0, MAX_TEXT_CHARS);

    const analysis = await analyzeNotice(safeText, sampleId);
    const userId = req.user?._id || null;
    const saved = await saveNotice(safeText, analysis, userId);

    res.json({
      ...analysis,
      rawText: safeText,
      id: saved?._id?.toString() || null,
    });
  } catch (err) {
    next(err);
  }
}
