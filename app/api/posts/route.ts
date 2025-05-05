import { NextResponse } from "next/server";
import Post from "@/models/Post";
import { connectDB } from "@/lib/db";

export async function GET(request: Request) {
  try {
    await connectDB();
    const posts = await Post.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     await connectDB();

//     // Validate required fields
//     const requiredFields = [
//       "name",
//       "enrollmentNo",
//       "department",
//       "batch",
//       "contactNumber",
//       "category",
//       "postTitle",
//       "description",
//       "studentPhoto",
//       "talentMedia",
//     ];

//     for (const field of requiredFields) {
//       if (!body[field]) {
//         return NextResponse.json(
//           { success: false, message: `${field} is required` },
//           { status: 400 }
//         );
//       }
//     }

//     const post = await Post.create(body);

//     return NextResponse.json({ success: true, data: post }, { status: 201 });
//   } catch (error: any) {
//     console.error("Error creating post:", error);

//     // Handle duplicate enrollmentNo error
//     if (error.code === 11000) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "A student with this enrollment number already exists",
//         },
//         { status: 409 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, message: "Failed to create post" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await connectDB();

    // Validate required fields
    const requiredFields = [
      "name",
      "enrollmentNo",
      "department",
      "batch",
      "contactNumber",
      "category",
      "postTitle",
      "description",
      "studentPhoto",
      "talentMedia",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Process studentPhoto to store both public_id and secure_url
    if (
      body.studentPhoto &&
      body.studentPhoto.public_id &&
      body.studentPhoto.secure_url
    ) {
      body.studentPhoto = {
        public_id: body.studentPhoto.public_id,
        secure_url: body.studentPhoto.secure_url,
      };
    }

    // Process talentMedia to store both public_id and secure_url
    if (body.talentMedia && Array.isArray(body.talentMedia)) {
      body.talentMedia = body.talentMedia.map((media: any) => ({
        public_id: media.public_id,
        secure_url: media.secure_url,
      }));
    }

    // Create the post
    const post = await Post.create(body);

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);

    // Handle duplicate enrollmentNo error
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
      { success: false, message: "Failed to create post" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import Post from "@/models/Post";
// import { connectDB } from "@/lib/db";

// export async function GET(request: Request) {
//   try {
//     await connectDB();
//     const posts = await Post.find({}).sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, data: posts }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch posts" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     await connectDB();

//     // Validate required fields
//     const requiredFields = [
//       "name",
//       "enrollmentNo",
//       "department",
//       "batch",
//       "contactNumber",
//       "category",
//       "postTitle",
//       "description",
//       "studentPhoto", // this will contain an object with secure_url and public_id
//       "talentMedia", // this will be an array of public_ids
//     ];

//     for (const field of requiredFields) {
//       if (!body[field]) {
//         return NextResponse.json(
//           { success: false, message: `${field} is required` },
//           { status: 400 }
//         );
//       }
//     }

//     // Create the post document
//     const post = await Post.create({
//       ...body,
//       studentPhoto: body.studentPhoto, // Make sure studentPhoto includes secure_url and public_id
//       talentMedia: body.talentMedia, // talentMedia should be an array of public_ids
//     });

//     return NextResponse.json({ success: true, data: post }, { status: 201 });
//   } catch (error: any) {
//     console.error("Error creating post:", error);

//     // Handle duplicate enrollmentNo error
//     if (error.code === 11000) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "A student with this enrollment number already exists",
//         },
//         { status: 409 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, message: "Failed to create post" },
//       { status: 500 }
//     );
//   }
// }
