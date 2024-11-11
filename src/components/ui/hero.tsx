"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import * as React from "react";
import { Card } from "./card";

const Hero = ({}) => {
  const [activeImage, setActiveImage] = useState(0);

  const images = ["/img1 (1).png", "/img1 (3).png", "/img1 (2).png"];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <section className="relative overflow-hidden ">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  ">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative z-10 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                  Master the Art of Memory
                </h1>
                <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                  Unlock the power of your mind with the ancient technique of
                  Memory Palace. Transform the way you learn and remember
                  through the Method of Loci.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Your Journey
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4 h-[600px]">
                {images.map((src, index) => (
                  <motion.div
                    key={index}
                    className={`relative ${
                      index === 2 ? "col-span-2" : ""
                    } rounded-2xl overflow-hidden`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: activeImage === index ? 1 : 0.5,
                      scale: activeImage === index ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={src}
                      alt={`Memory Palace Visualization ${index + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Decorative elements */}
              <div className="absolute -left-4 top-0 h-72 w-72 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -right-4 bottom-0 h-72 w-72 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>
      <Card className="text-center rounded-xl border text-card-foreground shadow py-12  mt-12">
        <h2 className="text-3xl font-bold mb-8 ">
          What is the Method of Loci?
        </h2>
        <p className="max-w-6xl text-lg mx-auto text-muted-foreground ">
          The Method of Loci, also known as Memory Palace, is a powerful
          memorization technique that uses visualization to organize and recall
          information. By mentally placing items within a familiar location, you
          create strong associations that significantly improve your ability to
          remember and retrieve information.
        </p>
      </Card>
    </>
  );
};

export default Hero;