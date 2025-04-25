"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "./card";
import { Sparkles } from "lucide-react";
const images = [
  {
    src: "https://res.cloudinary.com/sofiabargues/image/upload/v1733679147/palace/xnul4xr3ed3vd4ufkkfd.png",
    href: "/palace/6755d82ead2b664fb34ca40d",
    alt: "The Curious Tale of the Wandering Orange",
    title: "The Curious Tale of the Wandering Orange",
  },
  {
    src: "https://res.cloudinary.com/sofiabargues/image/upload/v1731954832/palace/wqoyurhcyv3mm84jjkax.png",
    href: "/palace/673b8893b2dc602f0ebd463f",
    alt: "A Day of Unexpected Adventures",
    title: "A Day of Unexpected Adventures",
  },
  {
    src: "https://res.cloudinary.com/sofiabargues/image/upload/v1730708900/palace/e5ujm0c2o4ssxywsr4xn.png",
    href: "/palace/672885a673a41580221a785b",
    alt: "Whimsy in the Park",
    title: "Whimsy in the Park",
  },
  {
    src: "https://res.cloudinary.com/sofiabargues/image/upload/v1730632553/palace/ibhah6qybg9gq8qn7mg9.png",
    href: "/palace/67275b6c25eadec2b359697e",
    alt: "The lemon dream",
    title: "The lemon dream",
  },
];

const Hero = ({}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <section className="relative w-full overflow-hidden py-14">
      <div className="container px-4 md:px-6 m-auto">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tighter text-primary sm:text-5xl 2xl:text-7xl xl:text-6xl/none">
            Visualize and Remember
          </h1>
          <p className="mx-auto max-w-[600px] text-secondary-foreground md:text-xl">
            {
              "Choose your words and discover a visual story that will lock them into your memory forever."
            }
          </p>
          <div className="mt-8 flex gap-4 sm:flex-row flex-col justify-center">
            <a href="/palaces">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Choose a palace
              </Button>
            </a>
            <a href="/tutorial">
              <Button size="lg" className="w-full sm:w-auto">
                Create a Palace
                <Sparkles></Sparkles>
              </Button>
            </a>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <a href={image.href}>
                <Card className="group relative overflow-hidden rounded-lg">
                  <div className="aspect-[3/4] w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute bottom-0 p-4">
                      <h2 className="text-xl font-bold text-card-foreground">
                        {image.title}
                      </h2>
                    </div>
                  </motion.div>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
