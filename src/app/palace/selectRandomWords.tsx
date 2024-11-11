import { wordsArray } from "./DATA";

export const selectRandomWords = () => {
  const shuffledWords = [...wordsArray].sort(() => 0.5 - Math.random());
  return shuffledWords.slice(0, 9);
};
