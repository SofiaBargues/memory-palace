import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WordRow } from "./wordRow";
import { Progress } from "@/components/ui/progress";
import { use, useEffect, useState } from "react";
import { Button } from "./button";
import { Description } from "./description";
import { Braces, CheckCircle2, XCircle } from "lucide-react";

export function WordsList({
  inputWords,
  originalWords,
  results,
}: {
  inputWords: string[];
  originalWords: string[];
  results: boolean[];
}) {
  const totalCorrect = results.filter((item) => item).length;
  const progressPercentage = (totalCorrect / results.length) * 100;

  return (
    <>
      {originalWords.map((x, index) => (
        <WordRow
          key={index}
          index={index}
          isCorrect={results[index]}
          originalWord={x}
          inputWord={inputWords[index]}
        />
      ))}
      <div className="font-medium text-xl my-1">
        Total Correct: {results.filter((x) => x === true).length}
      </div>

      <div className="w-full">
        <ProgressFromZero value={progressPercentage} className="w-full h-2" />
        <p className="text-center mt-2 text-sm text-gray-600">
          {progressPercentage.toFixed(0)}% Correct
        </p>
      </div>
    </>
  );
}

function ProgressFromZero({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [delayedValue, setDelayedValue] = useState(0);
  useEffect(() => {
    setDelayedValue(value);
  }, []);
  return <Progress value={delayedValue} className={className} />;
}
