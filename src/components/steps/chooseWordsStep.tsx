"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { PREDEFINED_LISTS } from "./DATA";

// Random words for each category
const getRandomWord = (
  category: "animals" | "fruits" | "objects",
  exclude: string[] = []
) => {
  const list = [...PREDEFINED_LISTS[category]];
  const availableWords = list.filter((word) => !exclude.includes(word));

  if (availableWords.length === 0) return ""; // All words are used

  const randomIndex = Math.floor(Math.random() * availableWords.length);
  return availableWords[randomIndex];
};

export function ChooseWordsStep({
  words,
  setWords,
  onGeneratePalaceClick,
}: {
  onGeneratePalaceClick: () => void;
  words: string[];
  setWords: (words: string[]) => void;
}) {
  // const [wordsOld, setWords] = useState<string[]>(Array(9).fill(""));
  const [step, setStep] = useState<"categories" | "words">("categories");
  const [selectedCategory, setSelectedCategory] = useState<
    "animals" | "fruits" | "objects" | "custom"
  >("custom");
  const [formErrorMessage, setFormErrorMessage] = useState<null | string>(null);

  // Fill words with a category
  const selectCategory = (
    category: "animals" | "fruits" | "objects" | "custom"
  ) => {
    setSelectedCategory(category);

    if (category !== "custom") {
      const newWords = Array(9)
        .fill("")
        .map((_, index) => {
          const usedWords = words.slice(0, index);
          return getRandomWord(category, usedWords);
        });
      setWords(newWords);
    } else {
      setWords(Array(9).fill(""));
    }

    setStep("words");
  };

  // Refresh a single word
  const refreshWord = (index: number) => {
    if (selectedCategory === "custom") {
      // If custom, use a random category
      const categories: ("animals" | "fruits" | "objects")[] = [
        "animals",
        "fruits",
        "objects",
      ];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      const newWords = [...words];
      newWords[index] = getRandomWord(
        randomCategory,
        words.filter((_, i) => i !== index)
      );
      setWords(newWords);
    } else {
      // Use the selected category
      const newWords = [...words];
      newWords[index] = getRandomWord(
        selectedCategory,
        words.filter((_, i) => i !== index)
      );
      setWords(newWords);
    }
  };

  // Handle word change
  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  // Go back to categories
  const goBackToCategories = () => {
    setStep("categories");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Memory Palace</h1>
        <p className="text-muted-foreground">
          Choose or customize 9 words to memorize using your memory palace
        </p>
      </div>

      {step === "categories" ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Select a word category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <CategoryCard
              title="Animals"
              description="Memorize a list of 9 different animals"
              onClick={() => selectCategory("animals")}
            />
            <CategoryCard
              title="Fruits"
              description="Memorize a list of 9 different fruits"
              onClick={() => selectCategory("fruits")}
            />
            <CategoryCard
              title="Objects"
              description="Memorize a list of 9 different objects"
              onClick={() => selectCategory("objects")}
            />
            <CategoryCard
              title="Custom"
              description="Create your own list of 9 words to memorize"
              onClick={() => selectCategory("custom")}
              isCustom
            />
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={goBackToCategories}
                className="mr-2"
                title="Volver a categorías"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>
                  {selectedCategory === "animals" && "Animals"}
                  {selectedCategory === "fruits" && "Fruits"}
                  {selectedCategory === "objects" && "Objects"}
                  {selectedCategory === "custom" && "Custom List"}
                </CardTitle>
                <CardDescription>
                  {selectedCategory === "custom"
                    ? "Enter your own words or generate random words"
                    : `List of words from the category ${
                        selectedCategory === "animals"
                          ? "Animals"
                          : selectedCategory === "fruits"
                          ? "Fruits"
                          : "Objects"
                      }`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {words.map((word, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-8 text-right font-medium text-muted-foreground">
                    {index + 1}.
                  </div>
                  <Input
                    value={word}
                    onChange={(e) => handleWordChange(index, e.target.value)}
                    placeholder="Enter a word"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => refreshWord(index)}
                    title="Generate random word"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formErrorMessage ? (
                <p className=" text-red-600">* {formErrorMessage}.</p>
              ) : (
                ""
              )}

              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setWords(Array(9).fill(""))}
                  variant="outline"
                  className="mr-2"
                >
                  Clean all
                </Button>
                {/* 
                // TODO: validate que no sean texto vacio antes de llamar a generate palace. Mostrar un error */}
                <Button
                  onClick={async () => {
                    if (hasEmptyWords(words)) {
                      setFormErrorMessage("No empty words");
                    } else if (hasDuplicated(words)) {
                      setFormErrorMessage("All words must be different");
                    } else {
                      setFormErrorMessage(null);
                      await onGeneratePalaceClick();
                    }
                  }}
                >
                  Generate Palace
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Category card component
function CategoryCard({
  title,
  description,
  onClick,
  isCustom = false,
}: {
  title: string;
  description: string;
  onClick: () => void;
  isCustom?: boolean;
}) {
  return (
    <Card
      className={`border-border hover:border-primary/50 transition-colors cursor-pointer ${
        isCustom ? "bg-secondary" : "bg-card"
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button variant="secondary" className="w-full">
          Select
        </Button>
      </CardContent>
    </Card>
  );
}

function hasDuplicated(listWords: string[]) {
  const set = new Set(listWords);
  return listWords.length !== set.size;
}

function hasEmptyWords(listWords: string[]) {
  for (const word of listWords) {
    if (word.trim() === "") return true;
  }
  return false;
}
