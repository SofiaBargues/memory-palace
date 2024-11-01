"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Palace } from "../api/v1/generate/route";
import { Title } from "./title";
import { WordsInput } from "./wordsInput";
import { WordsList } from "./wordList";
import { PalaceStory } from "./palaceStory";
import { generateDataResponse } from "./DATA";
import { Description } from "./description";
import palace from "@/mongodb/models/palace";
import { selectRandomWords } from "./selectRandomWords";

const generateData = JSON.parse(generateDataResponse);
export const storyData = Palace.parse(generateData);
export const imagesData = ["/part1.png", "/part2.png", "/part3.png"];

function PalacePage() {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(selectRandomWords());
  }, []);

  if (words.length === 0) {
    return <div>Loading...</div>;
  }
  const palace: Palace = {
    words: words,
    images: imagesData,
    imagePrompts: storyData.imagePrompts,
    sentences: storyData.sentences,
  };
  return <PalaceView initialPalace={palace} initialStep="start" />;
}
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

  const [inputWords, setInputWords] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[]>([]);

  async function generatePalace(): Promise<Palace | undefined> {
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
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const newArr = [];
    e.preventDefault();
    for (let i = 0; i < palace.words.length; i++) {
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
      {step === "palace" && (
        <>
          <Title title="Palace" />
          <Description>
            Welcome to the palace of memory, immerse yourself in this story.
            There, you will find the highlighted words in the order you must
            remember.
          </Description>
          <PalaceStory palace={palace} />
        </>
      )}
      {step === "fill1" && (
        <>
          <Title title="Fill" />
          <Description>
            Complete the blanks with the previous words in the correct order.
          </Description>
          <WordsInput
            initialWords={palace.words}
            handleSubmit={handleSubmit}
            step={step}
          />
        </>
      )}
      {step === "fill2" && (
        <>
          <Title title="Fill" />
          <Description>
            It's time to put your journey through the palace of memory to the
            test. Remember each scene from the story, visualizing the details.
            Fill in the blanks as you mentally progress through the narrative.
          </Description>
          <WordsInput
            initialWords={palace.words}
            handleSubmit={handleSubmit}
            step={step}
          />
        </>
      )}
      {step === "start" && (
        <>
          <Title title="Remember" />
          <Description>
            First attempt, now try to remember the following words and their
            order.
          </Description>
          <WordsList
            originalWords={palace.words}
            results={results}
            inputWords={inputWords}
          />
        </>
      )}
      {step === "results1" && (
        //paso previo a ver el palace
        <>
          <Title title="Results" />
          <Description>
            These are the results of your first attempt.
          </Description>
          <WordsList
            inputWords={inputWords}
            originalWords={palace.words}
            results={results}
          />
        </>
      )}
      {step === "results2" && (
        <>
          <Title title="Result" />
          <Description>
            These are the results of your memory palace journey
          </Description>
          <WordsList
            inputWords={inputWords}
            originalWords={palace.words}
            results={results}
          />
        </>
      )}
      {step != "fill1" && step != "fill2" ? (
        <Button className="w-28" onClick={goToNextStep}>
          Next
        </Button>
      ) : null}
    </div>
  );
}

export default PalacePage;
