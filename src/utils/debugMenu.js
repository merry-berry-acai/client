/**
 * Debug utility to help identify menu items with missing images
 * Only used during development
 */

/**
 * Scans all menu items and logs information about any items missing images
 * @param {Array} menuItems - Array of menu items to check
 */
export const logMissingImages = (menuItems) => {
  if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
    return [];
  }

  // Only run in development mode
  if (process.env.NODE_ENV !== 'development' && !import.meta.env.DEV) {
    return [];
  }

  const missingImages = menuItems.filter(item => {
    return !item.imageURL && !item.image && !item.imagePath && !item.imageUrl;
  });
  
  return missingImages;
};
