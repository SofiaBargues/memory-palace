import { useState } from "react";
import { StoryPart } from "./placePort";
import { Palace } from "../api/v1/generate/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function PalaceStory({ palace }: { palace: Palace }) {
  const [part] = useState<number>(1);
  console.log(part);
  // const handleNextPart = () => {
  //   setPart((prevPart) => ((prevPart % 3) + 1) as 1 | 2 | 3);
  // };
  console.log(palace);
  return (
    <Carousel className=" whitespace-nowrap rounded-md w-auto mx-11">
      <CarouselPrevious />
      <CarouselNext />
      <CarouselContent>
        <CarouselItem key="1">
          <StoryPart
            narrative={palace.sentences.slice(0, 3).join(" ")}
            image={palace.images[0]}
          />
        </CarouselItem>
        <CarouselItem key="2">
          <CardContent className="overflow-hidden rounded-md">
            <StoryPart
              narrative={palace.sentences.slice(3, 6).join(" ")}
              image={palace.images[1]}
            />
          </CardContent>
        </CarouselItem>{" "}
        <CarouselItem key="3">
          <div className="p-1">
            <CardContent className="overflow-hidden rounded-md">
              <StoryPart
                narrative={palace.sentences.slice(6, 9).join(" ")}
                image={palace.images[2]}
              />
            </CardContent>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
