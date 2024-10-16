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
        "part1": {
            "imageGeneratorPrompt": "A sunny day in a park with a giant tree, a shiny computer on a picnic table, and a cozy chair sitting nearby with a playful puppy chewing it.",
            "narrative": "Once upon a time, I was walking through a sunny park. I saw a huge tree with vibrant green leaves where I decided to sit down. Next to it was a shiny computer on a picnic table, and I thought about all the things I could learn. Nearby, a cozy chair was just waiting for someone to relax in."
        },
        "part2": {
            "imageGeneratorPrompt": "A bright living room inside a house, with a colorful phone on a table, a lovely house with flowers in the garden, and a cozy scarf hanging on a chair.",
            "narrative": "After enjoying the park, I headed to my house. Inside, the living room was bright and warm. On the table, there was a colorful phone that rang loudly, reminding me to stay connected. I noticed my favorite scarf hanging over the back of a chair, ready for the chilly evening."
        },
        "part3": {
            "imageGeneratorPrompt": "A peaceful bedside scene featuring an opened book, a beautiful watch resting on a nightstand, and a stylish bag ready to go on a journey.",
            "narrative": "Later that evening, I settled down in my bedroom. I grabbed an interesting book from the shelf and opened it to read a few pages. Next to it, my beautiful watch ticked softly, reminding me that it was getting late. I also saw my stylish bag by the door, ready for the next adventure."
        }
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
  const arrNarrative = Object.values(storyData).map((part) => part.narrative);

  return (
    <>
      <h1 className="text-6xl">Palace</h1>

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
      <h1 className="text-6xl">Remember</h1>
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
      <h1 className="text-6xl">Fill</h1>
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
        <WordsToRemember words={initialWords} results={results} />
      )}
      {step === "results1" && (
        <WordsToRemember words={initialWords} results={results} />
      )}
      {step === "results2" && (
        <WordsToRemember words={initialWords} results={results} />
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
