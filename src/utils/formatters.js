/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0.00';
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  return `$${numberValue.toFixed(2)}`;
};

/**
 * Format a date to a readable string
 * @param {Date|string|number} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};
