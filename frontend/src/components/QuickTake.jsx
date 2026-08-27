import { Calendar, ArrowRight, Users } from 'lucide-react';

export default function QuickTake({ quickTake }) {
  if (!quickTake) return null;

  const items = [
    { key: 'deadline', label: 'Deadline', value: quickTake.deadline, icon: Calendar },
    { key: 'action', label: 'Action', value: quickTake.action, icon: ArrowRight },
    { key: 'eligibility', label: 'Eligibility', value: quickTake.eligibility, icon: Users },
  ].filter((item) => item.value);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-surface-muted rounded-xl border border-border">
      {items.map(({ key, label, value, icon: Icon }) => (
        <div key={key} className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted uppercase tracking-wide mb-1">
            <Icon className="w-3.5 h-3.5" aria-hidden />
            {label}
          </div>
          <p className="text-sm font-medium text-ink leading-snug">{value}</p>
        </div>
      ))}
    </div>
  );
}
