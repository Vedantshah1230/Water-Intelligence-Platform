import { useState, useEffect, useCallback } from 'react';

export function useLivePolling<T>(fetchFn: () => Promise<T>, intervalMs: number = 5000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Polling error:', err);
      setError(err.message || 'Failed to fetch live data');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refresh();
    const timer = setInterval(() => {
      refresh();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [refresh, intervalMs]);

  return { data, loading, error, lastUpdated, refresh };
}
