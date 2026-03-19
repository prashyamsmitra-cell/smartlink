import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: 'acid' | 'sky' | 'coral';
  className?: string;
}

const accents = {
  acid:  'text-acid border-acid/20 bg-acid/5',
  sky:   'text-sky  border-sky/20  bg-sky/5',
  coral: 'text-coral border-coral/20 bg-coral/5',
};

export default function StatsCard({
  icon: Icon,
  label,
  value,
  accent = 'acid',
  className,
}: StatsCardProps) {
  return (
    <div className={clsx('card p-5 flex items-start gap-4', className)}>
      <div className={clsx('p-2.5 rounded-xl border', accents[accent])}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-ink-500 font-body mb-1">{label}</p>
        <p className="font-display font-bold text-xl text-ink-100 leading-none">{value}</p>
      </div>
    </div>
  );
}
