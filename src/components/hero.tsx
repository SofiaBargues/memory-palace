"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Landmark, MapPin, Sparkles, X } from "lucide-react";

const Hero = ({}) => {
  return (
    <aside className="mx-auto w-full max-w-[22rem] lg:mx-0">
      <div className="mb-7 text-[#31573a] ">
        <Landmark className="size-12 stroke-[1.35]" />
      </div>

      <p className="font-serif text-2xl leading-[1.28] text-[#3f4050] sm:text-3xl lg:text-[1.72rem]">
        See each word, place it, then walk back through the story.
      </p>

      <div className="my-8 border-t border-dashed border-[#b9c0cc]" />

      <div className="space-y-3">
        <a href="/palace" className="block">
          <Button
            size="lg"
            className="h-14 w-full gap-3 rounded-[5px] bg-[#f05a0a] text-base font-semibold text-white shadow-[0_14px_34px_rgba(240,90,10,0.26)] transition-transform hover:-translate-y-0.5 hover:bg-[#e45005]"
          >
            Create a Palace
            <Sparkles className="size-4" />
          </Button>
        </a>
        <a href="/palaces" className="block">
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-full justify-between rounded-[5px] border-[#111318] bg-white px-7 text-base font-medium text-[#111318] hover:bg-white"
          >
            Discover Palaces
            <ArrowRight className="size-5" />
          </Button>
        </a>
      </div>

      <div className="mt-8 text-[#31573a]">
        <div className="flex items-center gap-2 text-[#576070]">
          <MapPin className="size-5" />
          <div className="h-px flex-1 border-t border-dashed border-[#7e8795]" />
          <X className="size-5" />
        </div>
        <p className="mt-4 font-mono text-sm text-[#31573a]">
          Build a route. Lock it in.
        </p>
      </div>
    </aside>
  );
};

export default Hero;
