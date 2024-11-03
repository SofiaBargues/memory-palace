import { useState } from "react";
import { StoryPart } from "./placePort";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Palace } from "../api/v1/generate/route";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function PalaceStory({ palace }: { palace: Palace }) {
  const [part, setPart] = useState<number>(1);
  console.log(part);
  const handleNextPart = () => {
    setPart((prevPart) => ((prevPart % 3) + 1) as 1 | 2 | 3);
  };
  console.log(palace);
  return (
    <Carousel className=" whitespace-nowrap rounded-md border-none w-[430px]">
      <CarouselPrevious />
      <CarouselNext />
      <CarouselContent>
        <CarouselItem key="1">
          <Card className="shrink-0">
            <CardContent className="overflow-hidden rounded-md ">
              <StoryPart
                narrative={palace.sentences.slice(0, 3).join(" ")}
                image={palace.images[0]}
              />
            </CardContent>
          </Card>
        </CarouselItem>
        <CarouselItem key="2">
          <Card className="shrink-0">
            <CardContent className="overflow-hidden rounded-md">
              <StoryPart
                narrative={palace.sentences.slice(3, 6).join(" ")}
                image={palace.images[1]}
              />
            </CardContent>
          </Card>
        </CarouselItem>{" "}
        <CarouselItem key="3">
          <div className="p-1">
            <Card className="shrink-0">
              <CardContent className="overflow-hidden rounded-md">
                <StoryPart
                  narrative={palace.sentences.slice(6, 9).join(" ")}
                  image={palace.images[2]}
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
