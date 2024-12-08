"use client";
import { Palace } from "../api/v1/generate/types";
import { generateDataResponse } from "./DATA";

import { PalaceView } from "./palaceView";

const generateData = JSON.parse(generateDataResponse);
const storyData = Palace.parse(generateData);
const imagesData = ["/part1.png", "/part2.png", "/part3.png"];

function PalacePage() {
  const palace: Palace = {
    words: new Array(9).fill(undefined),
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
