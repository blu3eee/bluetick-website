// @see https://usehooks.com/useLockBodyScroll.
import * as React from "react";

/**
 * Custom hook to lock or unlock the body scroll based on the provided condition.
 * @param {boolean} lock - A boolean value that determines whether the body scroll should be locked or not.
 */
export function useLockBody(lock: boolean): void {
  React.useLayoutEffect(() => {
    if (lock) {
      // Lock body scroll
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        // Revert back to the original overflow style
        document.body.style.overflow = originalStyle;
      };
    }
  }, [lock]);
  // Only re-run effect if `lock` value changes
}
