import { useState, useEffect } from 'react';

/**
 * Custom hook for data that needs to be refreshed periodically
 * @param fetchFunction The async function to fetch the data
 * @param interval The refresh interval in milliseconds
 * @returns An object with data, loading state, error, and a function to manually refresh
 */
export function useRefreshData<T>(
  fetchFunction: () => Promise<T>,
  interval: number = 60000
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchFunction();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    const intervalId = setInterval(fetchData, interval);
    
    return () => clearInterval(intervalId);
  }, [interval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}