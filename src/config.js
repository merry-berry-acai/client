/**
 * Application Configuration
 * 
 * This file centralizes all configuration parameters for the application.
 * Environment variables are imported here and exported as structured configuration objects.
 */

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
  retries: 2,
  retryDelay: 1000,
  logRequests: import.meta.env.VITE_NODE_ENV === 'development',
  logLevel: 'verbose' // 'normal' or 'verbose'
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Auth Configuration
export const AUTH_CONFIG = {
  adminCacheKey: 'auth_admin_status',
  adminCacheExpiry: 1000 * 60 * 60, // 1 hour
  // For development: hardcoded admin UID
  adminUID: "EszW3BDsb4P6qLp9gJ03IRkCTKn2"
};

// Payment Configuration
export const PAYMENT_CONFIG = {
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY
};

// Environment Configuration
export const ENV_CONFIG = {
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
  nodeEnv: import.meta.env.VITE_NODE_ENV
};