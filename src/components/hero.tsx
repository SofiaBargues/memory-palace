"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { MemoryPalaceViolinDemo } from "@/components/memory-palace-violin-demo";

const Hero = ({}) => {
  return (
    <section className="relative w-full overflow-hidden py-8 sm:py-14">
      <div className="container m-auto px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
          <div className="mx-auto max-w-3xl text-center lg:text-left">
            <h1 className="mb-4 text-4xl font-bold text-primary sm:text-5xl xl:text-6xl 2xl:text-7xl">
              Visualize and Remember
            </h1>
            <p className="mx-auto max-w-[600px] text-secondary-foreground md:text-xl lg:mx-0">
              Choose your words and discover a visual story that will lock them
              into your memory forever.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <a href="/palaces">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Choose a palace
                </Button>
              </a>
              <a href="/palace">
                <Button size="lg" className="w-full sm:w-auto">
                  Create a Palace
                  <Sparkles />
                </Button>
              </a>
            </div>
          </div>

          <MemoryPalaceViolinDemo className="mx-auto max-w-3xl lg:mx-0" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
