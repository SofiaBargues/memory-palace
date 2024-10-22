import { useState } from "react";
import { StoryPart } from "./placePort";
import { storyData } from "./page";
import { Title } from "./title";
import { imagesData } from "./page";
import { Card } from "@/components/ui/card";

export function PalaceStory() {
  const [part, setPart] = useState<number>(1);
  const arrNarrative = storyData.sentences;
  console.log(part);
  const handleNextPart = () => {
    setPart((prevPart) => ((prevPart % 3) + 1) as 1 | 2 | 3);
  };
  return (
    <Card className="p-6 w-[600px] ">
      <div className="flex ">
        {part === 1 ? (
          <StoryPart
            narrative={arrNarrative.slice(0, 3).join(" ")}
            image={imagesData[0]}
          />
        ) : part === 2 ? (
          <StoryPart
            narrative={arrNarrative.slice(3, 7).join(" ")}
            image={imagesData[1]}
          />
        ) : part === 3 ? (
          <StoryPart
            narrative={arrNarrative.slice(7).join(" ")}
            image={imagesData[2]}
          />
        ) : null}
        <button className="text-7xl" onClick={handleNextPart}>
          ›
        </button>
      </div>
    </Card>
  );
}
