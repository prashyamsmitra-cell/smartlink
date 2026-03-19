import { Link } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-32 text-center space-y-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-ink-800 border border-ink-700 flex items-center
                      justify-center mx-auto">
        <Frown size={28} className="text-ink-500" />
      </div>

      <div className="space-y-2">
        <h1 className="font-display font-bold text-4xl text-ink-100">404</h1>
        <p className="text-ink-500 font-body text-sm">
          This page doesn't exist — or the short link has expired.
        </p>
      </div>

      <Link
        to="/"
        className="btn-primary inline-flex items-center gap-2 text-sm"
      >
        <Home size={15} />
        Back to Home
      </Link>
    </div>
  );
}
