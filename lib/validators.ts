// ./lib/validators.ts

/**
 * Checks if a given URL string points to a valid image resource.
 * Supported image formats are jpg, jpeg, png, gif, webp, and svg.
 * @param {string} urlString - The URL string to validate.
 * @returns {boolean} True if the URL is a valid image URL, otherwise false.
 */
export const isValidImageUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    const imagePath = url.pathname.toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|svg)$/.test(imagePath);
  } catch (e) {
    return false; // URL parsing failed, so it's not a valid URL
  }
};

/**
 * Validates if the provided string is a well-formed URL.
 * @param {string} urlString - The string to validate.
 * @returns {boolean} True if the string is a valid URL, otherwise false.
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url !== null;
  } catch (e) {
    return false;
  }
};

/**
 * Determines whether a given string is a valid hexadecimal color code.
 * @param {string} hexColor - The hexadecimal color string to validate.
 * @returns {boolean} True if the string is a valid hex color, otherwise false.
 */
export function isValidHexColor(hexColor: string): boolean {
  // Regular expression pattern to match a valid hexadecimal color code
  const hexColorPattern = /^#([A-Fa-f0-9]{6})$/;

  // Test the input string against the pattern
  return hexColorPattern.test(hexColor);
}
