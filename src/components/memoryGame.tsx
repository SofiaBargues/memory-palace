"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Palace } from "../app/api/v1/generate/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import MemoryTestStep from "./steps/memoryTestStep";
import { ChooseWordsStep } from "./steps/chooseWordsStep";
import { StoryStep } from "./steps/storyStep";
import { TutorialStep } from "./steps/tutorialStep";
import { flushSync } from "react-dom";

export type PalaceStep = "chooseWords" | "story" | "memoryTest" | "tutorial";

const LOADING_START_PROGRESS = 8;
const LOADING_MAX_PROGRESS = 98;
const LOADING_COMPLETE_DELAY_MS = 250;
const LOADING_ESTIMATED_DURATION_MS = 45000;

function getTimedLoadingProgress(startedAt: number) {
  const elapsedMilliseconds = Date.now() - startedAt;
  const progressRange = LOADING_MAX_PROGRESS - LOADING_START_PROGRESS;
  const elapsedRatio = Math.min(
    elapsedMilliseconds / LOADING_ESTIMATED_DURATION_MS,
    1
  );

  return Math.round(LOADING_START_PROGRESS + progressRange * elapsedRatio);
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function MemoryGame({
  initialPalaceId,
}: {
  initialPalaceId: string | undefined;
}) {
  const [palace, setPalace] = useState<Palace | null>(null);
  // const [_, setPalaceId] = useState(initialPalaceId);
  const [step, setStep] = useState<PalaceStep>("tutorial");
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingStartedAtRef = useRef<number | null>(null);

  const [referenceWords, setReferenceWords] = useState<string[]>(
    new Array(9).fill(undefined)
  );
  const [slideSelected, setSlideSelected] = useState(0);

  const isNewPalace = initialPalaceId ? false : true;

  useEffect(() => {
    if (!loading) {
      setLoadingProgress(0);
      return;
    }

    loadingStartedAtRef.current = Date.now();
    setLoadingProgress(LOADING_START_PROGRESS);

    const interval = window.setInterval(() => {
      if (!loadingStartedAtRef.current) {
        return;
      }

      setLoadingProgress(getTimedLoadingProgress(loadingStartedAtRef.current));
    }, 100);

    return () => {
      window.clearInterval(interval);
    };
  }, [loading]);

  const completeLoading = useCallback(async () => {
    setLoadingProgress(100);
    await wait(LOADING_COMPLETE_DELAY_MS);
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
            (value: Palace & { _id: string }) => value._id === initialPalaceId
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
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        body: JSON.stringify({ words: referenceWords }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const generatedPalace = await response.json(); // Convierte la respuesta a JSON
      return generatedPalace as Palace;
    } catch (error) {
      console.error("Fetch error:", error);
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
      console.error("Palace is undefined");
      return;
    }
    await completeLoading();
    setPalace(generatedPalace);
  }

  if (loading && (step === "story" || step === "chooseWords")) {
    return (
      <div className="w-full container m-auto md:p-10 flex flex-col gap-4">
        <Card className="w-full md:max-w-5xl rounded-none md:rounded-xl m-auto ">
          <CardContent className="flex justify-center items-center h-[900px] flex-col gap-5 px-8">
            <div className="w-full max-w-xl space-y-4 text-center">
              <p className="font-medium text-2xl">
                {isNewPalace ? "Creating Palace" : "Loading Palace"}
              </p>
              <Progress value={loadingProgress} animated className="h-4" />
              <p className="text-sm text-muted-foreground">
                Generating the story and images. This can take a few seconds.
              </p>
            </div>
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
