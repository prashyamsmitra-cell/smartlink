import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MousePointerClick,
  CalendarDays,
  Clock,
  ExternalLink,
  ArrowLeft,
  Copy,
  Check,
} from 'lucide-react';
import { getStats, ShortenedUrl } from '../utils/api';
import {
  formatDate,
  relativeTime,
  truncateUrl,
  stripProtocol,
  copyToClipboard,
} from '../utils/helpers';
import StatsCard from '../components/StatsCard';
import ClicksChart from '../components/ClicksChart';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [url, setUrl] = useState<ShortenedUrl | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!shortCode) return;
    setLoading(true);
    getStats(shortCode)
      .then(setUrl)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, [shortCode]);

  async function handleCopy() {
    if (!url) return;
    const ok = await copyToClipboard(url.shortUrl);
    if (ok) {
      setCopied(true);
      toast.success('Copied!');
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">

      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs text-ink-500 hover:text-ink-300
                   transition-colors font-body group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="card p-10 text-center space-y-3">
          <p className="text-coral font-body text-sm">{error}</p>
          <Link to="/" className="btn-ghost text-xs inline-flex">
            Go back home
          </Link>
        </div>
      )}

      {/* Analytics */}
      {!loading && url && (
        <div className="space-y-6 animate-fade-in">

          {/* Page header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-2xl text-ink-50">
                Analytics
              </h1>
              <span className="tag font-mono">{url.shortCode}</span>
            </div>
            <p className="text-ink-500 text-sm font-body truncate">
              {truncateUrl(url.longUrl, 80)}
            </p>
          </div>

          {/* Short URL bar */}
          <div className="card px-4 py-3 flex items-center justify-between gap-4">
            <a
              href={url.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-acid font-mono text-sm
                         hover:text-acid-light transition-colors min-w-0"
            >
              <span className="truncate">{stripProtocol(url.shortUrl)}</span>
              <ExternalLink size={12} className="shrink-0 opacity-60" />
            </a>
            <button
              onClick={handleCopy}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         text-xs font-body transition-all duration-200 active:scale-95
                         ${copied
                           ? 'bg-acid/15 text-acid border border-acid/30'
                           : 'bg-ink-800 text-ink-300 border border-ink-700 hover:bg-ink-700'
                         }`}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              icon={MousePointerClick}
              label="Total Clicks"
              value={url.clickCount.toLocaleString()}
              accent="acid"
              className="animate-slide-up delay-100"
            />
            <StatsCard
              icon={CalendarDays}
              label="Created"
              value={formatDate(url.createdAt)}
              accent="sky"
              className="animate-slide-up delay-200"
            />
            <StatsCard
              icon={Clock}
              label="Last Accessed"
              value={url.lastAccessed ? relativeTime(url.lastAccessed) : 'Never'}
              accent="coral"
              className="animate-slide-up delay-300"
            />
          </div>

          {/* Chart */}
          <div className="card p-6 space-y-4 animate-slide-up delay-400">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-sm text-ink-200">
                Click Distribution
              </h2>
              <span className="text-xs text-ink-600 font-body">Last 7 days (estimated)</span>
            </div>
            <ClicksChart url={url} />
          </div>

          {/* Original URL card */}
          <div className="card p-5 space-y-2 animate-fade-in delay-500">
            <p className="text-xs text-ink-500 font-body uppercase tracking-widest">
              Original URL
            </p>
            <a
              href={url.longUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-300 hover:text-ink-100 transition-colors
                         font-mono break-all flex items-start gap-2 group"
            >
              <span>{url.longUrl}</span>
              <ExternalLink
                size={12}
                className="shrink-0 mt-0.5 opacity-40 group-hover:opacity-80 transition-opacity"
              />
            </a>
          </div>

        </div>
      )}
    </div>
  );
}
