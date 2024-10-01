import dbConnect from "@/mongodb/connect";
import PostSchema from "@/mongodb/models/post";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const posts = await PostSchema.find({});
    return Response.json({ success: true, data: posts });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
