"use client";

import React, { useEffect, useState } from "react";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "../Loader";
import PalaceCard from "../PalaceCard";
import { MongoPalace } from "@/mongodb/models/palace";

export default function PalacesGrid() {
  const [loading, setLoading] = useState(true);
  const [allPalaces, setAllPalaces] = useState<MongoPalace[]>([]);
  const [handleShow, setHandleShow] = useState<boolean>(false);
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
      <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">
        {title}
      </h2>
    );
  };

  return (
    <div id="Grid" className="mt-10">
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          <section id="Community Showcase" className="container py-12">
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
  );
}
