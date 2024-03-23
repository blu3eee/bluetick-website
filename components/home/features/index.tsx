import React from 'react';
import WelcomeFeature from './welcome';
// import TicketFeature from './ticket';

const FeaturesDemo = (): JSX.Element => {
  return (
    <section className="w-full">
      <WelcomeFeature />
      {/* <TicketFeature /> */}
    </section>
  );
};

export default FeaturesDemo;
