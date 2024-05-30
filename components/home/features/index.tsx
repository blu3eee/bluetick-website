"use client";
import React from "react";
import WelcomeFeature from "./welcome";
import TicketFeature from "./ticket";
import AnimatedElement from "./animated-feature";
import AutoResFeature from "./auto-res";
import TwitchFeature from "./twitch";
import {
  type MotionValue,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import MoonSvg from "./moon";
import { homePageSpringConfig } from "@/config/motions";

const FeaturesDemo = (): JSX.Element => {
  const { scrollYProgress } = useScroll();

  /**
   * Creates a parallax spring effect based on the scroll progress.
   * @param {number} limit - The limit to which the value transforms.
   * @returns {MotionValue<any>} - A motion value that updates based on scroll progress.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function useParallaxSpring(limit: number): MotionValue<any> {
    return useSpring(
      useTransform(scrollYProgress, [0, 1], [0, limit]),
      homePageSpringConfig,
    );
  }

  return (
    <section className="relative flex w-full flex-col gap-4 px-2 py-4 sm:px-4 md:gap-8 md:px-6 lg:gap-12 lg:px-12 xl:gap-24 xl:px-24">
      <motion.div
        className={"fixed left-20 top-40 -z-50 text-gray-500 opacity-70"}
      >
        <MoonSvg
          width={70}
          height={70}
          className={"absolute"}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
          style={{
            translateX: useParallaxSpring(300),
            translateY: useParallaxSpring(300),
          }}
        />
      </motion.div>
      <AnimatedElement id="ticket-demo">
        <TicketFeature />
      </AnimatedElement>

      <AnimatedElement id="welcome-demo">
        <WelcomeFeature />
      </AnimatedElement>

      <AnimatedElement id="autores-demo">
        <AutoResFeature />
      </AnimatedElement>

      <AnimatedElement id="twitch-watcher-demo">
        <TwitchFeature />
      </AnimatedElement>
    </section>
  );
};

export default FeaturesDemo;
