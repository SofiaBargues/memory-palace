"use client";

import { useEffect, useState } from "react";

import Loader from "../Loader";
import PalaceCard from "../PalaceCard";
import { MongoPalace } from "@/mongodb/models/palace";

const RenderCards = ({ data }: { data: MongoPalace[] }) => {
  if (data?.length > 0) {
    return (
      <div className="grid-cols-1  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 grid">
        {data.map((palace) => (
          <PalaceCard key={palace._id} palace={palace} />
        ))}
      </div>
    );
  }
  <div>No palaces found</div>;
};

export default function PalacesGrid({ maxNum }: { maxNum?: number }) {
  const [loading, setLoading] = useState(true);
  const [allPalaces, setAllPalaces] = useState<MongoPalace[]>([]);
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

  return (
    <div id="Grid" className="p-4 h-full sm:p-12">
      {loading ? (
        <div className="flex  justify-center h-full  flex-col items-center">
          <Loader />
          <p className="font-medium  mt-5 text-xl">Loading Palaces</p>
        </div>
      ) : (
        <>
          {maxNum ? (
            <RenderCards data={allPalaces.slice(0, maxNum)} />
          ) : (
            <RenderCards data={allPalaces} />
          )}
        </>
      )}
    </div>
  );
}
