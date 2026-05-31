import dbConnect from "@/mongodb/connect";
import PalaceSchema from "@/mongodb/models/palace";

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 24;

function getPositiveNumber(value: string | null, fallback: number) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 1) {
    return fallback;
  }

  return Math.floor(numberValue);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = getPositiveNumber(searchParams.get("page"), 1);
    const requestedLimit = getPositiveNumber(
      searchParams.get("limit"),
      DEFAULT_LIMIT
    );
    const limit = Math.min(requestedLimit, MAX_LIMIT);
    const shouldPaginate = searchParams.has("page") || searchParams.has("limit");

    //conecta la base de datos
    await dbConnect();

    if (!shouldPaginate) {
      const palaces = await PalaceSchema.find({});
      return Response.json({ success: true, data: palaces });
    }

    const skip = (page - 1) * limit;
    const [palaces, total] = await Promise.all([
      PalaceSchema.find({}).sort({ _id: -1 }).skip(skip).limit(limit).lean(),
      PalaceSchema.countDocuments({}),
    ]);

    return Response.json({
      success: true,
      data: palaces,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + palaces.length < total,
      },
    });
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
    const palace = await request.json(); // body
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
