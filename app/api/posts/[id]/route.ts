import { NextResponse } from "next/server";
import Post from "@/models/Post";
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
// GET /api/posts/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await connectDB();

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    await connectDB();

    const updatedPost = await Post.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedPost },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating post:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A student with this enrollment number already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id]
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;

//     await connectDB();

//     const deletedPost = await Post.findByIdAndDelete(id);

//     if (!deletedPost) {
//       return NextResponse.json(
//         { success: false, message: "Post not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, message: "Post deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting post:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to delete post" },
//       { status: 500 }
//     );
//   }
// }

const getResourceType = (url: string): string => {
  if (
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".avi") ||
    url.endsWith(".mov") ||
    url.endsWith(".mkv") ||
    url.endsWith(".flv")
  ) {
    return "video";
  }

  if (
    url.endsWith(".jpg") ||
    url.endsWith(".png") ||
    url.endsWith(".heif") ||
    url.endsWith(".heic") ||
    url.endsWith(".webp") ||
    url.endsWith(".svg") ||
    url.endsWith(".gif") ||
    url.endsWith(".avif")
  ) {
    return "image";
  }

  return "raw"; // Default to 'raw' if it's not an image or video
};

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await connectDB();

    // Find the post to retrieve the public_ids for media
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(id);

    // Delete the student photo from Cloudinary (if it exists)
    if (post.studentPhoto?.public_id) {
      await cloudinary.uploader.destroy(post.studentPhoto.public_id, {
        resource_type: getResourceType(post.studentPhoto.secure_url),
      });
    }

    // Delete talent media from Cloudinary (if it exists)
    for (const media of post.talentMedia || []) {
      if (media.public_id) {
        const resourceType = getResourceType(media.secure_url); // Corrected here to use media.secure_url

        await cloudinary.uploader.destroy(media.public_id, {
          resource_type: resourceType,
        });
      }
    }

    return NextResponse.json(
      { success: true, message: "Post and media deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post and media:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete post and media" },
      { status: 500 }
    );
  }
}
