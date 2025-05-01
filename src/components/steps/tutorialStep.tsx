import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Container } from "../Container";

const data = [
  [
    "Create a palace",
    "We will provide you with a virtual memory palace to use.",
  ],
  ["Choose words", "Select or use our predefined words to memorize."],
  [
    "Read the story",
    "Read a story that connects the words with locations in your palace.",
  ],
  ["Test your memory", "Try to recall all the words in the correct order."],
];
export function TutorialStep({
  isNew,
  onContinueClick,
}: {
  isNew: boolean;
  onContinueClick: () => void;
}) {
  const displayData = isNew ? data : data.slice(2);
  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">The Loci Method</h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2"> How does it work?</h2>
              <p className="text-muted-foreground">
                The Loci method consists of associating information you want to
                remember with specific places in a familiar space.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/memoryPalace.png"
                width={300}
                height={200}
                alt="Ilustración del método Loci"
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">How to use:</h2>
          <ol className="space-y-4">
            {displayData.map((item, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item[0]}</h3>
                  <p className="text-sm text-muted-foreground">{item[1]}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" className="gap-2" onClick={onContinueClick}>
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Container>
  );
}
