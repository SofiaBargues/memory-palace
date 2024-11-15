"use client";

import React from "react";

import ExperienceCard from "@/components/ui/experienceCards";
import { Building, Footprints, PenTool } from "lucide-react";
import CallToAction from "@/components/ui/cta";
import Hero from "@/components/ui/hero";
import PalacesGrid from "@/components/ui/palacesGrid";

const Home = () => {


  return (
    <section className="max-w-7xl mx-auto">
      <Hero />
      <h2 className="text-3xl py-12  font-bold  text-center">
        Experience the Power of Memory Palaces
      </h2>
      <div className="grid gap-8 sm:grid-cols-3  w-full ">
        {/* <div className="flex gap-8 flex-col sm:flex-row"> */}
        <ExperienceCard
          title="1. Initial Memory Test"
          description="Try to memorize a set of words and recall them in order without any memory techniques"
          Icon={PenTool}
        />
        <ExperienceCard
          title="2. Enter the Palace"
          description="Explore a guided story with vivid imagery that helps you remember the same words"
          Icon={Building}
        />
        <ExperienceCard
          title="3. Mental Journey"
          description="Test your recall again using the memory palace technique and see the improvement"
          Icon={Footprints}
        />
      </div>
      <PalacesGrid />
      <CallToAction />
    </section>
  );
};

export default Home;
