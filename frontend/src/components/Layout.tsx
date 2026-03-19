import { Link, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-ink-800/60 bg-ink-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <span className="w-8 h-8 rounded-lg bg-acid flex items-center justify-center
                             group-hover:scale-110 transition-transform duration-200">
              <Zap size={16} className="text-ink-950" fill="currentColor" />
            </span>
            <span className="font-display font-bold text-lg tracking-tight text-ink-100">
              Smart<span className="text-acid">Link</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            <NavLink to="/" active={pathname === '/'}>Home</NavLink>
            <a
              href="https://github.com/yourusername/smartlink"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm py-1.5 px-3"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-ink-800/40 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center
                        justify-between gap-2 text-ink-500 text-xs font-body">
          <span>© {new Date().getFullYear()} SmartLink. Built for portfolio.</span>
          <span className="flex items-center gap-1">
            Powered by
            <span className="text-acid font-mono ml-1">Node.js · PostgreSQL · Redis</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={clsx(
        'px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-colors duration-150',
        active
          ? 'bg-acid/10 text-acid'
          : 'text-ink-400 hover:text-ink-100 hover:bg-ink-800/60',
      )}
    >
      {children}
    </Link>
  );
}
