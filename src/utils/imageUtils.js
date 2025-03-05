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
export const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If we're getting an object instead of a string (happens with some APIs)
  if (typeof imageUrl === 'object') {
    return null;
  }
  
  try {
    // If it's already an absolute URL (starts with http:// or https://), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // For data URLs (base64), return as is
    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }
  
    // Check if the image path already includes the API_BASE_URL (prevent double prefixing)
    if (imageUrl.includes(API_BASE_URL)) {
      return imageUrl;
    }

    // For relative paths, prepend the API base URL
    // Make sure the path starts with a slash
    const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    const fullUrl = `${API_BASE_URL}${path}`;
    
    return fullUrl;
  } catch (err) {
    console.error('Error processing image URL:', err);
    return null;
  }
};

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
