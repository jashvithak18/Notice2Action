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

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="flex items-center gap-1.5 bg-surface-muted px-2.5 py-1 rounded-full text-xs font-medium text-ink">
                  <UserIcon className="w-3.5 h-3.5 text-accent" />
                  <span className="max-w-[100px] truncate">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="text-ink-secondary hover:text-red-600 transition-colors p-1.5 rounded-lg focus-ring"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <button
                  onClick={() => openAuthModal('login')}
                  className="inline-flex items-center gap-1 text-ink-secondary hover:text-ink transition-colors px-2.5 py-1 rounded-lg focus-ring text-xs sm:text-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="inline-flex items-center gap-1 bg-accent hover:bg-accent-hover text-surface-raised transition-colors px-3 py-1 rounded-lg focus-ring text-xs sm:text-sm font-medium shadow-soft"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
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
