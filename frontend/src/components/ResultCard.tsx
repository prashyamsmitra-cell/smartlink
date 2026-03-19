import { useState } from 'react';
import { Copy, Check, BarChart2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { ShortenedUrl } from '../utils/api';
import { copyToClipboard, truncateUrl, stripProtocol } from '../utils/helpers';

interface ResultCardProps {
  result: ShortenedUrl;
  onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(result.shortUrl);
    if (ok) {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast.error('Failed to copy');
    }
  }

  return (
    <div className="card p-5 space-y-4 border-acid/20 glow-acid">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Animated check circle */}
          <span className="w-7 h-7 rounded-full bg-acid/15 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#b4ff4e" strokeWidth="2.5">
              <polyline
                points="4 12 9 17 20 7"
                strokeDasharray="100"
                strokeDashoffset="0"
                className="animate-check-draw"
              />
            </svg>
          </span>
          <span className="text-xs font-mono text-acid uppercase tracking-widest">Link created</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-ink-500 hover:text-ink-300 transition-colors font-body"
        >
          + New link
        </button>
      </div>

      {/* Short URL display */}
      <div className="bg-ink-950 rounded-xl border border-ink-700/60 px-4 py-3
                      flex items-center justify-between gap-3">
        <a
          href={result.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-acid hover:text-acid-light transition-colors
                     flex items-center gap-1.5 min-w-0"
        >
          <span className="truncate">{stripProtocol(result.shortUrl)}</span>
          <ExternalLink size={12} className="shrink-0 opacity-60" />
        </a>

        <button
          onClick={handleCopy}
          className={clsx(
            'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body',
            'transition-all duration-200 active:scale-95',
            copied
              ? 'bg-acid/15 text-acid border border-acid/30'
              : 'bg-ink-800 text-ink-300 border border-ink-700 hover:bg-ink-700 hover:text-ink-100',
          )}
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Original URL */}
      <p className="text-xs text-ink-500 font-body truncate">
        <span className="text-ink-600 mr-1">from</span>
        {truncateUrl(result.longUrl, 70)}
      </p>

      {/* Analytics link */}
      <Link
        to={`/analytics/${result.shortCode}`}
        className="flex items-center gap-2 text-xs text-ink-400 hover:text-sky
                   transition-colors font-body group"
      >
        <BarChart2 size={13} className="group-hover:text-sky transition-colors" />
        <span>View analytics dashboard</span>
      </Link>
    </div>
  );
}
