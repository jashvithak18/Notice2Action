import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function LoginPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Extract pending notice state from redirection
  const pendingNoticeText = location.state?.noticeText || '';
  const pendingSampleId = location.state?.sampleId || '';
  const returnTo = location.state?.from || '/analyze';

  useEffect(() => {
    // If already authenticated, redirect back to returnTo or /analyze
    if (isAuthenticated) {
      navigate(returnTo, {
        replace: true,
        state: pendingNoticeText ? { noticeText: pendingNoticeText, sampleId: pendingSampleId, autoAnalyze: true } : undefined,
      });
    }
  }, [isAuthenticated, navigate, returnTo, pendingNoticeText, pendingSampleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        if (!loginInput || !password) {
          throw new Error('Please enter your email/username and password.');
        }
        await login(loginInput, password);
      } else {
        if (!username || !email || !password) {
          throw new Error('Please fill in all fields.');
        }
        if (username.length < 3) {
          throw new Error('Username must be at least 3 characters.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await register(username, email, password);
      }

      // Redirect back after successful authentication
      navigate(returnTo, {
        replace: true,
        state: pendingNoticeText ? { noticeText: pendingNoticeText, sampleId: pendingSampleId, autoAnalyze: true } : undefined,
      });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-surface-raised rounded-2xl border border-border shadow-card p-6 sm:p-8"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex justify-center mb-3 group focus-ring rounded-lg p-1">
            <Logo className="w-10 h-10 group-hover:scale-105 transition-transform" />
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create your Account'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            {mode === 'login'
              ? 'Sign in to analyze notices and view your saved history'
              : 'Join Notice2Action to analyze notices and track deadlines'}
          </p>
        </div>

        {/* Notice Pending Banner */}
        {pendingNoticeText && (
          <div className="mb-4 flex items-center gap-2 text-xs text-accent bg-accent-light border border-accent/30 rounded-xl p-3">
            <Info className="w-4 h-4 shrink-0 text-accent" />
            <span className="font-medium">
              🔒 Sign in required to analyze your notice. Your notice text has been saved and will analyze immediately after login.
            </span>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="flex bg-surface-muted p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-surface-raised text-ink shadow-soft'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-surface-raised text-ink shadow-soft'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200/80 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus-ring"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Email or username"
                  className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus-ring"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus-ring"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-surface-raised font-medium py-3 rounded-xl transition-colors shadow-soft text-sm focus-ring disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-ink-secondary">
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-accent font-semibold hover:underline"
              >
                Create one now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-accent font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </main>
  );
}
