import { Card } from "@/components/ui/card";
import { WordRow } from "./wordRow";

export function WordsList({
  inputWords,
  originalWords,
  results,
}: {
  inputWords: string[];
  originalWords: string[];
  results: boolean[];
}) {
  return (
    <Card className="p-6 flex flex-col w-96 gap-3">
      {originalWords.map((x, index) => (
        <WordRow
          key={index}
          index={index}
          isCorrect={results[index]}
          originalWord={x}
          inputWord={inputWords[index]}
        />
      ))}
      <div className="font-medium text-xl my-1">Total {results.filter((x) => x === true).length}</div>
    </Card>
  );
}
