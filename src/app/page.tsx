"use client";

import CallToAction from "@/components/cta";
import Hero from "@/components/hero";
import { MemoryPalaceDemo } from "@/components/memory-palace-demo";
import MemoryPalaceJourney from "@/components/memory-palace-journey";

const Home = () => {
  return (
    <section className="max-w-7xl mx-auto ">
      <Hero />
      <div className="mx-auto px-4 md:px-6">
        <MemoryPalaceDemo className="mx-auto" />
      </div>
      <MemoryPalaceJourney />
      <CallToAction />
    </section>
  );
};

export default Home;
