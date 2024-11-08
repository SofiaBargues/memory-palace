import { Button } from "@/components/ui/button";
import { Title } from "./title";
import { Input } from "@/components/ui/input";

import { Card } from "@/components/ui/card";

export function WordsInput({
  handleSubmit,
  initialWords,
}: {
  initialWords: string[];
  step: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <form
        id="submit"
        onSubmit={handleSubmit}
        className="space-y-4 flex w-full flex-col"
      >
        {initialWords.map((x, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-gray-500 w-6">{index + 1}.</span>
            <Input
              type="text"
              id="myInput"
              className="flex-1 text-gray-400 "
              placeholder={"Word"}
              name={"input_" + index.toString()}
            />
          </div>
        ))}
      </form>
      <Button className="w-full" form="submit" type="submit">
        Submit
      </Button>
    </>
  );
}
