import { ChevronRight } from "lucide-react";

import { MemoryPalaceDemo } from "@/components/memory-palace-demo";
import { Button } from "@/components/ui/button";
import { Container } from "../Container";

export function TutorialStep({
  isNew,
  onContinueClick,
}: {
  isNew: boolean;
  onContinueClick: () => void;
}) {
  return (
    <Container>
      <MemoryPalaceDemo
        className="mx-auto"
        showChooseWordsStep={isNew}
        onSkipDemo={onContinueClick}
        footer={
          <Button
            size="lg"
            className="h-11 w-full gap-2 text-white shadow-md"
            onClick={onContinueClick}
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        }
      />
    </Container>
  );
}
