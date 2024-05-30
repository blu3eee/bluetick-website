"use client";
import React from "react";
import { poppinsFont, rubikFont } from "@/styles/fonts";
import HeroNavButtons from "../../../app/(home)/(landing-page)/_components/hero-nav-buttons";
import { AuroraBackground } from "@/components/motions/aurora-bg";
import usePerformanceMeasure from "@/hooks/use-performance";

const HeavyHeroSection = (): React.ReactNode => {
  return (
    <AuroraBackground className="h-[500px] justify-center">
      <HeroContent />
    </AuroraBackground>
  );
};

const LightHeroSection = (): React.ReactNode => {
  return (
    <section
      className="bg-primary-light dark:bg-primary-dark h-[500px] justify-center"
      style={{
        backgroundImage: `url('/bluetick/home-bg-2.webp')`,
        backgroundSize: "cover", // Cover the entire section
        backgroundPosition: "center", // Center the background image
        backgroundRepeat: "no-repeat", // Do not repeat the image
      }}
    >
      <HeroContent />
    </section>
  );
};

const HeroContent = (): React.ReactNode => {
  return (
    <div className="ml-0 mr-0 flex h-full max-w-[600px] flex-col items-center justify-center gap-4 p-8 sm:ml-auto sm:mr-12 sm:items-end ">
      <h1
        className={`rounded-lg p-2 text-center text-5xl font-bold text-yellow-500 sm:text-end ${rubikFont.className}`}
      >
        The Discord Bot that do everything automatically.
      </h1>
      <p
        className={`text-md text-wrap rounded-lg p-2 text-center font-semibold text-foreground backdrop-blur-md sm:text-end ${poppinsFont.className}`}
      >
        An all-in-one website offering versatile Discord bot solutions. From
        server moderation to ticket systems, auto-responses, welcome messages,
        and more, manage your Discord with ease and anticipate even greater
        features on the horizon.
      </p>
      <div className="z-10">
        <HeroNavButtons />
      </div>
    </div>
  );
};

const HeroSection = (): React.ReactNode => {
  const threshold = 10; // Set your performance threshold in milliseconds
  const RenderComponent = usePerformanceMeasure(
    HeavyHeroSection,
    LightHeroSection,
    threshold,
  );
  return <RenderComponent />;
};

export default HeroSection;
