import dbConnect from "@/mongodb/connect";
import PalaceSchema from "@/mongodb/models/palace";

export async function GET() {
  try {
    //conecta la base de datos
    await dbConnect();
    //trae todos los posts
    const palaces = await PalaceSchema.find({});
    return Response.json({ success: true, data: palaces });
  } catch (error) {
    console.error(error);
    const errorMessage = (error as Error).message;
    console.error(errorMessage);
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
export async function POST(request: Request) {
  try {
    const palace = await request.json();
    //conecta la base de datos
    await dbConnect();

    const newPalace = await PalaceSchema.create(palace);

    return Response.json(newPalace);
  } catch (error) {
    console.error(error);
    const errorMessage = (error as Error).message;
    console.error(errorMessage);
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
