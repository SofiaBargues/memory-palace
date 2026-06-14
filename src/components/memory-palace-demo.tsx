"use client";

import { type ReactNode, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  MoreHorizontal,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
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

const DEMO_TEST_ANSWERS = [
  "Apple",
  "Dog",
  "Orange",
  "Lion",
  "Pineapple",
  "Mango",
  "Cat",
  "Grape",
  "Kiwi",
];

const PALACE_LOCATIONS = [
  {
    id: 1,
    name: "Plaza",
    image: "/images/demo-fruits-orchard.png",
    title: "The Orchard's Bounty",
    story:
      "As I entered the lush orchard, I spotted a shiny red **Apple** hanging from a low branch. Next, I tiptoed over to a tall tree where a yellow **Banana** was just within my reach, swinging gently in the breeze. A bit further on, the citrusy scent led me to a quaint shed filled with boxes of fresh **Orange**s, glowing under the sunlight.",
    keywords: ["apple", "banana", "orange"],
    wordIndices: [0, 1, 2],
  },
  {
    id: 2,
    name: "Cascadas",
    image: "/images/demo-tropical-goodness.png",
    title: "The Tropical Patch",
    story:
      "Beside the shed, there were rows of lush bushes dotted with juicy **Strawberry**, and I couldn't resist plucking one to taste its sweetness. Moving deeper into the orchard, I stumbled upon a tropical patch where a majestic **Pineapple** stood, its spiky crown reaching toward the sky. Beside it, hanging from a sturdy tree, golden **Mango**es swayed gently, their fragrance weaving a welcoming aroma.",
    keywords: ["strawberry", "pineapple", "mango"],
    wordIndices: [3, 4, 5],
  },
  {
    id: 3,
    name: "Clinic",
    image: "/images/demo-riverside-fruits.png",
    title: "The Riverbank Gazebo",
    story:
      "Near the riverbank, the vibrant, striped flesh of a large **Watermelon** tempted me for a refreshing taste on this sunny day. Vines around a small gazebo were heavy with plump, purple **Grape**s, and I plucked one off to savor its tart skin. Finally, in a little patch of its own, lay fuzzy brown **Kiwi**s nestled together like tiny treasures waiting to be picked.",
    keywords: ["watermelon", "grape", "kiwi"],
    wordIndices: [6, 7, 8],
  },
];

const STORY_STEP_DELAY_MS = 2100;

const WORD_GROUPS = PALACE_LOCATIONS.map((location) => ({
  id: location.id,
  keywords: location.keywords,
  wordIndices: location.wordIndices,
}));

const LOCATION_DISPLAY_NAMES: Record<string, string> = {
  Plaza: "Fruit stand",
  Cascadas: "Orchard",
  Clinic: "Pergola",
};

const MEMORY_PATH_DRAW_DELAY_MS = 1900;

interface MemoryPalaceDemoProps {
  className?: string;
  showChooseWordsStep?: boolean;
  footer?: ReactNode;
}

export function MemoryPalaceDemo({
  className,
  showChooseWordsStep = true,
  footer,
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

    if (currentFillingWord === -1) {
      const timer = window.setTimeout(() => {
        setCurrentFillingWord(0);
      }, MEMORY_PATH_DRAW_DELAY_MS);

      return () => window.clearTimeout(timer);
    }

    const targetAnswer = DEMO_TEST_ANSWERS[currentFillingWord];
    const currentAnswer = testAnswers[currentFillingWord];

    if (currentAnswer.length < targetAnswer.length) {
      const timer = window.setTimeout(() => {
        setTestAnswers((previous) => {
          const nextAnswers = [...previous];
          nextAnswers[currentFillingWord] = targetAnswer.slice(
            0,
            currentAnswer.length + 1,
          );
          return nextAnswers;
        });
      }, 75);

      return () => window.clearTimeout(timer);
    }

    if (currentFillingWord < WORDS.length - 1) {
      const timer = window.setTimeout(() => {
        setCurrentFillingWord((previous) => previous + 1);
      }, 280);

      return () => window.clearTimeout(timer);
    }
  }, [currentStep, currentFillingWord, showPath, testAnswers]);

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

  const allTestAnswersComplete = testAnswers.every(
    (answer, index) => answer === DEMO_TEST_ANSWERS[index],
  );
  const hasTestErrors =
    allTestAnswersComplete &&
    testAnswers.some((answer, index) => answer !== WORDS[index]);

  return (
    <div className={cn("w-full overflow-hidden bg-transparent ", className)}>
      <div
        className="mb-4 flex justify-center md:mb-5 flex-col items-center gap-2"
        role="tablist"
        aria-label="Memory palace steps"
      >
        <h1 className="text-[2.00rem] font-extrabold   text-primary">
          How it works?
        </h1>
        <>
          <div className="flex w-[min(78%,15rem)] items-center justify-center gap-2">
            {visibleSteps.map((step) => {
              const stepLabel =
                step === 1
                  ? "Choose words"
                  : step === 2
                    ? "Read the story and find the words"
                    : "Test memory";

              return (
                <motion.button
                  key={step}
                  type="button"
                  onClick={() => selectStep(step)}
                  role="tab"
                  aria-label={stepLabel}
                  aria-selected={currentStep === step}
                  className={cn(
                    "h-2.5 flex-1 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                    "border-slate-950/10  shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16),inset_0_1px_2px_rgba(15,23,42,0.08)] backdrop-blur-[1px]",
                    currentStep === step &&
                      "border-black/40 shadow-[0_0_0_1px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,0.18)]",
                    currentStep > step && "border-slate-950/20 ",
                  )}
                  animate={{
                    scaleY: currentStep === step ? 1.12 : 1,
                    opacity: currentStep >= step ? 1 : 0.82,
                  }}
                >
                  <span className="sr-only">{stepLabel}</span>
                </motion.button>
              );
            })}
          </div>
        </>
      </div>

      <div
        className={cn(
          "relative lg:min-h-[520px]",
          currentStep === 1
            ? "min-h-[390px] md:min-h-[640px]"
            : isRecallStep
              ? "min-h-[475px] md:min-h-[640px]"
              : "min-h-[520px] md:min-h-[640px]",
        )}
      >
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <div className="mx-auto w-full">
              <motion.div
                key="step-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: labelsFlying ? 0 : 1 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.45 }}
                className="mx-auto max-w-2xl"
              >
                <motion.div
                  className="rounded-lg bg-white/80 p-3 shadow-lg ring-1 ring-slate-100/80 backdrop-blur md:p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-3 flex items-center gap-3 md:mb-5">
                    <ArrowLeft className="size-5 text-slate-400" />
                    <div>
                      <h3 className="font-semibold text-slate-950 md:text-md">
                        Words to memorize
                      </h3>
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
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="h-7 text-[10px] md:h-8 md:text-xs"
                    >
                      Clean all
                    </Button>
                    <Button
                      size="sm"
                      disabled={!showLabels}
                      className="h-7 text-[10px] md:h-8 md:text-xs"
                    >
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
              className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-[minmax(13rem,0.32fr)_minmax(0,1fr)] md:gap-5"
            >
              <motion.aside className="hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:block md:p-5 ">
                <h3 className="mb-4 text-center text-md font-semibold text-slate-950">
                  Word Groups
                </h3>
                <div className="flex flex-col h-full justify-evenly ">
                  {WORD_GROUPS.map((group, groupIndex) => {
                    const isActive = groupIndex === currentSlide;

                    return (
                      <motion.button
                        key={group.id}
                        type="button"
                        onClick={() => setCurrentSlide(groupIndex)}
                        className={cn(
                          "min-w-0 bg-white p-3  gap-6 transition",
                          isActive ? "font-medium text-slate-950 " : "",
                        )}
                        animate={{
                          scale: isActive ? 1.01 : 1,
                        }}
                      >
                        <div className="space-y-1.5 pl-8 md:pl-3 ">
                          {group.keywords.map((keyword) => (
                            <p
                              key={keyword}
                              className={cn(
                                "truncate text-xs capitalize leading-5 md:text-sm",
                                isActive
                                  ? "font-medium text-slate-950"
                                  : "text-slate-500",
                              )}
                            >
                              {keyword}
                            </p>
                          ))}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.aside>

              <motion.div className="min-w-0">
                <AnimatePresence mode="wait">
                  <motion.article
                    key={PALACE_LOCATIONS[currentSlide].id}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-5"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold leading-tight text-slate-950 md:text-2xl">
                        {PALACE_LOCATIONS[currentSlide].title}
                      </h3>
                      <MoreHorizontal className="mt-1 size-5 shrink-0 text-slate-950" />
                    </div>

                    <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={PALACE_LOCATIONS[currentSlide].image}
                        alt={PALACE_LOCATIONS[currentSlide].name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 52rem, 100vw"
                      />
                    </div>

                    <p className="mb-4 text-sm leading-relaxed text-slate-600 md:text-[0.95rem]">
                      {renderStoryWithBold(
                        PALACE_LOCATIONS[currentSlide].story,
                      )}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {PALACE_LOCATIONS[currentSlide].keywords.map(
                        (keyword) => (
                          <span
                            key={keyword}
                            className="rounded-md bg-slate-100 px-3 py-1 text-xs lowercase text-slate-600 md:text-sm"
                          >
                            {keyword}
                          </span>
                        ),
                      )}
                    </div>
                    <div className="mt-5 flex justify-center gap-3">
                      {PALACE_LOCATIONS.map((location, index) => (
                        <button
                          key={location.id}
                          type="button"
                          onClick={() => setCurrentSlide(index)}
                          aria-label={`Go to story scene ${index + 1}`}
                          className={cn(
                            "size-2.5 rounded-full transition-colors",
                            index === currentSlide
                              ? "bg-slate-950"
                              : "bg-slate-300 hover:bg-slate-400",
                          )}
                        />
                      ))}
                    </div>
                  </motion.article>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <div className="mx-auto w-full">
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

                  <div className="relative flex min-h-[420px] flex-col items-center gap-4 justify-between">
                    {PALACE_LOCATIONS.map((location, locationIndex) => (
                      <motion.div
                        key={location.id}
                        className="relative z-10 flex w-full justify-center"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{
                          opacity: showPath ? 1 : 0,
                          y: showPath ? 0 : 15,
                        }}
                        transition={{ delay: locationIndex * 0.25 }}
                      >
                        <div className="relative h-36 w-40 overflow-hidden rounded-[24px] bg-slate-100 shadow-[0_14px_30px_rgba(15,23,42,0.14)] ring-1 ring-black/5">
                          <Image
                            src={location.image}
                            alt={LOCATION_DISPLAY_NAMES[location.name]}
                            fill
                            sizes="10rem"
                            className="scale-[1.54] object-cover blur-[1.7px] saturate-[0.92]"
                          />
                          <div className="absolute inset-0 bg-white/10" />
                          <span className="absolute left-3 top-3 flex size-7 items-center justify-center rounded-full bg-white/25 text-sm font-bold text-slate-700 shadow-sm">
                            {locationIndex + 1}
                          </span>
                          <span className="absolute inset-x-3 bottom-3 rounded-md bg-white/25 px-2 py-1 text-center text-sm font-extrabold leading-tight text-slate-950 shadow-sm backdrop-blur">
                            {LOCATION_DISPLAY_NAMES[location.name]}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div className="rounded-lg bg-white/80 p-3 shadow-lg ring-1 ring-slate-100/80 backdrop-blur md:p-5">
                  <div className="mb-2 flex items-center justify-between md:mb-3">
                    <h3 className="text-sm font-bold text-slate-950 md:text-md">
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
                      const typedAnswer = testAnswers[index];
                      const isStarted = typedAnswer !== "";
                      const isFilled = typedAnswer === DEMO_TEST_ANSWERS[index];
                      const isCurrentlyFilling = index === currentFillingWord;
                      const isCorrect = typedAnswer === word;
                      const isVerified = allTestAnswersComplete && isFilled;
                      const hasError = isVerified && !isCorrect;
                      const isTyping = isCurrentlyFilling && !isFilled;

                      return (
                        <motion.div
                          key={word}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-2 py-0.5 transition-colors md:py-1.5",
                            hasError
                              ? "border-red-300 bg-red-50"
                              : isVerified
                                ? "border-green-200 bg-green-50"
                                : isCurrentlyFilling || isStarted
                                  ? "border-gray-200 bg-gray-50"
                                  : "border-transparent",
                          )}
                          animate={{
                            scale: isCurrentlyFilling ? 1.01 : 1,
                            x: hasError ? [0, -2, 2, -1, 1, 0] : 0,
                          }}
                        >
                          <span
                            className={cn(
                              "w-10 text-[10px] text-slate-500 md:w-12 md:text-xs",
                              hasError && "font-medium text-red-600",
                            )}
                          >
                            Word {index + 1}
                          </span>
                          <div className="relative flex-1">
                            <Input
                              value={typedAnswer}
                              readOnly
                              placeholder="Enter word..."
                              className={cn(
                                "h-6 pr-8 text-[10px] md:h-8 md:text-xs",
                                hasError
                                  ? "border-transparent bg-red-50 text-red-700 shadow-none"
                                  : isVerified
                                    ? "border-transparent bg-green-50 shadow-none"
                                    : "bg-white",
                              )}
                            />
                            {isTyping && (
                              <motion.span
                                className="absolute right-3 top-1/2 h-3.5 w-px -translate-y-1/2 bg-slate-900 md:h-4"
                                animate={{ opacity: [0, 1, 1, 0] }}
                                transition={{
                                  duration: 0.7,
                                  repeat: Infinity,
                                }}
                              />
                            )}
                            {isVerified && (
                              <motion.div
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                {hasError ? (
                                  <X className="size-3.5 stroke-[3] text-red-500" />
                                ) : (
                                  <Check className="size-3.5 text-green-500" />
                                )}
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
                        hasTestErrors
                          ? "bg-red-600"
                          : allTestAnswersComplete
                            ? "bg-green-600"
                            : "bg-slate-900",
                      )}
                    >
                      {allTestAnswersComplete
                        ? hasTestErrors
                          ? "3 Errors"
                          : "All Correct!"
                        : "Verify Answers"}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      {footer && isRecallStep && (
        <div className="relative z-20 mt-5">{footer}</div>
      )}
    </div>
  );
}

export default MemoryPalaceDemo;
