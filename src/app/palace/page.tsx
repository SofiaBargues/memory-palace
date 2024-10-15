"use client";
import React, { use, useState } from "react";
import { Story } from "../api/v1/generate/route";
import { map } from "zod";
import { Console } from "console";
import { start } from "repl";
const initialWords = [
  "Casa",
  "Bufanda",
  "Árbol",
  "Teléfono",
  "Libro",
  "Silla",
  "Computadora",
  "Reloj",
  "Bolso",
];

const generateDataResponse = `{
  "part1": {
    "imageGeneratorPrompt": "A cozy house surrounded by tall trees, with a brightly colored scarf hanging from a branch, and a book lying on a chair in front of the house.",
    "narrative": "In a quaint little house nestled among towering trees, a vibrant scarf fluttered in the wind, hanging from a low branch, as the afternoon sun bathed everything in golden light. Nearby, an open book lay forgotten on a comfortable chair, the pages softly turning with each gentle breeze."
    },
    "part2": {
      "imageGeneratorPrompt": "A modern living room featuring a computer on a desk, a classic watch on a shelf, and a stylish bag resting on the floor.",
      "narrative": "Inside the house, the modern living room was the perfect blend of technology and comfort. A sleek computer gleamed on the desk, while a vintage watch ticked quietly on a shelf, its hands gracefully moving. In a corner, a stylish bag sat patiently on the floor, ready for an adventure."
    },
    "part3": {
      "imageGeneratorPrompt": "A person holding a phone, looking at the time on their watch, with the house and tree visible in the background.",
      "narrative": "Stepping outside, a person glanced at their phone, checking messages as they enjoyed the fresh air. The watch on their wrist gleamed in the sunlight, reminding them that time was fleeting. The peaceful house and tree stood proud in the background, a testament to a life well-lived."
      }
      }`;

const generateData = JSON.parse(generateDataResponse);
const storyData = Story.parse(generateData);
const imagesData = ["/Arbol.png", "/Lentes.png", "/Taza.png"];

function StoryPart({ narrative, image }: { narrative: string; image: string }) {
  return (
    <p>
      <img className="w-56" src={image} alt={image} />
      {narrative}
    </p>
  );
}
function PalaceStory() {
  const arrNarrative = Object.values(storyData).map((part) => part.narrative);

  return (
    <>
      <div className="flex gap-3">
        <StoryPart narrative={arrNarrative[0]} image={imagesData[0]} />
        <StoryPart narrative={arrNarrative[1]} image={imagesData[1]} />
        <StoryPart narrative={arrNarrative[2]} image={imagesData[2]} />
      </div>
    </>
  );
}

function WordsToRemember({
  words,
  results,
}: {
  words: string[];
  results: boolean[];
}) {
  return (
    <ul>
      {words.map((x, index) => (
        <div key={index} className="flex">
          <li className="flex gap-4 ">
            <p>{x}</p>
            <div>{results[index]?.toString()}</div>
          </li>
        </div>
      ))}
    </ul>
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
      <button type="submit">Submit</button>
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
  };

  function handleClick() {
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
      {step === "fill1" && (
        <WordsInput handleSubmit={handleSubmit} step={step} />
      )}
      {step === "fill2" && (
        <WordsInput handleSubmit={handleSubmit} step={step} />
      )}
      <div className="text-xl">Remember</div>

      {step === "start" && (
        <WordsToRemember words={initialWords} results={results} />
      )}
      {step === "results1" && (
        <WordsToRemember words={initialWords} results={results} />
      )}
      {step === "results2" && (
        <WordsToRemember words={initialWords} results={results} />
      )}

      <button className="border" onClick={handleClick}>
        next
      </button>
      <div className="font-bold">Total: {total}</div>
    </>
  );
};

export default Palace;
