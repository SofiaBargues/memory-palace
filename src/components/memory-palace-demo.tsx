"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Check, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const WORDS = [
  "Apple",
  "Banana",
  "Orange",
  "Strawberry",
  "Pineapple",
  "Mango",
  "Watermelon",
  "Grape",
  "Kiwi",
];

const PALACE_LOCATIONS = [
  {
    id: 1,
    name: "Plaza",
    image: "/images/story-1-park.jpg",
    title: "A Day of Unexpected Adventures",
    story:
      "I packed a snack and headed to the park. I took a bite of my crisp **apple**. A playful monkey offered me a **banana**, and on my way home I enjoyed a juicy **orange**.",
    keywords: ["apple", "banana", "orange"],
    wordIndices: [0, 1, 2],
  },
  {
    id: 2,
    name: "Cascadas",
    image: "/images/story-2-waterfall.jpg",
    title: "A Trail Through the Waterfall",
    story:
      "I followed a hidden trail and discovered a sparkling waterfall. I picked a **strawberry**, found a giant **pineapple**, and blended a ripe **mango** into a smoothie.",
    keywords: ["strawberry", "pineapple", "mango"],
    wordIndices: [3, 4, 5],
  },
  {
    id: 3,
    name: "Clinic",
    image: "/images/story-3-medical.jpg",
    title: "The Last Room at Night",
    story:
      "Under bright hallway lights I ate a slice of **watermelon**, shared a sweet **grape**, and finished with a tangy **kiwi** before leaving the palace.",
    keywords: ["watermelon", "grape", "kiwi"],
    wordIndices: [6, 7, 8],
  },
];

const STORY_STEP_DELAY_MS = 2100;

const LOCATION_DISPLAY_NAMES: Record<string, string> = {
  Plaza: "Plaza",
  Cascadas: "Cascadas",
  Clinic: "Medical facility",
};

const LOCATION_ICONS: Record<string, JSX.Element> = {
  Plaza: (
    <svg viewBox="0 0 170 92" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="#111827" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1">
        <path d="M7 76H143" />
        <path d="M27 76H50M58 76H99M111 76H140" />
        <path d="M35 73V33" />
        <path d="M31 73H39" />
        <path d="M31 46H39" />
        <path d="M33 33H37L39 23H31L33 33Z" />
        <path d="M32 23L35 17L38 23" />
        <path d="M28 29H42" />
        <path d="M63 76V50H107V76" />
        <path d="M58 50H112" />
        <path d="M61 58H109" />
        <path d="M61 66H109" />
        <path d="M124 77V21" />
        <path d="M124 47L108 32" />
        <path d="M124 54L140 39" />
        <path d="M113 77C103 78 101 66 109 61C100 55 104 41 113 42C109 30 119 19 130 25C134 14 150 15 151 29C162 31 166 46 157 54C166 63 158 79 143 76" />
        <path d="M117 76C119 69 127 69 130 76" />
      </g>
    </svg>
  ),
  Cascadas: (
    <svg viewBox="0 0 150 102" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="#111827" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1">
        <path d="M29 86C17 80 20 65 31 62C25 52 33 39 43 42C45 27 57 20 67 28C77 18 95 24 97 40C108 39 116 50 110 60C125 61 131 80 116 88" />
        <path d="M51 87C45 78 49 69 55 65C60 58 58 49 62 39" />
        <path d="M75 88C68 78 71 66 75 59C80 49 77 38 82 30" />
        <path d="M94 88C88 80 89 69 95 62C101 55 99 45 103 38" />
        <path d="M47 89C58 96 88 96 105 89" />
        <path d="M20 91H127" />
        <path d="M18 62C13 59 12 54 17 51C20 45 29 47 30 53" />
        <path d="M119 51C122 45 132 46 134 53C141 52 144 61 137 65" />
        <path d="M10 72C15 70 20 72 22 76" />
        <path d="M128 75C133 72 139 73 143 77" />
        <path d="M31 91C28 83 35 78 40 84" />
        <path d="M116 91C119 82 111 78 106 85" />
      </g>
    </svg>
  ),
  Clinic: (
    <svg viewBox="0 0 150 104" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="#111827" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1">
        <path d="M23 91H127" />
        <path d="M38 91V25H112V91" />
        <path d="M30 57H38" />
        <path d="M112 57H121" />
        <path d="M51 91V48H99V91" />
        <path d="M64 91V61H85V91" />
        <path d="M57 54H93" />
        <path d="M68 74L75 66" />
        <path d="M88 79L94 72" />
        <path d="M71 31H80V22H90V31H99V41H90V50H80V41H71V31Z" />
        <path d="M24 91V75" />
        <path d="M19 75H29" />
        <path d="M21 69C15 64 17 55 25 55C32 56 34 65 28 69" />
        <path d="M126 91V75" />
        <path d="M121 75H131" />
        <path d="M123 69C117 64 119 55 127 55C134 56 136 65 130 69" />
      </g>
    </svg>
  ),
};

interface MemoryPalaceDemoProps {
  className?: string;
  showChooseWordsStep?: boolean;
}

export function MemoryPalaceDemo({
  className,
  showChooseWordsStep = true,
}: MemoryPalaceDemoProps) {
  const initialStep = showChooseWordsStep ? 1 : 2;
  const visibleSteps = showChooseWordsStep ? [1, 2, 3] : [2, 3];
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [filledWords, setFilledWords] = useState<number[]>([]);
  const [showLabels, setShowLabels] = useState(false);
  const [labelsFlying, setLabelsFlying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPath, setShowPath] = useState(false);
  const [currentFillingWord, setCurrentFillingWord] = useState(-1);
  const [testAnswers, setTestAnswers] = useState<string[]>(Array(9).fill(""));
  const isRecallStep = currentStep === 3;

  const resetDemo = useCallback(() => {
    setCurrentStep(initialStep);
    setFilledWords([]);
    setShowLabels(false);
    setLabelsFlying(false);
    setCurrentSlide(0);
    setShowPath(false);
    setCurrentFillingWord(-1);
    setTestAnswers(Array(9).fill(""));
  }, [initialStep]);

  useEffect(() => {
    resetDemo();
  }, [resetDemo]);

  const selectStep = useCallback((step: number) => {
    setCurrentStep(step);
    setFilledWords(step > 1 ? WORDS.map((_, index) => index) : []);
    setShowLabels(false);
    setLabelsFlying(false);
    setCurrentSlide(0);
    setShowPath(false);
    setCurrentFillingWord(-1);
    setTestAnswers(Array(9).fill(""));
  }, []);

  useEffect(() => {
    if (currentStep !== 1 || filledWords.length >= WORDS.length) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFilledWords((previous) => [...previous, previous.length]);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [currentStep, filledWords.length]);

  useEffect(() => {
    if (
      currentStep !== 1 ||
      filledWords.length !== WORDS.length ||
      showLabels
    ) {
      return;
    }

    const timer = window.setTimeout(() => setShowLabels(true), 400);
    return () => window.clearTimeout(timer);
  }, [currentStep, filledWords.length, showLabels]);

  useEffect(() => {
    if (currentStep !== 1 || !showLabels) {
      return;
    }

    const timer = window.setTimeout(() => {
      setLabelsFlying(true);
      window.setTimeout(() => {
        setCurrentStep(2);
        setLabelsFlying(false);
      }, 800);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [currentStep, showLabels]);

  useEffect(() => {
    if (currentStep !== 2) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (currentSlide < PALACE_LOCATIONS.length - 1) {
        setCurrentSlide((previous) => previous + 1);
        return;
      }

      setCurrentStep(3);
      setShowPath(false);
    }, STORY_STEP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [currentStep, currentSlide]);

  useEffect(() => {
    if (currentStep !== 3 || showPath) {
      return;
    }

    const timer = window.setTimeout(() => setShowPath(true), 500);
    return () => window.clearTimeout(timer);
  }, [currentStep, showPath]);

  useEffect(() => {
    if (currentStep !== 3 || !showPath) {
      return;
    }

    if (currentFillingWord < WORDS.length - 1) {
      const timer = window.setTimeout(() => {
        const nextWord = currentFillingWord + 1;
        setCurrentFillingWord(nextWord);
        setTestAnswers((previous) => {
          const nextAnswers = [...previous];
          nextAnswers[nextWord] = WORDS[nextWord];
          return nextAnswers;
        });
      }, 400);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(resetDemo, 4000);
    return () => window.clearTimeout(timer);
  }, [currentStep, currentFillingWord, resetDemo, showPath]);

  const renderStoryWithBold = (story: string) =>
    story.split(/\*\*(.*?)\*\*/g).map((part, index) =>
      index % 2 === 1 ? (
        <strong key={`${part}-${index}`} className="font-bold text-slate-950">
          {part}
        </strong>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      ),
    );

  return (
    <div
      className={cn(
        "w-full px-4 pb-0 pt-4 overflow-hidden bg-transparent md:p-6 md:rounded-lg md:bg-slate-100 md:shadow-xl md:ring-1 md:ring-slate-200",
        className,
      )}
    >
      <motion.div
        className="hidden"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* <h2 className="text-2xl font-bold text-slate-950 md:text-3xl">Memory Palace</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose words, build scenes, then walk the route to remember them.
        </p> */}
      </motion.div>

      <div className="mb-4 flex justify-center gap-2 md:mb-5">
        {visibleSteps.map((step) => (
          <motion.button
            key={step}
            type="button"
            onClick={() => selectStep(step)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:px-4",
              currentStep === step
                ? "border-slate-900 bg-slate-900 text-white"
                : currentStep > step
                  ? "border-teal-500 bg-teal-500 text-white"
                  : "border-slate-200 bg-white text-slate-400",
            )}
            animate={{ scale: currentStep === step ? 1.04 : 1 }}
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-white/20">
              {currentStep > step ? (
                <Check className="size-3" />
              ) : (
                visibleSteps.indexOf(step) + 1
              )}
            </span>
            <span className={cn(currentStep === step ? "inline" : "hidden", "sm:inline")}>
              {step === 1
                ? "Choose words"
                : step === 2
                  ? "Go through the palace"
                  : "Test memory"}
            </span>
          </motion.button>
        ))}
      </div>

      <div
        className={cn(
          "relative lg:min-h-[520px]",
          currentStep === 1
            ? "min-h-[390px] md:min-h-[640px]"
            : isRecallStep
            ? "min-h-[475px] md:min-h-[640px]"
            : "min-h-[425px] md:min-h-[640px]",
        )}
      >
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <div className="mx-auto w-[92%] sm:w-full">
              <motion.div
                key="step-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: labelsFlying ? 0 : 1 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.45 }}
                className="mx-auto max-w-2xl"
              >
                <motion.div
                  className="rounded-lg bg-white p-3 shadow-lg ring-1 ring-slate-100 md:p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-3 flex items-center gap-3 md:mb-5">
                    <ArrowLeft className="size-5 text-slate-400" />
                    <div>
                      <h3 className="font-semibold text-slate-950">Fruits</h3>
                      <p className="text-xs text-slate-500 md:text-sm">
                        Words to memorize
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2.5">
                    {WORDS.map((word, index) => (
                      <motion.div
                        key={word}
                        className="flex items-center gap-2 md:gap-3"
                        initial={{ opacity: 0.3 }}
                        animate={{
                          opacity: filledWords.includes(index) ? 1 : 0.3,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="w-5 text-right text-xs text-slate-400 md:text-sm">
                          {index + 1}.
                        </span>
                        <Input
                          value={filledWords.includes(index) ? word : ""}
                          readOnly
                          className="h-6 bg-white text-[10px] md:h-10 md:text-sm"
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: filledWords.includes(index) ? 1 : 0,
                            scale: filledWords.includes(index) ? 1 : 0,
                          }}
                        >
                          <RefreshCw className="size-3.5 text-slate-400 md:size-4" />
                        </motion.div>
                        <motion.div
                          className="hidden min-w-28 rounded-full border border-slate-100 bg-white px-4 py-1.5 text-center text-sm font-medium text-slate-700 shadow-sm lg:block"
                          initial={{ opacity: 0, x: -12 }}
                          animate={{
                            opacity: showLabels ? 1 : 0,
                            x: showLabels ? (labelsFlying ? 72 : 0) : -12,
                          }}
                          transition={{
                            delay: labelsFlying ? index * 0.04 : index * 0.05,
                            duration: labelsFlying ? 0.5 : 0.25,
                          }}
                        >
                          {word}
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-3 flex justify-center gap-3 md:mt-5">
                    <Button variant="outline" size="sm" disabled className="h-7 text-[10px] md:h-8 md:text-xs">
                      Clean all
                    </Button>
                    <Button size="sm" disabled={!showLabels} className="h-7 text-[10px] md:h-8 md:text-xs">
                      {showLabels ? "Generating..." : "Generate Palace"}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.45 }}
              className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
            >
              <motion.div className="relative hidden rounded-lg bg-white p-5 shadow-lg ring-1 ring-slate-100 lg:block">
                <motion.div
                  key={currentSlide}
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500 px-4 py-1 text-sm font-medium text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {currentSlide === 0
                    ? "First 3 words"
                    : currentSlide === 1
                      ? "Next 3 words"
                      : "Final 3 words"}
                </motion.div>

                <div className="mt-3 space-y-2">
                  {WORDS.map((word, index) => {
                    const isActive =
                      PALACE_LOCATIONS[currentSlide].wordIndices.includes(
                        index,
                      );

                    return (
                      <motion.div
                        key={word}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                          isActive && "border border-teal-200 bg-teal-50",
                        )}
                        animate={{
                          opacity: isActive ? 1 : 0.35,
                          scale: isActive ? 1.02 : 1,
                        }}
                      >
                        <span
                          className={cn(
                            "w-5 text-right text-sm",
                            isActive
                              ? "font-semibold text-teal-600"
                              : "text-slate-400",
                          )}
                        >
                          {index + 1}.
                        </span>
                        <Input
                          value={word}
                          readOnly
                          className={cn(
                            "h-9 text-sm",
                            isActive
                              ? "border-teal-300 bg-teal-100 font-medium"
                              : "bg-slate-50",
                          )}
                        />
                        {isActive ? (
                          <Check className="size-4 text-teal-500" />
                        ) : (
                          <RefreshCw className="size-4 text-slate-300" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div className="relative min-h-[500px] sm:min-h-[520px]">
                <div className="relative h-[470px] sm:h-[500px]">
                  <AnimatePresence initial={false}>
                    {PALACE_LOCATIONS.slice(0, currentSlide + 1).map(
                      (location, index) => {
                        const stackDepth = currentSlide - index;
                        const isTopStory = stackDepth === 0;
                        const xOffset =
                          stackDepth === 0
                            ? 0
                            : stackDepth % 2 === 0
                              ? -22
                              : 22;

                        return (
                          <motion.article
                            key={location.id}
                            className="absolute inset-x-0 top-0 rounded-lg bg-white p-5 shadow-lg ring-1 ring-slate-100"
                            style={{
                              zIndex: index + 1,
                              transformOrigin: "center top",
                            }}
                            initial={{
                              opacity: 0,
                              y: 70,
                              scale: 0.96,
                              rotate: 0,
                            }}
                            animate={{
                              opacity: Math.max(0.5, 1 - stackDepth * 0.16),
                              x: xOffset,
                              y: stackDepth * 24,
                              scale: 1 - stackDepth * 0.06,
                              rotate:
                                stackDepth === 0
                                  ? 0
                                  : stackDepth % 2 === 0
                                    ? -4
                                    : 4,
                            }}
                            exit={{ opacity: 0, y: -20, scale: 0.96 }}
                            transition={{ duration: 0.36, ease: "easeOut" }}
                          >
                            <motion.div
                              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-teal-500 px-4 py-1 text-sm font-medium text-white"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              Story page {index + 1}
                            </motion.div>

                            <div className="mt-3">
                              <h3 className="mb-3 text-xl font-bold text-slate-950">
                                {location.title}
                              </h3>
                              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                                <Image
                                  src={location.image}
                                  alt={location.name}
                                  fill
                                  className="object-cover"
                                  sizes="(min-width: 1024px) 25rem, 100vw"
                                />
                              </div>
                              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                                {renderStoryWithBold(location.story)}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {location.keywords.map((keyword) => (
                                  <span
                                    key={keyword}
                                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {!isTopStory && (
                              <div className="absolute inset-0 rounded-lg bg-white/20" />
                            )}
                          </motion.article>
                        );
                      },
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-center gap-2">
                  {PALACE_LOCATIONS.map((location, index) => (
                    <div
                      key={location.id}
                      className={cn(
                        "size-2 rounded-full transition-colors",
                        index === currentSlide ? "bg-teal-500" : "bg-slate-200",
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <div className="mx-auto w-[92%] sm:w-full">
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="relative grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]"
              >
                <motion.div className="hidden rounded-lg bg-white p-5 shadow-lg ring-1 ring-slate-100 lg:block">
                  <h3 className="mb-4 text-center text-sm font-semibold text-slate-950">
                    Memory path
                  </h3>

                  <div className="relative min-h-[420px]">
                    <svg className="absolute inset-0 z-0 h-full w-full" viewBox="0 0 248 420" aria-hidden="true">
                      <motion.path
                        d="M46 40 V112 C46 136 66 138 85 138 H104 C126 138 130 150 130 170 V188 M46 172 V244 C46 268 66 270 85 270 H104 C126 270 130 282 130 302 V318"
                        fill="none"
                        stroke="#0f9f9a"
                        strokeDasharray="8 10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: showPath ? 1 : 0, pathLength: showPath ? 1 : 0 }}
                        transition={{ delay: 0.1, duration: 0.7 }}
                      />
                    </svg>
                    {PALACE_LOCATIONS.map((location, locationIndex) => (
                      <motion.div
                        key={location.id}
                        className="relative z-10 mb-5 grid min-h-[118px] grid-cols-[3.5rem_minmax(0,1fr)] items-center last:mb-0"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{
                          opacity: showPath ? 1 : 0,
                          y: showPath ? 0 : 15,
                        }}
                        transition={{ delay: locationIndex * 0.25 }}
                      >
                        <div className="flex h-full items-start justify-center pt-2">
                          <div
                            className={cn(
                              "z-10 flex size-8 items-center justify-center rounded-full border-2 bg-white text-base font-medium shadow-sm",
                              locationIndex === 0
                                ? "border-teal-400 text-teal-600 shadow-[0_0_14px_rgba(20,184,166,0.42)]"
                                : "border-slate-300 text-slate-500",
                            )}
                          >
                            {locationIndex + 1}
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="h-24 w-36">
                            {LOCATION_ICONS[location.name]}
                          </div>
                          <span className="mt-1 text-center text-base font-medium leading-tight text-slate-950">
                            {LOCATION_DISPLAY_NAMES[location.name]}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div className="rounded-lg bg-white p-3 shadow-lg ring-1 ring-slate-100 md:p-5">
                  <div className="mb-2 flex items-center justify-between md:mb-3">
                    <h3 className="text-sm font-bold text-slate-950 md:text-lg">
                      Test Your Memory
                    </h3>
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-500 md:text-xs">
                      Time: 0:
                      {String(Math.max(0, currentFillingWord + 1) * 2).padStart(
                        2,
                        "0",
                      )}
                    </span>
                  </div>

                  <div className="space-y-1.5 md:space-y-1.5">
                    {WORDS.map((word, index) => {
                      const locationIndex = Math.floor(index / 3);
                      const isFilled = testAnswers[index] !== "";
                      const isCurrentlyFilling = index === currentFillingWord;

                      return (
                        <motion.div
                          key={word}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-2 py-0.5 transition-colors md:py-1.5",
                            isFilled
                              ? "border-green-200 bg-green-50"
                              : isCurrentlyFilling
                                ? "border-teal-200 bg-teal-50"
                                : "border-transparent",
                          )}
                          animate={{ scale: isCurrentlyFilling ? 1.01 : 1 }}
                        >
                          <span className="w-10 text-[10px] text-slate-500 md:w-12 md:text-xs">
                            Word {index + 1}
                          </span>
                          <span className="hidden w-16 truncate rounded bg-slate-100 px-1.5 py-0.5 text-center text-[10px] text-slate-400 sm:block">
                            {PALACE_LOCATIONS[locationIndex].name}
                          </span>
                          <div className="relative flex-1">
                            <Input
                              value={testAnswers[index]}
                              readOnly
                              placeholder="Enter word..."
                              className={cn(
                                "h-6 text-[10px] md:h-8 md:text-xs",
                                isFilled
                                  ? "border-transparent bg-green-100"
                                  : "bg-white",
                              )}
                            />
                            {isFilled && (
                              <motion.div
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Check className="size-3.5 text-green-500" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex items-center justify-between md:mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="h-7 text-[10px] md:h-8 md:text-xs"
                    >
                      <ArrowLeft className="mr-1 size-3" /> Back
                    </Button>
                    <Button
                      size="sm"
                      disabled
                      className={cn(
                        "h-7 text-[10px] text-white md:h-8 md:text-xs",
                        testAnswers.every(Boolean)
                          ? "bg-green-600"
                          : "bg-slate-900",
                      )}
                    >
                      {testAnswers.every(Boolean)
                        ? "All Correct!"
                        : "Verify Answers"}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MemoryPalaceDemo;
