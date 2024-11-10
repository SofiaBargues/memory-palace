"use client";

import { useEffect, useState } from "react";
import React from "react";

import { FormField, Loader } from "@/components/index";
import { Palace } from "./api/v1/generate/route";
import palace, { MongoPalace } from "@/mongodb/models/palace";
import PalaceCard from "@/components/PalaceCard";
import ExperienceCard from "@/components/ui/experienceCards";
import { Building, ChevronRight, Footprints, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import CallToAction from "@/components/ui/cta";
import Hero from "@/components/ui/hero";
const RenderCards = ({
  data,
  title,
}: {
  data: MongoPalace[];
  title: string;
}) => {
  if (data?.length > 0) {
    return (
      <div className="grid-cols-3 gap-3 grid">
        {data.map((palace) => (
          <PalaceCard key={palace._id} palace={palace} />
        ))}
      </div>
    );
  }
  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [allPalaces, setAllPalaces] = useState<MongoPalace[]>([]);
  const [handleShow, setHandleShow] = useState<boolean>(false);

  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState<MongoPalace[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/palace", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log(response);
          const result = await response.json();
          console.log(result);
          setAllPalaces(result.data.reverse());
        } else {
          const errorData = await response.json();
          console.log(errorData);
          throw new Error(errorData.message || "Error en la solicitud");
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchText(e.target.value);

    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPalaces.filter((item) =>
          item.words[0]
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase())
        );

        setSearchedResults(searchResults);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <Hero />
      <div className="container py-12">
        <h2 className="text-3xl  font-bold mb-8 text-center">
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
      </div>
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            <section className="container py-12">
              <div className="text-center ">
                <h2 className="text-3xl font-bold ">Community Showcase</h2>
                <p className="mt-2 text-[#666e75] mb-3 text-[16px] ">
                  Browse through other Memory Palaces
                </p>
              </div>
              {handleShow === false ? (
                <RenderCards
                  data={allPalaces.slice(0, 6)}
                  title="No posts found"
                />
              ) : (
                <RenderCards data={allPalaces} title="No posts found" />
              )}
              <div className="text-center mt-8">
                <Button
                  onClick={() =>
                    !handleShow ? setHandleShow(true) : setHandleShow(false)
                  }
                >
                  {!handleShow ? "More" : "Less"} Palaces
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </section>
          </>
        )}
      </div>
      <CallToAction />
    </section>
  );
};

export default Home;
