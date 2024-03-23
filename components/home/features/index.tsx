'use client';
import React from 'react';
import WelcomeFeature from './welcome';
import TicketFeature from './ticket';
import AnimatedElement from './animated-feature';
import AutoResFeature from './auto-res';

const FeaturesDemo = (): JSX.Element => {
  return (
    <section className="w-full px-2 sm:px-4 md:px-6 lg:px-12 xl:px-24 flex flex-col gap-4 md:gap-8 py-4">
      <AnimatedElement>
        <WelcomeFeature />
      </AnimatedElement>
      <AnimatedElement>
        <TicketFeature />
      </AnimatedElement>
      <AnimatedElement>
        <AutoResFeature />
      </AnimatedElement>
    </section>
  );
};

export default FeaturesDemo;
