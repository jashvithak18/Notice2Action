import Notice from '../models/Notice.js';

export async function saveNotice(rawText, analysis) {
  try {
    if (!process.env.MONGODB_URI) return null;

    const notice = await Notice.create({
      rawText,
      summary: analysis.summary,
      deadlines: analysis.deadlines,
      eligibility: analysis.eligibility,
      checklist: analysis.checklist,
      quickTake: analysis.quickTake,
    });
    return notice;
  } catch (err) {
    console.warn('Failed to save notice to MongoDB:', err.message);
    return null;
  }
}

export async function getHistory(limit = 20) {
  try {
    if (!process.env.MONGODB_URI) return [];

    const notices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('summary quickTake createdAt rawText deadlines eligibility checklist');

    return notices;
  } catch (err) {
    console.warn('Failed to fetch history:', err.message);
    return [];
  }
}

export async function getNoticeById(id) {
  try {
    if (!process.env.MONGODB_URI) return null;
    return await Notice.findById(id);
  } catch {
    return null;
  }
}
