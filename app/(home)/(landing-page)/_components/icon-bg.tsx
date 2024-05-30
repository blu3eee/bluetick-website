import { type SVGMotionProps, motion } from "framer-motion";
import React from "react";

const LogoBorderBg: React.FC<SVGMotionProps<SVGSVGElement>> = (props) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      fill="none"
      viewBox="0 0 59 56"
      {...props}
    >
      <path
        fill='url("#SvgjsLinearGradient1033")'
        d="M26.2 50.1c-1.2-1.9-3.7-2.5-5.6-1.3l-5.2 3.3-.3-6.2c-.1-2.3-2-4-4.3-3.9l-6.2.3 2.8-5.5c1-2 .3-4.5-1.7-5.6l-5.4-3 5.4-3c2-1.1 2.7-3.6 1.7-5.6L4.5 14l6.2.3c2.3.1 4.2-1.6 4.3-3.9l.3-6.2 5.3 3.3c1.9 1.2 4.4.6 5.6-1.4L29.4.8l3.2 5.3c1.2 1.9 3.7 2.5 5.6 1.3l5.2-3.3.3 6.2c.1 2.3 2 4 4.3 3.9l6.2-.3-2.8 5.5c-1 2-.3 4.5 1.7 5.6l5.4 3-5.4 3c-2 1.1-2.7 3.6-1.7 5.6l2.8 5.5-6.2-.3c-2.3-.1-4.2 1.6-4.3 3.9l-.3 6.2-5.3-3.2c-1.9-1.2-4.4-.6-5.6 1.4l-3.2 5.3-3.1-5.3Z"
      ></path>
      <defs>
        <linearGradient id="SvgjsLinearGradient1033">
          <stop stopColor="#fceabb" offset="0"></stop>
          <stop stopColor="#f8b500" offset="1"></stop>
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

export default LogoBorderBg;
