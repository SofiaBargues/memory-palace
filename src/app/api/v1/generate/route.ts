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

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const words = res.words;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a Loci method builder. You get an ordered list of words and create a memorable story with them that help the user remember the words in the same order in which they are given. The output is divided in 3 story parts, each part uses 3 words from the input list. Create a narrative and an image generation prompt for each part to be used in Dall-e-3. Use Writing grade 5. In the story you move through different places and perform actions according to the loci method.",
        },
        {
          role: "user",
          content: JSON.stringify(words),
        },
      ],
      response_format: zodResponseFormat(Story, "story"),
    });

    const story = completion.choices[0].message.parsed;
    if (story === null) {
      return new Response(JSON.stringify({ message: "Story is Null" }), {
        status: 500,
      });
    }

    const imgPrompts = Object.values(story).map((x) => x.imageGeneratorPrompt);

    // DALLE PART 2
    const promises = imgPrompts.map((imgPrompt) =>
      openai.images.generate({
        response_format: "url", // Can be `b64_json`
        model: "dall-e-3",
        size: "1024x1024",
        // model: "dall-e-2",
        // size: "256x256",
        prompt: imgPrompt,
        n: 1,
        quality: "standard",
      })
    );
    const responses = await Promise.all(promises);
    const images = responses.map((res) => res.data[0].url); // Can be `b64_json`
    return Response.json({ story, images });
  } catch (error) {
    console.error(error);

    const errorMessage = (error as Error).message;
    console.error(errorMessage);
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
