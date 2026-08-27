import { motion } from 'framer-motion';

export default function EligibilitySection({ eligibility }) {
  const validEligibility = (eligibility || []).filter(
    (item) => typeof item === 'string' && item.trim().length > 0
  );

  return (
    <section aria-labelledby="eligibility-heading">
      <h2 id="eligibility-heading" className="font-display text-lg font-semibold text-ink mb-4">
        Who this applies to
      </h2>

      {validEligibility.length > 0 ? (
        <ul className="space-y-2">
          {validEligibility.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-2.5 text-xs sm:text-sm text-ink-secondary leading-relaxed"
            >
              <span className="text-accent mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent" aria-hidden />
              <span className="break-words">{item}</span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-secondary italic">
          No specific eligibility conditions were stated.
        </p>
      )}
    </section>
  );
}
