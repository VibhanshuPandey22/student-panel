import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { pusherServer } from "@/lib/pusher";
import { NextRequest } from "next/server"; // ✅ import this

export async function POST(
  req: NextRequest,
  context: { params: { id: string } } // ✅ proper destructuring
) {
  await connectDB();

  const { id } = context.params; // ✅ this avoids the error

  const { hasLiked } = await req.json();

  const post = await Post.findById(id);
  if (!post) {
    return new Response(JSON.stringify({ success: false }), { status: 404 });
  }

  post.likes += hasLiked ? -1 : 1;
  await post.save();

  await pusherServer.trigger("student-channel", "student-liked", {
    id: post._id,
    likes: post.likes,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
