import dbConnect from "@/mongodb/connect";
import PostSchema from "@/mongodb/models/post";
import { v2 as cloudinary } from "cloudinary";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const posts = await PostSchema.find({});
    return Response.json({ success: true, data: posts });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const { name, prompt, photo } = await request.json();
    const photoUrl = await cloudinary.uploader.upload(photo);
    await dbConnect();

    const newPost = await PostSchema.create({
      name,
      prompt,
      photo: photoUrl.url,
    });

    return Response.json({ success: true, data: newPost });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
