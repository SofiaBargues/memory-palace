"use client";

import { ArrowRight, Sparkles } from "lucide-react";

import { MemoryPalaceDemo } from "@/components/memory-palace-demo";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <main className="w-full bg-white px-4 py-8 text-[#101216] sm:px-6 lg:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <MemoryPalaceDemo className="mx-auto" showChooseWordsStep />

        <div className="mx-auto mt-5 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          <a href="/palace?start=chooseWords" className="block">
            <Button
              size="lg"
              className="h-12 w-full justify-between rounded-[5px] bg-black px-7 text-base font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5 hover:bg-[#262626]"
            >
              Create a Palace
              <Sparkles className="size-5" />
            </Button>
          </a>
          <a href="/palaces" className="block">
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full justify-between rounded-[5px] border-black bg-transparent px-7 text-base font-medium text-black hover:bg-transparent"
            >
              Discover Palaces
              <ArrowRight className="size-5" />
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}
