import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import React, { RefObject } from "react";

export default function SvgFollowScroll({ scrollYProgress }: { scrollYProgress: any }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Flex container to center-align the SVG horizontally and vertically */}
      <div className="absolute inset-0 w-full h-[100vh] opacity-90 flex items-center justify-center">
        <LinePath
          className="max-w-4xl w-full h-auto sticky top-[10vh] px-10 md:px-20 mx-auto"
          scrollYProgress={scrollYProgress}
        />
      </div>
    </div>
  );
}

const LinePath = ({
  className,
  scrollYProgress,
}: {
  className: string;
  scrollYProgress: any;
}) => {
  const pathLength = useTransform(scrollYProgress, [0.12, 0.55], [0.0, 1.0], {
    clamp: true
  });

  return (
    <svg
      viewBox="0 0 388.55 294.63"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* User's custom exported path */}
      <motion.path
        d="M9.5,137.3c5.1-10.7,15.1-18.6,26-23c11-4.4,23-5.7,34.8-5.8c36.7-0.3,73.3,10.2,109.6,5.4
			c14.7-1.9,29.6-6.7,40.5-16.7c11.2-10.5,17.1-25.4,16.1-40.7c-1.3-15.3-9.3-29.2-21.9-37.9c-8.9-6-19.9-9.1-30.5-7.5
			c-31.2,4.8-43.7,49.8-52,75c-19,57.8-38.7,115.4-59,172.9c-3.8,10.7-9.5,25.1-21.3,29.4c-4,1.5-9.3,0.5-11.4-3.2
			c-1.3-2.3-1.1-5.2-0.7-7.9c2.2-14.4,9.2-27.6,19.9-37.5c2.5-2.3,5.3-4.4,8.6-4.9c5.7-0.8,10.9,3.6,14,8.4s5.1,10.4,9,14.6
			c3.6,3.8,10.5,5.1,15.4,2.8c1.5-0.7,3-1.9,6.1-6.7c5.4-8.4,6.2-13.3,11.2-23.5c2.8-5.6,4.2-8.4,6.5-10.7
			c4.9-4.8,13.8-9.9,18.9-6.3c2.7,1.9,4,5.3,4.7,8.6c2,10.1-0.3,20.5-6.3,28.8c-6.1,8.3-25.8,16.6-27.2,0.4
			c-0.8-9.9,4.3-19.2,9.2-27.8c1.9-3.3,3.4-5.3,5.9-7.1c0.8-0.6,7.6-5.3,12.8-2.6c3.2,1.7,4.4,5.5,5.2,7.9c0.6,2,0.9,4.1,0.9,6.3
			c0.1,7.6,6.3,17.8,12.8,20.9c8.2,3.9,17.7-1.5,24.4-7.6c26.8-24.1,40.6-61.8,35.7-97.5c-0.9-6.3-5.5-14.4-11.3-11.8
			c-1.6,0.9-3,2.2-3.9,3.8c-14.5,20.6-18,47-17.9,72.3c0,10.2,0.7,20.9,5.7,29.8c18.8,33.7,43.5-2.5,52.8-21.4
			c12.1-24.6,23.3-52.2,16.5-78.8c-1.1-4.1-3.2-8.7-7.4-9.4c-6.1-1-9.5,6.8-10.5,12.9c-6,35.4-7.7,71.4-5.1,107.2l22.4-43.4
			c2.2-4.4,5.7-9.4,10.6-8.7c3.7,0.5,6.1,4.4,7.1,8c2.1,7.1,1.4,14.8,2,22.3c0.3,3.6,2.5,18.8,8.2,18.6c4.3-0.1,6.7-12.7,7.8-16
			c4.1-12.2,7.1-23.8,16.7-33c3.5-3.3,8.6-6.4,12.8-4.2c2.8,1.5,4,4.7,5,7.7c2.2,7.1,3.8,14.8,1.3,21.8s-10.1,12.7-17.2,10.4
			c-6.1-2-9.3-8.8-9.6-15.2c-0.5-10.1,5.6-20.8,15.4-23.5c2.3-0.6,4.9-0.7,6.8,0.6c1.4,1.2,2.4,2.8,2.8,4.5
			c1.9,5.5,2.4,11.4,4.1,16.9c1.6,5.6,4.6,11.1,9.8,13.8c8,4.3,17.6,0.2,24.8-3.8c-1.7,0.9-3.3,1.9-5,2.8"        className="stroke-black dark:stroke-white"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          pathLength,
          strokeDashoffset: useTransform(pathLength, (value) => 1 - value),
        }}
      />
    </svg>
  );
};
