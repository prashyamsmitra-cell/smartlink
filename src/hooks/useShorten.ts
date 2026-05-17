import { useState } from 'react';
import { shortenUrl, ShortenedUrl } from '../utils/api';

interface UseShortenState {
  loading: boolean;
  result: ShortenedUrl | null;
  error: string | null;
}

export function useShorten() {
  const [state, setState] = useState<UseShortenState>({
    loading: false,
    result: null,
    error: null,
  });

  async function shorten(url: string) {
    setState({ loading: true, result: null, error: null });
    try {
      const data = await shortenUrl(url);
      setState({ loading: false, result: data, error: null });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to shorten URL';
      setState({ loading: false, result: null, error: message });
      return null;
    }
  }

  function reset() {
    setState({ loading: false, result: null, error: null });
  }

  return { ...state, shorten, reset };
}
