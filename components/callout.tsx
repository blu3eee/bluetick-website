import * as React from 'react';

import { cn } from '@/lib/utils';
import type { AdditionalProps } from './ui';

interface CalloutProps {
  icon?: string;
  children?: React.ReactNode;
  type?: 'default' | 'warning' | 'danger';
}

/**
 * Renders a callout component to highlight or emphasize content, optionally with an icon and different types for context indication.
 * @example
 * <Callout type="warning" icon="⚠️">
 *   <p>This is a warning callout with an icon.</p>
 * </Callout>
 * @param {CalloutProps} props - The props for the Callout component.
 * @param {React.ReactNode} [props.children] - The content to be displayed within the callout. This could be a string, a JSX element, or any React node.
 * @param {string} [props.icon] - Optional. A string that represents an icon displayed at the beginning of the callout. This should be a character or an emoji.
 * @param {'default' | 'warning' | 'danger'} [props.type] - Optional. Specifies the type of callout to determine its styling. Default is 'default'.
 * @param {string} [props.className] - Optional. Additional class names to apply to the callout for custom styling.
 * @param {AdditionalProps} [props...] - Additional props spread onto the callout container element.
 * @returns {JSX.Element} The Callout component.
 */
export function Callout({
  children,
  icon,
  type = 'default',
  className,
  ...props
}: CalloutProps & AdditionalProps): JSX.Element {
  return (
    <div
      className={cn(
        'my-6 flex items-center rounded-md border border-l-4 p-4',
        {
          'border-red-900 bg-red-50 text-black': type === 'danger',
          'border-yellow-900 bg-yellow-50 text-black': type === 'warning',
        },
        className
      )}
      {...props}
    >
      {icon && <span className="mr-4 text-2xl">{icon}</span>}
      <div>{children}</div>
    </div>
  );
}
