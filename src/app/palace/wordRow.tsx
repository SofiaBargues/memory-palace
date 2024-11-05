import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle } from "lucide-react";
export function WordRow({
  index,
  isCorrect,
  originalWord,
  inputWord,
}: {
  inputWord: string;
  index: number;
  isCorrect: boolean;
  originalWord: string;
}) {
  return (
    <div className="flex items-center space-x-2 ">
      <span className="text-gray-500 w-6">{index + 1}.</span>
      {inputWord != undefined ? (
        <Input
          value={inputWord}
          className={`flex-1 ${
            isCorrect ? " border-green-400 " : " border-red-400"
          }`}
        ></Input>
      ) : (
        <></>
      )}
      <Input value={originalWord} className={"flex-1 text-gray-400 "}></Input>
      {isCorrect ? (
        <CheckCircle2 className="text-green-500 w-6 h-6" />
      ) : (
        <XCircle className="text-red-500 w-6 h-6" />
      )}
    </div>
  );
}
