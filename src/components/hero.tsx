"use client";

import { Button } from "@/components/ui/button";
import { CastleLogo } from "@/components/castle-logo";
import { ArrowRight, MapPin, Sparkles, X } from "lucide-react";

const Hero = ({}) => {
  return (
    <aside className="mx-auto w-full max-w-[20rem] lg:mx-0 lg:max-w-[22rem]">
      <div className="mb-7 hidden justify-center text-black lg:flex lg:justify-start">
        <CastleLogo className="size-11 object-contain lg:size-12" />
      </div>

      <p className="hidden text-center font-serif text-[1.62rem] leading-[1.24] text-[#171717] sm:text-3xl lg:block lg:text-left lg:text-[1.72rem]">
        See each word, place it, then walk back through the story.
      </p>

      <div className="my-8 hidden border-t border-dashed border-black/25 lg:block" />

      <div className="space-y-3">
        <a href="/palace" className="block">
          <Button
            size="lg"
            className="h-[3.25rem] w-full justify-between rounded-[5px] bg-black px-7 text-base font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5 hover:bg-[#262626] sm:h-14"
          >
            Create a Palace
            <Sparkles className="size-5" />
          </Button>
        </a>
        <a href="/palaces" className="block">
          <Button
            size="lg"
            variant="outline"
            className="h-[3.25rem] w-full justify-between rounded-[5px] border-black bg-white px-7 text-base font-medium text-black hover:bg-white sm:h-14"
          >
            Choose a palace
            <ArrowRight className="size-5" />
          </Button>
        </a>
      </div>

      <div className="mt-8 text-black">
        <div className="relative mx-auto h-11 max-w-[19rem] text-black/60 lg:max-w-none">
          <MapPin className="absolute left-0 top-0 size-6" />
          <svg
            className="absolute left-8 top-2 h-8 w-[calc(100%-4.75rem)]"
            viewBox="0 0 220 42"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 25 C35 38 44 6 77 16 C106 25 106 38 139 22 C166 9 184 14 218 24"
              stroke="currentColor"
              strokeDasharray="8 8"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
          <X className="absolute right-0 top-3 size-6" />
        </div>
        <p className="mt-4 text-center font-mono text-sm text-black lg:text-left">
          Build a route. Lock it in.
        </p>
      </div>
    </aside>
  );
};

export default Hero;
