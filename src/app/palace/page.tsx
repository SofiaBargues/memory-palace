"use client";
import React, { useEffect, useState } from "react";
import { Palace } from "../api/v1/generate/types";
import { generateDataResponse } from "./DATA";
import { selectRandomWords } from "./selectRandomWords";

import { PalaceView } from "./palaceView";

const generateData = JSON.parse(generateDataResponse);
const storyData = Palace.parse(generateData);
const imagesData = ["/part1.png", "/part2.png", "/part3.png"];

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
    title: storyData.title,
    imagePrompts: storyData.imagePrompts,
    sentences: storyData.sentences,
  };
  return (
    <PalaceView
      initialPalace={palace}
      initialStep="start"
      initialPalaceId={undefined}
    />
  );
}

export default PalacePage;
