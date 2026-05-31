"use client";

import Hero from "@/components/hero";
import MemoryPalaceViolinDemo from "@/components/memory-palace-violin-demo";

const Home = () => {
  return (
    <main className="min-h-[calc(100vh-84px)] overflow-hidden bg-[#fdfdfb] text-[#101216]">
      <section className="relative border-b border-[#b8c0cc]">

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-4 py-5 sm:px-6 lg:min-h-[38rem] lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10 lg:px-10 lg:py-8 xl:grid-cols-[minmax(0,1fr)_25rem]">
          <div className="relative min-w-0">
            <h1 className="relative z-10 mx-auto max-w-none whitespace-nowrap text-center font-serif text-[clamp(3rem,13vw,5.8rem)] font-medium leading-[0.9] tracking-normal lg:mx-0 lg:text-left lg:text-[clamp(7rem,8.6vw,9.4rem)]">
              Put memory
            </h1>

            <div className="relative z-20 mx-auto mt-0 w-full max-w-[42rem] lg:mt-[-0.2rem] lg:h-[470px] xl:max-w-[46rem]">
              <div className="origin-top lg:scale-[0.82] xl:scale-[0.86]">
                <MemoryPalaceViolinDemo className="mx-auto max-w-full lg:rounded-lg lg:shadow-[0_20px_52px_rgba(15,23,42,0.17)]" />
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-[-0.55rem] grid max-w-[42rem] grid-cols-[minmax(0,1fr)_auto] items-end gap-4 lg:gap-8 xl:max-w-[46rem]">
              <p className="font-serif text-[clamp(3.9rem,13vw,7.4rem)] leading-[0.78] tracking-normal lg:text-[clamp(6.4rem,7.3vw,8rem)]">
                in its
              </p>
              <p className="font-serif text-[clamp(4.1rem,13vw,7.6rem)] leading-[0.78] tracking-normal text-[#e9530a] lg:text-[clamp(6.6rem,7.5vw,8.2rem)]">
                place
              </p>
            </div>

            <p className="mt-7 hidden max-w-[13rem] rotate-[-8deg] font-mono text-base leading-6 text-[#7890b5] lg:block">
              A place beats repetition.
            </p>
          </div>

          <div className="flex items-center justify-center border-[#e0e5ed] lg:border-l lg:pl-10 xl:pl-14">
            <Hero />
          </div>
        </div>
      </section>

      {/* <section className="bg-[#fdfdfb]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-dashed divide-[#c7ced8] px-4 py-7 sm:px-6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4 lg:px-10">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="grid grid-cols-[auto_4.5rem_1fr] gap-5 px-0 py-5 md:px-7 md:py-2"
              >
                <span className="font-serif text-3xl leading-none text-[#e9530a]">
                  {step.number}
                </span>
                <Icon className="size-12 stroke-[1.35] text-[#31573a]" />
                <div>
                  <h2 className="text-base font-bold text-[#111318]">
                    {step.title}
                  </h2>
                  <p className="mt-2 max-w-[12rem] text-sm leading-5 text-[#3f4653]">
                    {step.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section> */}
    </main>
  );
};

export default Home;
