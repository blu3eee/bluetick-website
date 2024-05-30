import React from "react";
import { motion, type SVGMotionProps } from "framer-motion";

const MotionTriangleSvg: React.FC<SVGMotionProps<SVGSVGElement>> = (props) => {
  return (
    <motion.svg
      width="200"
      height="200"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <polygon
        points="100,10 190,190 10,190"
        fill="currentColor"
        // stroke="black"
        strokeWidth="2"
      />
    </motion.svg>
  );
};

export default MotionTriangleSvg;
