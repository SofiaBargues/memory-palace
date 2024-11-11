import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function MyControlledInput({
  index,
  initialValue,
}: {
  index: number;
  initialValue: string | undefined;
}) {
  const [value, setValue] = useState(initialValue);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <Input
        value={value}
        onChange={onChange}
        type="text"
        id="myInput"
        className="flex-1 placeholder:text-gray-300 "
        placeholder={value}
        name={"input_" + index.toString()}
      />
    </>
  );
}

export function WordsInput({
  handleSubmit,
  initialWords,
}: {
  initialWords: string[] | undefined[];
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
            <MyControlledInput index={index} initialValue={x} />
          </div>
        ))}
      </form>
      <Button className="w-full" form="submit" type="submit">
        Submit
      </Button>
    </>
  );
}
