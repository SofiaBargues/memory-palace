import { Input } from "@/components/ui/input";

function MyControlledInput({
  index,
  value,
  onChange,
}: {
  className: string;
  index: number;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}) {
  const handleChange = (event: { target: { value: string | undefined } }) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <>
      <Input
        value={value}
        onChange={handleChange}
        type="text"
        id="myInput"
        className="flex-1 placeholder:text-gray-300 "
        placeholder={value}
        name={"input_" + index.toString()}
        maxLength={25} // Máximo 10 caracteres
        minLength={3} // Mínimo 3 caracteres
        required // Campo obligatorio
      />
    </>
  );
}

export function WordsInput({
  handleSubmit,
  words,
  onFieldChange,
}: {
  words: string[] | undefined[];
  step: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onFieldChange?: (fieldNum: number, value: string | undefined) => void;
}) {
  return (
    <>
      <form
        id="submit"
        onSubmit={handleSubmit}
        className="space-y-4 flex w-full flex-col"
      >
        {words.map((x, index) => (
          <div key={index} className="flex items-center space-x-2 ">
            <span className="text-gray-500 w-6 ">{index + 1}.</span>
            <MyControlledInput
              index={index}
              className="flex-1 text-black font-semibold // flex h-9 w-full rounded-md bg-secondary px-3 items-center text-sm shadow-md "
              value={x}
              onChange={(value) => {
                if (!onFieldChange) {
                  return;
                }
                onFieldChange(index, value);
              }}
              
            />
          </div>
        ))}
      </form>
    </>
  );
}
