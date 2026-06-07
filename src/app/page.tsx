"use client";

import Hero from "@/components/hero";
import { CastleLogo } from "@/components/castle-logo";
import MemoryPalaceViolinDemo from "@/components/memory-palace-violin-demo";
import { Compass, Footprints, ListChecks } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Words",
    body: "Start with the list you need to remember.",
    icon: ListChecks,
  },
  {
    number: "02",
    title: "Palace",
    body: "Place each word in a vivid location.",
    icon: CastleLogo,
  },
  {
    number: "03",
    title: "Recall",
    body: "Walk the route and let each image trigger.",
    icon: Footprints,
  },
  {
    number: "04",
    title: "Result",
    body: "Keep the order without forcing it.",
    icon: Compass,
  },
];

const Home = () => {
  return (
    <main className="overflow-hidden bg-[#fdfdfb] text-[#101216]">
      <section className="relative border-b border-[#b8c0cc]">
        <div
          className="pointer-events-none absolute -left-14 top-7 hidden h-[26rem] w-[24rem] rotate-[-18deg] opacity-60 lg:block"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(154,175,204,0.2)_1px,transparent_1px),linear-gradient(0deg,rgba(154,175,204,0.2)_1px,transparent_1px)] bg-[size:52px_52px]" />
          <div className="absolute left-20 top-20 h-28 w-28 border border-[#cbd7e7]" />
          <div className="absolute left-40 top-32 h-36 w-48 border border-[#cbd7e7]" />
          <div className="absolute left-28 top-8 h-20 w-40 border border-[#d8e1ed]" />
          <div className="absolute left-40 top-36 h-36 w-28 border border-[#d8e1ed]" />
        </div>
        <div
          className="pointer-events-none absolute left-[5.5rem] top-[10.5rem] hidden h-60 w-24 lg:block"
          aria-hidden="true"
        >
          <div className="absolute right-2 top-0 size-2.5 rounded-full border-[3px] border-[#e9530a]" />
          <div className="absolute right-4 top-4 h-40 w-20 rounded-[50%] border-r-2 border-dashed border-[#e9530a] rotate-[-15deg]" />
          <div className="absolute bottom-9 left-0 text-3xl leading-none text-[#e9530a]">
            x
          </div>
        </div>
        <div
          className="pointer-events-none absolute right-8 top-0 hidden h-full w-28 border-x border-[#e5ebf3] bg-[linear-gradient(0deg,rgba(188,202,220,0.55)_1px,transparent_1px)] bg-[size:100%_42px] opacity-70 xl:block"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-7 px-5 pb-4 pt-10 sm:px-6 lg:min-h-[36rem] lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10 lg:px-16 lg:pb-0 lg:pt-8 xl:grid-cols-[minmax(0,1fr)_25rem] xl:px-10">
          <div className="relative min-h-[31rem] min-w-0 [container-type:inline-size] sm:min-h-[38rem] lg:min-h-[43rem]">
            <div className="relative z-20 mx-auto w-full max-w-full">
              <h1 className="w-full whitespace-nowrap text-center font-serif text-[clamp(3.55rem,14.5vw,6.8rem)] font-medium leading-[0.82] tracking-normal sm:text-[clamp(6rem,13.8vw,8.2rem)] lg:text-left lg:text-[clamp(5.6rem,16cqw,8.7rem)]">
                Put memory
              </h1>

              <div className="mx-auto mt-1 flex max-w-none items-end justify-center gap-4 whitespace-nowrap lg:mx-0 lg:w-fit lg:max-w-full lg:justify-start lg:gap-5">
                <p className="min-w-0 font-serif text-[clamp(3.7rem,15vw,7.8rem)] leading-[0.78] tracking-normal lg:text-[clamp(5.15rem,14.2cqw,8rem)]">
                  in its
                </p>
                <p className="min-w-0 font-serif text-[clamp(3.85rem,15.5vw,8rem)] leading-[0.78] tracking-normal text-[#e9530a] lg:text-[clamp(5.3rem,14.8cqw,8.25rem)]">
                  place
                </p>
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-7 w-[min(92vw,23rem)] sm:mt-9 sm:w-[min(82vw,45rem)] lg:mt-8 lg:w-full xl:max-w-[50rem]">
              <MemoryPalaceViolinDemo
                autoPlay
                heroPreview
                initialStep="Palace"
                className="mx-auto max-w-full rounded-lg shadow-[0_22px_58px_rgba(15,23,42,0.18)]"
              />
            </div>

            <p className="relative z-20 mt-4 hidden max-w-[13rem] rotate-[-8deg] font-mono text-base leading-6 text-[#7890b5] lg:block">
              A place beats repetition.
            </p>
          </div>

          <div className="flex items-center justify-center border-[#e0e5ed] lg:items-start lg:border-l lg:pl-10 lg:pt-[8.75rem] xl:pl-14 xl:pt-[8.25rem]">
            <Hero />
          </div>
        </div>
      </section>

      <section className="bg-[#fdfdfb]">
        <div className="mx-4 my-6 grid max-w-7xl grid-cols-4 divide-x divide-dashed divide-[#aeb8c8] rounded-[8px] border border-[#e1e6ee] bg-white/80 px-0 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.1)] sm:mx-6 lg:mx-auto lg:my-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-10 lg:py-7 lg:shadow-none">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="grid min-w-0 justify-items-center gap-2 px-2 py-2 text-center lg:grid-cols-[auto_4.5rem_1fr] lg:justify-items-start lg:gap-5 lg:px-7 lg:py-2 lg:text-left"
              >
                <span className="font-serif text-3xl leading-none text-[#e9530a] lg:text-3xl">
                  {step.number}
                </span>
                <Icon className="size-12 stroke-[1.35] text-[#31573a]" />
                <div>
                  <h2 className="text-base font-medium text-[#111318] sm:text-xl lg:text-base lg:font-bold">
                    {step.title}
                  </h2>
                  <p className="mt-2 hidden max-w-[12rem] text-sm leading-5 text-[#3f4653] lg:block">
                    {step.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Home;
