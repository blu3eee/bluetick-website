import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
