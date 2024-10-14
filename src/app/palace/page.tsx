"use client";
import React, { useState } from "react";
import { Story } from "../api/v1/generate/route";
const data = [
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
const imagesData = [
  "https://oaidalleapiprodscus.blob.core.windows.net/private/org-XTBnmOzM1EDto3GC2mdnRzHK/user-ZxWc0pZk4yZd44RFsTL1d6IA/img-pM3zIDengGWojMDxNQTKf3y9.png?st=2024-10-15T07%3A27%3A58Z&se=2024-10-15T09%3A27%3A58Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-15T00%3A13%3A08Z&ske=2024-10-16T00%3A13%3A08Z&sks=b&skv=2024-08-04&sig=86AvDX2X/1JLDmdjGgmh8prYZRIEKIMHjj5WMj4WOW0%3D",
  "https://oaidalleapiprodscus.blob.core.windows.net/private/org-XTBnmOzM1EDto3GC2mdnRzHK/user-ZxWc0pZk4yZd44RFsTL1d6IA/img-hB3C4Fo57mgicFOS3R5pN3Od.png?st=2024-10-15T07%3A28%3A46Z&se=2024-10-15T09%3A28%3A46Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-14T23%3A24%3A57Z&ske=2024-10-15T23%3A24%3A57Z&sks=b&skv=2024-08-04&sig=VmlCimJ4QrX0igXtO2V7NfOx6Dxrj3hfgMQE2rVgOgU%3D",
  "https://oaidalleapiprodscus.blob.core.windows.net/private/org-XTBnmOzM1EDto3GC2mdnRzHK/user-ZxWc0pZk4yZd44RFsTL1d6IA/img-3pVcyy5jlcW0910nS1LOG65E.png?st=2024-10-15T07%3A30%3A34Z&se=2024-10-15T09%3A30%3A34Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-15T01%3A37%3A22Z&ske=2024-10-16T01%3A37%3A22Z&sks=b&skv=2024-08-04&sig=2myMsS5rCTwbZ9Beln/eg2XKR0Dvfo2yOojCw1L7isc%3D",
];

const Palace = () => {
  const [formValues, setFormValues] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const total = results.filter((x) => x === true).length;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const newArr = [];
    e.preventDefault();
    for (let i = 0; i < data.length; i++) {
      newArr.push(e.target.elements["input_" + i].value);
    }
    setFormValues(newArr);

    const isCorrectArr = [];
    for (let i = 0; i < newArr.length; i++) {
      const palabra = newArr[i];
      if (palabra.toLowerCase() === data[i].toLowerCase()) {
        isCorrectArr.push(true);
      } else {
        isCorrectArr.push(false);
      }
    }
    setResults(isCorrectArr);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {data.map((x, index) => (
          <input
            key={index}
            type="text"
            id="myInput"
            className="border"
            placeholder={"Word " + (index + 1)}
            name={"input_" + index.toString()}
            value={formValues[index]}
          />
        ))}
        <button type="submit">Submit</button>
      </form>
      <div>Remember</div>
      <ul>
        {data.map((x, index) => (
          <div key={index} className="flex">
            <li className="flex gap-4 ">
              <p>{x}</p>
              <div>{results[index]?.toString()}</div>
            </li>
          </div>
        ))}
      </ul>
      <div className="font-bold">Total: {total}</div>
    </>
  );
};

export default Palace;
