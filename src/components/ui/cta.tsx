import { Button } from "@/components/ui/button";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Brain, ArrowRight, Building, Image, PenTool } from "lucide-react";
const CallToAction = () => {
  return (
    <section className="mt-24 text-center">
      <Card className="p-12 bg-primary/5">
        <h2 className="text-3xl font-bold tracking-tighter mb-4">
          Ready to Enhance Your Memory?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start your journey with our guided memory palace experiences or create
          your own custom memory challenges.
        </p>
        <Button size="lg">
          Get Started Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Card>
    </section>
  );
};

export default CallToAction;
