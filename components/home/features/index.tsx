'use client';
import React from 'react';
import WelcomeFeature from './welcome';
import TicketFeature from './ticket';
import AnimatedElement from './animated-feature';
import AutoResFeature from './auto-res';
import TwitchFeature from './twitch';

const FeaturesDemo = (): JSX.Element => {
  return (
    <section className="w-full px-2 sm:px-4 md:px-6 lg:px-12 xl:px-24 flex flex-col gap-4 md:gap-8 lg:gap-12 xl:gap-24 py-4">
      <AnimatedElement id="welcome-demo">
        <WelcomeFeature />
      </AnimatedElement>
      <AnimatedElement id="twitch-watcher-demo">
        <TwitchFeature />
      </AnimatedElement>
      <AnimatedElement id="ticket-demo">
        <TicketFeature />
      </AnimatedElement>
      <AnimatedElement id="autores-demo">
        <AutoResFeature />
      </AnimatedElement>
    </section>
  );
};

export default FeaturesDemo;
