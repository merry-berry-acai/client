/**
 * Utility functions for handling image URLs
 */

// Get the API base URL from environment variables or use a default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Transforms a relative image path from the API to a full URL
 * @param {string} imageUrl - The image path stored in the database
 * @returns {string} The full URL to the image
 */
export function getFullImageUrl(imageUrl) {
  try {
    if (!imageUrl || typeof imageUrl === 'object') {
      return null;
    }

    const url = String(imageUrl);
    
    // If absolute URL or data URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
        }
        const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
        const fullUrl = `${API_BASE_URL}${cleanUrl}`;
        return fullUrl
    
  } catch (error) {
    console.error('Error generating image URL:', error);
    appLogger.error('Error generating image URL', error);
    return null;
  }
}

/**
 * Gets a fallback image URL if the provided URL is invalid
 * @param {string} type - The type of fallback image (optional)
 * @returns {string} The fallback image URL
 */
export const getFallbackImageUrl = (type = 'food') => {
  // Return appropriate fallback based on type
  switch (type) {
    case 'user':
      return '/assets/default-user.png';
    case 'category':
      return '/assets/default-category.png';
    default:
      return '/assets/default-food.png';
  }
};
