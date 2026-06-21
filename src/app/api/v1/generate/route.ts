import { OpenAI } from "openai";
import { uploadToCloudinary } from "./uploadToCloudinary";
import { buildTriptychPrompt } from "@/server/palace/buildTriptychPrompt";
import { createTriptychPalace } from "@/server/palace/createTriptychPalace";
import { cropTriptychBase64 } from "@/server/palace/cropTriptych";
import { generatePalacePlan } from "@/server/palace/generatePalacePlan";
import { generateTriptychImage } from "@/server/palace/generateTriptychImage";
import { validateWords } from "@/server/palace/validateWords";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const words = validateWords(body.words);

    console.info("[generate] starting pov triptych palace", { words });

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.info("[generate] creating palace plan");
    const plan = await generatePalacePlan(openai, words);
    console.info("[generate] creating triptych prompt", {
      title: plan.title,
      scenario: plan.scenario.name,
    });
    const { imagePrompt } = await buildTriptychPrompt(openai, plan);
    console.info("[generate] generating triptych image");
    const triptychBase64 = await generateTriptychImage(openai, imagePrompt);
    console.info("[generate] cropping triptych image");
    const slideBase64Images = cropTriptychBase64(triptychBase64);

    console.info("[generate] uploading images");
    const [triptychImage, ...images] = await Promise.all([
      uploadToCloudinary(triptychBase64),
      ...slideBase64Images.map((image) => uploadToCloudinary(image)),
    ]);

    console.info("[generate] saving palace");
    const savedPalace = await createTriptychPalace({
      words,
      plan,
      triptychImage,
      images,
      imagePrompt,
    });

    return Response.json(savedPalace);
  } catch (error) {
    console.error("[generate] failed", error);
    const errorMessage = (error as Error).message;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
