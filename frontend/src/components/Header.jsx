import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User as UserIcon, LogOut, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import AuthModal from './AuthModal';

export default function Header() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const isAnalyze = location.pathname === '/analyze' || location.pathname === '/app';
  const isHistory = location.pathname === '/history';
  const isHome = location.pathname === '/';

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="border-b border-border bg-surface-raised/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-base sm:text-lg font-semibold text-ink tracking-tight focus-ring rounded-sm group shrink-0"
          >
            <Logo className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-105 transition-transform" />
            <span className="truncate">Notice2Action</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-3 text-xs sm:text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors focus-ring rounded-md px-2 py-1 ${
                isHome
                  ? 'text-accent font-semibold bg-accent-light/40'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              Home
            </Link>
            <Link
              to="/analyze"
              className={`transition-colors focus-ring rounded-md px-2 py-1 ${
                isAnalyze
                  ? 'text-accent font-semibold bg-accent-light/40'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              <span>Analyze</span>
              <span className="hidden sm:inline"> Notice</span>
            </Link>
            <Link
              to="/history"
              className={`transition-colors focus-ring rounded-md px-2 py-1 ${
                isHistory
                  ? 'text-accent font-semibold bg-accent-light/40'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              History
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-border">
                <div className="flex items-center gap-1 bg-surface-muted px-2 py-1 rounded-full text-xs font-medium text-ink">
                  <UserIcon className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="max-w-[70px] sm:max-w-[110px] truncate">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="text-ink-secondary hover:text-red-600 transition-colors p-1.5 rounded-lg focus-ring shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 pl-1.5 sm:pl-2 border-l border-border">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-ink-secondary hover:text-ink transition-colors px-2 py-1 rounded-lg focus-ring text-xs sm:text-sm"
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 bg-accent hover:bg-accent-hover text-surface-raised transition-colors px-2.5 py-1 rounded-lg focus-ring text-xs sm:text-sm font-medium shadow-soft shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xs:inline">Register</span>
                  <span className="xs:hidden">+</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
