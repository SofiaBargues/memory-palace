import { useState } from "react";
import { StoryPart } from "./placePort";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Palace } from "../api/v1/generate/route";

export function PalaceStory({ palace }: { palace: Palace }) {
  const [part, setPart] = useState<number>(1);
  console.log(part);
  const handleNextPart = () => {
    setPart((prevPart) => ((prevPart % 3) + 1) as 1 | 2 | 3);
  };
  console.log(palace);
  return (
    <ScrollArea className=" whitespace-nowrap rounded-md border ">
      <div
        className="flex w-max 
      space-x-4 p-4"
      >
        <figure className="shrink-0">
          <div className="overflow-hidden rounded-md ">
            <StoryPart
              narrative={palace.sentences.slice(0, 3).join(" ")}
              image={palace.images[0]}
            />
          </div>
        </figure>
        <figure className="shrink-0">
          <div className="overflow-hidden rounded-md">
            <StoryPart
              narrative={palace.sentences.slice(3, 7).join(" ")}
              image={palace.images[1]}
            />
          </div>
        </figure>
        <figure className="shrink-0">
          <div className="overflow-hidden rounded-md">
            <StoryPart
              narrative={palace.sentences.slice(7).join(" ")}
              image={palace.images[2]}
            />
          </div>
        </figure>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
