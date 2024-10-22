import { Button } from "@/components/ui/button";
import { Title } from "./title";
import { Input } from "@/components/ui/input";

export function WordsInput({
  handleSubmit,
  initialWords,
}: {
  initialWords: string[];
  step: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-28 ">
      {initialWords.map((x, index) => (
        <div key={index} className="flex gap-3">
          <p>{index + 1}</p>
          <Input
            type="text"
            id="myInput"
            className="border-2 w-52 p-1 m-1 bg-white rounded-lg h-8 "
            placeholder={"Word"}
            name={"input_" + index.toString()}
          />
        </div>
      ))}
      <Button type="submit">Submit</Button>
    </form>
  );
}
