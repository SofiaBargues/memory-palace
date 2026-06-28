import { OpenAI } from "openai";

export async function generateTriptychImage(
  openai: OpenAI,
  imagePrompt: string,
): Promise<string> {
  const imageRequest = {
    model: "gpt-image-2",
    prompt: imagePrompt,
    quality: "medium",
  } as const;

  const response = await openai.images.generate(imageRequest);

  const image = response.data?.[0]?.b64_json;

  if (!image) {
    throw new Error("Triptych image generation did not return base64 data");
  }

  return image;
}
