import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Clock,
  CheckSquare,
  ChevronRight,
  ListTodo
} from 'lucide-react';
import Logo from '../components/Logo';
import { fetchSamples, fetchSampleText, analyzeNotice } from '../services/api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [samples, setSamples] = useState([]);
  const [loadingSampleId, setLoadingSampleId] = useState(null);

  useEffect(() => {
    fetchSamples()
      .then(setSamples)
      .catch(() => {});
  }, []);

  const handleTrySample = async (sampleId) => {
    setLoadingSampleId(sampleId);
    try {
      const sample = await fetchSampleText(sampleId);
      const result = await analyzeNotice(sample.text, sampleId);
      navigate('/results', { state: { result } });
    } catch {
      // If direct analysis fails, navigate to analyzer page with sample preloaded
      navigate('/analyze', { state: { sampleId } });
    } finally {
      setLoadingSampleId(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent text-xs sm:text-sm font-medium mb-6 border border-accent/20">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Notice Extraction & Action Planning</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink tracking-tight leading-[1.15] max-w-3xl mx-auto">
            Turn confusing official notices into <span className="text-accent italic font-normal">clear next steps.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 sm:mt-6 text-ink-secondary text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Don&apos;t get buried in bureaucratic jargon. Extract deadlines, verify eligibility conditions, and generate an executable checklist in seconds.
          </p>

          {/* Primary Call to Actions */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-surface-raised font-medium px-6 py-3.5 rounded-lg transition-colors shadow-card text-base focus-ring"
            >
              <span>Analyze Your Notice</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-raised hover:bg-surface-muted text-ink font-medium px-6 py-3.5 rounded-lg border border-border transition-colors text-base focus-ring"
            >
              <span>How It Works</span>
            </a>
          </div>
        </motion.div>

        {/* Visual Product Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 text-left"
        >
          <div className="bg-surface-raised rounded-2xl border border-border shadow-card overflow-hidden p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Logo className="w-6 h-6" />
                <span className="font-display font-semibold text-ink text-base">Sample Breakdown</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-accent bg-accent-light px-2.5 py-1 rounded-full">
                <Zap className="w-3.5 h-3.5" /> Structured Analysis
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Summary Preview */}
              <div className="bg-surface-muted/60 p-4 rounded-xl border border-border/80">
                <div className="flex items-center gap-2 text-ink font-medium text-sm mb-2">
                  <FileText className="w-4 h-4 text-accent" />
                  <span>Plain Language Summary</span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Annual property tax assessment updated. Payment of $3,250 is due by Oct 1, 2026. Appeals must be filed by Sep 15.
                </p>
              </div>

              {/* Deadlines Preview */}
              <div className="bg-surface-muted/60 p-4 rounded-xl border border-border/80">
                <div className="flex items-center gap-2 text-ink font-medium text-sm mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Extracted Deadlines</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs bg-surface-raised p-2 rounded border border-border">
                    <span className="font-semibold text-amber-700">Sep 15, 2026</span>
                    <span className="text-ink-secondary text-[11px]">File Appeal</span>
                  </div>
                  <div className="flex justify-between items-center text-xs bg-surface-raised p-2 rounded border border-border">
                    <span className="font-semibold text-ink">Oct 01, 2026</span>
                    <span className="text-ink-secondary text-[11px]">Tax Due</span>
                  </div>
                </div>
              </div>

              {/* Checklist Preview */}
              <div className="bg-surface-muted/60 p-4 rounded-xl border border-border/80">
                <div className="flex items-center gap-2 text-ink font-medium text-sm mb-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>Action Items</span>
                </div>
                <ul className="space-y-1.5 text-xs text-ink-secondary">
                  <li className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="line-through opacity-75">Review assessment notice</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded border border-ink-muted shrink-0"></div>
                    <span>Submit Form PT-400 for appeal</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded border border-ink-muted shrink-0"></div>
                    <span>Pay tax due via online portal</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="border-t border-border bg-surface-raised py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
              Designed for transparency and quick action
            </h2>
            <p className="mt-2 text-ink-secondary text-sm sm:text-base">
              Get exactly what you need from official correspondence without reading pages of legalese.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-surface border border-border hover:border-border-strong transition-all shadow-soft">
              <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center text-accent mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-ink text-base mb-2">Explicit Deadlines</h3>
              <p className="text-ink-secondary text-sm leading-relaxed">
                Automatically extracts hard dates and submission deadlines so you never miss an important due date.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-surface border border-border hover:border-border-strong transition-all shadow-soft">
              <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center text-accent mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-ink text-base mb-2">Eligibility Verification</h3>
              <p className="text-ink-secondary text-sm leading-relaxed">
                Highlights required criteria and prerequisites explicitly stated in the document before you spend time applying.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-surface border border-border hover:border-border-strong transition-all shadow-soft">
              <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center text-accent mb-4">
                <ListTodo className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-ink text-base mb-2">Interactive To-Do List</h3>
              <p className="text-ink-secondary text-sm leading-relaxed">
                Converts requirements into action items you can check off with automatic persistent progress tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Simple 3-Step Process</span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink tracking-tight mt-1">
            How Notice2Action Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-surface-raised p-6 rounded-xl border border-border relative">
            <div className="w-8 h-8 rounded-full bg-accent text-surface-raised flex items-center justify-center font-bold text-sm mb-4">
              1
            </div>
            <h3 className="font-semibold text-ink text-base mb-2">Upload or Paste</h3>
            <p className="text-ink-secondary text-sm leading-relaxed">
              Paste the text of your notice or drag and drop any text-based PDF or TXT file.
            </p>
          </div>

          <div className="bg-surface-raised p-6 rounded-xl border border-border relative">
            <div className="w-8 h-8 rounded-full bg-accent text-surface-raised flex items-center justify-center font-bold text-sm mb-4">
              2
            </div>
            <h3 className="font-semibold text-ink text-base mb-2">AI Extraction</h3>
            <p className="text-ink-secondary text-sm leading-relaxed">
              Our structured extraction isolates dates, requirements, and key takeaways cleanly.
            </p>
          </div>

          <div className="bg-surface-raised p-6 rounded-xl border border-border relative">
            <div className="w-8 h-8 rounded-full bg-accent text-surface-raised flex items-center justify-center font-bold text-sm mb-4">
              3
            </div>
            <h3 className="font-semibold text-ink text-base mb-2">Take Action</h3>
            <p className="text-ink-secondary text-sm leading-relaxed">
              Use your personalized checklist to complete tasks step-by-step with zero guesswork.
            </p>
          </div>
        </div>
      </section>

      {/* Try Demo Samples Section */}
      {samples.length > 0 && (
        <section className="bg-surface-muted/60 py-14 border-t border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">Try with a sample notice</h3>
                <p className="text-ink-secondary text-sm mt-0.5">Test real-world examples in 1 click.</p>
              </div>
              <Link
                to="/analyze"
                className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
              >
                <span>Or input your own notice</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleTrySample(sample.id)}
                  disabled={loadingSampleId === sample.id}
                  className="text-left bg-surface-raised hover:bg-surface-muted p-5 rounded-xl border border-border transition-all flex items-center justify-between group focus-ring"
                >
                  <div>
                    <h4 className="font-medium text-ink text-sm group-hover:text-accent transition-colors">
                      {sample.title}
                    </h4>
                    <p className="text-ink-muted text-xs mt-1">{sample.category}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent-light text-accent flex items-center justify-center shrink-0 ml-3">
                    {loadingSampleId === sample.id ? (
                      <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
                    ) : (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div className="bg-surface-raised rounded-2xl p-8 sm:p-12 border border-border shadow-card relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
              Ready to parse your notice?
            </h2>
            <p className="mt-3 text-ink-secondary text-sm sm:text-base">
              Instant plain-language summaries, hard deadlines, and step-by-step checklists.
            </p>
            <div className="mt-8">
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-surface-raised font-medium px-7 py-3.5 rounded-lg transition-colors shadow-card text-base focus-ring"
              >
                <span>Start Analyzing Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-raised py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5" />
            <span className="font-display font-medium text-ink">Notice2Action</span>
          </div>
          <p>© {new Date().getFullYear()} Notice2Action. Always verify deadlines with original official documents.</p>
        </div>
      </footer>
    </div>
  );
}
