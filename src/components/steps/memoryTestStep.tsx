"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, X, Brain, Trophy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Container } from "../Container";

type Step = "testIntro" | "testFill" | "testResult";

function areWordsEqual(word1: string, word2: string) {
  return word1.trim().toLowerCase() === word2.trim().toLowerCase();
}

export default function MemoryTestStep({
  wordsToRemember,
  onBackToStoryClick,
}: {
  wordsToRemember: string[];
  onBackToStoryClick: () => void;
}) {
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array(wordsToRemember.length).fill("")
  );
  const [step, setStep] = useState<Step>("testIntro");
  const [timeElapsed, setTimeElapsed] = useState(0);

  const handleInputChange = (index: number, value: string) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[index] = value;
    setUserAnswers(newUserAnswers);
  };

  const score = userAnswers.filter((answer, index) =>
    areWordsEqual(answer, wordsToRemember[index])
  ).length;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (step === "testFill") {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step]);

  const handleStartTest = () => {
    setStep("testFill");
  };
  const handleVerify = () => {
    console.log("Verifying words:", userAnswers);
    setStep("testResult");
  };
  const handleBackToIntro = () => {
    setStep("testIntro");
    setTimeElapsed(0);
    setUserAnswers(Array(wordsToRemember.length).fill(""));
  };
  const getScoreMessage = () => {
    const percentage = (score / wordsToRemember.length) * 100;
    if (percentage >= 90) return "Excellent! You have an extraordinary memory.";
    if (percentage >= 70) return "Very good! Your memory is quite strong.";
    if (percentage >= 50)
      return "Good attempt. With more practice, you'll improve.";
    return "Keep practicing. The method of loci takes time and practice.";
  };

  if (step === "testIntro") {
    return (
      <Container>
        <Button
          onClick={onBackToStoryClick}
          variant="ghost"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to the story
        </Button>

        <Card className="text-center ">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Memory Test</CardTitle>
            {/* <CardDescription>
              Vamos a poner a prueba tu capacidad para recordar las 9 palabras
              de la historia
            </CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <p className="text-balance">
              Remember to mentally walk through your memory palace to find the
              words you placed in each location.
            </p>
            <p className="text-sm text-muted-foreground">
              You will be asked to write down each of the 9 words that appeared
              in the story.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button size="lg" onClick={handleStartTest}>
              Start Test
            </Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  if (step === "testResult") {
    return (
      <Container>
        <Card>
          <CardHeader className="text-center p-2 md:p-6">
            <div className="w-10 h-10 md:w-16 md:h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center md:mb-4">
              <Trophy className="h-4 w-4  md:h-8 md:w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl ">Test Results</CardTitle>
            <CardDescription>
              You have completed the memory test
            </CardDescription>
          </CardHeader>
          <CardContent className="md:space-y-6  p-2 md:p-6  space-y-2">
            <div className="text-center">
              <p className="md:text-4xl text-2xl font-bold">
                {score} / {wordsToRemember.length}
              </p>
              <p className="text-muted-foreground">Correct words</p>
            </div>

            <Progress
              value={(score / wordsToRemember.length) * 100}
              className="h-3 "
            />

            <p className="text-center font-medium text-sm sm:text-lg">
              {getScoreMessage()}
            </p>

            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 gap-px bg-muted">
                <div className="bg-card md:p-4 text-center">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {Math.floor(timeElapsed / 60)}:
                    {timeElapsed % 60 < 10
                      ? `0${timeElapsed % 60}`
                      : timeElapsed % 60}
                  </p>
                </div>
                <div className="bg-card md:p-4 text-center">
                  <p className="text-sm text-muted-foreground">Precision</p>
                  <p className="font-medium">
                    {Math.round((score / wordsToRemember.length) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Answers:</h3>
              <div className="space-y-2">
                {wordsToRemember.map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 text-sm md:text-lg rounded-md bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      {areWordsEqual(userAnswers[index], word) ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                      <span>
                        Word {index + 1}: <strong>{word}</strong>
                      </span>
                    </div>
                    <div className="text-sm">
                      {userAnswers[index] ? (
                        areWordsEqual(userAnswers[index], word) ? (
                          <span className="text-green-500">Correct</span>
                        ) : (
                          <span className="text-red-500">
                            Your answer: {userAnswers[index]}
                          </span>
                        )
                      ) : (
                        <span className="text-muted-foreground">No reply</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <Link href="/palaces">
              <Button variant="outline">All palaces</Button>
            </Link>
            <Button onClick={onBackToStoryClick}>Play again</Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="w-full max-w-md m-auto shadow-lg">
        <CardHeader className="space-y-1 pb-2 ">
          <div className="flex items-center flex-row justify-between">
            <CardTitle className="text-2xl font-bold flex justify-between">
              Test Your Memory
            </CardTitle>
            <div className="text-muted-foreground font-mono text-xl">
              Time: {Math.floor(timeElapsed / 60)}:
              {timeElapsed % 60 < 10
                ? `0${timeElapsed % 60}`
                : timeElapsed % 60}
            </div>
          </div>
          <CardDescription>
            Recall the words from your memory palace and type them in the
            correct order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium mb-4">
            Enter the words in the correct sequence:
          </p>

          <div className="space-y-3">
            {Array.from({ length: userAnswers.length }).map((_, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`word-${index + 1}`} className="text-right">
                  Word {index + 1}
                </Label>
                <Input
                  id={`word-${index + 1}`}
                  className="col-span-3"
                  placeholder="Enter word..."
                  value={userAnswers[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" onClick={handleBackToIntro}>
            Back
          </Button>
          <Button onClick={handleVerify}>Verify Answers</Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
