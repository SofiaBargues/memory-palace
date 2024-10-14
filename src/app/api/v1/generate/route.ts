import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const StoryPart = z.object({
  imageGeneratorPrompt: z.string(), // .min(100).max(150)
  narrative: z.string(), // .min(300).max(450)
});
export const Story = z.object({
  part1: StoryPart,
  part2: StoryPart,
  part3: StoryPart,
});

export type Story = z.infer<typeof Story>;

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a Loci method builder. You get a list of words and create a memorable story with them that help the user remember the words. The output is divided in 3 story parts, each part uses 3 words from the input list. You also create a image generation prompt for each part to be used in Dall-e-3.",
        },
        {
          role: "user",
          content:
            "[House, Scarf, Tree, Phone, Book, Chair, Computer, Watch, Bag]",
        },
      ],
      response_format: zodResponseFormat(Story, "story"),
    });

    const story = completion.choices[0].message.parsed;
    return Response.json({ story });

    // DALLE PART 2
    const { prompt } = await request.json();
    const aiResponse = await openai.images.generate({
      response_format: "b64_json",
      model: "dall-e-3",
      size: "1024x1024",

      // model: "dall-e-2",
      // size: "256x256",
      prompt,
      n: 1,
      quality: "standard",
    });
    // console.log(aiResponse);
    const image = aiResponse.data[0].b64_json;

    return Response.json({ photo: image });
  } catch (error) {
    console.error(error);

    const errorMessage = (error as Error).message;
    console.error(errorMessage);
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
