import { OpenAI } from "openai";
import { uploadToCloudinary } from "./uploadToCloudinary";
import { buildTriptychPrompt } from "@/server/palace/buildTriptychPrompt";
import { createTriptychPalace } from "@/server/palace/createTriptychPalace";
import { cropTriptychBase64 } from "@/server/palace/cropTriptych";
import { generatePalacePlan } from "@/server/palace/generatePalacePlan";
import { generateTriptychImage } from "@/server/palace/generateTriptychImage";
import { validateWords } from "@/server/palace/validateWords";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const words = validateWords(body.words);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const plan = await generatePalacePlan(openai, words);
    const { imagePrompt } = await buildTriptychPrompt(openai, plan);
    const triptychBase64 = await generateTriptychImage(openai, imagePrompt);
    const slideBase64Images = cropTriptychBase64(triptychBase64);

    const [triptychImage, ...images] = await Promise.all([
      uploadToCloudinary(triptychBase64),
      ...slideBase64Images.map((image) => uploadToCloudinary(image)),
    ]);

    const savedPalace = await createTriptychPalace({
      words,
      plan,
      triptychImage,
      images,
      imagePrompt,
    });

    return Response.json(savedPalace);
  } catch (error) {
    const errorMessage = (error as Error).message;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
