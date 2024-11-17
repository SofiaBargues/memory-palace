import { useState } from "react";
import { StoryPart } from "./placePort";
import { Palace } from "../api/v1/generate/types";
import { type CarouselApi, CardContent } from "@/components/ui/card";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function PalaceStory({
  palace,
  onSlideSelected,
}: {
  onSlideSelected: (slideNumber: number) => void;
  palace: Palace;
}) {
  const [part] = useState<number>(1);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    onSlideSelected(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
      onSlideSelected(api.selectedScrollSnap() + 1);
    });
  }, [api, onSlideSelected]);

  console.log(part);
  console.log(palace);
  return (
    <div>
      <Carousel
        setApi={setApi}
        className=" whitespace-nowrap md:rounded-md md:w-full rounded-none"
      >
        <CarouselPrevious />
        <CarouselNext />
        <CarouselContent className="">
          <CarouselItem key="1">
            <StoryPart
              narrative={palace.sentences.slice(0, 3).join(" ")}
              image={palace.images[0]}
            />
          </CarouselItem>
          <CarouselItem key="2">
            <StoryPart
              narrative={palace.sentences.slice(3, 6).join(" ")}
              image={palace.images[1]}
            />
          </CarouselItem>
          <CarouselItem key="3">
            <div className="p-1">
              <StoryPart
                narrative={palace.sentences.slice(6, 9).join(" ")}
                image={palace.images[2]}
              />
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
}
