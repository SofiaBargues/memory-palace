"use client";
import { useEffect, useState } from "react";
import { Palace } from "../app/api/v1/generate/types";
import { Loader } from "@/components/Loader";
import { Card, CardContent } from "@/components/ui/card";
import MemoryTestStep from "./steps/memoryTestStep";
import { ChooseWordsStep } from "./steps/chooseWordsStep";
import { StoryStep } from "./steps/storyStep";
import { TutorialStep } from "./steps/tutorialStep";

export type PalaceStep = "chooseWords" | "story" | "memoryTest" | "tutorial";

export function MemoryGame({
  initialPalaceId,
}: {
  initialPalaceId: string | undefined;
}) {
  const [palace, setPalace] = useState<Palace | null>(null);
  const [palaceId, setPalaceId] = useState(initialPalaceId);
  const [step, setStep] = useState<PalaceStep>("tutorial");
  const [loading, setLoading] = useState(false);

  const [referenceWords, setReferenceWords] = useState<string[]>(
    new Array(9).fill(undefined)
  );
  const [slideSelected, setSlideSelected] = useState(0);

  const isNewPalace = initialPalaceId ? false : true;

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
    setLoading(true);
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
    } finally {
      setLoading(false);
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
    const generatedPalace = await generatePalace();
    if (!generatedPalace) {
      console.log("Palace is undefined");
      return;
    }
    setPalace(generatedPalace);
    // @ts-expect-error id exists in palace response
    setPalaceId(generatedPalace._id);
  }

  console.log(slideSelected);
  return (
    <div className="w-full container m-auto md:p-10 flex flex-col  gap-4">
      {/* <Card className="w-full md:max-w-5xl rounded-none md:rounded-xl m-auto "> */}
      {step === "story" && (
        <>
          {loading ? (
            <div className="w-full container m-auto md:p-10 flex flex-col  gap-4">
              <Card className="w-full md:max-w-5xl rounded-none md:rounded-xl m-auto ">
                <CardContent className="flex justify-center items-center h-[900px] flex-col">
                  <Loader />
                  <p className="font-medium  mt-5 text-xl">
                    {isNewPalace ? "Creating Palace" : "Loading Palace"}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : palace ? (
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
            setSlideSelected(0)
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
