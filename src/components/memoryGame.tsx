"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { Palace } from "../app/api/v1/generate/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import MemoryTestStep from "./steps/memoryTestStep";
import { ChooseWordsStep } from "./steps/chooseWordsStep";
import { StoryStep } from "./steps/storyStep";
import { TutorialStep } from "./steps/tutorialStep";
import { flushSync } from "react-dom";
import { Check, Circle, LoaderCircle } from "lucide-react";

export type PalaceStep = "chooseWords" | "story" | "memoryTest" | "tutorial";

const GENERATION_STEPS = [
  { label: "Reading words", startsAt: 0 },
  { label: "Building palace route", startsAt: 4 },
  { label: "Writing scene prompts", startsAt: 10 },
  { label: "Generating triptych image", startsAt: 16 },
  {
    label: "Cropping and uploading images",
    startsAt: Number.POSITIVE_INFINITY,
  },
  { label: "Saving palace", startsAt: Number.POSITIVE_INFINITY },
];

function LoadingStepItem({
  label,
  status,
}: {
  label: string;
  status: "complete" | "active" | "pending";
}) {
  return (
    <li className="grid grid-cols-[1.25rem_1fr] items-center gap-4 text-sm">
      <span className="flex size-5 items-center justify-center">
        {status === "complete" && <Check className="size-4 stroke-[1.8]" />}
        {status === "active" && (
          <LoaderCircle className="size-4 animate-spin stroke-[2]" />
        )}
        {status === "pending" && (
          <Circle className="size-4 stroke-[1.6] text-muted-foreground" />
        )}
      </span>
      <span
        className={
          status === "active"
            ? "font-semibold text-foreground"
            : status === "pending"
              ? "text-muted-foreground"
              : "text-foreground"
        }
      >
        {label}
      </span>
    </li>
  );
}

function PalaceLoadingScreen({
  isNewPalace,
  elapsedSeconds,
}: {
  isNewPalace: boolean;
  elapsedSeconds: number;
}) {
  if (!isNewPalace) {
    return (
      <div className="w-full max-w-xl text-center">
        <p className="text-2xl font-medium">Loading Palace</p>
        <div className="mt-5">
          <Progress value={100} animated className="h-3 bg-muted" />
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          Fetching your saved palace.
        </p>
      </div>
    );
  }

  const activeStepIndex = GENERATION_STEPS.reduce(
    (activeIndex, loadingStep, index) =>
      elapsedSeconds >= loadingStep.startsAt ? index : activeIndex,
    0,
  );

  return (
    <div className="flex w-full max-w-[34rem] flex-col items-center text-center">
      <p className="text-2xl font-medium">Creating Palace</p>
      <p className="mt-3 text-sm text-muted-foreground">
        Generating your story and images. This take a few minutes.
      </p>

      <div className="mt-10 w-full">
        <Progress value={100} animated className="h-3 bg-muted" />
      </div>

      <ol className="mt-10 flex w-full max-w-sm flex-col gap-7 text-left">
        {GENERATION_STEPS.map((loadingStep, index) => {
          const status =
            index < activeStepIndex
              ? "complete"
              : index === activeStepIndex
                ? "active"
                : "pending";

          return (
            <LoadingStepItem
              key={loadingStep.label}
              label={loadingStep.label}
              status={status}
            />
          );
        })}
      </ol>
      <p className="mt-11 text-sm text-accent-foreground">
        Image generation takes at least 3 minutes, this is
        the longest step in this process.
      </p>
    </div>
  );
}

export function MemoryGame({
  initialPalaceId,
  initialStep = "tutorial",
}: {
  initialPalaceId: string | undefined;
  initialStep?: PalaceStep;
}) {
  const [palace, setPalace] = useState<Palace | null>(null);
  // const [_, setPalaceId] = useState(initialPalaceId);
  const [step, setStep] = useState<PalaceStep>(initialStep);
  const [loading, setLoading] = useState(false);
  const [loadingElapsedSeconds, setLoadingElapsedSeconds] = useState(0);
  const loadingStartedAtRef = useRef<number | null>(null);

  const [referenceWords, setReferenceWords] = useState<string[]>(
    new Array(9).fill(undefined),
  );
  const [slideSelected, setSlideSelected] = useState(0);

  const isNewPalace = initialPalaceId ? false : true;

  useEffect(() => {
    if (!loading) {
      setLoadingElapsedSeconds(0);
      return;
    }

    loadingStartedAtRef.current = Date.now();
    setLoadingElapsedSeconds(0);

    const interval = window.setInterval(() => {
      if (!loadingStartedAtRef.current) {
        return;
      }

      setLoadingElapsedSeconds(
        Math.floor((Date.now() - loadingStartedAtRef.current) / 1000),
      );
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loading]);

  const completeLoading = useCallback(async () => {
    loadingStartedAtRef.current = null;
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/palace", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          const fetchedPalace = result.data.find(
            (value: Palace & { _id: string }) => value._id === initialPalaceId,
          );
          setPalace(fetchedPalace);
          setReferenceWords(fetchedPalace?.words);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error en la solicitud");
        }
      } catch (error) {
        alert(error);
      } finally {
        await completeLoading();
      }
    };
    if (!isNewPalace) {
      fetchPosts();
    }
  }, [completeLoading, initialPalaceId, isNewPalace]);

  async function generatePalace(): Promise<Palace | undefined> {
    try {
      const distinctId = posthog.get_distinct_id();
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(distinctId ? { "x-posthog-distinct-id": distinctId } : {}),
        },
        body: JSON.stringify({ words: referenceWords }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            "Network response was not ok " + response.statusText,
        );
      }
      const generatedPalace = await response.json(); // Convierte la respuesta a JSON
      return generatedPalace as Palace;
    } catch {
      return undefined;
    }
  }

  async function goToNextStep() {
    if (step === "tutorial" && isNewPalace) {
      setStep("chooseWords");
    } else if (step === "tutorial" && !isNewPalace) {
      setStep("story");
    } else if (step === "chooseWords") {
      await createPalace();
      setStep("story");
    } else if (step === "story") {
      setStep("memoryTest");
    } else if (step === "memoryTest") {
      setStep("tutorial");
    }
  }

  async function createPalace() {
    flushSync(() => setLoading(true));
    const generatedPalace = await generatePalace();
    if (!generatedPalace) {
      setLoading(false);
      return;
    }
    await completeLoading();
    setPalace(generatedPalace);
  }

  if (loading && (step === "story" || step === "chooseWords")) {
    return (
      <div className="w-full container m-auto md:p-10 flex flex-col gap-4">
        <Card className="w-full md:max-w-5xl rounded-none md:rounded-xl m-auto ">
          <CardContent className="flex min-h-[720px] flex-col items-center justify-center px-8 py-16 md:min-h-[810px]">
            <PalaceLoadingScreen
              isNewPalace={isNewPalace}
              elapsedSeconds={loadingElapsedSeconds}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={
        step === "story"
          ? "w-full flex flex-col gap-4"
          : "w-full container m-auto md:p-10 flex flex-col  gap-4"
      }
    >
      {/* <Card className="w-full md:max-w-5xl rounded-none md:rounded-xl m-auto "> */}
      {step === "story" && (
        <>
          {palace ? (
            <StoryStep
              setSlideSelected={setSlideSelected}
              slideSelected={slideSelected}
              onFinishClick={goToNextStep}
              palace={palace}
            />
          ) : (
            <div>Palace not found</div>
          )}
        </>
      )}

      {step === "tutorial" && (
        <TutorialStep isNew={isNewPalace} onContinueClick={goToNextStep} />
      )}

      {step === "memoryTest" && (
        <MemoryTestStep
          wordsToRemember={referenceWords}
          onBackToStoryClick={() => {
            setStep("story");
            setSlideSelected(0);
          }}
        />
      )}

      {step === "chooseWords" && (
        <ChooseWordsStep
          onGeneratePalaceClick={goToNextStep}
          words={referenceWords}
          setWords={setReferenceWords}
        />
      )}
      {/* </Card> */}
    </div>
  );
}
