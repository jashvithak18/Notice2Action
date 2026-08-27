import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { fetchHistory } from '../services/api';

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function HistoryPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory()
      .then(setNotices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
          History
        </h1>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-secondary">
          Previously analyzed notices saved on this device&apos;s server session.
        </p>
      </header>

      {loading && (
        <p className="text-sm text-ink-muted">Loading history…</p>
      )}

      {error && (
        <div className="text-sm text-ink-secondary bg-surface-muted border border-border rounded-lg px-4 py-3">
          <p>{error === 'Something went wrong. Please try again.' ? 'History is unavailable — MongoDB may not be connected.' : error}</p>
          <Link to="/analyze" className="text-accent hover:text-accent-hover font-medium mt-2 inline-block">
            Analyze a notice instead
          </Link>
        </div>
      )}

      {!loading && !error && notices.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <p className="text-ink-secondary text-sm mb-4">No analyzed notices yet.</p>
          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors focus-ring shadow-soft"
          >
            Analyze your first notice
          </Link>
        </div>
      )}

      {!loading && notices.length > 0 && (
        <ul className="space-y-3">
          {notices.map((notice, i) => (
            <motion.li
              key={notice._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to="/results"
                state={{
                  result: {
                    rawText: notice.rawText,
                    summary: notice.summary,
                    deadlines: notice.deadlines,
                    eligibility: notice.eligibility,
                    checklist: notice.checklist,
                    quickTake: notice.quickTake,
                    id: notice._id,
                  },
                }}
                className="group flex items-start gap-3 p-4 bg-surface-raised border border-border rounded-xl hover:border-border-strong hover:shadow-soft transition-all focus-ring"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink line-clamp-2 leading-snug">
                    {notice.summary}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-ink-muted">
                    <Clock className="w-3.5 h-3.5" aria-hidden />
                    {formatDate(notice.createdAt)}
                  </div>
                  {notice.quickTake?.deadline && (
                    <p className="text-xs text-accent font-medium mt-1.5">
                      Deadline: {notice.quickTake.deadline}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-ink flex-shrink-0 mt-1 transition-colors" aria-hidden />
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </main>
  );
}
