// import { NextRequest, NextResponse } from "next/server";
// import cloudinary from "@/lib/cloudinary";

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();

//     // Handle profile photo
//     const studentPhotoFile = formData.get("studentPhoto") as File | null;
//     if (!studentPhotoFile) {
//       return NextResponse.json(
//         { success: false, message: "No student photo provided." },
//         { status: 400 }
//       );
//     }

//     const studentBuffer = Buffer.from(await studentPhotoFile.arrayBuffer());

//     const uploadedPhoto = await new Promise<{ secure_url: string }>(
//       (resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream(
//             {
//               upload_preset: "talent",
//               folder: "student_photos",
//               resource_type: "auto",
//             },
//             (error, result) => {
//               if (error || !result) return reject(error || "Upload failed");
//               resolve(result);
//             }
//           )
//           .end(studentBuffer);
//       }
//     );

//     // Handle talent media
//     const mediaFiles = formData.getAll("talentMedia") as File[];

//     if (mediaFiles.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "No media files provided." },
//         { status: 400 }
//       );
//     }

//     // Use Promise.all to upload all media files in parallel
//     const mediaUploadPromises = mediaFiles.map(async (file) => {
//       const mediaBuffer = Buffer.from(await file.arrayBuffer());

//       const uploadedMedia = await new Promise<{ secure_url: string }>(
//         (resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream(
//               {
//                 upload_preset: "talent",
//                 folder: "talent_media",
//                 resource_type: "auto",
//               },
//               (error, result) => {
//                 if (error || !result) return reject(error || "Upload failed");
//                 resolve(result);
//               }
//             )
//             .end(mediaBuffer);
//         }
//       );

//       return uploadedMedia.secure_url;
//     });

//     const mediaUrls = await Promise.all(mediaUploadPromises);

//     return NextResponse.json(
//       {
//         success: true,
//         studentPhoto: uploadedPhoto.secure_url,
//         media: mediaUrls,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Cloudinary upload error:", error);
//     return NextResponse.json(
//       { success: false, error: "Cloudinary upload failed" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Handle profile photo
    const studentPhotoFile = formData.get("studentPhoto") as File | null;
    if (!studentPhotoFile) {
      return NextResponse.json(
        { success: false, message: "No student photo provided." },
        { status: 400 }
      );
    }

    const studentBuffer = Buffer.from(await studentPhotoFile.arrayBuffer());

    const uploadedPhoto = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            upload_preset: "talent",
            folder: "student_photos",
            resource_type: "auto",
          },
          (error, result) => {
            if (error || !result) return reject(error || "Upload failed");
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        )
        .end(studentBuffer);
    });

    // Handle talent media
    const mediaFiles = formData.getAll("talentMedia") as File[];

    if (mediaFiles.length === 0) {
      return NextResponse.json(
        { success: false, message: "No media files provided." },
        { status: 400 }
      );
    }

    // Use Promise.all to upload all media files in parallel
    const mediaUploadPromises = mediaFiles.map(async (file) => {
      const mediaBuffer = Buffer.from(await file.arrayBuffer());

      const uploadedMedia = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              upload_preset: "talent",
              folder: "talent_media",
              resource_type: "auto",
            },
            (error, result) => {
              if (error || !result) return reject(error || "Upload failed");
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            }
          )
          .end(mediaBuffer);
      });

      return uploadedMedia;
    });

    const mediaUrls = await Promise.all(mediaUploadPromises);

    return NextResponse.json(
      {
        success: true,
        studentPhoto: uploadedPhoto,
        media: mediaUrls,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { success: false, error: "Cloudinary upload failed" },
      { status: 500 }
    );
  }
}
