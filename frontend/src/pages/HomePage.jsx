import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import NoticeInput from '../components/NoticeInput';
import LoadingStages from '../components/LoadingStages';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { analyzeNotice, fetchSamples, fetchSampleText } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [samples, setSamples] = useState([]);
  const [activeSampleId, setActiveSampleId] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    fetchSamples()
      .then((data) => {
        setSamples(data);
        if (location.state?.sampleId) {
          handleLoadSample(location.state.sampleId);
        }
      })
      .catch(() => {
        /* samples optional if backend down */
      });
  }, [location.state?.sampleId]);

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 50) {
      setError('Please paste or upload a notice before analyzing.');
      return;
    }

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await analyzeNotice(text, activeSampleId || undefined);
      navigate('/results', { state: { result } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async (id) => {
    setError('');
    try {
      const sample = await fetchSampleText(id);
      setText(sample.text);
      setActiveSampleId(id);
      setFileName('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <header className="mb-10 sm:mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight leading-tight">
            Turn confusing notices into clear next steps.
          </h1>
          <p className="mt-3 text-ink-secondary text-base sm:text-lg leading-relaxed max-w-xl">
            Paste or upload an official notice — we&apos;ll extract deadlines,
            eligibility, and a checklist of what you need to do.
          </p>
        </header>

        {isLoading ? (
          <LoadingStages />
        ) : (
          <>
            <NoticeInput
              text={text}
              onTextChange={(value) => {
                setText(value);
                setActiveSampleId('');
              }}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              fileName={fileName}
              onFileNameChange={setFileName}
              samples={samples}
              onLoadSample={handleLoadSample}
              isAuthenticated={isAuthenticated}
              onRequireAuth={() => setAuthModalOpen(true)}
            />

            {error && (
              <p
                className="mt-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
                role="alert"
              >
                {error}
              </p>
            )}
          </>
        )}
      </motion.div>

      {/* Auth Modal Triggered when Unauthenticated user attempts analysis */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
        message="Please sign in or create an account to analyze notices."
      />
    </main>
  );
}
