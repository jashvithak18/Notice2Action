import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  'Reading the notice…',
  'Finding important dates…',
  'Turning requirements into actions…',
];

export default function LoadingStages() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-4"
      role="status"
      aria-live="polite"
      aria-label="Analyzing notice"
    >
      <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin mb-6" />
      <AnimatePresence mode="wait">
        <motion.p
          key={stageIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-ink-secondary text-sm font-medium"
        >
          {STAGES[stageIndex]}
        </motion.p>
      </AnimatePresence>
      <p className="text-ink-muted text-xs mt-2">This may take a few seconds</p>
    </div>
  );
}
