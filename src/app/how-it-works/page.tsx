"use client";

import { ArrowRight, Sparkles } from "lucide-react";

import { MemoryPalaceDemo } from "@/components/memory-palace-demo";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <main className="min-h-[calc(100vh-84px)] bg-[#f6f8fb] px-4 py-8 text-[#101216] sm:px-6 lg:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <MemoryPalaceDemo className="mx-auto" showChooseWordsStep />

        <div className="mx-auto mt-5 grid w-full gap-3 sm:grid-cols-2">
          <a href="/palace" className="block">
            <Button
              size="lg"
              className="h-12 w-full justify-between rounded-[5px] bg-[#f05a0a] px-7 text-base font-semibold text-white shadow-[0_14px_34px_rgba(240,90,10,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-[#e45005]"
            >
              Create a Palace
              <Sparkles className="size-5" />
            </Button>
          </a>
          <a href="/palaces" className="block">
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full justify-between rounded-[5px] border-[#111318] bg-transparent px-7 text-base font-medium text-[#111318] hover:bg-transparent"
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
