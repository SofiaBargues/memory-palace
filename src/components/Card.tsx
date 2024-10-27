import React from "react";
import { downloadImage } from "@/utils";
import { Palace, Story } from "@/app/api/v1/generate/route";
import { storyData } from "@/app/palace/page";

export type Post = {
  _id: string;
  name: string;
  prompt: string;
  photo: string;
};

const Card = ({ sentences, words, imagePrompts, images }: Palace) => {
  const _id = words[0];
  const name = sentences[0];
  const prompt = imagePrompts;
  const photo = images[0];

  return (
    <div
      className="rounded-xl group relative shadow-card
hover:shadow-cardhover card"
    >
      <img
        className="w-full h-auto object-cover rounded-xl"
        src={photo}
        alt={prompt}
      />
      <div
        className="group-hover:flex flex-col max-h-[94.5%]
hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2
p-4 rounded-md"
      >
        <p className="text-white text-md overflow-y-auto prompt">{prompt}</p>
        <div className="mt-5 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold">
              {name[0]}
            </div>
            <p className="text-white text-sm">{name}</p>
          </div>
          <button
            type="button"
            onClick={() => downloadImage(_id, photo)}
            className="outline-none bg-transparent border-none"
          >
            <img
              src="/download.png"
              alt="download"
              className="w-6 h-6 object-contain invert"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
