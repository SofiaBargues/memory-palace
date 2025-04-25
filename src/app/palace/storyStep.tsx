import { Button } from "@/components/ui/button";
import React from "react";
import { PalaceStory } from "./palaceStory";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Palace } from "../api/v1/generate/types";

export function StoryStep({
  palace,
  setSlideSelected,
  slideSelected,
  goToNextStep,
}: {
  palace: Palace;
  setSlideSelected: (slide:number) => void;
  slideSelected: number;
  goToNextStep: () => void;
}) {
  return (
    <>
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold ">
          Read the story to remember
        </CardTitle>
        <CardDescription className="text-gray-600">
          Link each word in the story, making recall effortless and engaging.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PalaceStory
          palace={palace}
          onSlideSelected={(num) => {
            console.log(" changed", num);
            setSlideSelected(num);
          }}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <Button
          className="w-full"
          disabled={slideSelected < palace.images.length}
          onClick={goToNextStep}
        >
          Test Me
        </Button>
      </CardFooter>
    </>
  );
}
