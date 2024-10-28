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
      <Card className="p-6 flex flex-col  gap-3 w-72">
        <form
          id="submit"
          onSubmit={handleSubmit}
          className="flex flex-col w-28"
        >
          {initialWords.map((x, index) => (
            <div key={index} className="flex gap-3 items-center">
              <p>{index + 1}</p>
              <Input
                type="text"
                id="myInput"
                className="border-2 w-52 p-1 m-2 bg-white rounded-lg h-8 "
                placeholder={"Word"}
                name={"input_" + index.toString()}
              />
            </div>
          ))}
        </form>
      </Card>
      <Button className="w-28" form="submit" type="submit">
        Submit
      </Button>
    </>
  );
}
