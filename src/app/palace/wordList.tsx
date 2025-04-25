import { WordRow } from "./wordRow";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { PalaceStep } from "./memoryGame";

export function WordsList({
  inputWords,
  originalWords,
  results,
  step,
}: {
  step: PalaceStep;
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
          step={step}
          key={index}
          index={index}
          isCorrect={results[index]}
          originalWord={x}
          inputWord={inputWords[index]}
        />
      ))}
      {results.length > 0 ? (
        <>
          <div className="font-medium  font-semibold pt-9">
            Total: {results.filter((x) => x === true).length}
          </div>
          <div className="w-full flex flex-col ">
            <ProgressFromZero
              value={progressPercentage}
              className="w-full h-2"
            />
            <p className=" text-center mt-2 text-sm text-gray-600 ">
              {progressPercentage.toFixed(0)}% Correct
            </p>
          </div>
        </>
      ) : (
        <></>
      )}
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
