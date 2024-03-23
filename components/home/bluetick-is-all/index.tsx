import React from 'react';
import BotsMotion from './bots-motion';
import { cn } from '@/lib/utils';
import { rubikFont } from '@/styles/fonts';

const BluetickIsAll = (): JSX.Element => {
  return (
    <section
      className={`bg-secondary flex flex-col items-center justify-center py-8 text-2xl font-semibold gap-4`}
    >
      <BotsMotion />
      <span
        className={cn(
          'font-bold text-3xl text-blue-500 uppercase text-center',
          rubikFont.className
        )}
      >
        Bluetick is all
      </span>
    </section>
  );
};

export default BluetickIsAll;
