import { Configuration, OpenAIApi } from "openai";

export async function GET() {
  return new Response("Hello from DALL-E!");
}
export async function POST(request: Request) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const { prompt } = await request.json();
    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      // size: "1024x1024",
      size: "256x256",

      response_format: "b64_json",
    });
    // console.log(aiResponse);
    const image = aiResponse.data.data[0].b64_json;

    return Response.json({ photo: image });
  } catch (error) {
    console.log(error);
    // return new Response(error.message, { status: 500 });
    return new Response();
  }
}
