import React from "react";
import { Palace } from "../../app/api/v1/generate/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Container } from "../Container";

export function StoryStep({
  palace,
  setSlideSelected,
  slideSelected,
  onFinishClick,
}: {
  palace: Palace;
  setSlideSelected: (slide: number) => void;
  slideSelected: number;
  onFinishClick: () => void;
}) {
  return (
    <>
      {/* <div className="space-y-8 container mx-auto max-w-4xl">
       */}
      <Container>
        <div className="">
          <h1 className="text-3xl font-bold tracking-tight">{palace.title}</h1>
          <p className="text-muted-foreground mt-2">
            Read carefully and visualize the story. Try to associate each
            keyword with a location in your memory palace.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="relative  aspect-square overflow-hidden rounded-lg max-w-72 m-auto">
              <Image
                src={palace.images[slideSelected] || "/placeholder.svg"}
                alt="History viewed"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <p
                className="text-lg leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: palace.sentences
                    .slice(slideSelected * 3, slideSelected * 3 + 3)
                    .join(" "),
                }}
              />
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Key words to remember:</h3>
              <div className="flex flex-wrap gap-2">
                {palace.words
                  .slice(slideSelected * 3, slideSelected * 3 + 3)
                  .map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setSlideSelected(slideSelected - 1)}
            disabled={slideSelected === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {slideSelected + 1} of {palace.images.length}
            </span>
          </div>
          <Button
            onClick={() => {
              if (slideSelected === palace.images.length - 1) {
                onFinishClick();
              } else {
                setSlideSelected(slideSelected + 1);
              }
            }}
          >
            {slideSelected < palace.images.length - 1 ? (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Complete reading <BookOpen className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Container>
      {/* </div> */}
    </>
  );
}
