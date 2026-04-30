"use client";
import { useEffect, useState } from "react";
import { Palace } from "../app/api/v1/generate/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import MemoryTestStep from "./steps/memoryTestStep";
import { ChooseWordsStep } from "./steps/chooseWordsStep";
import { StoryStep } from "./steps/storyStep";
import { TutorialStep } from "./steps/tutorialStep";
import { flushSync } from "react-dom";

export type PalaceStep = "chooseWords" | "story" | "memoryTest" | "tutorial";

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

    setLoadingProgress(8);

    const interval = window.setInterval(() => {
      setLoadingProgress((currentProgress) => {
        if (currentProgress >= 92) {
          return currentProgress;
        }

        const stepSize = Math.max(2, Math.ceil((100 - currentProgress) / 12));
        return Math.min(currentProgress + stepSize, 92);
      });
    }, 400);

    return () => {
      window.clearInterval(interval);
    };
  }, [loading]);

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
          console.log(response);
          const result = await response.json();
          console.log(result);
          const fetchedPalace = result.data.find(
            (value: Palace & { _id: string }) => value._id === initialPalaceId
          );
          setPalace(fetchedPalace);
          setReferenceWords(fetchedPalace?.words);
        } else {
          const errorData = await response.json();
          console.log(errorData);
          throw new Error(errorData.message || "Error en la solicitud");
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };
    if (!isNewPalace) {
      fetchPosts();
    }
  }, [initialPalaceId, isNewPalace]);

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
      console.log(generatedPalace); // Imprime cada nombre de usuario
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
    console.log("Creating New Palace");
    console.log("Loading");
    flushSync(() => setLoading(true));
    const generatedPalace = await generatePalace();
    if (!generatedPalace) {
      setLoading(false);
      console.log("Palace is undefined");
      return;
    }
    setLoadingProgress(100);
    setLoading(false);
    setPalace(generatedPalace);
  }

  if (loading && (step === "story" || step === "chooseWords")) {
    return (
      <div className="w-full container m-auto md:p-10 flex flex-col gap-4">
        <Card className="w-full md:max-w-5xl rounded-none md:rounded-xl m-auto ">
          <CardContent className="flex justify-center items-center h-[900px] flex-col gap-5 px-8">
            <div className="w-full max-w-xl space-y-4 text-center">
              <p className="text-5xl font-semibold tabular-nums">
                {loadingProgress}%
              </p>
              <p className="font-medium text-xl">
                {isNewPalace ? "Creating Palace" : "Loading Palace"}
              </p>
              <Progress value={loadingProgress} className="h-4" />
              <p className="text-sm text-muted-foreground">
                Generating the story and images. This can take a few seconds.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log(slideSelected);
  return (
    <div className="w-full container m-auto md:p-10 flex flex-col  gap-4">
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
