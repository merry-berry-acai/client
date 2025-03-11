import { useState, useCallback } from 'react';
import { apiHandler } from '../api/apiClient';

const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (options) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiHandler(options);
        setData(result);
        return result; // Return result for immediate use if needed
      } catch (err) {
        setError(err);
        setData(null); // Clear data on error
        throw err; // Re-throw error for component-level handling
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, request };
};

export default useApi;
