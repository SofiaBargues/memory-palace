"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BookOpen, Brain, Check, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const WORDS = ["orange", "ladder", "violin", "moon", "suitcase"] as const;
type Word = (typeof WORDS)[number];

const WORD_STYLE = {
  bg: "bg-primary/10",
  text: "text-primary",
  border: "border-primary/30",
  tailwind: "text-primary",
};

const WORD_COLORS: Record<
  Word,
  { bg: string; text: string; border: string; tailwind: string }
> = {
  orange: WORD_STYLE,
  ladder: WORD_STYLE,
  violin: WORD_STYLE,
  moon: WORD_STYLE,
  suitcase: WORD_STYLE,
};

const OBJECT_POSITIONS: Record<Word, { x: number; y: number; size: number }> = {
  orange: { x: 16, y: 74, size: 62 },
  ladder: { x: 16, y: 48, size: 92 },
  violin: { x: 70, y: 66, size: 90 },
  moon: { x: 52, y: 28, size: 78 },
  suitcase: { x: 87, y: 68, size: 76 },
};

const STORY_SEGMENTS = [
  {
    before: "You enter a grand courtyard. On a marble table sits a bright ",
    keyword: "orange" as Word,
    after: ".",
  },
  {
    before: "A ",
    keyword: "ladder" as Word,
    after: " leans against the archway.",
  },
  {
    before: "Beside the fountain rests a ",
    keyword: "violin" as Word,
    after: ".",
  },
  {
    before: "",
    keyword: "moon" as Word,
    after: "light shines through the window.",
    displayKeyword: "Moon",
  },
  {
    before: "Near the doorway stands a ",
    keyword: "suitcase" as Word,
    after: ".",
  },
];

const STEPS = ["Words", "Palace", "Recall", "Result"] as const;
type Step = (typeof STEPS)[number];

const TIMING: Record<Step, number> = {
  Words: 3500,
  Palace: 8000,
  Recall: 3500,
  Result: 2500,
};

const PALACE_IMAGE_URL = "/images/memory-palace.png";
const PALACE_IMAGE_ASPECT_RATIO = 1024 / 1536;
const BASE_RECALL_IMAGE_WIDTH = 240;
const STEP_PADDING_CLASS = "p-3 sm:p-6";
const LABEL_HALF_WIDTH = 58;
const LABEL_HEIGHT = 30;

interface MemoryPalaceViolinDemoProps {
  className?: string;
  initialStep?: Step;
  autoPlay?: boolean;
  heroPreview?: boolean;
}

export function MemoryPalaceViolinDemo({
  className,
  initialStep = "Words",
  autoPlay = true,
  heroPreview = false,
}: MemoryPalaceViolinDemoProps) {
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);
  const [stepRunId, setStepRunId] = useState(0);
  const [visibleWords, setVisibleWords] = useState<number[]>([]);
  const [wordsConverging, setWordsConverging] = useState(false);
  const [visibleStoryLines, setVisibleStoryLines] = useState(
    initialStep === "Palace" ? 1 : 0,
  );
  const [recallKeywordIndex, setRecallKeywordIndex] = useState(
    initialStep === "Palace" ? 0 : -1,
  );
  const [revealedObjects, setRevealedObjects] = useState<Word[]>(
    initialStep === "Palace" ? ["orange"] : [],
  );
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const palaceImageRef = useRef<HTMLDivElement>(null);
  const [recallImageSize, setRecallImageSize] = useState({
    width: 0,
    height: 0,
  });

  const resetState = useCallback(() => {
    setVisibleWords([]);
    setWordsConverging(false);
    setVisibleStoryLines(0);
    setRecallKeywordIndex(-1);
    setRevealedObjects([]);
    setAnswerRevealed(false);
    setShowSuccess(false);
  }, []);

  const startStep = useCallback(
    (step: Step) => {
      resetState();
      setCurrentStep(step);
      setStepRunId((current) => current + 1);
    },
    [resetState],
  );

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    const timer = window.setTimeout(() => {
      const currentIndex = STEPS.indexOf(currentStep);
      const nextStep = STEPS[(currentIndex + 1) % STEPS.length];

      startStep(nextStep);
    }, TIMING[currentStep]);

    return () => window.clearTimeout(timer);
  }, [autoPlay, currentStep, startStep, stepRunId]);

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    const timers: number[] = [];

    if (currentStep === "Words") {
      WORDS.forEach((_, index) => {
        timers.push(
          window.setTimeout(() => {
            setVisibleWords((prev) => [...prev, index]);
          }, index * 350),
        );
      });

      timers.push(
        window.setTimeout(() => {
          setWordsConverging(true);
        }, 2500),
      );
    }

    if (currentStep === "Palace") {
      STORY_SEGMENTS.forEach((segment, index) => {
        timers.push(
          window.setTimeout(
            () => {
              setVisibleStoryLines(index + 1);
              setRecallKeywordIndex(index);
              setRevealedObjects((prev) =>
                prev.includes(segment.keyword)
                  ? prev
                  : [...prev, segment.keyword],
              );
            },
            800 + index * 1000,
          ),
        );
      });

      timers.push(
        window.setTimeout(() => {
          setRecallKeywordIndex(-1);
        }, 6200),
      );
    }

    if (currentStep === "Recall") {
      timers.push(
        window.setTimeout(() => {
          setAnswerRevealed(true);
        }, 1600),
      );
    }

    if (currentStep === "Result") {
      timers.push(
        window.setTimeout(() => {
          setShowSuccess(true);
        }, 300),
      );
    }

    return () => timers.forEach(window.clearTimeout);
  }, [autoPlay, currentStep, stepRunId]);

  useEffect(() => {
    const imageFrame = palaceImageRef.current;

    if (!imageFrame) {
      return;
    }

    const updateImageSize = () => {
      const { width, height } = imageFrame.getBoundingClientRect();
      setRecallImageSize({ width, height });
    };

    updateImageSize();

    const resizeObserver = new ResizeObserver(updateImageSize);
    resizeObserver.observe(imageFrame);

    return () => resizeObserver.disconnect();
  }, []);

  const getRecallObjectPosition = useCallback(
    (word: Word) => {
      const position = OBJECT_POSITIONS[word];
      const { width, height } = recallImageSize;

      if (!width || !height) {
        return position;
      }

      const frameAspectRatio = width / height;
      const renderedImage =
        frameAspectRatio > PALACE_IMAGE_ASPECT_RATIO
          ? {
              width: height * PALACE_IMAGE_ASPECT_RATIO,
              height,
              x: (width - height * PALACE_IMAGE_ASPECT_RATIO) / 2,
              y: 0,
            }
          : {
              width,
              height: width / PALACE_IMAGE_ASPECT_RATIO,
              x: 0,
              y: (height - width / PALACE_IMAGE_ASPECT_RATIO) / 2,
            };

      return {
        ...position,
        size: Math.round(
          Math.min(
            position.size,
            Math.max(
              44,
              position.size * (renderedImage.width / BASE_RECALL_IMAGE_WIDTH),
            ),
          ),
        ),
        x:
          ((renderedImage.x + (position.x / 100) * renderedImage.width) /
            width) *
          100,
        y:
          ((renderedImage.y + (position.y / 100) * renderedImage.height) /
            height) *
          100,
      };
    },
    [recallImageSize],
  );

  const getRenderedImageBounds = useCallback(() => {
    const { width, height } = recallImageSize;

    if (!width || !height) {
      return { left: 0, right: 100, top: 0, bottom: 100 };
    }

    const frameAspectRatio = width / height;
    const renderedImage =
      frameAspectRatio > PALACE_IMAGE_ASPECT_RATIO
        ? {
            width: height * PALACE_IMAGE_ASPECT_RATIO,
            height,
            x: (width - height * PALACE_IMAGE_ASPECT_RATIO) / 2,
            y: 0,
          }
        : {
            width,
            height: width / PALACE_IMAGE_ASPECT_RATIO,
            x: 0,
            y: (height - width / PALACE_IMAGE_ASPECT_RATIO) / 2,
          };

    return {
      left: (renderedImage.x / width) * 100,
      right: ((renderedImage.x + renderedImage.width) / width) * 100,
      top: (renderedImage.y / height) * 100,
      bottom: ((renderedImage.y + renderedImage.height) / height) * 100,
    };
  }, [recallImageSize]);

  const getObjectLabelPlacement = useCallback(
    (position: { x: number; y: number }) => {
      const bounds = getRenderedImageBounds();
      const { width, height } = recallImageSize;
      const xGutter = width ? (LABEL_HALF_WIDTH / width) * 100 : 18;
      const yGutter = height ? (LABEL_HEIGHT / height) * 100 : 8;
      const showBelow = position.y < bounds.top + 24;

      return {
        x: Math.min(
          bounds.right - xGutter,
          Math.max(bounds.left + xGutter, position.x),
        ),
        y: showBelow
          ? Math.min(
              bounds.bottom - yGutter,
              Math.max(bounds.top + yGutter, position.y + 14),
            )
          : Math.min(
              bounds.bottom - yGutter,
              Math.max(bounds.top + yGutter, position.y - 12),
            ),
        transform: showBelow
          ? "translate(-50%, 0)"
          : "translate(-50%, -100%)",
      };
    },
    [getRenderedImageBounds, recallImageSize],
  );

  const getObjectRevealMask = useCallback(
    (position: { x: number; y: number; size: number }) => {
      const radius = Math.round(position.size / 1.35);

      return `radial-gradient(circle ${radius}px at ${position.x}% ${position.y}%, black 0 58%, rgba(0, 0, 0, 0.72) 68%, transparent 100%)`;
    },
    [],
  );

  const getObjectHighlightMask = useCallback(
    (position: { x: number; y: number }) =>
      `radial-gradient(circle at ${position.x}% ${position.y}%, black 0 45%, rgba(0, 0, 0, 0.55) 62%, transparent 100%)`,
    [],
  );

  const stepIndex = STEPS.indexOf(currentStep);
  const progressValue = ((stepIndex + 1) / STEPS.length) * 100;
  const activeRecallWord =
    recallKeywordIndex >= 0 && recallKeywordIndex < WORDS.length
      ? WORDS[recallKeywordIndex]
      : null;
  const activeRecallPosition = activeRecallWord
    ? getRecallObjectPosition(activeRecallWord)
    : null;
  const activeStorySegment =
    recallKeywordIndex >= 0 && recallKeywordIndex < STORY_SEGMENTS.length
      ? STORY_SEGMENTS[recallKeywordIndex]
      : null;
  const activeRecallLabelPlacement = activeRecallPosition
    ? getObjectLabelPlacement(activeRecallPosition)
    : null;

  const activeRecallHighlightSize = activeRecallPosition
    ? Math.round(activeRecallPosition.size * 1.25)
    : 0;

  return (
    <div className={cn("w-full max-w-3xl", className)}>
      <Card className="overflow-hidden rounded-lg border-0 bg-transparent shadow-none">
        <CardContent
          className={cn(
            "relative overflow-hidden space-y-0 p-0",
            heroPreview
              ? "h-[292px] sm:h-[340px] lg:h-[430px]"
              : "h-[430px] sm:h-[620px] lg:h-[460px]",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-5 transition-all duration-700",
              STEP_PADDING_CLASS,
              currentStep === "Words"
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-8 opacity-0",
            )}
          >
            <p className="text-center text-sm text-muted-foreground">
              A list of random words, hard to remember on their own
            </p>
            <div
              className={cn(
                "flex flex-wrap justify-center gap-3 transition-all duration-700",
                wordsConverging && "scale-95 gap-2",
              )}
            >
              {WORDS.map((word, index) => {
                const colors = WORD_COLORS[word];

                return (
                  <Badge
                    key={word}
                    variant="outline"
                    className={cn(
                      "border-2 px-4 py-2.5 text-base font-semibold transition-all duration-500",
                      colors.bg,
                      colors.text,
                      colors.border,
                      visibleWords.includes(index)
                        ? "translate-y-0 scale-100 opacity-100"
                        : "translate-y-4 scale-95 opacity-0",
                      wordsConverging && "shadow-lg",
                    )}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {word}
                  </Badge>
                );
              })}
            </div>
            {wordsConverging && (
              <p className="animate-pulse text-sm font-medium text-primary">
                Transforming into a memorable scene...
              </p>
            )}
          </div>

          <div
            className={cn(
              "absolute inset-0 flex flex-col transition-all duration-700",
              heroPreview ? "p-0" : "px-3 pb-3 pt-0 sm:px-6 sm:pb-6 sm:pt-0",
              currentStep === "Palace"
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-8 opacity-0",
            )}
          >
            <div
              className={cn(
                "flex h-full min-h-0 overflow-hidden bg-card",
                heroPreview
                  ? "flex-row rounded-[8px] border border-[#d7dde7] shadow-none"
                  : "flex-col rounded-lg border-2 border-border shadow-lg lg:flex-row",
              )}
            >
              <div
                ref={palaceImageRef}
                className={cn(
                  "relative shrink-0 overflow-hidden bg-muted",
                  heroPreview
                    ? "h-full aspect-[1024/1536] border-r border-[#d7dde7]"
                    : "h-[260px] w-full border-b-2 border-border sm:h-72 lg:h-full lg:w-1/2 lg:border-b-0 lg:border-r-2",
                )}
              >
                {!heroPreview && (
                  <Image
                    src={PALACE_IMAGE_URL}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="scale-110 object-cover opacity-35 blur-md"
                    sizes="(min-width: 1024px) 24rem, 100vw"
                  />
                )}
                <Image
                  src={PALACE_IMAGE_URL}
                  alt="Memory palace scene"
                  fill
                  className="object-contain grayscale"
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />
                {revealedObjects.map((word) => {
                  const pos = getRecallObjectPosition(word);
                  const mask = getObjectRevealMask(pos);

                  return (
                    <Image
                      key={word}
                      src={PALACE_IMAGE_URL}
                      alt=""
                      aria-hidden="true"
                      fill
                      className="z-10 object-contain"
                      sizes="(min-width: 1024px) 24rem, 100vw"
                      style={{
                        WebkitMaskImage: mask,
                        maskImage: mask,
                      }}
                    />
                  );
                })}
                {activeRecallWord && activeRecallPosition && (
                  <>
                    <div
                      className="animate-object-pulse-white pointer-events-none absolute z-20 rounded-full"
                      style={{
                        left: `${activeRecallPosition.x}%`,
                        top: `${activeRecallPosition.y}%`,
                        width: `${activeRecallHighlightSize}px`,
                        height: `${activeRecallHighlightSize}px`,
                        transform: "translate(-50%, -50%)",
                        boxShadow:
                          "0 0 30px 18px rgba(255, 255, 255, 0.82), 0 0 62px 34px rgba(255, 255, 255, 0.42)",
                        background:
                          "radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.24) 52%, transparent 76%)",
                        WebkitMaskImage:
                          getObjectHighlightMask(activeRecallPosition),
                        maskImage: getObjectHighlightMask(activeRecallPosition),
                      }}
                    />
                  </>
                )}
                {activeRecallWord && activeRecallLabelPlacement && (
                  <Badge
                    variant="outline"
                    className="pointer-events-none absolute z-30 max-w-[7.5rem] select-none whitespace-nowrap border-0 bg-white px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-normal text-slate-950 shadow-[0_8px_22px_rgba(0,0,0,0.28)] ring-0 sm:px-3 sm:py-1.5 sm:text-xs"
                    style={{
                      left: `${activeRecallLabelPlacement.x}%`,
                      top: `${activeRecallLabelPlacement.y}%`,
                      transform: activeRecallLabelPlacement.transform,
                    }}
                  >
                    {activeRecallWord}
                  </Badge>
                )}
                {/* <Badge
                  variant="outline"
                  className="absolute left-3 top-3 z-30 border-border bg-white/85 text-foreground shadow-md backdrop-blur"
                >
                  Your Memory Palace
                </Badge> */}
                <div className="absolute bottom-3 left-3 right-3 z-30 flex gap-1.5">
                  {WORDS.map((word) => {
                    const colors = WORD_COLORS[word];
                    const isRevealed = revealedObjects.includes(word);

                    return (
                      <div
                        key={word}
                        className={cn(
                          "h-2 flex-1 rounded-full border transition-all duration-500",
                          isRevealed
                            ? cn(colors.bg, colors.border, "shadow-sm")
                            : "border-white/40 bg-white/30",
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-card">
                <CardHeader
                  className={cn(
                    "pb-2",
                    heroPreview
                      ? "block px-4 pt-7 sm:px-7 sm:pt-10"
                      : "hidden sm:block lg:block",
                  )}
                >
                  <CardTitle
                    className={cn(
                      "flex items-center gap-2 text-muted-foreground",
                      heroPreview ? "text-xs sm:text-sm" : "text-sm",
                    )}
                  >
                    <BookOpen
                      className={cn(heroPreview ? "size-5" : "size-4")}
                    />
                    The story unfolds...
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className={cn(
                    "min-h-0 flex-1",
                    heroPreview
                      ? "p-4 pt-2 sm:p-7 sm:pt-6"
                      : "p-5 sm:p-6 sm:pt-0",
                  )}
                >
                  <div className="flex h-full min-h-0 items-center lg:hidden">
                    {activeStorySegment ? (
                      <p
                        key={activeStorySegment.keyword}
                        className={cn(
                          "text-foreground/80 transition-all duration-500",
                          heroPreview
                            ? "text-[0.78rem] leading-[1.55] sm:text-base sm:leading-7"
                            : "text-lg leading-8 sm:text-base sm:leading-7",
                        )}
                      >
                        <span>{activeStorySegment.before}</span>
                        <span
                          className={cn(
                            "animate-keyword-glow mx-1 inline-block scale-110 font-bold transition-all duration-500",
                            WORD_COLORS[activeStorySegment.keyword].tailwind,
                          )}
                        >
                          {activeStorySegment.displayKeyword ||
                            activeStorySegment.keyword}
                        </span>
                        <span>{activeStorySegment.after}</span>
                      </p>
                    ) : (
                      <p className="text-lg leading-8 text-foreground/50 sm:text-base sm:leading-7">
                        The story unfolds...
                      </p>
                    )}
                  </div>

                  <div className="hidden h-full min-h-0 space-y-2.5 overflow-y-auto pr-3 lg:block">
                    {STORY_SEGMENTS.map((segment, index) => {
                      const colors = WORD_COLORS[segment.keyword];
                      const isActive = index === recallKeywordIndex;

                      return (
                        <p
                          key={segment.keyword}
                          className={cn(
                            "text-sm leading-6 transition-all duration-500",
                            index < visibleStoryLines
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-4 opacity-0",
                          )}
                        >
                          <span className="text-foreground/80">
                            {segment.before}
                          </span>
                          <span
                            className={cn(
                              "font-bold transition-all duration-500",
                              colors.tailwind,
                              isActive &&
                                "animate-keyword-glow mx-1 inline-block scale-125",
                            )}
                          >
                            {segment.displayKeyword || segment.keyword}
                          </span>
                          <span className="text-foreground/80">
                            {segment.after}
                          </span>
                        </p>
                      );
                    })}
                  </div>
                </CardContent>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700",
              STEP_PADDING_CLASS,
              currentStep === "Recall"
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-8 opacity-0",
            )}
          >
            <Card className="w-full max-w-md rounded-lg border-0 shadow-none">
              <CardContent className="flex min--[240px] flex-col items-center justify-center gap-5 p-5 text-center sm:p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="size-4 text-primary" />
                  Test your memory
                </div>
                <p className="text-base font-semibold text-foreground">
                  What came after the ladder?
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {(["moon", "violin", "suitcase"] as Word[]).map((option) => {
                    const colors = WORD_COLORS[option];
                    const isCorrect = option === "violin";

                    return (
                      <Button
                        key={option}
                        variant={
                          answerRevealed && isCorrect ? "default" : "outline"
                        }
                        size="sm"
                        className={cn(
                          "transition-all duration-300",
                          answerRevealed && isCorrect && "shadow-lg",
                          !answerRevealed &&
                            cn(
                              "border-2 hover:opacity-80",
                              colors.border,
                              colors.bg,
                              colors.text,
                            ),
                        )}
                      >
                        {option}
                        {answerRevealed && isCorrect && (
                          <Check className="ml-2 size-4" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700",
              STEP_PADDING_CLASS,
              currentStep === "Result"
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0",
            )}
          >
            <div
              className={cn(
                "flex flex-col items-center gap-5 text-center transition-all duration-700",
                heroPreview && "gap-3 sm:gap-5",
                showSuccess
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full border-2 border-primary bg-primary/10 shadow-lg",
                  heroPreview ? "size-14 sm:size-20" : "size-20",
                )}
              >
                <Trophy
                  className={cn(
                    "text-primary",
                    heroPreview ? "size-7 sm:size-10" : "size-10",
                  )}
                />
              </div>
              <div className="space-y-2">
                <h3
                  className={cn(
                    "font-bold text-foreground",
                    heroPreview ? "text-xl sm:text-2xl" : "text-2xl",
                  )}
                >
                  You remembered the path.
                </h3>
                <p
                  className={cn(
                    "max-w-sm text-muted-foreground",
                    heroPreview && "text-sm sm:text-base",
                  )}
                >
                  A list became a place you can revisit anytime.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {WORDS.map((word) => {
                  const colors = WORD_COLORS[word];

                  return (
                    <Badge
                      key={word}
                      variant="outline"
                      className={cn(
                        "border-2 px-2 py-1 text-[0.65rem] sm:px-3 sm:text-xs",
                        colors.bg,
                        colors.text,
                        colors.border,
                      )}
                    >
                      {word}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>

        {!heroPreview && (
          <div className="px-5 pb-4 pt-2 sm:px-6">
            <Progress value={progressValue} className="h-1.5" />
          </div>
        )}
      </Card>
    </div>
  );
}

export default MemoryPalaceViolinDemo;
