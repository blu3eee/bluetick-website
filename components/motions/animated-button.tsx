import React from 'react';
import { Button, type ButtonProps, buttonVariants } from '../ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const AnimatedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, variant, size, asChild = false, ...props },
    ref
  ): JSX.Element => {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);
AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
