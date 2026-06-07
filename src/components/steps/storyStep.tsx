import React from "react";
import { Palace } from "../../app/api/v1/generate/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

export function StoryStep({
  palace,
  setSlideSelected,
  slideSelected,
  onFinishClick,
}: {
  palace: Palace;
  setSlideSelected: (slide: number) => void;
  slideSelected: number;
  onFinishClick: () => void;
}) {
  const currentWords = palace.words.slice(
    slideSelected * 3,
    slideSelected * 3 + 3,
  );
  const currentSentences = palace.sentences
    .slice(slideSelected * 3, slideSelected * 3 + 3)
    .join(" ");
  const fullStory = palace.sentences.join(" ");
  const isFirstSlide = slideSelected === 0;
  const isLastSlide = slideSelected === palace.images.length - 1;

  const goBack = () => {
    if (!isFirstSlide) {
      setSlideSelected(slideSelected - 1);
    }
  };

  const goNext = () => {
    if (isLastSlide) {
      onFinishClick();
    } else {
      setSlideSelected(slideSelected + 1);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 min-h-[100svh] overflow-y-auto bg-white text-[#10212c] lg:hidden">
        <section className="relative min-h-[56svh] overflow-hidden bg-black">
          <Image
            src={palace.images[slideSelected] || "/placeholder.svg"}
            alt="Memory palace scene"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

          {isFirstSlide ? (
            <Link
              href="/palaces"
              aria-label="Back to palaces"
              className="absolute left-4 top-10 z-20 flex h-9 w-9 items-center justify-center text-white"
            >
              <ArrowLeft className="h-7 w-7 stroke-[3]" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={goBack}
              aria-label="Back"
              className="absolute left-4 top-10 z-20 flex h-9 w-9 items-center justify-center text-white"
            >
              <ArrowLeft className="h-7 w-7 stroke-[3]" />
            </button>
          )}

          <h1 className="absolute left-[16%] right-24 top-10 z-20 text-[clamp(0.92rem,4.6vw,1.2rem)] font-extrabold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            {palace.title}
          </h1>

          <div className="absolute right-4 top-8 z-20 rounded-[0.85rem] bg-[#101923]/85 px-3 py-2.5 text-white shadow-2xl backdrop-blur-md">
            <div className="text-center text-base font-extrabold leading-none">
              {slideSelected + 1}/{palace.images.length}
            </div>
            <div className="mt-2.5 flex items-center justify-center gap-2">
              {palace.images.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === slideSelected ? "bg-[#e9530a]" : "bg-white/55"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-20 -mt-8 rounded-t-[1.9rem] bg-white px-6 pb-28 pt-4 shadow-[0_-18px_38px_rgba(13,32,23,0.16)]">
       

          <div className="flex gap-4">
            <Eye className="mt-0.5 h-7 w-7 shrink-0 text-black" />
            <p className="text-[1.2rem] font-extrabold leading-snug text-black">
              Visualize the scene and connect each keyword to a place.
            </p>
          </div>

          <div className="my-5 h-px bg-black/15" />

          <div className="flex gap-4">
            <BookOpen className="mt-0.5 h-8 w-8 shrink-0 text-black" />
            <p
              className="text-[1.1rem] leading-snug text-[#10212c]"
              dangerouslySetInnerHTML={{ __html: currentSentences }}
            />
          </div>

          <div className="my-5 h-px bg-black/15" />

          <h2 className="text-[1.15rem] font-extrabold text-black">
            Story Keywords
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-2.5 pb-2">
            {currentWords.map((keyword, index) => (
              <div
                key={`${keyword}-chip-${index}`}
                className="flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-black/15 bg-white py-2 pl-2 pr-2.5 text-sm text-[#10212c] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-sm font-extrabold text-white">
                  {slideSelected * 3 + index + 1}
                </span>
                <span className="min-w-0 truncate">{keyword}</span>
              </div>
            ))}
          </div>
        </section>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 items-center gap-3 border-t border-[#dfe4ec] bg-[#fdfdfb] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_26px_rgba(16,33,44,0.1)]">
          {isFirstSlide ? (
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-[5px] border-2 border-black bg-white px-3 text-base font-extrabold text-black"
            >
              <Link href="/palaces">
                <ChevronLeft className="mr-1.5 h-5 w-5 stroke-[3]" />
                Back
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={goBack}
              className="h-12 rounded-[5px] border-2 border-black bg-white px-3 text-base font-extrabold text-black"
            >
              <ChevronLeft className="mr-1.5 h-5 w-5 stroke-[3]" />
              Back
            </Button>
          )}

          <Button
            onClick={goNext}
            className="h-12 rounded-[5px] bg-[#e9530a] px-3 text-base font-extrabold text-white shadow-[0_12px_24px_rgba(233,83,10,0.26)] hover:bg-[#d94c08]"
          >
            {isLastSlide ? "Complete" : "Next"}
            {isLastSlide ? (
              <BookOpen className="ml-1.5 h-5 w-5" />
            ) : (
              <ChevronRight className="ml-1.5 h-5 w-5 stroke-[3]" />
            )}
          </Button>
        </nav>
      </div>

      <div className="hidden lg:block">
        <section className="bg-white px-5 pb-4 pt-4 text-[#10212c] xl:px-8">
          <div className="mx-auto max-w-[1640px]">
            <div className="grid min-h-[calc(100vh_-_166px)] grid-cols-[minmax(0,1.45fr)_minmax(520px,640px)] gap-0 overflow-hidden bg-[#111820]">
              <div className="relative min-h-[640px] overflow-hidden bg-black">
                <Image
                  src={palace.images[slideSelected] || "/placeholder.svg"}
                  alt="Memory palace scene"
                  fill
                  priority
                  sizes="calc(100vw - 500px)"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.26)_100%)]" />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/62 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/44 to-transparent" />

                <div className="absolute left-7 right-7 top-7 z-20 flex items-start gap-5">
                  {isFirstSlide ? (
                    <Link
                      href="/palaces"
                      aria-label="Back to palaces"
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] bg-[#101923]/88 text-white shadow-[0_12px_30px_rgba(0,0,0,0.32)] backdrop-blur-md transition hover:bg-[#101923]"
                    >
                      <ArrowLeft className="h-8 w-8 stroke-[3]" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={goBack}
                      aria-label="Back"
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] bg-[#101923]/88 text-white shadow-[0_12px_30px_rgba(0,0,0,0.32)] backdrop-blur-md transition hover:bg-[#101923]"
                    >
                      <ArrowLeft className="h-8 w-8 stroke-[3]" />
                    </button>
                  )}

                  <h1 className="max-w-[640px] pt-2 text-[clamp(2rem,3vw,3.1rem)] font-extrabold leading-none tracking-normal text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.42)]">
                    {palace.title}
                  </h1>
                </div>

                <div className="absolute right-7 top-7 z-20 rounded-[0.85rem] bg-[#101923]/90 px-4 py-3 text-white shadow-2xl backdrop-blur-md">
                <div className="text-center text-xl font-extrabold leading-none">
                  {slideSelected + 1}/{palace.images.length}
                </div>
                <div className="mt-3 flex items-center justify-center gap-2.5">
                  {palace.images.map((_, index) => (
                    <span
                      key={index}
                      className={`h-2.5 w-2.5 rounded-full ${
                        index === slideSelected ? "bg-[#e9530a]" : "bg-white/55"
                      }`}
                    />
                  ))}
                </div>
              </div>
              </div>

              <div className="flex items-start justify-center bg-[#111820]/70 px-6 py-7 xl:px-8">
              <article className="max-h-[calc(100vh_-_220px)] w-full overflow-y-auto rounded-[8px] bg-white px-8 py-9 shadow-[0_24px_70px_rgba(0,0,0,0.28)] ring-1 ring-black/10 xl:px-11 xl:py-10">
                <div className="flex gap-6">
                  <Eye className="mt-1 h-8 w-8 shrink-0 text-black" />
                  <p className="text-[clamp(1.25rem,1.55vw,1.5rem)] font-extrabold leading-snug text-black">
                    Visualize the scene and connect each keyword to a place.
                  </p>
                </div>

                <div className="my-9 h-px bg-black/18" />

                <div className="flex gap-6">
                  <BookOpen className="mt-1 h-9 w-9 shrink-0 text-black" />
                  <p
                    className="text-[clamp(1rem,1.18vw,1.16rem)] leading-[1.7] text-[#10212c] [&_b]:font-extrabold [&_strong]:font-extrabold"
                    dangerouslySetInnerHTML={{ __html: fullStory }}
                  />
                </div>

                <div className="my-9 h-px bg-black/18" />

                <h2 className="text-[1.28rem] font-extrabold text-black">
                  Story Keywords
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-2">
                  {palace.words.map((keyword, index) => (
                    <div
                      key={`${keyword}-desktop-chip-${index}`}
                      className="flex min-w-0 items-center gap-3 rounded-[8px] border border-black/15 bg-white px-3.5 py-3 text-base text-[#10212c] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-base font-extrabold text-white">
                        {index + 1}
                      </span>
                      <span className="min-w-0 whitespace-normal break-words font-medium leading-snug">
                        {keyword}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="my-8 h-px bg-black/18" />

                <nav className="grid grid-cols-2 items-center gap-4">
                  {isFirstSlide ? (
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 rounded-[5px] border-2 border-black bg-white text-base font-extrabold text-black hover:bg-white/85"
                    >
                      <Link href="/palaces">
                        <ChevronLeft className="mr-3 h-5 w-5 stroke-[3]" />
                        Back
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={goBack}
                      className="h-12 rounded-[5px] border-2 border-black bg-white text-base font-extrabold text-black hover:bg-white/85"
                    >
                      <ChevronLeft className="mr-3 h-5 w-5 stroke-[3]" />
                      Back
                    </Button>
                  )}

                  <Button
                    onClick={goNext}
                    className="h-12 rounded-[5px] bg-[#e9530a] text-base font-extrabold text-white shadow-[0_16px_30px_rgba(233,83,10,0.26)] hover:bg-[#d94c08]"
                  >
                    {isLastSlide ? "Complete" : "Next"}
                    {isLastSlide ? (
                      <BookOpen className="ml-3 h-5 w-5" />
                    ) : (
                      <ChevronRight className="ml-3 h-5 w-5 stroke-[3]" />
                    )}
                  </Button>
                </nav>
              </article>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
