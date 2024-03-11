'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { LoginButton } from '../bluetick/auth-buttons';

const NavButtons = (): JSX.Element => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === 'loading') {
    return (
      <>
        <Skeleton className="w-24 h-10" />
        <Skeleton className="w-24 h-10" />
      </>
    );
  }
  return session ? (
    <>
      <Button
        variant={'red'}
        onClick={() => {
          router.push('/servers');
        }}
      >
        Manage Servers
      </Button>
      <Button
        variant={'blue'}
        onClick={() => {
          router.push('/servers');
        }}
      >
        Add bot
      </Button>
    </>
  ) : (
    <>
      <LoginButton />
      <Button
        variant={'blue'}
        onClick={() => {
          router.push('/servers');
        }}
      >
        Add bot
      </Button>
    </>
  );
};

const HeroNavButtons = (): JSX.Element => {
  return (
    <div className="flex justify-end md:justify-center gap-2">
      <NavButtons />
    </div>
  );
};

export default HeroNavButtons;
