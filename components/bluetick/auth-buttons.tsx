'use client';

import React from 'react';
import { Button, type ButtonProps } from '../ui/button';
import { cn } from '@/lib/utils';
import { signIn, signOut } from 'next-auth/react';
import { toast } from 'sonner';

interface LoginButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary';
}

export const LoginButton: React.FC<LoginButtonProps & ButtonProps> = ({
  children,
  className,
  variant,
  ...props
}): JSX.Element => {
  return (
    <Button
      onClick={() => {
        signIn('discord', { callbackUrl: '/servers' }).catch(() => {
          toast.error('Failed to initiate log in with Discord');
        });
      }}
      variant={variant ?? 'default'}
      className={cn('', className)}
      {...props}
    >
      {children ?? 'Login with Discord'}
    </Button>
  );
};

interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary';
}

export const LogoutButton: React.FC<LogoutButtonProps & ButtonProps> = ({
  children,
  className,
  variant,
  ...props
}) => {
  return (
    <Button
      onClick={() => {
        signOut().catch(() => {
          toast.error('Failed to log out');
        });
      }}
      variant={variant ?? 'outline'}
      className={cn(
        'text-red-600 border-red-600 hover:bg-red-600 focus:bg-red-600',
        className
      )}
      {...props}
    >
      {children ?? 'Logout'}
    </Button>
  );
};
