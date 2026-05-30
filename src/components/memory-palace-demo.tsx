"use client";

import { useEffect, useState } from "react";
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

const LOCATION_ICONS: Record<string, JSX.Element> = {
  Plaza: (
    <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <rect x="5" y="50" width="70" height="8" fill="#e5e7eb" rx="2" />
      <rect x="35" y="35" width="10" height="20" fill="#9ca3af" />
      <circle cx="40" cy="25" r="15" fill="#22c55e" opacity="0.8" />
      <rect x="55" y="40" width="15" height="15" fill="#d4a574" rx="2" />
      <rect x="10" y="45" width="20" height="10" fill="#78716c" rx="1" />
    </svg>
  ),
  Cascadas: (
    <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <path d="M10 20 L40 5 L70 20 L70 35 L40 25 L10 35 Z" fill="#6b7280" />
      <path d="M35 35 L45 35 L45 70 L35 70 Z" fill="#60a5fa" opacity="0.6" />
      <path d="M30 70 L50 70 Q55 75 50 80 L30 80 Q25 75 30 70" fill="#60a5fa" opacity="0.4" />
      <circle cx="20" cy="65" r="8" fill="#22c55e" />
      <circle cx="60" cy="65" r="8" fill="#22c55e" />
    </svg>
  ),
  Clinic: (
    <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <rect x="15" y="25" width="50" height="45" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" rx="3" />
      <rect x="35" y="50" width="10" height="20" fill="#78716c" />
      <rect x="32" y="32" width="16" height="16" fill="#fff" stroke="#14b8a6" strokeWidth="2" />
      <rect x="38" y="35" width="4" height="10" fill="#14b8a6" />
      <rect x="35" y="38" width="10" height="4" fill="#14b8a6" />
      <ellipse cx="15" cy="70" rx="8" ry="5" fill="#22c55e" />
      <ellipse cx="65" cy="70" rx="8" ry="5" fill="#22c55e" />
    </svg>
  ),
};

interface MemoryPalaceDemoProps {
  className?: string;
}

export function MemoryPalaceDemo({ className }: MemoryPalaceDemoProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [filledWords, setFilledWords] = useState<number[]>([]);
  const [showLabels, setShowLabels] = useState(false);
  const [labelsFlying, setLabelsFlying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPath, setShowPath] = useState(false);
  const [currentFillingWord, setCurrentFillingWord] = useState(-1);
  const [testAnswers, setTestAnswers] = useState<string[]>(Array(9).fill(""));

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
    if (currentStep !== 1 || filledWords.length !== WORDS.length || showLabels) {
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
    }, 3500);

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
  }, [currentStep, currentFillingWord, showPath]);

  const resetDemo = () => {
    setCurrentStep(1);
    setFilledWords([]);
    setShowLabels(false);
    setLabelsFlying(false);
    setCurrentSlide(0);
    setShowPath(false);
    setCurrentFillingWord(-1);
    setTestAnswers(Array(9).fill(""));
  };

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
    <div className={cn("w-full overflow-hidden rounded-lg bg-slate-100 p-4 shadow-xl ring-1 ring-slate-200 md:p-6", className)}>
      <motion.div
        className="mb-5 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-slate-950 md:text-3xl">Memory Palace</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose words, build scenes, then walk the route to remember them.
        </p>
      </motion.div>

      <div className="mb-5 flex justify-center gap-2">
        {[1, 2, 3].map((step) => (
          <motion.div
            key={step}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition-colors sm:px-4",
              currentStep === step
                ? "border-slate-900 bg-slate-900 text-white"
                : currentStep > step
                  ? "border-teal-500 bg-teal-500 text-white"
                  : "border-slate-200 bg-white text-slate-400",
            )}
            animate={{ scale: currentStep === step ? 1.04 : 1 }}
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-white/20">
              {currentStep > step ? <Check className="size-3" /> : step}
            </span>
            <span className="hidden sm:inline">
              {step === 1 ? "Choose words" : step === 2 ? "Build palace" : "Test memory"}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="relative min-h-[640px] lg:min-h-[520px]">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: labelsFlying ? 0 : 1 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.45 }}
              className="grid items-start gap-5 lg:grid-cols-[1fr_15rem]"
            >
              <motion.div
                className="rounded-lg bg-white p-5 shadow-lg ring-1 ring-slate-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <ArrowLeft className="size-5 text-slate-400" />
                  <div>
                    <h3 className="font-semibold text-slate-950">Fruits</h3>
                    <p className="text-sm text-slate-500">Words to memorize</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {WORDS.map((word, index) => (
                    <motion.div
                      key={word}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: filledWords.includes(index) ? 1 : 0.3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="w-5 text-right text-sm text-slate-400">{index + 1}.</span>
                      <Input value={filledWords.includes(index) ? word : ""} readOnly className="h-10 bg-white" />
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: filledWords.includes(index) ? 1 : 0,
                          scale: filledWords.includes(index) ? 1 : 0,
                        }}
                      >
                        <RefreshCw className="size-4 text-slate-400" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 flex justify-center gap-3">
                  <Button variant="outline" size="sm" disabled>
                    Clean all
                  </Button>
                  <Button size="sm" disabled={!showLabels}>
                    {showLabels ? "Generating..." : "Generate Palace"}
                  </Button>
                </div>
              </motion.div>

              <div className="hidden lg:block">
                <div className="space-y-2 pt-8">
                  {WORDS.map((word, index) => (
                    <motion.div
                      key={word}
                      className="w-fit rounded-full border border-slate-100 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: showLabels ? 1 : 0,
                        x: showLabels ? (labelsFlying ? 150 : 0) : -20,
                      }}
                      transition={{
                        delay: labelsFlying ? index * 0.04 : index * 0.05,
                        duration: labelsFlying ? 0.5 : 0.25,
                      }}
                    >
                      {word}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
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
              <motion.div className="relative rounded-lg bg-white p-5 shadow-lg ring-1 ring-slate-100">
                <motion.div
                  key={currentSlide}
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500 px-4 py-1 text-sm font-medium text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {currentSlide === 0 ? "First 3 words" : currentSlide === 1 ? "Next 3 words" : "Final 3 words"}
                </motion.div>

                <div className="mt-3 space-y-2">
                  {WORDS.map((word, index) => {
                    const isActive = PALACE_LOCATIONS[currentSlide].wordIndices.includes(index);

                    return (
                      <motion.div
                        key={word}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                          isActive && "border border-teal-200 bg-teal-50",
                        )}
                        animate={{ opacity: isActive ? 1 : 0.35, scale: isActive ? 1.02 : 1 }}
                      >
                        <span className={cn("w-5 text-right text-sm", isActive ? "font-semibold text-teal-600" : "text-slate-400")}>
                          {index + 1}.
                        </span>
                        <Input
                          value={word}
                          readOnly
                          className={cn("h-9 text-sm", isActive ? "border-teal-300 bg-teal-100 font-medium" : "bg-slate-50")}
                        />
                        {isActive ? <Check className="size-4 text-teal-500" /> : <RefreshCw className="size-4 text-slate-300" />}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div className="relative rounded-lg bg-white p-5 shadow-lg ring-1 ring-slate-100">
                <motion.div
                  key={currentSlide}
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500 px-4 py-1 text-sm font-medium text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Story page {currentSlide + 1}
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    className="mt-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="mb-3 text-xl font-bold text-slate-950">{PALACE_LOCATIONS[currentSlide].title}</h3>
                    <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                      <Image
                        src={PALACE_LOCATIONS[currentSlide].image}
                        alt={PALACE_LOCATIONS[currentSlide].name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 25rem, 100vw"
                      />
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-slate-600">
                      {renderStoryWithBold(PALACE_LOCATIONS[currentSlide].story)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PALACE_LOCATIONS[currentSlide].keywords.map((keyword) => (
                        <span key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 flex justify-center gap-2">
                  {PALACE_LOCATIONS.map((location, index) => (
                    <div
                      key={location.id}
                      className={cn("size-2 rounded-full transition-colors", index === currentSlide ? "bg-teal-500" : "bg-slate-200")}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]"
            >
              <motion.div className="rounded-lg bg-white p-5 shadow-lg ring-1 ring-slate-100">
                <h3 className="mb-4 text-center text-sm font-semibold text-slate-950">Memory path</h3>

                <div className="relative pl-2">
                  {PALACE_LOCATIONS.map((location, locationIndex) => (
                    <motion.div
                      key={location.id}
                      className="relative mb-4 last:mb-0"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: showPath ? 1 : 0, y: showPath ? 0 : 15 }}
                      transition={{ delay: locationIndex * 0.25 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex shrink-0 flex-col items-center">
                          <div className="z-10 flex size-7 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-xs font-medium text-slate-500">
                            {locationIndex + 1}
                          </div>
                          <div className="mt-1 size-14">{LOCATION_ICONS[location.name]}</div>
                          <span className="mt-0.5 w-16 text-center text-[10px] leading-tight text-slate-500">
                            {location.name}
                          </span>
                        </div>

                        <svg className="absolute h-24 w-full" style={{ left: 30, top: 10 }} viewBox="0 0 200 80" aria-hidden="true">
                          {[0, 1, 2].map((index) => (
                            <motion.path
                              key={index}
                              d={`M0,${12 + index * 24} C48,${12 + index * 24} 92,${12 + index * 24} 180,${12 + index * 24}`}
                              fill="none"
                              stroke="#14b8a6"
                              strokeDasharray="4 3"
                              strokeWidth="1.5"
                              initial={{ opacity: 0, pathLength: 0 }}
                              animate={{ opacity: showPath ? 1 : 0, pathLength: showPath ? 1 : 0 }}
                              transition={{ delay: locationIndex * 0.25 + 0.15 + index * 0.08 }}
                            />
                          ))}
                        </svg>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="rounded-lg bg-white p-5 shadow-lg ring-1 ring-slate-100">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-950">Test Your Memory</h3>
                  <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500">
                    Time: 0:{String(Math.max(0, currentFillingWord + 1) * 2).padStart(2, "0")}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {WORDS.map((word, index) => {
                    const locationIndex = Math.floor(index / 3);
                    const isFilled = testAnswers[index] !== "";
                    const isCurrentlyFilling = index === currentFillingWord;

                    return (
                      <motion.div
                        key={word}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors",
                          isFilled
                            ? "border-green-200 bg-green-50"
                            : isCurrentlyFilling
                              ? "border-teal-200 bg-teal-50"
                              : "border-transparent",
                        )}
                        animate={{ scale: isCurrentlyFilling ? 1.01 : 1 }}
                      >
                        <span className="w-12 text-xs text-slate-500">Word {index + 1}</span>
                        <span className="w-16 truncate rounded bg-slate-100 px-1.5 py-0.5 text-center text-[10px] text-slate-400">
                          {PALACE_LOCATIONS[locationIndex].name}
                        </span>
                        <div className="relative flex-1">
                          <Input
                            value={testAnswers[index]}
                            readOnly
                            placeholder="Enter word..."
                            className={cn("h-8 text-xs", isFilled ? "border-green-300 bg-green-100" : "bg-white")}
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

                <div className="mt-4 flex items-center justify-between">
                  <Button variant="outline" size="sm" disabled className="h-8 text-xs">
                    <ArrowLeft className="mr-1 size-3" /> Back
                  </Button>
                  <Button size="sm" disabled className={cn("h-8 text-xs text-white", testAnswers.every(Boolean) ? "bg-green-600" : "bg-slate-900")}>
                    {testAnswers.every(Boolean) ? "All Correct!" : "Verify Answers"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MemoryPalaceDemo;
