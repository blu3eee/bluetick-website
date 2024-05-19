import React from "react";
import { SparklesCore } from "@/components/motions/particles";

const BluetickIsAll = (): JSX.Element => {
  return (
    <section className="relative flex h-fit min-h-24 w-full flex-col items-center justify-center overflow-hidden  bg-black">
      <div className="absolute inset-0 h-screen w-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="h-full w-full"
          particleColor="#FFFFFF"
        />
      </div>
      <h1 className="relative z-20 text-center text-2xl font-bold text-white md:text-3xl lg:text-4xl">
        Bluetick is all
      </h1>
    </section>
  );
};

export default BluetickIsAll;
