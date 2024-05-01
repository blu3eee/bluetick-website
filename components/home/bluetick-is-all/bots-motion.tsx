"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { rubikFont } from "@/styles/fonts";

const BotsMotion = (): JSX.Element => {
  const bots = ["Ticket Bot", "Server Managing Bot", "Entertainment Bot"];
  const [curIndex, setCurIndex] = React.useState(0);
  React.useEffect(() => {
    // Set up a timer to change the index every second
    const timer = setInterval(() => {
      setCurIndex((prevIndex) => (prevIndex + 1) % bots.length);
    }, 2000);

    // Clear the timer when the component unmounts
    // to prevent memory leaks
    return () => {
      clearInterval(timer);
    };
  }, [bots.length]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <section className="flex flex-col items-center justify-center w-full">
        <motion.div
          className={cn(
            "flex flex-col items-center justify-center text-3xl font-bold",
            rubikFont.className,
          )}
          transition={{ type: "spring", duration: 1 }}
        >
          {bots.map((bot, i) => {
            const letters: Record<string, number> = {};
            return (
              <React.Fragment key={i}>
                {curIndex === i && (
                  <motion.div
                    className="flex items-center"
                    transition={{
                      duration: 1,
                      ease: "easeInOut",
                    }}
                  >
                    {bot.split("").map((char, charIndex) => {
                      const isSpace = char === " ";
                      const count = isSpace ? 0 : letters[char] || 0;
                      if (!isSpace) letters[char] = count + 1;
                      return (
                        <motion.span
                          key={`${char}-${charIndex}`}
                          layoutId={
                            isSpace ? `space-${charIndex}` : `${char}-${count}`
                          }
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 1,
                            ease: "easeInOut",
                          }}
                        >
                          {isSpace ? "\u00A0" : char}
                        </motion.span>
                      );
                    })}
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </motion.div>
      </section>
    </AnimatePresence>
  );
};

export default BotsMotion;
