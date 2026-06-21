"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Palace } from "../../app/api/v1/generate/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const INTRO_STORAGE_PREFIX = "memory-palace-intro-seen";
const INTRO_TEXT = "Visualize the scene and connect each keyword to a place.";
const SCENE_IMAGE_SIZES =
  "(min-width: 1280px) 54vw, (min-width: 1024px) 58vw, 100vw";

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
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [desktopImageRatio, setDesktopImageRatio] = useState(16 / 9);
  const [showIntroPopup, setShowIntroPopup] = useState(false);
  const currentWords = palace.words.slice(
    slideSelected * 3,
    slideSelected * 3 + 3,
  );
  const currentParagraphs = palace.sentences.slice(
    slideSelected * 3,
    slideSelected * 3 + 3,
  );
  const isFirstSlide = slideSelected === 0;
  const isLastSlide = slideSelected === palace.images.length - 1;
  const palaceIntroKey = useMemo(() => {
    const palaceId = (palace as Palace & { _id?: string })._id;
    const stablePalaceId =
      palaceId ||
      [palace.title, palace.images[0], palace.words.join("|")].join(":");

    return `${INTRO_STORAGE_PREFIX}:${stablePalaceId}`;
  }, [palace]);

  useEffect(() => {
    if (!isFirstSlide) {
      setShowIntroPopup(false);
      return;
    }

    setShowIntroPopup(localStorage.getItem(palaceIntroKey) !== "true");
  }, [isFirstSlide, palaceIntroKey]);

  useEffect(() => {
    mobileScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [slideSelected]);

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

  const closeIntroPopup = () => {
    localStorage.setItem(palaceIntroKey, "true");
    setShowIntroPopup(false);
  };

  const updateImageRatio = (image: HTMLImageElement) => {
    if (!image.naturalWidth || !image.naturalHeight) {
      return;
    }

    setDesktopImageRatio(image.naturalWidth / image.naturalHeight);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-hidden bg-[#183026] text-[#10212c] lg:hidden"
        style={
          {
            "--scene-image-ratio": desktopImageRatio,
          } as React.CSSProperties
        }
      >
        <section className="absolute inset-x-0 top-0 overflow-hidden bg-black [height:min(calc(100vw/var(--scene-image-ratio)),62svh)]">
          <Image
            src={palace.images[slideSelected] || "/placeholder.svg"}
            alt="Memory palace scene"
            fill
            priority
            sizes={SCENE_IMAGE_SIZES}
            className={`object-contain transition duration-300 ${
              showIntroPopup ? "blur-sm scale-[1.02]" : ""
            }`}
            onLoad={(event) => updateImageRatio(event.currentTarget)}
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

          <div className="absolute right-7 top-7 z-20 rounded-[0.85rem] bg-[#101923]/88 px-4 py-3 text-white shadow-2xl backdrop-blur-md">
            <div className="text-center text-base font-extrabold leading-none">
              {slideSelected + 1}/{palace.images.length}
            </div>
            <div className="mt-2.5 flex items-center justify-center gap-2">
              {palace.images.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === slideSelected ? "bg-white" : "bg-white/55"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <div
          className="fixed inset-x-0 bottom-0 z-[60] flex h-auto max-h-[calc(100svh-(min(calc(100vw/var(--scene-image-ratio)),62svh)*0.8))] flex-col overflow-hidden rounded-t-[1.9rem] border-0 bg-white pt-0 shadow-[0_-18px_38px_rgba(13,32,23,0.16)] outline-none lg:hidden"
          style={
            {
              "--scene-image-ratio": desktopImageRatio,
            } as React.CSSProperties
          }
        >
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
          <h2 className="sr-only">Memory palace story</h2>
          <p className="sr-only">
            Read the scene and review the keywords for this step.
          </p>

          <div
            ref={mobileScrollRef}
            className={`flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-24 pt-5 transition duration-300 ${
              showIntroPopup ? "blur-sm" : ""
            }`}
          >
              <div className="flex flex-1 items-center gap-4 py-6">
                <BookOpen className="mt-0.5 h-8 w-8 shrink-0 self-start text-black" />
                <div className="space-y-5 text-[1.02rem] leading-[1.5] text-[#10212c] [&_b]:font-extrabold [&_strong]:font-extrabold">
                  {currentParagraphs.map((sentence, index) => (
                    <p
                      key={`${slideSelected}-mobile-sentence-${index}`}
                      dangerouslySetInnerHTML={{ __html: sentence }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-auto h-px bg-black/15" />

              <h2 className="mt-4 text-[1rem] font-extrabold   text-muted-foreground">
                Story Keywords
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-2.5 pb-2">
                {currentWords.map((keyword, index) => (
                  <div
                    key={`${keyword}-chip-${index}`}
                    className="flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-black/15 bg-white py-2 pl-2 pr-2.5 text-sm text-[#10212c] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full  text-sm font-extrabold  text-muted-foreground">
                      {slideSelected * 3 + index + 1}
                    </span>
                    <span className="min-w-0 truncate">{keyword}</span>
                  </div>
                ))}
              </div>
            </div>

            <nav
              data-vaul-no-drag
              className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-2 items-center gap-3  border-black/10 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_26px_rgba(0,0,0,0.1)]"
            >
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
                className="h-12 rounded-[5px] bg-black px-3 text-base font-extrabold text-white shadow-[0_12px_24px_rgba(0,0,0,0.24)] hover:bg-[#262626]"
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
      </div>

      <div className="hidden lg:block">
        <section className="bg-white px-5 pb-4 pt-4 text-[#10212c] xl:px-8">
          <div className="mx-auto max-w-[1640px]">
            <div
              className="mx-auto grid w-fit max-w-full items-stretch overflow-hidden rounded-[8px] bg-white shadow-[0_18px_46px_rgba(17,24,32,0.16)]"
              style={{
                gridTemplateColumns:
                  "minmax(0, auto) minmax(390px, clamp(390px, 42vw, 600px))",
              }}
            >
              <div
                className="relative min-w-[360px] overflow-hidden bg-white"
                style={{
                  aspectRatio: desktopImageRatio,
                  width: `clamp(440px, min(54vw, calc((100vh - 166px) * ${desktopImageRatio})), 980px)`,
                }}
              >
                <Image
                  src={palace.images[slideSelected] || "/placeholder.svg"}
                  alt="Memory palace scene"
                  fill
                  priority
                  sizes={SCENE_IMAGE_SIZES}
                  className={`object-contain object-center transition duration-300 ${
                    showIntroPopup ? "blur-sm scale-[1.02]" : ""
                  }`}
                  onLoad={(event) => updateImageRatio(event.currentTarget)}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.26)_100%)]" />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/62 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/44 to-transparent" />

                <div className="absolute left-7 right-28 top-7 z-20 flex items-start gap-5">
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

                <div className="absolute right-7 top-7 z-20 rounded-[0.85rem] bg-[#101923]/88 px-4 py-3 text-white shadow-2xl backdrop-blur-md">
                  <div className="text-center text-xl font-extrabold leading-none">
                    {slideSelected + 1}/{palace.images.length}
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2.5">
                    {palace.images.map((_, index) => (
                      <span
                        key={index}
                        className={`h-2.5 w-2.5 rounded-full ${
                          index === slideSelected ? "bg-white" : "bg-white/55"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="z-30 -ml-[10px] flex min-h-0 w-[calc(100%+10px)] items-stretch justify-center">
                <article
                  className={`flex h-full w-full flex-col overflow-hidden rounded-l-[8px] border border-black/10 bg-white px-8 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition duration-300 xl:px-10 xl:py-6 ${
                    showIntroPopup ? "blur-sm" : ""
                  }`}
                >
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex min-h-0 flex-1 items-center gap-6 py-5">
                      <BookOpen className="mt-1 h-8 w-8 shrink-0 self-start text-black" />
                      <div className="max-w-[560px] space-y-6 text-[clamp(0.94rem,1vw,1rem)] leading-[1.6] text-[#10212c] [&_b]:font-extrabold [&_strong]:font-extrabold">
                        {currentParagraphs.map((sentence, index) => (
                          <p
                            key={`${slideSelected}-desktop-sentence-${index}`}
                            dangerouslySetInnerHTML={{ __html: sentence }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <div className="mb-5 h-px bg-black/18" />

                      <h2 className="text-[1.16rem] font-extrabold  text-muted-foreground">
                        Story Keywords
                      </h2>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        {currentWords.map((keyword, index) => (
                          <div
                            key={`${keyword}-desktop-chip-${index}`}
                            className="flex min-w-0 items-center gap-2.5 rounded-[8px] border border-black/15 bg-white px-3 py-2 text-sm text-[#10212c] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold  text-muted-foreground"></span>
                            <span className="min-w-0 whitespace-normal break-words font-medium leading-snug">
                              {keyword}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <nav className="grid grid-cols-2 items-center gap-4 pt-5">
                      {isFirstSlide ? (
                        <Button
                          asChild
                          variant="outline"
                          className="h-11 rounded-[5px] border-2 border-black bg-white text-base font-extrabold text-black hover:bg-white/85"
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
                          className="h-11 rounded-[5px] border-2 border-black bg-white text-base font-extrabold text-black hover:bg-white/85"
                        >
                          <ChevronLeft className="mr-3 h-5 w-5 stroke-[3]" />
                          Back
                        </Button>
                      )}

                      <Button
                        onClick={goNext}
                        className="h-11 rounded-[5px] bg-black text-base font-extrabold text-white shadow-[0_16px_30px_rgba(0,0,0,0.24)] hover:bg-[#262626]"
                      >
                        {isLastSlide ? "Complete" : "Next"}
                        {isLastSlide ? (
                          <BookOpen className="ml-3 h-5 w-5" />
                        ) : (
                          <ChevronRight className="ml-3 h-5 w-5 stroke-[3]" />
                        )}
                      </Button>
                    </nav>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showIntroPopup ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-describedby="palace-intro-copy"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/28 px-4 backdrop-blur-[2px]"
        >
          <div className="relative w-full max-w-[385px] rounded-[13px] bg-white px-9 pb-7 pt-16 text-center text-black shadow-[0_22px_64px_rgba(0,0,0,0.38)] ring-1 ring-black/10 sm:max-w-[430px] sm:px-11">
            <button
              type="button"
              onClick={closeIntroPopup}
              aria-label="Close introduction"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/8 text-black transition hover:bg-black/14"
            >
              <X className="h-7 w-7 stroke-[3]" />
            </button>

            <p
              id="palace-intro-copy"
              className="mx-auto max-w-[320px] text-[clamp(1.18rem,5vw,1.35rem)] font-extrabold leading-[1.35] tracking-normal"
            >
              {INTRO_TEXT}
            </p>

            <Button
              type="button"
              onClick={closeIntroPopup}
              className="mt-9 h-[60px] w-full rounded-[10px] bg-black text-[clamp(1rem,4.8vw,1.13rem)] font-extrabold text-white shadow-[0_9px_20px_rgba(0,0,0,0.24)] hover:bg-[#1f1f1f]"
            >
              I understand
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
