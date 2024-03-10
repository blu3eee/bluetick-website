import { poppinsFont, rubikFont } from '@/styles/fonts';
import React from 'react';

const Page = (): JSX.Element => {
  return (
    <div>
      <HeroSection />
    </div>
  );
};

export default Page;

const HeroSection = (): JSX.Element => {
  return (
    <section
      className="h-[70vh] justify-center bg-primary-light dark:bg-primary-dark"
      style={{
        backgroundImage: `url('/bluetick/home-bg-2.webp')`,
        backgroundSize: 'cover', // Cover the entire section
        backgroundPosition: 'center', // Center the background image
        backgroundRepeat: 'no-repeat', // Do not repeat the image
      }}
    >
      <div className="p-8 flex flex-col justify-center ml-0 sm:ml-auto mr-0 sm:mr-12 items-center sm:items-end h-full gap-4 max-w-[600px]">
        <h1
          className={`text-5xl sm:text-6xl xl:text-7xl font-bold text-center sm:text-end text-yellow-500 ${rubikFont.className}`}
        >
          The Discord Bot that do everything automatically.
        </h1>
        <p
          className={`text-md text-gray-200 text-white text-center sm:text-end font-semibold text-wrap ${poppinsFont.className}`}
        >
          An all-in-one website offering versatile Discord bot solutions. From
          server moderation to ticket systems, auto-responses, welcome messages,
          and more, manage your Discord with ease and anticipate even greater
          features on the horizon.
        </p>
      </div>
    </section>
  );
};
