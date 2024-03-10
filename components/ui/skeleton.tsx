import { cn } from '@/lib/utils';
import React from 'react';
import type { AdditionalProps } from '.';

/**
 * Renders a skeleton loader element with customizable classes.
 * This component is useful for displaying a placeholder while content is loading.
 * @param {React.HTMLAttributes<HTMLDivElement> & AdditionalProps} props - The props for the skeleton component.
 * @param {string} props.className - Additional CSS classes to apply to the skeleton element for further styling.
 * @returns {React.ReactElement} A React element representing the skeleton loader.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & AdditionalProps): React.ReactElement {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };
