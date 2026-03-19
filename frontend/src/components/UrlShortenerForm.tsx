import { useState, useRef, FormEvent } from 'react';
import { Link2, Loader2, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useShorten } from '../hooks/useShorten';
import ResultCard from './ResultCard';

export default function UrlShortenerForm({
  onNewUrl,
}: {
  onNewUrl?: () => void;
}) {
  const [inputUrl, setInputUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { loading, result, error, shorten, reset } = useShorten();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!inputUrl.trim()) {
      toast.error('Please enter a URL first');
      inputRef.current?.focus();
      return;
    }

    const data = await shorten(inputUrl.trim());
    if (data) {
      toast.success('Link shortened!');
      setInputUrl('');
      onNewUrl?.();
    }
  }

  function handleReset() {
    reset();
    setInputUrl('');
    inputRef.current?.focus();
  }

  return (
    <div className="w-full space-y-4">
      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={clsx(
            'flex items-center gap-0 rounded-2xl border transition-all duration-300',
            'bg-ink-900/80 backdrop-blur-sm overflow-hidden',
            loading
              ? 'border-acid/30 shadow-[0_0_30px_rgba(180,255,78,0.08)]'
              : 'border-ink-700/60 hover:border-ink-600 focus-within:border-acid/50 focus-within:shadow-[0_0_30px_rgba(180,255,78,0.1)]',
          )}
        >
          {/* Icon */}
          <div className="pl-4 pr-2 text-ink-500 shrink-0">
            <Link2 size={18} />
          </div>

          {/* URL input */}
          <input
            ref={inputRef}
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste your long URL here…"
            disabled={loading}
            className={clsx(
              'flex-1 bg-transparent py-4 pr-2 text-sm font-mono text-ink-100',
              'placeholder-ink-600 focus:outline-none disabled:opacity-50',
            )}
            aria-label="Long URL"
            autoComplete="off"
            spellCheck={false}
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !inputUrl.trim()}
            className={clsx(
              'm-1.5 shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl',
              'font-display font-semibold text-sm transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-acid/40',
              loading || !inputUrl.trim()
                ? 'bg-ink-700 text-ink-500 cursor-not-allowed'
                : 'bg-acid text-ink-950 hover:bg-acid-light active:scale-95 glow-acid',
            )}
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Shortening…</span>
              </>
            ) : (
              <>
                <span>Shorten</span>
                <ChevronRight size={15} />
              </>
            )}
          </button>
        </div>

        {/* Inline error */}
        {error && (
          <p className="mt-2 text-xs text-coral font-body pl-1 animate-fade-in">
            {error}
          </p>
        )}
      </form>

      {/* Result */}
      {result && (
        <div className="animate-slide-up">
          <ResultCard result={result} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
