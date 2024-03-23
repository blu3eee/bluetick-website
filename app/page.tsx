import HeroSection from '@/components/home/hero-section';
import React from 'react';
import BluetickIsAll from '@/components/home/bluetick-is-all';
import FeaturesDemo from '@/components/home/features';

const Page = (): JSX.Element => {
  return (
    <div>
      <HeroSection />
      <BluetickIsAll />
      <FeaturesDemo />
    </div>
  );
};

export default Page;
