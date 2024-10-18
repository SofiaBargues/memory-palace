import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const StoryPart = z.object({
  imageGeneratorPrompt: z.string(), // .min(100).max(150)
  narrative: z.string(), // .min(300).max(450)
});
export const Story = z.object({
  sentences: z.string().array(),
  imagePrompts: z.string().array(),
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
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            // TODO: Asq the sistem to wrap word bold
            // TODO: Improve prompt to ensure words are mentioned in order
            `You are a Loci method builder. 
- Create a memorable story using all the words in the list, keeping them **in the exact order of the input**.
- For each word write a sentence in the output sentences array. This array has 9 sentences.
- The story is narrated in **first person**, where the reader moves through different places and interacts with the words.
- For each group for 3 sentences generate a DALL-E 3 prompt based on the scene described. This array has 3 prompts.
- Keep the writing at a **5th grade level**, using clear, simple imagery.
`,
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
