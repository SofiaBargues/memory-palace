"use client";
import React from "react";
import { MemoryGame } from "../../../components/memoryGame";

const PalaceIdPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="flex">
        <MemoryGame initialPalaceId={params.id} />
      </div>
    </>
  );
};

export default PalaceIdPage;
