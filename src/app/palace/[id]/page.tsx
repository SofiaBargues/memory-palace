"use client";
import React, { useEffect, useState } from "react";
import { PalaceView } from "../palaceView";
import { Palace } from "@/app/api/v1/generate/types";
import { Loader } from "@/components";

const PalaceIdPage = ({ params }: { params: { id: string } }) => {
  const [loading, setLoading] = useState(true);
  const [allPalaces, setAllPalaces] = useState<(Palace & { _id: string })[]>(
    []
  );
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

  console.log(allPalaces);
  const selectedPalace = allPalaces.find((value) => value._id === params.id);

  if (true || loading) {
    return (
      <div className="flex justify-center h-full items-center">
        <Loader></Loader>
      </div>
    );
  }
  if (!selectedPalace) {
    return <div>Not found</div>;
  }

  console.log(selectedPalace);
  return (
    <>
      <div className="flex">
        <PalaceView
          initialPalace={selectedPalace}
          initialStep="palace"
          initialPalaceId={params.id}
        />
      </div>
    </>
  );
};

export default PalaceIdPage;
