import React from "react";
import Image from "next/image";
import { downloadImage } from "@/utils";
import { Palace, Story } from "@/app/api/v1/generate/route";
import { MongoPalace } from "@/mongodb/models/palace";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const PalaceCard = ({ palace }: { palace: MongoPalace }) => {
  const prompt = palace.imagePrompts;
  const _id = palace._id;

  return (
    // <a href={"/palace/" + _id}>
    <Card className="overflow-hidden cursor-pointer transition-transform hover:scale-105">
      <CardContent className="p-0">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative aspect-square">
              <Image
                src={palace.images[0]}
                alt={"item.title"}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity opacity-0 hover:opacity-100 flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-bold text-2xl">Title</h3>
                  {/* <p className="text-sm">{palace.sentences.slice(0,3)}</p> */}
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>title</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Image
                src={palace.images[0]}
                alt="{item.title}"
                width={600}
                height={600}
                layout="responsive"
              />
              <p className="mt-4">{palace.sentences[0]}</p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
    // </a>
  );
};

export default PalaceCard;
