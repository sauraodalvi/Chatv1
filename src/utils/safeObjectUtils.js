/**
 * Safely calls Object.entries() with null/undefined checks
 * @param {Object} obj - The object to get entries from
 * @returns {Array} - Array of [key, value] pairs or empty array if obj is null/undefined
 */
export const safeObjectEntries = (obj) => {
  if (obj === null || obj === undefined) {
    return [];
  }
  return Object.entries(obj);
};

/**
 * Safely calls Object.keys() with null/undefined checks
 * @param {Object} obj - The object to get keys from
 * @returns {Array} - Array of keys or empty array if obj is null/undefined
 */
export const safeObjectKeys = (obj) => {
  if (obj === null || obj === undefined) {
    return [];
  }
  return Object.keys(obj);
};

/**
 * Safely calls Object.values() with null/undefined checks
 * @param {Object} obj - The object to get values from
 * @returns {Array} - Array of values or empty array if obj is null/undefined
 */
export const safeObjectValues = (obj) => {
  if (obj === null || obj === undefined) {
    return [];
  }
  return Object.values(obj);
};
