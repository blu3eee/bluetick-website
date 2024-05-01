import * as React from "react";

/**
 * React hook to check if the current media query matches
 * @param query - The media query string to match against
 * @returns A boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    /**
     * Handles the change event of the media query list
     * @param event - The MediaQueryListEvent object
     */
    function onChange(event: MediaQueryListEvent): void {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return (): void => {
      result.removeEventListener("change", onChange);
    };
  }, [query]);

  return value;
}
