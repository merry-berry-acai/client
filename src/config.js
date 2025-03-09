// Suggested code may be subject to a license. Learn more: ~LicenseLog:3785646613.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1104270504.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2421444192.
/**
 * Application Configuration
 * 
 * This file centralizes all configuration parameters for the application.
 * Environment variables are imported here and exported as structured configuration objects.
 */

/**
 * Function to validate environment variables.
 * 
 * @param {string} envVarName - The name of the environment variable.
 * @param {boolean} isOptional - Whether the environment variable is optional.
 * @returns {string | undefined} - The value of the environment variable or undefined if it's optional and not found.
 * @throws {Error} - Throws an error if a required environment variable is missing.
 */
const getEnv = (envVarName, isOptional = false) => {
  const envValue = import.meta.env[envVarName];
  if (!envValue && !isOptional) {
    throw new Error(`Missing required environment variable: ${envVarName}`);
  }
  return envValue;
};

// API Configuration
const apiBaseUrl = getEnv('VITE_API_URL')
if(!apiBaseUrl.startsWith('http')){
  throw new Error('VITE_API_URL must start with http')
}
export const API_CONFIG = {
  baseURL: apiBaseUrl,
  timeout: 8000,
  retries: 2,
  retryDelay: 1000,
  logRequests: getEnv('VITE_NODE_ENV') === 'development',
  logLevel: 'verbose' // 'normal' or 'verbose'
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID', true),
};



// Auth Configuration
export const AUTH_CONFIG = {
  adminCacheKey: 'auth_admin_status',
  adminCacheExpiry: 1000 * 60 * 60, // 1 hour
  // For development: hardcoded admin UID
  adminUID: "nYoUNJqj8Wh4NbHcH4Go2Wz1Ie82"
};

// Payment Configuration
export const PAYMENT_CONFIG = {
  stripePublicKey: getEnv('VITE_STRIPE_PUBLIC_KEY'),
};

// Environment Configuration
export const ENV_CONFIG = {
  isDevelopment: getEnv('VITE_NODE_ENV') === 'development',
  nodeEnv: getEnv('VITE_NODE_ENV'),
};

// Cache Configuration
export const CACHE_CONFIG = {
  storagePrefix: 'menu_cache_',
  defaultExpiry: 1000 * 60 * 30, // 30 minutes
  refreshInterval: 1000 * 60 * 5, // 5 minutes - interval for background refresh
  forceRefreshThreshold: 1000 * 60 * 60, // 60 minutes - when to force refresh on user action
  keys: {
    menuItems: 'menuItems',
    categories: 'categories',
    toppings: 'toppings',
    featuredItems: 'featuredItems',
    users: 'users'
  }
};

// Logger Configuration
export const LOG_CONFIG = {
  enabled: ENV_CONFIG.isDevelopment,
  level: getEnv('VITE_LOG_LEVEL', true) || 'info',
  sensitiveKeys: ['password', 'token', 'auth', 'key', 'secret', 'apiKey'],
  
  // Configure which types of logs are shown for each component
  componentConfig: {
    api: { 
      showSuccess: false,     // Don't log every successful API call
      showPayloads: true,     // Show request/response payloads
      showRetryAttempts: true // Show retry attempts
    },
    firebase: {
      showAuthFlow: true      // Show authentication flow logs
    }
  },
  
  contextIcons: {
    api: '🌐',               // Changed to globe for API
    firebase: '🔥',
    auth: '🔐',
    app: '📱',
    database: '💾',
    config: '⚙️',
    default: '📋'            // Changed to clipboard
  },
  
  // More descriptive level names
  levels: {
    debug: 0,   // Detailed information for debugging
    info: 1,    // General information about application flow
    warn: 2,    // Potential issues that don't halt execution
    error: 3,   // Errors that affect functionality
    none: 4     // No logging
  }
};