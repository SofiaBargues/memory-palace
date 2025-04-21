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

  // TODO refactor testFill step
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");

  // TODO: Refactor to testIntro / testFill / testResult
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const [timeElapsed, setTimeElapsed] = useState(0);

  const score = userAnswers.filter(
    (answer, index) => answer === wordsToRemember[index].toLowerCase()
  ).length;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (testStarted && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testStarted, showResults]);

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleSubmitAnswer = () => {
    if (currentAnswer.trim()) {
      const newAnswers = [...userAnswers];
      newAnswers[currentStep] = currentAnswer.trim().toLowerCase();
      setUserAnswers(newAnswers);
      setCurrentAnswer("");

      if (currentStep < wordsToRemember.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  const handleSkip = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentStep] = "";
    setUserAnswers(newAnswers);

    if (currentStep < wordsToRemember.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / wordsToRemember.length) * 100;
    if (percentage >= 90)
      return "¡Excelente! Tienes una memoria extraordinaria.";
    if (percentage >= 70) return "¡Muy bien! Tu memoria es bastante buena.";
    if (percentage >= 50) return "Buen intento. Con más práctica mejorarás.";
    return "Sigue practicando. El método de loci requiere tiempo y práctica.";
  };

  if (!testStarted) {
    return (
      <div className="container max-w-4xl py-12">
        <Button
          onClick={onBackToStoryClick}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a la historia
        </Button>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Prueba de memoria</CardTitle>
            <CardDescription>
              Vamos a poner a prueba tu capacidad para recordar las 9 palabras
              de la historia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <p>
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

  if (showResults) {
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
                      {userAnswers[index].toLowerCase() ===
                      word.toLowerCase() ? (
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
                        userAnswers[index].toLowerCase() ===
                        word.toLowerCase() ? (
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
            <Link href="/">
              <Button variant="outline">Volver al inicio</Button>
            </Link>
            <Link href="/palace">
              <Button>Crear nuevo palacio</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Prueba de memoria
          </h1>
          <p className="text-muted-foreground mt-2">
            Recorre mentalmente tu palacio de memoria y escribe las palabras que
            recuerdes
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium">Progreso:</span>
            <span>
              {currentStep + 1} de {wordsToRemember.length}
            </span>
          </div>
          <Progress
            value={(currentStep / wordsToRemember.length) * 100}
            className="w-1/2 h-2"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Palabra {currentStep + 1}</CardTitle>
            <CardDescription>
              ¿Qué palabra estaba en la posición {currentStep + 1} de la
              historia?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe la palabra..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmitAnswer();
                    }
                  }}
                  autoFocus
                />
                <Button onClick={handleSubmitAnswer}>Enviar</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Intenta visualizar el lugar en tu palacio de memoria donde
                colocaste esta palabra.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={handleSkip}>
              No recuerdo / Saltar
            </Button>
            <div className="text-sm text-muted-foreground">
              {currentStep + 1} de {wordsToRemember.length}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
