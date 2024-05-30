import React from "react";
// import HeroSection from "@/components/home/hero-section";
// import BluetickIsAll from "@/components/home/bluetick-is-all";

import BotCountries from "@/components/home/bots-analytics/countries";
import NewHeroSection from "./_components/hero-section";
import FeaturesDemo from "./_components/features";

const Page = (): JSX.Element => {
  return (
    <div>
      <NewHeroSection />
      {/* <HeroSection /> */}
      {/* <BluetickIsAll /> */}
      <FeaturesDemo />
      <BotCountries />
    </div>
  );
};

export default Page;
