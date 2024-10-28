import { useState } from "react";
import { StoryPart } from "./placePort";
import { storyData } from "./page";
import { Title } from "./title";
import { imagesData } from "./page";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function PalaceStory({ imagesData }: { imagesData: string[] }) {
  const [part, setPart] = useState<number>(1);
  const arrNarrative = storyData.sentences;
  console.log(part);
  const handleNextPart = () => {
    setPart((prevPart) => ((prevPart % 3) + 1) as 1 | 2 | 3);
  };
  return (
    <ScrollArea className=" whitespace-nowrap rounded-md border ">
      <div
        className="flex w-max 
      space-x-4 p-4"
      >
        <figure className="shrink-0">
          <div className="overflow-hidden rounded-md ">
            <StoryPart
              narrative={arrNarrative.slice(0, 3).join(" ")}
              image={imagesData[0]}
            />
          </div>
        </figure>
        <figure className="shrink-0">
          <div className="overflow-hidden rounded-md">
            <StoryPart
              narrative={arrNarrative.slice(3, 7).join(" ")}
              image={imagesData[1]}
            />
          </div>
        </figure>
        <figure className="shrink-0">
          <div className="overflow-hidden rounded-md">
            <StoryPart
              narrative={arrNarrative.slice(7).join(" ")}
              image={imagesData[2]}
            />
          </div>
        </figure>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
