"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BookOpen, Brain, Check, Sparkles, Trophy } from "lucide-react";

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

const STEP_ICONS = {
  Words: Sparkles,
  Palace: BookOpen,
  Recall: Brain,
  Result: Trophy,
};

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

interface MemoryPalaceViolinDemoProps {
  className?: string;
}

export function MemoryPalaceViolinDemo({
  className,
}: MemoryPalaceViolinDemoProps) {
  const [currentStep, setCurrentStep] = useState<Step>("Words");
  const [stepRunId, setStepRunId] = useState(0);
  const [visibleWords, setVisibleWords] = useState<number[]>([]);
  const [wordsConverging, setWordsConverging] = useState(false);
  const [visibleStoryLines, setVisibleStoryLines] = useState(0);
  const [recallKeywordIndex, setRecallKeywordIndex] = useState(-1);
  const [revealedObjects, setRevealedObjects] = useState<Word[]>([]);
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
    const timer = window.setTimeout(() => {
      const currentIndex = STEPS.indexOf(currentStep);
      const nextStep = STEPS[(currentIndex + 1) % STEPS.length];

      startStep(nextStep);
    }, TIMING[currentStep]);

    return () => window.clearTimeout(timer);
  }, [currentStep, startStep, stepRunId]);

  useEffect(() => {
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
  }, [currentStep, stepRunId]);

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
              width,
              height: width / PALACE_IMAGE_ASPECT_RATIO,
              x: 0,
              y: (height - width / PALACE_IMAGE_ASPECT_RATIO) / 2,
            }
          : {
              width: height * PALACE_IMAGE_ASPECT_RATIO,
              height,
              x: (width - height * PALACE_IMAGE_ASPECT_RATIO) / 2,
              y: 0,
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

  const stepIndex = STEPS.indexOf(currentStep);
  const progressValue = ((stepIndex + 1) / STEPS.length) * 100;
  const activeRecallWord =
    recallKeywordIndex >= 0 && recallKeywordIndex < WORDS.length
      ? WORDS[recallKeywordIndex]
      : null;
  const activeRecallPosition = activeRecallWord
    ? getRecallObjectPosition(activeRecallWord)
    : null;
  const activeRecallHighlightSize = activeRecallPosition
    ? Math.round(activeRecallPosition.size * 1.25)
    : 0;
  return (
    <div className={cn("w-full max-w-3xl", className)}>
      <Card className="overflow-hidden rounded-lg border-0 shadow-none bg-transparent">
        <CardContent
          className="relative h-[386px] overflow-hidden p-0 sm:h-[620px] lg:h-[460px]"
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
              STEP_PADDING_CLASS,
              currentStep === "Palace"
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-8 opacity-0",
            )}
          >
            <div className="flex h-full min-h-0 flex-col gap-2.5 sm:gap-4 lg:flex-row">
              <div
                ref={palaceImageRef}
                className="relative h-[176px] w-full shrink-0 overflow-hidden rounded-lg border-2 border-border bg-muted shadow-lg sm:h-72 lg:h-full lg:w-1/2"
              >
                <Image
                  src={PALACE_IMAGE_URL}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="scale-110 object-cover opacity-35 blur-md"
                  sizes="(min-width: 1024px) 24rem, 100vw"
                />
                <Image
                  src={PALACE_IMAGE_URL}
                  alt="Memory palace scene"
                  fill
                  className="object-cover grayscale"
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />
                {revealedObjects.map((word) => {
                  const pos = getRecallObjectPosition(word);
                  const radius = Math.round(pos.size / 1.5);

                  return (
                    <Image
                      key={word}
                      src={PALACE_IMAGE_URL}
                      alt=""
                      aria-hidden="true"
                      fill
                      className="z-10 object-cover"
                      sizes="(min-width: 1024px) 24rem, 100vw"
                      style={{
                        clipPath: `circle(${radius}px at ${pos.x}% ${pos.y}%)`,
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
                          "0 0 0 1px rgba(255, 255, 255, 0.55), 0 0 28px 18px rgba(255, 255, 255, 0.88), 0 0 62px 34px rgba(255, 255, 255, 0.5)",
                        background:
                          "radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.24) 52%, transparent 76%)",
                      }}
                    />
                    <Badge
                      variant="outline"
                      className={cn(
                        "animate-bounce-subtle pointer-events-none absolute z-30 select-none border-2 bg-white/85 px-3 py-1.5 text-sm font-bold shadow-xl backdrop-blur",
                        WORD_COLORS[activeRecallWord].text,
                        WORD_COLORS[activeRecallWord].border,
                      )}
                      style={{
                        left: `${activeRecallPosition.x}%`,
                        top: `${activeRecallPosition.y - 12}%`,
                        transform: "translate(-50%, -100%)",
                      }}
                    >
                      {activeRecallWord.toUpperCase()}
                    </Badge>
                  </>
                )}
                <Badge
                  variant="outline"
                  className="absolute left-3 top-3 z-30 border-border bg-white/85 text-foreground shadow-md backdrop-blur"
                >
                  Your Memory Palace
                </Badge>
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

              <Card className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border-2 shadow-none">
                <CardHeader className="hidden pb-2 sm:block">
                  <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="size-4" />
                    The story unfolds...
                  </CardTitle>
                </CardHeader>
                <CardContent className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-3.5 pr-3 sm:space-y-2.5 sm:p-6 sm:pt-0">
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
                </CardContent>
              </Card>
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
            <Card className="w-full max-w-md rounded-lg border-2 shadow-none">
              <CardContent className="flex min-h-[240px] flex-col items-center justify-center gap-5 p-5 text-center sm:p-6">
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
                showSuccess
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0",
              )}
            >
              <div className="flex size-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10 shadow-lg">
                <Trophy className="size-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  You remembered the path.
                </h3>
                <p className="max-w-sm text-muted-foreground">
                  A list became a place you can revisit anytime.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {WORDS.map((word) => {
                  const colors = WORD_COLORS[word];

                  return (
                    <Badge
                      key={word}
                      variant="outline"
                      className={cn(
                        "border-2 px-3 py-1 text-xs",
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

        <div className="px-5 pb-4 pt-2 sm:px-6">
          <Progress value={progressValue} className="h-1.5" />
        </div>
      </Card>
    </div>
  );
}

export default MemoryPalaceViolinDemo;
