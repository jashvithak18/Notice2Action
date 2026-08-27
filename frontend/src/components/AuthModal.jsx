import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  
  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loginInput, setLoginInput] = useState(''); // email or username for login
  const [password, setPassword] = useState('');
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
      onClose();
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-surface-raised rounded-2xl border border-border shadow-card overflow-hidden z-10 p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-ink-muted hover:text-ink transition-colors p-1 rounded-md focus-ring"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Logo className="w-9 h-9" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-ink tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create your Account'}
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              {mode === 'login'
                ? 'Sign in to access your saved notice history'
                : 'Join Notice2Action to automatically track your notices'}
            </p>
          </div>

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
                {/* Username Input */}
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

                {/* Email Input */}
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
              /* Login Input (Email or Username) */
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

            {/* Password Input */}
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

            {/* Submit Button */}
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

          {/* Footer switch prompt */}
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
      </div>
    </AnimatePresence>
  );
}
