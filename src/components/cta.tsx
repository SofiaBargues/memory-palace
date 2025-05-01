import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
const CallToAction = () => {
  return (
    <section
      id="Create"
      className=" text-center sm:my-20 my-7 px-2
     "
    >
      {/* <Card className="p-12  "> */}
      <h2 className="text-3xl font-bold tracking-tighter mb-4">
        Create Your Memory Palace
      </h2>
      <p className=" text-muted-foreground mb-8 max-w-xl mx-auto">
        Start your journey with our guided memory palace experiences or create
        your own custom memory challenges.
      </p>
      <a href="/palace">
        <Button size="lg">
          Create it Now
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </a>
      {/* </Card> */}
    </section>
  );
};

export default CallToAction;
