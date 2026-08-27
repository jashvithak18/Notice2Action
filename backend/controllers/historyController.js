import { getHistory, getNoticeById } from '../services/noticeService.js';

export async function listHistory(req, res) {
  const notices = await getHistory();
  res.json(notices);
}

export async function getHistoryItem(req, res) {
  const notice = await getNoticeById(req.params.id);
  if (!notice) {
    return res.status(404).json({ error: 'Notice not found.' });
  }
  res.json(notice);
}
