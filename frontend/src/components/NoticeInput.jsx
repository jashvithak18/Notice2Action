import { useRef, useState, useCallback } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadFile } from '../services/api';

const ACCEPTED_TYPES = '.txt,.pdf';
const MIN_LENGTH = 50;

export default function NoticeInput({
  text,
  onTextChange,
  onAnalyze,
  isLoading,
  fileName,
  onFileNameChange,
  samples,
  onLoadSample,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const charCount = text.length;
  const canAnalyze = text.trim().length >= MIN_LENGTH && !isLoading && !isUploading;

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      setUploadError('');
      setIsUploading(true);

      try {
        const result = await uploadFile(file);
        onTextChange(result.text);
        onFileNameChange(result.fileName);
      } catch (err) {
        setUploadError(err.message);
        onFileNameChange('');
      } finally {
        setIsUploading(false);
      }
    },
    [onTextChange, onFileNameChange]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClear = () => {
    onTextChange('');
    onFileNameChange('');
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative rounded-xl border transition-colors ${
          isDragging
            ? 'border-accent bg-accent-light/50'
            : 'border-border-strong bg-surface-raised'
        }`}
      >
        <textarea
          value={text}
          onChange={(e) => {
            onTextChange(e.target.value);
            if (fileName) onFileNameChange('');
          }}
          placeholder="Paste your notice here…"
          rows={12}
          disabled={isLoading || isUploading}
          aria-label="Notice text"
          className="w-full px-4 sm:px-5 py-4 bg-transparent text-ink placeholder:text-ink-muted resize-y min-h-[240px] text-[15px] leading-relaxed focus:outline-none rounded-xl disabled:opacity-60"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 pb-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            {fileName ? (
              <span className="flex items-center gap-1.5 text-ink-secondary">
                <FileText className="w-3.5 h-3.5" aria-hidden />
                {fileName}
              </span>
            ) : (
              <span>{charCount.toLocaleString()} characters</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {text && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading || isUploading}
                className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors focus-ring rounded px-2 py-1 disabled:opacity-50"
                aria-label="Clear notice text"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              className="sr-only"
              id="file-upload"
              onChange={(e) => handleFile(e.target.files?.[0])}
              disabled={isLoading || isUploading}
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:border-border-strong hover:bg-surface-muted transition-colors cursor-pointer focus-ring ${
                isLoading || isUploading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <Upload className="w-3.5 h-3.5" aria-hidden />
              Upload
            </label>
          </div>
        </div>
      </div>

      <p className="text-xs text-ink-muted">
        Supports .txt and text-based .pdf files. Scanned or image PDFs aren&apos;t
        supported yet.
      </p>

      {uploadError && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">
          {uploadError}
        </p>
      )}

      {samples?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted">Try a sample:</span>
          {samples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onLoadSample(sample.id)}
              disabled={isLoading || isUploading}
              className="text-xs font-medium text-accent hover:text-accent-hover border border-accent/20 hover:border-accent/40 bg-accent-light/30 hover:bg-accent-light/60 px-3 py-1.5 rounded-full transition-colors focus-ring disabled:opacity-50"
            >
              {sample.label}
            </button>
          ))}
        </div>
      )}

      <motion.button
        type="button"
        onClick={onAnalyze}
        disabled={!canAnalyze}
        whileTap={{ scale: canAnalyze ? 0.98 : 1 }}
        className="w-full sm:w-auto px-8 py-3 bg-accent hover:bg-accent-hover disabled:bg-border-strong disabled:text-ink-muted text-white font-medium text-sm rounded-lg transition-colors focus-ring disabled:cursor-not-allowed"
        aria-label="Analyze notice"
      >
        {isLoading ? 'Analyzing…' : isUploading ? 'Uploading…' : 'Analyze Notice'}
      </motion.button>

      {text.trim().length > 0 && text.trim().length < MIN_LENGTH && (
        <p className="text-xs text-ink-muted">
          Add a bit more text — we need at least {MIN_LENGTH} characters to analyze.
        </p>
      )}
    </div>
  );
}
