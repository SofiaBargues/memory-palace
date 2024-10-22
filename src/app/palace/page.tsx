"use client";
import { Button } from "@/components/ui/button";
import React, { use, useState } from "react";
import { Story } from "../api/v1/generate/route";
import { map } from "zod";
import { Console } from "console";
import { start } from "repl";
import { disconnect } from "process";
import { Result } from "postcss";
import { BlobLike } from "openai/uploads.mjs";
import { text } from "stream/consumers";
import { Title } from "./title";
import { WordsInput } from "./wordsInput";
import { Card } from "./card";
import { WordRow } from "./wordRow";
import { WordsList } from "./wordList";
import { StoryPart } from "./placePort";
import { PalaceStory } from "./palaceStory";
import { generateDataResponse, initialWords } from "./DATA";
import { ButtonIcon } from "@radix-ui/react-icons";

const generateData = JSON.parse(generateDataResponse);
export const storyData = Story.parse(generateData.story);
export const imagesData = ["/part1.png", "/part2.png", "/part3.png"];

//todo description

const Palace = () => {
  const [inputWords, setInputWords] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [step, setStep] = useState<
    "start" | "fill1" | "results1" | "palace" | "fill2" | "results2"
  >("start");

  const total = results.filter((x) => x === true).length;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const newArr = [];
    e.preventDefault();
    for (let i = 0; i < initialWords.length; i++) {
      newArr.push(e.target.elements["input_" + i].value);
    }
    setInputWords(newArr);

    const isCorrectArr = [];
    for (let i = 0; i < newArr.length; i++) {
      const palabra = newArr[i];
      if (palabra.toLowerCase() === initialWords[i].toLowerCase()) {
        isCorrectArr.push(true);
      } else {
        isCorrectArr.push(false);
      }
    }
    setResults(isCorrectArr);
    goToNextStep();
  };

  function goToNextStep() {
    if (step === "start") {
      setStep("fill1");
    } else if (step === "fill1") {
      setStep("results1");
    } else if (step === "results1") {
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
  console.log(step);
  return (
    <div className="w-full container m-auto p-10 flex flex-col ">
      {step === "palace" && (
        <>
          <Title title="Palace" />
          <PalaceStory />
        </>
      )}
      {step === "fill1" && (
        <>
          <Title title="Fill" />
          <WordsInput
            initialWords={initialWords}
            handleSubmit={handleSubmit}
            step={step}
          />
        </>
      )}
      {step === "fill2" && (
        <>
          <Title title="Fill" />
          <WordsInput
            initialWords={initialWords}
            handleSubmit={handleSubmit}
            step={step}
          />
        </>
      )}
      {step === "start" && (
        <>
          <Title title="Remember" />
          <WordsList
            originalWords={initialWords}
            results={results}
            inputWords={inputWords}
          />
        </>
      )}
      {step === "results1" && (
        <>
          <Title title="Results" />
          <WordsList
            inputWords={inputWords}
            originalWords={initialWords}
            results={results}
          />
        </>
      )}
      {step === "results2" && (
        <>
          <Title title="Remember" />
          <WordsList
            inputWords={inputWords}
            originalWords={initialWords}
            results={results}
          />
        </>
      )}
      {step === "results2" || step === "results1" ? (
        <div className="font-medium text-xl my-5">Total {total}</div>
      ) : null}
      {step != "fill1" && step != "fill2" ? (
        <Button className="w-28" onClick={goToNextStep}>
          Next
        </Button>
      ) : null}
    </div>
  );
};

export default Palace;
