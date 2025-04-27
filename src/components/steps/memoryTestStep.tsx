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
    if (percentage >= 90)
      return "¡Excelente! Tienes una memoria extraordinaria.";
    if (percentage >= 70) return "¡Muy bien! Tu memoria es bastante buena.";
    if (percentage >= 50) return "Buen intento. Con más práctica mejorarás.";
    return "Sigue practicando. El método de loci requiere tiempo y práctica.";
  };

  if (step === "testIntro") {
    return (
      <div className="container max-w-4xl py-12">
        <Button
          onClick={onBackToStoryClick}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a la historia
        </Button>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Prueba de memoria</CardTitle>
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
              Recuerda recorrer mentalmente tu palacio de memoria para encontrar
              las palabras que ubicaste en cada lugar.
            </p>
            <p className="text-sm text-muted-foreground">
              Se te pedirá que escribas cada una de las 9 palabras que
              aparecieron en la historia.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button size="lg" onClick={handleStartTest}>
              Comenzar prueba
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (step === "testResult") {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Resultados de la prueba</CardTitle>
            <CardDescription>
              Has completado la prueba de memoria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold">
                {score} / {wordsToRemember.length}
              </p>
              <p className="text-muted-foreground">palabras correctas</p>
            </div>

            <Progress
              value={(score / wordsToRemember.length) * 100}
              className="h-3"
            />

            <p className="text-center font-medium">{getScoreMessage()}</p>

            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 gap-px bg-muted">
                <div className="bg-card p-4 text-center">
                  <p className="text-sm text-muted-foreground">Tiempo</p>
                  <p className="font-medium">
                    {Math.floor(timeElapsed / 60)}:
                    {timeElapsed % 60 < 10
                      ? `0${timeElapsed % 60}`
                      : timeElapsed % 60}
                  </p>
                </div>
                <div className="bg-card p-4 text-center">
                  <p className="text-sm text-muted-foreground">Precisión</p>
                  <p className="font-medium">
                    {Math.round((score / wordsToRemember.length) * 100)}%
                  </p>
                </div>
                <div className="bg-card p-4 text-center">
                  <p className="text-sm text-muted-foreground">Nivel</p>
                  <p className="font-medium">
                    {score >= 8
                      ? "Experto"
                      : score >= 6
                      ? "Avanzado"
                      : score >= 4
                      ? "Intermedio"
                      : "Principiante"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Detalle de respuestas:</h3>
              <div className="space-y-2">
                {wordsToRemember.map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      {areWordsEqual(userAnswers[index], word) ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                      <span>
                        Palabra {index + 1}: <strong>{word}</strong>
                      </span>
                    </div>
                    <div className="text-sm">
                      {userAnswers[index] ? (
                        areWordsEqual(userAnswers[index], word) ? (
                          <span className="text-green-500">Correcto</span>
                        ) : (
                          <span className="text-red-500">
                            Tu respuesta: {userAnswers[index]}
                          </span>
                        )
                      ) : (
                        <span className="text-muted-foreground">
                          Sin respuesta
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Link href="/palaces">
              <Button variant="outline">All palaces</Button>
            </Link>
            <Button onClick={onBackToStoryClick}>Play again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <Card className="w-full max-w-md m-auto shadow-lg ">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold">Test Your Memory</CardTitle>
          <CardDescription>
            Recall the words from your memory palace and type them in the
            correct order
          </CardDescription>
          <div className="text-sm text-muted-foreground">
            Time: {Math.floor(timeElapsed / 60)}:
            {timeElapsed % 60 < 10 ? `0${timeElapsed % 60}` : timeElapsed % 60}
          </div>
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
    </div>
  );
}
