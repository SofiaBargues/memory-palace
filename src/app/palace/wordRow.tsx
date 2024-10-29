import { Card } from "./card";

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
    <li className="flex gap-3 items-center  ">
      <p className="w-3">{index + 1}</p>
      {inputWord != undefined ? (
        <Card className={isCorrect ? " border-green-400 " : " border-red-400"}>
          <p>{inputWord}</p>
        </Card>
      ) : (
        <></>
      )}
      <Card
        className={
          isCorrect ? "text-gray-400 " : " border border-gray-600 text-gray-600"
        }
      >
        <p>{originalWord}</p>
      </Card>
    </li>
  );
}
