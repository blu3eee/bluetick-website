"use client";
import { useState, useEffect, type ComponentType } from "react";

const usePerformanceMeasure = (
  Component: ComponentType,
  Fallback: ComponentType,
  threshold: number,
): ComponentType => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const start = performance.now();

    const timeout = setTimeout(() => {
      const end = performance.now();
      const duration = end - start;

      if (duration > threshold) {
        setIsSlow(true);
      }
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [Component, threshold]);

  return isSlow ? Fallback : Component;
};

export default usePerformanceMeasure;
