import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function Header() {
  const location = useLocation();
  const isAnalyze = location.pathname === '/analyze' || location.pathname === '/app';
  const isHistory = location.pathname === '/history';
  const isHome = location.pathname === '/';

  return (
    <header className="border-b border-border bg-surface-raised/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink tracking-tight focus-ring rounded-sm group"
        >
          <Logo className="w-7 h-7 group-hover:scale-105 transition-transform" />
          <span>Notice2Action</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors focus-ring rounded-sm px-2.5 py-1 ${
              isHome
                ? 'text-accent font-semibold'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Home
          </Link>
          <Link
            to="/analyze"
            className={`transition-colors focus-ring rounded-sm px-2.5 py-1 ${
              isAnalyze
                ? 'text-accent font-semibold'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Analyze Notice
          </Link>
          <Link
            to="/history"
            className={`transition-colors focus-ring rounded-sm px-2.5 py-1 ${
              isHistory
                ? 'text-accent font-semibold'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            History
          </Link>
        </nav>
      </div>
    </header>
  );
}
