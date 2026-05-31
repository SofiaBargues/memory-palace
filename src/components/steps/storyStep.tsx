import React from "react";
import { Palace } from "../../app/api/v1/generate/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Container } from "../Container";

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
      <div className="fixed inset-0 z-50 min-h-[100svh] overflow-y-auto bg-white text-[#10212c] md:hidden">
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

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-[#dfe4ec] bg-[#fdfdfb] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_26px_rgba(16,33,44,0.1)]">
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

          <Link
            href="/"
            aria-label="Go home"
            className="flex min-w-20 flex-col items-center justify-center text-black"
          >
            <Image
              src="/castle.svg"
              alt=""
              width={26}
              height={26}
              className="object-contain"
            />
          </Link>

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

      <Container>
        <div className="hidden md:block">
          <div className="py-4">
            <h1 className="md:text-3xl text-2xl font-bold tracking-tight">
              {palace.title}
            </h1>
            <p className="text-muted-foreground  mt-2">
              Read carefully and visualize the story. Try to associate each
              keyword with a location in your memory palace.
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="relative  aspect-square overflow-hidden rounded-lg max-w-72 m-auto">
                <Image
                  src={palace.images[slideSelected] || "/placeholder.svg"}
                  alt="History viewed"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <p
                  className="md:text-lg text-md leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: currentSentences,
                  }}
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Key words to remember:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentWords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-4">
            {isFirstSlide ? (
              <Button asChild variant="outline">
                <Link href="/palaces">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {slideSelected + 1} of {palace.images.length}
              </span>
            </div>
            <Button onClick={goNext}>
              {!isLastSlide ? (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Complete reading <BookOpen className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
