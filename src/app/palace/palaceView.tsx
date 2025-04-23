"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Palace } from "../api/v1/generate/types";
import { WordsInput } from "./wordsInput";
import { WordsList } from "./wordList";
import { PalaceStory } from "./palaceStory";
import { Loader } from "@/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { selectRandomWord } from "./selectRandomWord";
import { RefreshCw, Sparkles } from "lucide-react";
import MemoryTestStep from "./memoryTestStep";
import { ChooseWordsStep } from "./chooseWordsStep";

function upDateArrayValue({
  i,
  newVal,
  arr,
}: {
  i: number;
  newVal: string;
  arr: string[];
}) {
  const arrWork = [...arr];
  arrWork[i] = newVal;

  return arrWork;
}

export type PalaceStep =
  // new
  | "chooseWords"
  | "story"
  | "memoryTest"
  // old
  | "start"
  | "fill2"
  | "results2";

export function PalaceView({
  initialPalace,
  initialStep,
  initialPalaceId,
}: {
  initialPalaceId: string | undefined;
  initialPalace: Palace;
  initialStep: PalaceStep;
}) {
  const [palace, setPalace] = useState(initialPalace);
  const [palaceId, setPalaceId] = useState(initialPalaceId);
  const [step, setStep] = useState<PalaceStep>(initialStep);
  const [loading, setLoading] = useState(false);

  const [referenceWords, setReferenceWords] = useState<string[]>(palace.words);
  const [slideSelected, setSlideSelected] = useState(0);

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

  const handleWordsChoiceSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    const newArr = [];
    e.preventDefault();
  };

  async function goToNextStep() {
    if (step === "chooseWords") {
      await createPalace();
      setStep("story");
    } else if (step === "story") {
      setStep("memoryTest");
    } else if (step === "memoryTest") {
      setStep("chooseWords");
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

  if (loading) {
    return (
      <div className="w-full container m-auto md:p-10 flex flex-col  gap-4">
        <Card className="w-full md:max-w-5xl rounded-none md:rounded-xl m-auto ">
          <CardContent className="flex justify-center items-center h-[900px] flex-col">
            <Loader />
            <p className="font-medium  mt-5 text-xl">Creating Palace</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log(slideSelected);
  return (
    <div className="w-full container m-auto md:p-10 flex flex-col  gap-4">
      <Card className="w-full md:max-w-5xl rounded-none md:rounded-xl m-auto ">
        {step === "story" && (
          <>
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl font-bold ">
                Read the story to remember
              </CardTitle>
              <CardDescription className="text-gray-600">
                Link each word in the story, making recall effortless and
                engaging.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PalaceStory
                palace={palace}
                onSlideSelected={(num) => {
                  console.log(" changed", num);
                  setSlideSelected(num);
                }}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4">
              <Button
                className="w-full"
                disabled={slideSelected < palace.images.length}
                onClick={goToNextStep}
              >
                Test Me
              </Button>
            </CardFooter>
          </>
        )}

        {step === "memoryTest" && (
          <MemoryTestStep
            wordsToRemember={referenceWords}
            onBackToStoryClick={() => {
              setStep("story");
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
      </Card>
    </div>
  );
}
