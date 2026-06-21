export function validateWords(input: unknown): string[] {
  if (!Array.isArray(input)) {
    throw new Error("words must be an array");
  }

  const words = input.map((word) =>
    typeof word === "string" ? word.trim() : ""
  );

  if (words.length !== 9) {
    throw new Error("Exactly 9 words are required");
  }

  if (words.some((word) => word.length === 0)) {
    throw new Error("Words cannot be empty");
  }

  const normalizedWords = words.map((word) => word.toLowerCase());
  const uniqueWords = new Set(normalizedWords);

  if (uniqueWords.size !== words.length) {
    throw new Error("Words must be unique");
  }

  return words;
}
