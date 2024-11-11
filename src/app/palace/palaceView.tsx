"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Palace } from "../api/v1/generate/types";
import { Title } from "./title";
import { WordsInput } from "./wordsInput";
import { WordsList } from "./wordList";
import { PalaceStory } from "./palaceStory";
import { Description } from "./description";
import { Loader } from "@/components";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PalaceStep =
  | "start"
  | "fill1"
  | "results1"
  | "palace"
  | "fill2"
  | "results2";

export function PalaceView({
  initialPalace,
  initialStep,
}: {
  initialPalace: Palace;
  initialStep: PalaceStep;
}) {
  const [palace, setPalace] = useState(initialPalace);
  const [step, setStep] = useState<PalaceStep>(initialStep);
  const [loading, setLoading] = useState(false);

  const [inputWords, setInputWords] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[]>([]);

  async function generatePalace(): Promise<Palace | undefined> {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        body: JSON.stringify({ words: palace.words }),
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const newArr = [];
    e.preventDefault();
    for (let i = 0; i < palace.words.length; i++) {
      // @ts-expect-error  form has elements attribute
      newArr.push(e.target.elements["input_" + i].value);
    }
    setInputWords(newArr);

    const isCorrectArr = [];
    for (let i = 0; i < newArr.length; i++) {
      const palabra = newArr[i];
      if (palabra.toLowerCase() === palace.words[i].toLowerCase()) {
        isCorrectArr.push(true);
      } else {
        isCorrectArr.push(false);
      }
    }
    setResults(isCorrectArr);
    await goToNextStep();
  };

  async function goToNextStep() {
    if (step === "start") {
      setStep("fill1");
    } else if (step === "fill1") {
      setStep("results1");
    } else if (step === "results1") {
      console.log("Creating New Palace");
      console.log("Loading");
      const generatedPalace = await generatePalace();
      if (!generatedPalace) {
        console.log("Palace is undefined");
        return;
      }
      setPalace(generatedPalace);
      setStep("palace");
    } else if (step === "palace") {
      setStep("fill2");
    } else if (step === "fill2") {
      setStep("results2");
    } else if (step === "results2") {
      setResults([]);
      setInputWords([]);
      setStep("start");
    }
  }
  return (
    <div className="w-full container m-auto p-10 flex flex-col  gap-4">
      <Card className="w-full max-w-2xl">
        <>
          {step === "palace" && (
            <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">
                  Memory Place
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h2 className="text-xl font-semibold mb-4">Palace</h2>
                <p className="text-gray-600 mb-6">
                  Welcome to the palace of memory, immerse yourself in this
                  story. There, you will find the highlighted words in the order
                  you must remember.
                </p>

                <PalaceStory palace={palace} />
              </CardContent>
            </>
          )}
        </>

        {step === "fill1" && (
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Memory Place</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Fill</h2>
              <p className="text-gray-600 mb-6">
                Complete the blanks with the previous words in the correct
                order.
              </p>
              <WordsInput
                initialWords={palace.words}
                handleSubmit={handleSubmit}
                step={step}
              />
            </CardContent>
          </>
        )}
        {step === "fill2" && (
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Memory Place</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Fill</h2>
              <p className="text-gray-600 mb-6">
                It is time to put your journey through the palace of memory to
                the test. Remember each scene from the story, visualizing the
                details. Fill in the blanks as you mentally progress through the
                narrative.
              </p>
              <WordsInput
                initialWords={palace.words}
                handleSubmit={handleSubmit}
                step={step}
              />
            </CardContent>
          </>
        )}
        {step === "start" && (
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Memory Place</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Remember</h2>
              <p className="text-gray-600 mb-6">
                First attempt, now try to remember the following words and their
                order.
              </p>
              <WordsList
                originalWords={palace.words}
                results={results}
                inputWords={inputWords}
              />
            </CardContent>
          </>
        )}
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          step === "results1" && (
            //paso previo a ver el palace
            <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">
                  Memory Place
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Title title="Results" />
                <Description>
                  These are the results of your first attempt.
                </Description>

                <WordsList
                  inputWords={inputWords}
                  originalWords={palace.words}
                  results={results}
                />
              </CardContent>
            </>
          )
        )}
        {step === "results2" && (
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Memory Place</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <p className="text-gray-600 mb-6">
                These are the results of your first attempt.
              </p>
              <WordsList
                inputWords={inputWords}
                originalWords={palace.words}
                results={results}
              />
              <a href="http://localhost:3000/">
                <Button className="w-full mt-4">Go home</Button>
              </a>
            </CardContent>
          </>
        )}
        <CardFooter className="flex flex-col items-start space-y-4">
          {step != "fill1" &&
          step != "fill2" &&
          step != "results2" &&
          !loading ? (
            <Button className="w-full" onClick={goToNextStep}>
              Next
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
