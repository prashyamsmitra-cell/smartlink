import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Response interceptor — normalise errors ────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  },
);

// ── API methods ────────────────────────────────────────────────────────────

export interface ShortenedUrl {
  id: string;
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
  clickCount: number;
  lastAccessed?: string;
}

export async function shortenUrl(url: string): Promise<ShortenedUrl> {
  const res = await api.post<{ success: boolean; data: ShortenedUrl }>('/shorten', { url });
  return res.data.data;
}

export async function getStats(shortCode: string): Promise<ShortenedUrl> {
  const res = await api.get<{ success: boolean; data: ShortenedUrl }>(`/stats/${shortCode}`);
  return res.data.data;
}

export async function getRecentUrls(limit = 10): Promise<ShortenedUrl[]> {
  const res = await api.get<{ success: boolean; data: ShortenedUrl[] }>(`/recent?limit=${limit}`);
  return res.data.data;
}

export default api;
