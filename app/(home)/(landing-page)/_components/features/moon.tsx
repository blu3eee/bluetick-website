import { type SVGMotionProps, motion } from "framer-motion";
import React from "react";

const MoonSvg: React.FC<SVGMotionProps<SVGSVGElement>> = (props) => {
  return (
    <motion.svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <defs>
          <style>{`.r{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;}`}</style>
        </defs>
        <g id="b">
          <circle id="c" className="r" cx="24" cy="24" r="21.5" />
          <path
            id="d"
            className="r"
            d="M23.9409,29.0859c-1.1953,1.6578-3.1145,2.6401-5.1583,2.6401-3.5121,0-6.3592-2.8471-6.3592-6.3592s2.8471-6.3592,6.3592-6.3592,6.3592,2.8471,6.3592,6.3592h0c0,.4165-.0409,.832-.1222,1.2406"
          />
          <circle id="e" className="r" cx="34.2891" cy="16.9174" r="3.0637" />
          <circle id="f" className="r" cx="14.3037" cy="13.1249" r="2.0016" />
          <circle id="g" className="r" cx="29.6712" cy="9.3213" r="1.4721" />
          <ellipse
            id="h"
            className="r"
            cx="41.8074"
            cy="22.7252"
            rx=".9853"
            ry="1.7864"
          />
          <ellipse
            id="i"
            className="r"
            cx="40.1441"
            cy="32.4128"
            rx="1.0189"
            ry="1.6012"
          />
          <circle id="j" className="r" cx="27.5688" cy="34.0382" r="2.0212" />
          <circle id="k" className="r" cx="19.8935" cy="40.9779" r="2.2555" />
          <circle id="l" className="r" cx="9.3354" cy="30.0283" r="1.1932" />
          <ellipse
            id="m"
            className="r"
            cx="19.0728"
            cy="5.836"
            rx="1.6008"
            ry=".8004"
          />
          <circle id="n" className="r" cx="26.5197" cy="39.261" r=".9508" />
          <circle id="o" className="r" cx="19.2734" cy="22.9938" r="1.4144" />
          <circle id="p" className="r" cx="25.1731" cy="28.0512" r="1.3919" />
          <path
            id="q"
            className="r"
            d="M23.3907,45.4915c-4.6569-6.1331-7.1905-13.7177-7.1905-21.5311,0-7.749,2.4921-15.276,7.0806-21.3856"
          />
        </g>
      </g>
    </motion.svg>
  );
};

export default MoonSvg;
