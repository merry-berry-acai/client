import React, { useState, useCallback } from 'react';
import { ApiDebugContext } from './ApiDebugPanel';

const ApiDebugProvider = ({ children }) => {
  const [debugMode, setDebugMode] = useState(false);
  const [apiLogs, setApiLogs] = useState([]);

  const logApiRequest = useCallback((requestType, url, data = null, response = null, error = null) => {
    if (!debugMode) return;
    
    const timestamp = new Date().toISOString();
    const newLog = {
      id: Date.now(),
      timestamp,
      requestType,
      url,
      data,
      response,
      error,
      success: !error
    };
    
    setApiLogs(prevLogs => [newLog, ...prevLogs].slice(0, 10)); // Keep last 10 logs
  }, [debugMode]);

  const clearApiLogs = useCallback(() => {
    setApiLogs([]);
  }, []);

  const toggleDebugMode = useCallback((enabled) => {
    setDebugMode(enabled);
  }, []);

  return (
    <ApiDebugContext.Provider 
      value={{ 
        logApiRequest, 
        debugMode, 
        toggleDebugMode, 
        apiLogs, 
        clearApiLogs 
      }}
    >
      {children}
    </ApiDebugContext.Provider>
  );
};

export default ApiDebugProvider;
