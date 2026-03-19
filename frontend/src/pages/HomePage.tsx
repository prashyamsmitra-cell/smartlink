import { useRef } from 'react';
import { ArrowRight, Zap, Shield, BarChart2 } from 'lucide-react';
import UrlShortenerForm from '../components/UrlShortenerForm';
import RecentLinksTable from '../components/RecentLinksTable';

const FEATURES = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Redis-cached redirects serve your links in milliseconds.',
  },
  {
    icon: BarChart2,
    title: 'Click Analytics',
    desc: 'Track every click with a real-time analytics dashboard.',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    desc: 'SSRF protection, rate limiting, and helmet security headers.',
  },
];

export default function HomePage() {
  const recentRef = useRef<{ refresh: () => void }>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="text-center space-y-6 animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                        border border-acid/20 bg-acid/5 text-acid text-xs font-mono
                        tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse-slow" />
          Production-ready URL shortener
        </div>

        {/* Heading */}
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl leading-tight
                       text-ink-50 tracking-tight">
          Shorten. Share.{' '}
          <span className="text-gradient">Track.</span>
        </h1>

        {/* Sub-heading */}
        <p className="text-ink-400 font-body text-lg max-w-xl mx-auto leading-relaxed">
          Transform long URLs into clean smart links — with click analytics,
          Redis caching, and a full REST API powering every redirect.
        </p>

        {/* Scroll hint */}
        <div className="flex items-center justify-center gap-1.5 text-ink-600 text-xs font-body">
          <span>Paste your URL below</span>
          <ArrowRight size={12} className="rotate-90" />
        </div>
      </section>

      {/* ── Shortener form ───────────────────────────────────────────── */}
      <section className="animate-slide-up delay-200">
        <UrlShortenerForm onNewUrl={() => recentRef.current?.refresh()} />
      </section>

      {/* ── Feature pills ────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in delay-300">
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            className="card p-5 hover:border-ink-600/60 hover:shadow-lg
                       hover:-translate-y-0.5 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${300 + i * 80}ms`, animationFillMode: 'both' }}
          >
            <div className="w-9 h-9 rounded-xl bg-acid/10 border border-acid/20
                            flex items-center justify-center mb-3">
              <Icon size={17} className="text-acid" />
            </div>
            <h3 className="font-display font-semibold text-sm text-ink-100 mb-1">
              {title}
            </h3>
            <p className="text-xs text-ink-500 font-body leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* ── Recent links ─────────────────────────────────────────────── */}
      <section className="animate-fade-in delay-400 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <h2 className="font-display font-semibold text-ink-200 text-base">
            Recent Links
          </h2>
          <span className="flex-1 h-px bg-ink-800/60" />
        </div>
        <RecentLinksTable ref={recentRef} />
      </section>

    </div>
  );
}
