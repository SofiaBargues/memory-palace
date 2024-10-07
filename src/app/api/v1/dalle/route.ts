import { OpenAI } from "openai";

export async function GET() {
  return new Response("Hello from DALL-E!");
}
export async function POST(request: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { prompt } = await request.json();
    const aiResponse = await openai.images.generate({
      response_format: "b64_json",
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });
    // console.log(aiResponse);

    const image = aiResponse.data[0].b64_json;

    return Response.json({ photo: image });
  } catch (error) {
    console.log(error);
    // return new Response(error.message, { status: 500 });
    return new Response();
  }
}
