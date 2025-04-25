import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle } from "lucide-react";
import { PalaceStep } from "./memoryGame";
export function WordRow({
  index,
  isCorrect,
  originalWord,
  step,
  inputWord,
}: {
  step: PalaceStep;
  inputWord: string | undefined;
  index: number;
  isCorrect: boolean;
  originalWord: string | undefined;
}) {
  const isSingleCol = inputWord === undefined;
  console.log(step);
  return (
    <div className="flex items-center space-x-2  ">
      <span className="text-gray-500 w-6">{index + 1}.</span>
      {!isSingleCol ? (
        <Input
          value={inputWord}
          className={`flex-1 ${
            isCorrect && originalWord != ""
              ? " border-green-400 "
              : " border-red-400"
          }`}
        ></Input>
      ) : (
        <></>
      )}
      <div
        className={
          "flex-1 text-black font-semibold // flex h-9 w-full rounded-md bg-secondary px-3 items-center text-sm shadow-md "
        }
      >
        {originalWord}
      </div>
      {!isSingleCol ? (
        <>
          {isCorrect && originalWord != "" ? (
            <CheckCircle2 className="text-green-500 w-6 h-6" />
          ) : (
            <XCircle className="text-red-500 w-6 h-6" />
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
