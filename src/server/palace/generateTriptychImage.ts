import { OpenAI } from "openai";

export async function generateTriptychImage(
  openai: OpenAI,
  imagePrompt: string,
  runId?: string,
): Promise<string> {
  const imageRequest = {
    model: "gpt-image-2",
    prompt: imagePrompt,
    quality: "medium",
  } as const;

  const logPrefix = runId ? `[generate:${runId}]` : "[generate]";
  console.info(
    `${logPrefix} image playground payload (copy JSON below)\n${JSON.stringify(
      imageRequest,
      null,
      2,
    )}`,
  );

  const response = await openai.images.generate(imageRequest);

  const image = response.data?.[0]?.b64_json;

  if (!image) {
    throw new Error("Triptych image generation did not return base64 data");
  }

  return image;
}
