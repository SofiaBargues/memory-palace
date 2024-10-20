"use client";
import React, { use, useState } from "react";
import { Story } from "../api/v1/generate/route";
import { map } from "zod";
import { Console } from "console";
import { start } from "repl";
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
const storyData = Story.parse(generateData.story);
const imagesData = ["/part1.png", "/part2.png", "/part3.png"];

function StoryPart({ narrative, image }: { narrative: string; image: string }) {
  return (
    <p>
      <img className="w-56" src={image} alt={image} />
      {narrative}
    </p>
  );
}
function PalaceStory() {
  const arrNarrative = storyData.sentences;

  return (
    <>
      <h1 className="text-6xl">Palace</h1>

      <div className="flex gap-3">
        <StoryPart
          narrative={arrNarrative.slice(0, 3).join(" ")}
          image={imagesData[0]}
        />
        <StoryPart
          narrative={arrNarrative.slice(3, 7).join(" ")}
          image={imagesData[1]}
        />
        <StoryPart
          narrative={arrNarrative.slice(7).join(" ")}
          image={imagesData[2]}
        />
      </div>
    </>
  );
}

function WordsList({
  inputWords,
  originalWords,
  results,
}: {
  inputWords: string[];
  originalWords: string[];
  results: boolean[];
}) {
  return (
    <ul>
      <h1 className="text-6xl">Remember</h1>
      {originalWords.map((x, index) => (
        <div key={index} className="flex  border-2 ">
          <WordRow
            index={index}
            isCorrect={results[index]}
            originalWord={x}
            inputWord={inputWords[index]}
          />
        </div>
      ))}
    </ul>
  );
}

function WordRow({
  index,
  isCorrect,
  originalWord,
  inputWord,
}: {
  inputWord: string;
  index: number;
  isCorrect: boolean;
  originalWord: string;
}) {
  return (
    <li className="flex gap-4 ">
      <p>{index}</p>
      <p>{originalWord}</p>
      <p>{inputWord}</p>
      <div>{isCorrect?.toString()}</div>
    </li>
  );
}

function WordsInput({
  handleSubmit,
}: {
  step: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-28">
      <h1 className="text-6xl ">Fill</h1>
      {initialWords.map((x, index) => (
        <input
          key={index}
          type="text"
          id="myInput"
          className="border"
          placeholder={"Word " + (index + 1)}
          name={"input_" + index.toString()}
        />
      ))}
      <button className="border bg-green-400 p-4" type="submit">
        Submit
      </button>
    </form>
  );
}

const Palace = () => {
  const [formValues, setFormValues] = useState<string[]>([]);
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
    setFormValues(newArr);

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
      setStep("start");
    }
  }
  console.log(step);
  return (
    <>
      {step === "palace" && <PalaceStory />}
      {(step === "fill1" || step === "results1") && (
        <WordsInput handleSubmit={handleSubmit} step={step} />
      )}
      {(step === "fill2" || step === "results2") && (
        <WordsInput handleSubmit={handleSubmit} step={step} />
      )}

      {step === "start" && (
        <WordsList
          originalWords={initialWords}
          results={results}
          inputWords={new Array(9)}
        />
      )}
      {step === "results1" && (
        <WordsList
          inputWords={new Array(9)}
          originalWords={initialWords}
          results={results}
        />
      )}
      {step === "results2" && (
        <WordsList
          inputWords={new Array(9)}
          originalWords={initialWords}
          results={results}
        />
      )}

      {step === "results2" || step === "results1" ? (
        <div className="font-bold">Total: {total}</div>
      ) : null}
      {step != "fill1" && step != "fill2" ? (
        <button className="border bg-green-400 p-4" onClick={goToNextStep}>
          next
        </button>
      ) : null}
    </>
  );
};

export default Palace;
