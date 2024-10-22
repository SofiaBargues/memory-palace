"use client";
import React, { use, useState } from "react";
import { Story } from "../api/v1/generate/route";
import { map } from "zod";
import { Console } from "console";
import { start } from "repl";
import { disconnect } from "process";
import { Result } from "postcss";
import { BlobLike } from "openai/uploads.mjs";
import { text } from "stream/consumers";
import { Button } from "./button";
import { Title } from "./title";
import { WordsInput } from "./wordsInput";
import { Card } from "./card";
import { WordRow } from "./wordRow";
import { WordsList } from "./wordList";
import { StoryPart } from "./placePort";
import { PalaceStory } from "./palaceStory";

const initialWords = [
  "Tree",
  "Computer",
  "Chair",
  "Phone",
  "House",
  "Scarf",
  "Book",
  "Watch",
  "Bag",
];
const generateDataResponse = `{
   "story": {
        "sentences": [
            "I took a morning walk to the big oak tree in the park, its leaves rustling in the gentle breeze.",
            "Right at the base of the tree, I found a small, forgotten computer with a screen flickering on and off.",
            "Next to it was an old, creaky chair, perfect for sitting as I tried to figure out the computer's secrets.",
            "My phone buzzed in my pocket, reminding me of the time as I got lost in thought.",
            "Feeling adventurous, I headed to a nearby house, its windows glowing warmly in the morning light.",
            "I noticed a colorful scarf waving from one of the windows, as if beckoning me inside.",
            "As I entered, I spotted a dusty book resting on the coffee table, full of stories from long ago.",
            "On the table next to the book was a shiny, golden watch, ticking steadily.",
            "I scooped up my bag, feeling the day's weight but also the joy of discovery the adventure had given me."
        ],
        "imagePrompts": [
            "A serene park with a large oak tree and a flickering computer at the base, accompanied by an old, creaky chair.",
            "A cozy house with glowing windows, a colorful scarf in the window and a vintage book on a coffee table inside.",
            "An arrangement of a shiny golden watch and a bag, symbolizing the conclusion of an adventurous day."
        ]
    },
    "images": [
        "https://oaidalleapiprodscus.blob.core.windows.net/private/org-XTBnmOzM1EDto3GC2mdnRzHK/user-ZxWc0pZk4yZd44RFsTL1d6IA/img-8zOWd45MPARIDy2k8E2fPt1G.png?st=2024-10-16T18%3A41%3A17Z&se=2024-10-16T20%3A41%3A17Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-16T19%3A14%3A18Z&ske=2024-10-17T19%3A14%3A18Z&sks=b&skv=2024-08-04&sig=yLyDi4bE5kzEVPt6H//uvjGQYeCiUjDkM%2B5qx4vZABg%3D",
        "https://oaidalleapiprodscus.blob.core.windows.net/private/org-XTBnmOzM1EDto3GC2mdnRzHK/user-ZxWc0pZk4yZd44RFsTL1d6IA/img-NYYmHWpYbweajutJpoW52IXA.png?st=2024-10-16T18%3A41%3A17Z&se=2024-10-16T20%3A41%3A17Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-16T19%3A24%3A21Z&ske=2024-10-17T19%3A24%3A21Z&sks=b&skv=2024-08-04&sig=m%2BJQRVH8gBZA2vI3hSxUZ4FCqQhPb2cWb4D22Q3efLo%3D",
        "https://oaidalleapiprodscus.blob.core.windows.net/private/org-XTBnmOzM1EDto3GC2mdnRzHK/user-ZxWc0pZk4yZd44RFsTL1d6IA/img-CcKymUbRhYBJRSwweVk1Mvcv.png?st=2024-10-16T18%3A41%3A18Z&se=2024-10-16T20%3A41%3A18Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-16T19%3A18%3A31Z&ske=2024-10-17T19%3A18%3A31Z&sks=b&skv=2024-08-04&sig=yqTtUNLipqki62G2T48tVL2eVOF2MpxV328EubuUfyM%3D"
    ]
}`;

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
    <div className="w-full container m-auto p-10 flex flex-col">
      {step === "palace" && (
        <PalaceStory storyData={storyData.sentences} imagesData={imagesData} />
      )}
      {step === "fill1" && (
        <WordsInput
          initialWords={initialWords}
          handleSubmit={handleSubmit}
          step={step}
        />
      )}
      {step === "fill2" && (
        <WordsInput
          initialWords={initialWords}
          handleSubmit={handleSubmit}
          step={step}
        />
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
        <WordsList
          inputWords={inputWords}
          originalWords={initialWords}
          results={results}
        />
      )}

      {step === "results2" || step === "results1" ? (
        <div className="font-medium text-xl my-5">Total {total}</div>
      ) : null}
      {step != "fill1" && step != "fill2" ? (
        <Button onClick={goToNextStep}>Next</Button>
      ) : null}
    </div>
  );
};

export default Palace;
