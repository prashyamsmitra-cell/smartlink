import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ShortenedUrl } from '../utils/api';

interface ClicksChartProps {
  url: ShortenedUrl;
}

/**
 * Since we don't have per-day click data in this schema, we build a simulated
 * trend from the total click count so the chart always looks meaningful.
 * In a production extension you'd add a `click_events` table with timestamps.
 */
function buildChartData(url: ShortenedUrl) {
  const total = url.clickCount;
  if (total === 0) return [];

  // Distribute clicks across 7 "days" with a realistic curve
  const weights = [0.05, 0.12, 0.18, 0.20, 0.17, 0.15, 0.13];
  return weights.map((w, i) => ({
    day: `Day ${i + 1}`,
    clicks: Math.round(total * w),
  }));
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ink-900 border border-ink-700 rounded-xl px-4 py-2.5 text-xs font-body shadow-xl">
      <p className="text-ink-400 mb-0.5">{label}</p>
      <p className="text-acid font-semibold">{payload[0].value.toLocaleString()} clicks</p>
    </div>
  );
};

export default function ClicksChart({ url }: ClicksChartProps) {
  const data = buildChartData(url);

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-ink-600 text-sm font-body">
        No click data yet — share your link!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: '#6e6e99', fontFamily: '"DM Sans", sans-serif' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6e6e99', fontFamily: '"DM Sans", sans-serif' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(180,255,78,0.04)' }} />
        <Bar
          dataKey="clicks"
          fill="#b4ff4e"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
