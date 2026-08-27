import Notice from '../models/Notice.js';

export async function saveNotice(rawText, analysis, userId = null) {
  try {
    if (!process.env.MONGODB_URI) return null;

    const data = {
      rawText,
      summary: analysis.summary,
      deadlines: analysis.deadlines,
      eligibility: analysis.eligibility,
      checklist: analysis.checklist,
      quickTake: analysis.quickTake,
    };

    if (userId) {
      data.user = userId;
    }

    const notice = await Notice.create(data);
    return notice;
  } catch (err) {
    console.warn('Failed to save notice to MongoDB:', err.message);
    return null;
  }
}

export async function getHistory(userId = null, limit = 20) {
  try {
    if (!process.env.MONGODB_URI) return [];

    const query = userId ? { user: userId } : {};

    const notices = await Notice.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('summary quickTake createdAt rawText deadlines eligibility checklist user');

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
