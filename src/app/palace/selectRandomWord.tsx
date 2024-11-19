import { wordsArray } from "./DATA";

export const selectRandomWord = () => {
  const length = wordsArray.length;
  return wordsArray[Math.floor(Math.random() * length)];

};
