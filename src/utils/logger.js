/**
 * Centralized logger utility for consistent logging across the application
 * Uses centralized configuration from config.js
 */
import { LOG_CONFIG, ENV_CONFIG } from '../config';
import * as Sentry from "@sentry/react";

/**
 * Format current timestamp for logging
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false });
};

/**
 * Create a logger instance for a specific context
 * @param {string} context - The context for this logger (api, firebase, etc.)
 * @param {Object} options - Additional options
 * @returns {Object} - Logger instance with methods for each log level
 */
export const createLogger = (context = 'default', options = {}) => {
  // Get context icon
  const icon = LOG_CONFIG.contextIcons[context] || LOG_CONFIG.contextIcons.default;
  const componentConfig = LOG_CONFIG.componentConfig[context] || {};
  
  // Create logger functions for each level
  const logger = {
    debug: (message, data) => {
      if (!LOG_CONFIG.enabled || LOG_CONFIG.levels[LOG_CONFIG.level] > LOG_CONFIG.levels.debug) return;
      
      const timestamp = getTimestamp();
      const prefix = `${timestamp} ${icon} ${context.toUpperCase()}`;
      
      if (data) {
        console.log(`${prefix} ⚙️ ${message}`, data);
      } else {
        console.log(`${prefix} ⚙️ ${message}`);
      }
    },
    
    info: (message, data) => {
      if (!LOG_CONFIG.enabled || LOG_CONFIG.levels[LOG_CONFIG.level] > LOG_CONFIG.levels.info) return;
      
      const timestamp = getTimestamp();
      const prefix = `${timestamp} ${icon} ${context.toUpperCase()}`;
      
      if (data) {
        console.info(`${prefix} ℹ️ ${message}`, data);
      } else {
        console.info(`${prefix} ℹ️ ${message}`);
      }
    },
    
    warn: (message, data) => {
      if (!LOG_CONFIG.enabled || LOG_CONFIG.levels[LOG_CONFIG.level] > LOG_CONFIG.levels.warn) return;
      
      const timestamp = getTimestamp();
      const prefix = `${timestamp} ${icon} ${context.toUpperCase()}`;
      
      if (data) {
        console.warn(`${prefix} ⚠️ ${message}`, data);
      } else {
        console.warn(`${prefix} ⚠️ ${message}`);
      }
    },
    
    error: (message, data) => {
      if (!LOG_CONFIG.enabled || LOG_CONFIG.levels[LOG_CONFIG.level] > LOG_CONFIG.levels.error) return;
      
      const timestamp = getTimestamp();
      const prefix = `${timestamp} ${icon} ${context.toUpperCase()}`;
      
      if (data) {
        console.error(`${prefix} ❌ ${message}`, data);
        Sentry.captureException(message, { extra: data });
      } else {
        console.error(`${prefix} ❌ ${message}`);
        Sentry.captureException(message);
      }
    },
    
    // Helper method - Only log success messages if configured to do so
    success: (message, data) => {
      if (!LOG_CONFIG.enabled || LOG_CONFIG.levels[LOG_CONFIG.level] > LOG_CONFIG.levels.info) return;
      if (context === 'api' && componentConfig.showSuccess === false) return;
      
      const timestamp = getTimestamp();
      const prefix = `${timestamp} ${icon} ${context.toUpperCase()}`;
      
      if (data) {
        console.info(`${prefix} ✅ ${message}`, data);
      } else {
        console.info(`${prefix} ✅ ${message}`);
      }
    },
    
    // Helper method to check if we should log retry attempts
    shouldLogRetry: () => {
      if (context !== 'api') return true;
      return componentConfig.showRetryAttempts !== false;
    },
    
    // Helper method to check if we should log payloads
    shouldLogPayloads: () => {
      if (context !== 'api') return true;
      return componentConfig.showPayloads !== false;
    },
    
    // Utility method to sanitize sensitive data
    sanitize: (data, sensitiveKeys = LOG_CONFIG.sensitiveKeys) => {
      if (!data || typeof data !== 'object') return data;
      
      const sanitized = { ...data };
      
      for (const key in sanitized) {
        if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
          if (typeof sanitized[key] === 'string') {
            sanitized[key] = sanitized[key].substring(0, 3) + '***';
          } else {
            sanitized[key] = '***';
          }
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
          sanitized[key] = logger.sanitize(sanitized[key], sensitiveKeys);
        }
      }
      
      return sanitized;
    },
    
    // Configuration getters
    getConfig: () => componentConfig
  };
  
  return logger;
};

// Create and export common loggers
export const apiLogger = createLogger('api');
export const firebaseLogger = createLogger('firebase');
export const authLogger = createLogger('auth');
export const appLogger = createLogger('app');
export const dbLogger = createLogger('database');

// Export a default general logger
export default createLogger('default');
