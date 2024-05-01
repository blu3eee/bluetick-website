import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: { opacity: 1, y: 0 },
};

const animationConfig = {
  variants,
  transition: { ease: "linear", duration: 1, y: { duration: 0.8 } },
  viewport: { once: true },
};

const AnimatedElement: React.FC<{
  id?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ id, className, children }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    id={id}
    className={cn("max-w-[1400px] mx-auto", className)}
    {...animationConfig}
  >
    {children}
  </motion.div>
);

export default AnimatedElement;
