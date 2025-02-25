"use client";

import ExperienceCard from "@/components/ui/experienceCards";
import { CastleIcon, Footprints, PenTool } from "lucide-react";
import CallToAction from "@/components/ui/cta";
import Hero from "@/components/ui/hero";

const Home = () => {
  return (
    <section className="max-w-7xl mx-auto ">
      <Hero />
      {/* <h2 className="text-3xl py-12  font-bold  text-center">
        Experience the Power of Memory Palaces
      </h2> */}
      {/* <div className="grid gap-8 sm:grid-cols-3  w-full "> */}
      {/* <div className="flex gap-8 flex-col sm:flex-row"> */}
      {/* <ExperienceCard
          title="1. Initial Memory Test"
          description="Try to memorize a set of words and recall them in order without any memory techniques"
          Icon={PenTool}
        />
        <ExperienceCard
          title="2. Enter the Palace"
          description="Explore a guided story with vivid imagery that helps you remember the same words"
          Icon={CastleIcon}
        />
        <ExperienceCard
          title="3. Mental Journey"
          description="Test your recall again using the memory palace technique and see the improvement"
          Icon={Footprints}
        /> */}
      {/* </div> */}
      {/* <section id="Community Showcase" className=" py-12">
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold mb-4">What is Memory Palace</h2>
          <p className="max-w-6xl text-sm md:text-lg mx-auto text-muted-foreground text-balance">
            The Memory Palace, or Method of Loci, is an ancient mnemonic
            technique used to enhance memory by associating information with
            specific locations in an imagined space. By mentally placing items
            along a familiar path, such as a childhood home or a known street,
            individuals can recall information by "walking" through these
            locations in their minds. This method leverages spatial memory to
            improve retention and recall. Used by ancient Greeks, Romans, and
            memory champions today, the Memory Palace is particularly effective
            for memorizing lists, speeches, and large amounts of information by
            transforming abstract data into vivid, memorable images.
          </p>
        </div>
      </section> */}

      <CallToAction />
    </section>
  );
};

export default Home;
