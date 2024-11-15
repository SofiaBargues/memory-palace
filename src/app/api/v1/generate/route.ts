import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { uploadToCloudinary } from "./uploadToCloudinary";
import { Story, StoryImages } from "./types";

export const runtime = "edge";

export async function POST(request: Request) {
  // stop the img generator
  // return;
  //todo: frene la generacion de imagenes saca rertutn para que funcione
  try {
    // 1. obtengo words del request
    const res = await request.json();
    const words = res.words;

    // 2. crea un cliente de open ai
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 3. crea senteces
    const completionSentences = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      temperature: 1.2,
      messages: [
        {
          role: "system",
          content: `You are a Loci method builder. 
- Create a memorable story using all the words in the list, keeping them **in the exact order of the input**.
Style:
 - Keep the writing at a **5th grade level**, using clear, simple imagery.
- The story is narrated in **first person**, where the reader moves through different places and interacts with the words.
- The word from the input is wrapped in a bold HTML tag in the "sentences" array E.g.  alice -> <b>alice</b

Steps:
1. For each word in the user input write a sentence in the output sentences array. The "sentences" array has 9 elements.

  `,
        },
        {
          role: "user",
          content: JSON.stringify(words),
        },
      ],
      response_format: zodResponseFormat(Story, "story"),
    });

    const storySentences = completionSentences.choices[0].message.parsed;

    if (storySentences === null) {
      return new Response(JSON.stringify({ message: "Story is Null" }), {
        status: 500,
      });
    }
    // 4. crea img Promt
    const step2Completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `You are a Loci method builder. 
          - Create a title for the story.
- Create three DALL-E 3 prompts.
Steps:
1. For each sentence generate a DALL-E 3 prompt based on the scene described that contains.
2. The 3 words wrapped in bold tags must appear in the final image. `,
        },
        {
          role: "user",
          content: JSON.stringify([
            storySentences.sentences.slice(0, 3).join(" "),
            storySentences.sentences.slice(3, 6).join(" "),
            storySentences.sentences.slice(6, 9).join(" "),
          ]),
        },
      ],
      response_format: zodResponseFormat(StoryImages, "story"),
    });

    const step2response = step2Completion.choices[0].message.parsed;

    if (step2response === null) {
      return new Response(JSON.stringify({ message: "Story Images is Null" }), {
        status: 500,
      });
    }

    // 5. creo las imagenes con dalle 3

    const imgPrompts = step2response.imagePrompts;

    // DALLE
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
    const temporalImages = responses.map((res) => res.data[0].url!); // Can be `b64_json`

    // 6. guardo img en cloudinary

    const persistentImages = [];
    for (const image of temporalImages) {
      persistentImages.push(await uploadToCloudinary(image));
    }

    // 7. construyo Palace
    const { sentences } = storySentences;
    const { imagePrompts, title } = step2response;
    const palace = {
      title,
      words,
      imagePrompts,
      sentences,
      images: persistentImages,
    };
    console.log(sentences);
    console.log(storySentences);
    // 8. guardo palace en mongo
    const palaceResponse = await fetch(
      process.env.NEXT_PUBLIC_URL + "/api/v1/palace",
      {
        method: "POST",
        body: JSON.stringify(palace),
      }
    );
    const savedPalace = await palaceResponse.json();

    return Response.json(savedPalace);
  } catch (error) {
    console.error(error);
    const errorMessage = (error as Error).message;
    console.error(errorMessage);
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
