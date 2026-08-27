import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export default function DeadlinesSection({ deadlines }) {
  return (
    <section aria-labelledby="deadlines-heading">
      <h2 id="deadlines-heading" className="font-display text-lg font-semibold text-ink mb-4">
        Deadlines
      </h2>

      {deadlines?.length > 0 ? (
        <ul className="space-y-4">
          {deadlines.map((deadline, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
                <Calendar className="w-4 h-4 text-accent" aria-hidden />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="font-display font-semibold text-ink text-base leading-snug">
                  {deadline.date}
                </p>
                <p className="text-sm text-ink-secondary mt-1 leading-relaxed">
                  {deadline.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-secondary italic">
          No explicit deadline found in this notice.
        </p>
      )}
    </section>
  );
}
