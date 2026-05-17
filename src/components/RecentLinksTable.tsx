import { RefreshCw, ExternalLink, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { forwardRef, useImperativeHandle } from 'react';
import { useRecentUrls } from '../hooks/useRecentUrls';
import { truncateUrl, relativeTime, stripProtocol } from '../utils/helpers';
import Spinner from './Spinner';

export interface RecentLinksTableHandle {
  refresh: () => void;
}

const RecentLinksTable = forwardRef<RecentLinksTableHandle>((_props, ref) => {
  const { urls, loading, error, refresh } = useRecentUrls();

  useImperativeHandle(ref, () => ({ refresh }));

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-ink-800/60 flex items-center justify-between">
        <h2 className="font-display font-semibold text-sm text-ink-200 tracking-wide">
          Recent Links
        </h2>
        <button
          onClick={refresh}
          disabled={loading}
          className="text-ink-500 hover:text-ink-300 transition-colors disabled:opacity-50"
          aria-label="Refresh"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin-slow' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-14">
          <Spinner />
        </div>
      ) : error ? (
        <div className="py-10 text-center text-xs text-coral font-body">{error}</div>
      ) : urls.length === 0 ? (
        <div className="py-12 text-center text-ink-600 text-sm font-body">
          No links yet. Shorten something above!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b border-ink-800/40">
                <th className="text-left px-5 py-3 text-ink-500 font-medium">Original URL</th>
                <th className="text-left px-4 py-3 text-ink-500 font-medium">Short Link</th>
                <th className="text-right px-4 py-3 text-ink-500 font-medium">Clicks</th>
                <th className="text-right px-4 py-3 text-ink-500 font-medium">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url, i) => (
                <tr
                  key={url.id}
                  className="border-b border-ink-800/30 hover:bg-ink-800/20 transition-colors animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
                >
                  <td className="px-5 py-3.5 max-w-[260px]">
                    <a
                      href={url.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-400 hover:text-ink-200 transition-colors truncate flex items-center gap-1 max-w-full"
                    >
                      <span className="truncate">{truncateUrl(url.longUrl, 45)}</span>
                      <ExternalLink size={10} className="shrink-0 opacity-50" />
                    </a>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-acid text-xs">{stripProtocol(url.shortUrl)}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="tag">{url.clickCount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-ink-500">
                    {relativeTime(url.createdAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/analytics/${url.shortCode}`}
                      className="text-ink-600 hover:text-sky transition-colors"
                      title="View analytics"
                    >
                      <BarChart2 size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

RecentLinksTable.displayName = 'RecentLinksTable';
export default RecentLinksTable;
