import { analyzeNotice } from '../services/aiService.js';
import { saveNotice } from '../services/noticeService.js';
import { validateNoticeText } from '../utils/validation.js';

// Hard-limit to 15 000 chars (≈ 15 KB). Official notices rarely exceed this.
const MAX_TEXT_CHARS = 15_000;

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
