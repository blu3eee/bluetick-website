import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: { opacity: 1, y: 0 },
};

const animationConfig = {
  variants,
  transition: { ease: 'linear', duration: 1, y: { duration: 0.8 } },
  viewport: { once: true },
};

const AnimatedElement: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    {...animationConfig}
    className="max-w-[1400px] mx-auto"
  >
    {children}
  </motion.div>
);

export default AnimatedElement;
