import React from "react";
import { downloadImage } from "@/utils";
import { Palace, Story } from "@/app/api/v1/generate/route";
import { MongoPalace } from "@/mongodb/models/palace";

const PalaceCard = ({ palace }: { palace: MongoPalace }) => {
  const prompt = palace.imagePrompts;
  const _id = palace._id;

  return (
    <a href={"/palace/" + _id}>
      <div className="flex">
        <div className="rounded-xl  group relative card">
          <img
            className="w-32 h-32 object-cover rounded-xl"
            src={palace.images[0]}
            alt={palace.sentences[0]}
          />

          <div className="">
            <p className="text-black w-32 text-md">{palace.sentences[0]}</p>
          </div>
        </div>
        <div className="rounded-xl group relative card">
          <img
            className="w-32 h-32 object-cover rounded-xl"
            src={palace.images[1]}
            alt={palace.sentences[1]}
          />

          <div className="">
            <p className="text-black w-32 text-md">{palace.sentences[1]}</p>
          </div>
        </div>
        <div className="rounded-xl group relative card">
          <img
            className="w-32 h-32 object-cover rounded-xl"
            src={palace.images[2]}
            alt={palace.sentences[2]}
          />

          <div className="">
            <p className="text-black w-32 text-md">{palace.sentences[2]}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default PalaceCard;
