import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0); // Progreso de la barra
  const _id = palace._id;
  useEffect(() => {
    // Cambiar la imagen cada 3 segundos (3000 milisegundos)
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % palace.images.length
      );
      setProgress(0);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 100 / 30; // 30 pasos en 3 segundos
        } else {
          return 100;
        }
      });
    }, 100); // Actualiza el progreso cada 100ms

    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      clearInterval(progressInterval);
      clearInterval(intervalId);
    };
  }, [palace.images.length]);

  return (
    <>
      <Card className="overflow-hidden  cursor-pointer transition-transform hover:scale-105">
        <CardContent className="p-0">
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative aspect-square ">
                <Image
                  src={palace.images[0]}
                  alt={"item.title"}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity opacity-0 hover:opacity-100 flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-bold text-2xl">{palace.title}</h3>
                    {/* <p className="text-sm">{palace.sentences.slice(0,3)}</p> */}
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">{palace.title}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div>
                  <Image
                    src={palace.images[currentImageIndex]}
                    alt="{item.title}"
                    width={600}
                    height={600}
                    layout="responsive"
                    className="rounded-2xl"
                  />
                  {/* Barra de progreso debajo de la imagen */}
                  <div className="relative mt-2">
                    <div className="absolute bottom-0 left-0 h-1 bg-white w-full rounded-full"></div>
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-gray-200 rounded-full"
                      style={{
                        width: `${progress}%`,
                        transition: "width 0.1s linear",
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-medium">
                    You will remember these words:
                  </div>
                  <div className="">
                    <p>{palace.words.join(", ")}</p>
                  </div>
                </div>
              </div>
              <a className="justify-end flex" href={"/palace/" + _id}>
                <Button>Visit</Button>
              </a>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
};

export default PalaceCard;
