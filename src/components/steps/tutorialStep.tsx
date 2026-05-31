import { ChevronRight } from "lucide-react";

import { MemoryPalaceDemo } from "@/components/memory-palace-demo";
import { Button } from "@/components/ui/button";
import { Container } from "../Container";

export function TutorialStep({
  onContinueClick,
}: {
  isNew: boolean;
  onContinueClick: () => void;
}) {
  return (
    <Container>
      <MemoryPalaceDemo className="mx-auto" />

      <div className="mt-8 flex justify-center">
        <Button size="lg" className="gap-2" onClick={onContinueClick}>
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Container>
  );
}
