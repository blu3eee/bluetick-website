'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';
import type { AdditionalProps } from '.';

// Define a type for the size variants
type SwitchSize = 'xs' | 'sm' | 'lg';

// Define a type for the color variants
type Switchvariant = 'primary' | 'secondary' | 'destructive' | 'muted';

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  size?: SwitchSize;
  variant?: Switchvariant;
}

const switchSizeStyles = {
  xs: 'h-4 w-8',
  sm: 'h-6 w-11',
  lg: 'h-8 w-14',
};

const switchColorStyles = {
  primary: 'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
  secondary:
    'data-[state=checked]:bg-secondary data-[state=unchecked]:bg-input',
  destructive:
    'data-[state=checked]:bg-destructive data-[state=unchecked]:bg-input',
  muted: 'data-[state=checked]:bg-muted data-[state=unchecked]:bg-input',
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps & AdditionalProps
>(
  (
    { className, size = 'sm', variant = 'primary', ...props },
    ref
  ): JSX.Element => {
    const sizeStyle = switchSizeStyles[size];
    const colorStyle = switchColorStyles[variant];

    return (
      <SwitchPrimitives.Root
        className={cn(
          'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          sizeStyle,
          colorStyle,
          className
        )}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
            size === 'xs'
              ? 'h-3 w-3 translate-x-0 data-[state=checked]:translate-x-4'
              : size === 'lg'
              ? 'h-6 w-6 translate-x-0 data-[state=checked]:translate-x-8'
              : 'h-5 w-5 translate-x-0 data-[state=checked]:translate-x-5'
          )}
        />
      </SwitchPrimitives.Root>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };
