import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function ActionChecklist({ items, checked, onToggle, completedCount, total }) {
  return (
    <section aria-labelledby="checklist-heading" className="bg-surface-raised border border-border rounded-xl p-5 sm:p-6 shadow-soft">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h2 id="checklist-heading" className="font-display text-lg font-semibold text-ink">
          What you need to do
        </h2>
        {total > 0 && (
          <span className="text-xs text-ink-muted font-medium tabular-nums">
            {completedCount}/{total}
          </span>
        )}
      </div>

      {items?.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item, index) => {
            const isChecked = !!checked[index];
            return (
              <motion.li
                key={index}
                layout
                className="group"
              >
                <label
                  className={`flex items-start gap-3 p-3 -mx-3 rounded-lg cursor-pointer transition-colors hover:bg-surface-muted ${
                    isChecked ? 'opacity-60' : ''
                  }`}
                >
                  <span className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggle(index)}
                      className="sr-only peer"
                      aria-label={`Mark as complete: ${item}`}
                    />
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 ${
                        isChecked
                          ? 'bg-accent border-accent'
                          : 'border-border-strong group-hover:border-accent/50'
                      }`}
                      aria-hidden
                    >
                      {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </span>
                  </span>
                  <span
                    className={`text-sm leading-relaxed transition-all ${
                      isChecked ? 'line-through text-ink-muted' : 'text-ink'
                    }`}
                  >
                    {item}
                  </span>
                </label>
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-ink-secondary italic">
          No specific actions could be extracted from this notice.
        </p>
      )}
    </section>
  );
}
