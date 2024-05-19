import React from "react";
import { poppinsFont, rubikFont } from "@/styles/fonts";
import HeroNavButtons from "./hero-nav-buttons";
import { AuroraBackground } from "@/components/motions/aurora-bg";

const HeroSection = (): JSX.Element => {
  return (
    <section>
      <AuroraBackground className="h-[500px] justify-center">
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
            server moderation to ticket systems, auto-responses, welcome
            messages, and more, manage your Discord with ease and anticipate
            even greater features on the horizon.
          </p>
          <div className="z-10">
            <HeroNavButtons />
          </div>
        </div>
      </AuroraBackground>
    </section>
  );
};

export default HeroSection;
