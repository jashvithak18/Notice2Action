import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuickTake from '../components/QuickTake';
import DeadlinesSection from '../components/DeadlinesSection';
import EligibilitySection from '../components/EligibilitySection';
import ActionChecklist from '../components/ActionChecklist';
import OriginalNotice from '../components/OriginalNotice';
import Disclaimer from '../components/Disclaimer';
import { useChecklist, createNoticeKey } from '../hooks/useChecklist';

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const noticeKey = result ? createNoticeKey(result.rawText) : '';
  const { checked, toggle, completedCount, total } = useChecklist(
    noticeKey,
    result?.checklist || []
  );

  useEffect(() => {
    if (!result) {
      navigate('/', { replace: true });
    }
  }, [result, navigate]);

  if (!result) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <p className="text-xs font-medium text-accent uppercase tracking-wide mb-2">
            Notice analyzed
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
            Here&apos;s what you need to know
          </h1>
        </div>

        <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" className="mb-8">
          <QuickTake quickTake={result.quickTake} />
        </motion.div>

        <motion.section
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-10"
          aria-labelledby="summary-heading"
        >
          <h2 id="summary-heading" className="font-display text-lg font-semibold text-ink mb-3">
            What this means
          </h2>
          <p className="text-[15px] text-ink-secondary leading-relaxed">
            {result.summary}
          </p>
        </motion.section>

        <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="mb-10">
          <ActionChecklist
            items={result.checklist}
            checked={checked}
            onToggle={toggle}
            completedCount={completedCount}
            total={total}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
          <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible">
            <DeadlinesSection deadlines={result.deadlines} />
          </motion.div>

          <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="visible">
            <EligibilitySection eligibility={result.eligibility} />
          </motion.div>
        </div>

        <motion.div custom={5} variants={sectionVariants} initial="hidden" animate="visible" className="mb-6">
          <OriginalNotice rawText={result.rawText} />
        </motion.div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors focus-ring"
          >
            Analyze another notice
          </Link>
        </div>

        <Disclaimer />
      </motion.div>
    </main>
  );
}
