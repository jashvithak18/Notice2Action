import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="border-b border-border bg-surface-raised/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-lg font-semibold text-ink tracking-tight focus-ring rounded-sm"
        >
          Notice2Action
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {!isHome && (
            <Link
              to="/"
              className="text-ink-secondary hover:text-ink transition-colors focus-ring rounded-sm px-2 py-1"
            >
              New Notice
            </Link>
          )}
          <Link
            to="/history"
            className={`transition-colors focus-ring rounded-sm px-2 py-1 ${
              location.pathname === '/history'
                ? 'text-accent font-medium'
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
