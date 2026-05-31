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
  Landmark,
} from "lucide-react";
import { Container } from "../Container";

const mobileLabelPositions = [
  "left-[10%] top-[30%]",
  "left-[39%] top-[50%]",
  "right-[7%] top-[61%]",
];

const keywordEmoji = (keyword: string) => {
  const normalizedKeyword = keyword.toLowerCase();

  if (normalizedKeyword.includes("fig")) return "🍇";
  if (normalizedKeyword.includes("apple")) return "🍎";
  if (normalizedKeyword.includes("carrot")) return "🥕";
  if (normalizedKeyword.includes("banana")) return "🍌";
  if (normalizedKeyword.includes("orange")) return "🍊";
  if (normalizedKeyword.includes("grape")) return "🍇";
  if (normalizedKeyword.includes("kiwi")) return "🥝";
  if (normalizedKeyword.includes("watermelon")) return "🍉";
  if (normalizedKeyword.includes("lemon")) return "🍋";
  if (normalizedKeyword.includes("strawberry")) return "🍓";

  return "✦";
};

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
    slideSelected * 3 + 3
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
        <section className="relative min-h-[52svh] overflow-hidden bg-[#17351d]">
          <Image
            src={palace.images[slideSelected] || "/placeholder.svg"}
            alt="Memory palace scene"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />

          <button
            type="button"
            onClick={goBack}
            disabled={isFirstSlide}
            aria-label="Back"
            className="absolute left-4 top-9 z-20 flex h-8 w-8 items-center justify-center text-white disabled:opacity-45"
          >
            <ArrowLeft className="h-6 w-6 stroke-[3]" />
          </button>

          <h1 className="absolute left-[16%] right-24 top-9 z-20 text-[clamp(0.95rem,5.1vw,1.35rem)] font-extrabold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            {palace.title}
          </h1>

          <div className="absolute right-4 top-6 z-20 rounded-2xl bg-[#101923]/85 px-3.5 py-2.5 text-white shadow-2xl backdrop-blur-md">
            <div className="text-center text-lg font-extrabold leading-none">
              {slideSelected + 1}/{palace.images.length}
            </div>
            <div className="mt-2.5 flex items-center justify-center gap-2">
              {palace.images.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === slideSelected ? "bg-[#5fda45]" : "bg-white/55"
                  }`}
                />
              ))}
            </div>
          </div>

          {currentWords.map((keyword, index) => (
            <div
              key={`${keyword}-${index}`}
              className={`absolute z-10 flex items-center gap-1.5 rounded-xl bg-white/95 py-1 pl-1 pr-3 text-sm font-bold text-[#10212c] shadow-[0_10px_24px_rgba(16,33,44,0.22)] ${
                mobileLabelPositions[index] || "left-6 top-1/2"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#207b35] text-base font-extrabold text-white">
                {slideSelected * 3 + index + 1}
              </span>
              <span className="max-w-[5.5rem] truncate">{keyword}</span>
            </div>
          ))}
        </section>

        <section className="relative z-20 -mt-7 rounded-t-[1.65rem] bg-white px-5 pb-24 pt-3.5 shadow-[0_-18px_38px_rgba(13,32,23,0.16)]">
          <div className="mx-auto mb-5 h-1 w-20 rounded-full bg-black/25" />

          <div className="flex gap-3.5">
            <Eye className="mt-0.5 h-6 w-6 shrink-0 text-[#1f6e2d]" />
            <p className="text-[1rem] font-extrabold leading-snug text-[#1f6e2d]">
              Visualize the scene and connect each keyword to a place.
            </p>
          </div>

          <div className="my-4 h-px bg-black/15" />

          <div className="flex gap-3.5">
            <BookOpen className="mt-0.5 h-7 w-7 shrink-0 text-[#1f6e2d]" />
            <p
              className="text-[0.98rem] leading-snug text-[#10212c]"
              dangerouslySetInnerHTML={{ __html: currentSentences }}
            />
          </div>

          <div className="my-4 h-px bg-black/15" />

          <h2 className="text-base font-extrabold text-[#1f6e2d]">
            Story Keywords
          </h2>
          <div className="mt-3 flex gap-2.5 overflow-x-auto pb-2">
            {currentWords.map((keyword, index) => (
              <div
                key={`${keyword}-chip-${index}`}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-[#d7eadb] bg-[#f4faf5] py-1.5 pl-2.5 pr-3 text-sm text-[#10212c] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#207b35] text-sm font-extrabold text-white">
                  {slideSelected * 3 + index + 1}
                </span>
                <span className="text-xl leading-none">{keywordEmoji(keyword)}</span>
                <span className="max-w-[6.5rem] truncate">{keyword}</span>
              </div>
            ))}
          </div>
        </section>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 border-t border-black/10 bg-white px-4 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_26px_rgba(16,33,44,0.1)]">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={isFirstSlide}
            className="h-11 rounded-xl border-2 border-[#17682a] bg-white px-3 text-sm font-extrabold text-[#17682a] disabled:opacity-45"
          >
            <ChevronLeft className="mr-1 h-[1.125rem] w-[1.125rem] stroke-[3]" />
            Back
          </Button>

          <Link
            href="/"
            aria-label="Go to Memory Palace home"
            className="flex min-w-16 flex-col items-center justify-center text-[#17682a]"
          >
            <Landmark className="h-6 w-6" />
            <span className="mt-0.5 whitespace-nowrap text-[0.65rem] font-semibold">
              Memory Palace
            </span>
          </Link>

          <Button
            onClick={goNext}
            className="h-11 rounded-xl bg-[#17682a] px-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(23,104,42,0.28)] hover:bg-[#17682a]/95"
          >
            {isLastSlide ? "Complete" : "Next"}
            {isLastSlide ? (
              <BookOpen className="ml-1 h-[1.125rem] w-[1.125rem]" />
            ) : (
              <ChevronRight className="ml-1 h-[1.125rem] w-[1.125rem] stroke-[3]" />
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
            <Button variant="outline" onClick={goBack} disabled={isFirstSlide}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
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
