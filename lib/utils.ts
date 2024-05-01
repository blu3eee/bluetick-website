import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and then merges them with tailwind-merge.
 * This function allows for dynamic class name generation with conditional
 * and grouped class names support, optimized for Tailwind CSS.
 * This function is mostly used by `shadcn/ui` components.
 * @param inputs - An array of class values to be combined and merged.
 * @returns The merged class names as a single string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Converts an integer representation of a hexadecimal color code into a string usable in CSS.
 * @param {number} intColor - The integer representation of the color.
 * @returns {string} The CSS hexadecimal color string.
 */
export function intToHexColor(intColor: number): string {
  // Convert the integer to a hexadecimal string
  let hexColor = intColor.toString(16);
  // Ensure the hexadecimal string is 6 characters long, padding with zeros if necessary
  hexColor = hexColor.padStart(6, "0");
  // Prefix with '#' to make it usable in CSS
  return `#${hexColor}`;
}

export const replacePlaceholders = (
  text: string,
  valuesMap: Record<string, string>,
): string => {
  let resultText = text;
  for (const [placeholder, value] of Object.entries(valuesMap)) {
    // Using a global regex to replace all instances of the placeholder
    const regex = new RegExp(`{${placeholder}}`, "g");
    resultText = resultText.replace(regex, value);
  }
  return resultText;
};
