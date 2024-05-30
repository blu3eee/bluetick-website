"use client";
import React from "react";
import {
  type MotionValue,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import MotionTriangleSvg from "./mountain";
import MotionCloudSvg from "./cloud";
import { cn } from "@/lib/utils";
import { rubikFont } from "@/styles/fonts";

import { homePageSpringConfig } from "@/config/motions";
import HeroNavButtons from "./hero-nav-buttons";
import { Icons } from "@/components/icons";
import LogoBorderBg from "./icon-bg";

const cloudVariants = ({
  duration = 40,
  scale = 1,
}: {
  duration?: number;
  scale?: number;
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}) => {
  return {
    initial: { opacity: 0, x: 0, scale },
    animate: {
      opacity: 1,
      x: ["0%", "-100vw"],
      transition: {
        opacity: { duration: 1, delay: 0 },
        x: {
          delay: 1,
          duration,
          repeat: Infinity,
          repeatType: "loop",
        },
        scale,
      },
    },
  };
};

const NewHeroSection = (): React.ReactNode => {
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
    <div className="relative z-10 h-[calc(100dvh-80px)] min-h-[500px] w-full overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-blue-200"></div>
      <motion.div
        className="absolute h-full w-full bg-blue-300 "
        initial={{ x: "100%" }}
        animate={{ x: "calc(100dvw - 100%)" }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute h-full w-full bg-blue-400 "
        initial={{ x: "100%" }}
        animate={{ x: "calc(100dvw - 100%)" }}
        transition={{ delay: 0.2, duration: 0.8 }}
      />
      <motion.div
        className="absolute  h-full w-full bg-[#0784B5]"
        initial={{ x: "100%" }}
        animate={{ x: "calc(100dvw - 100%)" }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 top-0  w-full"
        initial="initial"
        animate="animate"
      >
        <MotionCloudSvg
          variants={cloudVariants({ duration: 70, scale: 0.8 })}
          className="absolute right-0 top-20 text-white/90"
          style={{
            translateY: useParallaxSpring(1400),
          }}
        />
        <motion.div
          className={"absolute left-20 top-40"}
          transition={{
            duration: 2.5,
          }}
          initial={{ y: 1000, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            translateY: useParallaxSpring(2000),
            translateX: useParallaxSpring(-50),
          }}
        >
          <LogoBorderBg
            width={70}
            height={70}
            className={"absolute"}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
          />
          <Icons.logo
            width={70}
            height={70}
            className="absolute p-4 text-black"
          />
        </motion.div>

        {/* mountains */}
        <MotionTriangleSvg
          initial={{ y: "100%", scale: 4 }}
          animate={{ y: 0, scale: 4 }}
          className={"absolute bottom-0 left-10 text-blue-200"}
          transition={{ delay: 1, duration: 1 }}
          style={{
            translateY: useParallaxSpring(700),
            translateX: useParallaxSpring(-100),
          }}
        />
        <MotionCloudSvg
          variants={cloudVariants({ duration: 55 })}
          className="absolute right-10 top-36 text-white/90"
          style={{
            translateY: useParallaxSpring(1250),
          }}
        />
        <MotionTriangleSvg
          initial={{ y: "100%", scale: 3 }}
          animate={{ y: 0, scale: 3 }}
          className={"absolute -left-10 bottom-0 text-blue-300"}
          transition={{ delay: 1, duration: 1 }}
          style={{
            translateY: useParallaxSpring(450),
            translateX: useParallaxSpring(-50),
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 top-0 flex flex-col justify-center gap-3 px-8 text-right font-medium text-black"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
          }}
          transition={{
            opacity: { duration: 1, delay: 1.5 },
          }}
          style={{
            translateY: useParallaxSpring(650),
            translateX: useParallaxSpring(50),
          }}
        >
          <motion.div
            className={cn("text-[36px] font-bold", rubikFont.className)}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 1.5,
            }}
          >
            The Discord Bot that do everything automatically.
          </motion.div>
          <motion.div
            className={cn(
              "max-w-[80dvw] self-end text-right text-[24px] font-light",
              rubikFont.className,
            )}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 1.5,
            }}
            style={{
              translateX: useParallaxSpring(-200),
            }}
          >
            An all-in-one website offering versatile Discord bot solutions. From
            server moderation to ticket systems, auto-responses, welcome
            messages, and more, manage your Discord with ease and anticipate
            even greater features on the horizon.
          </motion.div>
          <motion.div
            className={cn(
              "z-50 flex items-center justify-end gap-4",
              rubikFont.className,
            )}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 1.5,
            }}
          >
            <HeroNavButtons />
          </motion.div>
        </motion.div>

        <MotionCloudSvg
          variants={cloudVariants({ scale: 1.2 })}
          className="absolute right-0 top-[200px] text-white"
          style={{
            translateY: useParallaxSpring(1000),
          }}
        />
      </motion.div>
    </div>
  );
};

export default NewHeroSection;
