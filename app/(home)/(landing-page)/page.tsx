import React from "react";
// import HeroSection from "@/components/home/hero-section";
// import BluetickIsAll from "@/components/home/bluetick-is-all";
import FeaturesDemo from "@/components/home/features";
import BotCountries from "@/components/home/bots-analytics/countries";
import NewHeroSection from "./_components/hero-section";

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
