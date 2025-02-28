import { useState, useEffect } from 'react';
import axios from 'axios';

const useApiStatus = (pollingInterval = 30000) => {
  const [status, setStatus] = useState({
    isUp: null,
    responseTime: null,
    lastChecked: null,
    error: null,
    history: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkApiStatus = async () => {
    const startTime = Date.now();
    setIsLoading(true);
    
    try {
      // Replace with your actual health endpoint
      const response = await axios.get(`${import.meta.env.VITE_API_URL}`, { 
        timeout: 5000 
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const timestamp = new Date().toISOString();
      
      const newStatus = {
        isUp: response.status === 200,
        responseTime: responseTime,
        lastChecked: timestamp,
        error: null
      };

      setStatus(prevStatus => ({
        ...newStatus,
        history: [...(prevStatus.history || []).slice(-9), newStatus]
      }));
    } catch (error) {
      const timestamp = new Date().toISOString();
      
      const newStatus = {
        isUp: false,
        responseTime: null,
        lastChecked: timestamp,
        error: error.message
      };

      setStatus(prevStatus => ({
        ...newStatus,
        history: [...(prevStatus.history || []).slice(-9), newStatus]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
    
    const intervalId = setInterval(() => {
      checkApiStatus();
    }, pollingInterval);
    
    return () => clearInterval(intervalId);
  }, [pollingInterval]);

  return {
    ...status,
    isLoading,
    refresh: checkApiStatus
  };
};

export default useApiStatus;
