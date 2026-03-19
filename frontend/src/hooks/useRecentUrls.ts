import { useState, useEffect, useCallback } from 'react';
import { getRecentUrls, ShortenedUrl } from '../utils/api';

export function useRecentUrls() {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecentUrls(10);
      setUrls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recent links');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  return { urls, loading, error, refresh: fetchUrls };
}
