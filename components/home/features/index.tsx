import React from 'react';
import WelcomeFeature from './welcome';
import TicketFeature from './ticket';

const FeaturesDemo = (): JSX.Element => {
  return (
    <section className="w-full px-4 md:px-6 lg:px-12">
      <WelcomeFeature />
      <TicketFeature />
    </section>
  );
};

export default FeaturesDemo;
