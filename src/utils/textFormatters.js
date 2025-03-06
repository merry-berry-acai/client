/**
 * Converts a string to title case (first letter of each word capitalized)
 * @param {string} str - The string to convert
 * @return {string} - The title-cased string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
