"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function StudentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        if (response.data.success) {
          setStudent(response.data.data);
        } else {
          setStudent(null);
        }
      } catch (error) {
        console.error("Error fetching student", error);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <p className="text-blue-700">Loading...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <p className="text-blue-700">Student not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-block mb-6">
        <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="flex flex-col items-center mb-8">
        <div className="h-48 w-48 rounded-full overflow-hidden flex justify-center items-center border-4 border-blue-200 mb-4">
          <Image
            src={student.studentPhoto.secure_url || "/placeholder.svg"}
            alt={student.name}
            width={192}
            height={192}
            className="object-cover cursor-pointer"
            onClick={() => setOpen(true)}
          />

          {/* Full Screen Modal */}
          {open && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <div className="relative w-96 h-96">
                <img
                  src={student.studentPhoto.secure_url || "/placeholder.svg"}
                  alt="Full Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-blue-800">{student.name}</h1>
        <p className="text-xl text-blue-600 mt-1">{student.enrollmentNo}</p>
      </div>

      <Card className="border-blue-100 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">
                Student Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-blue-500">Department</p>
                  <p className=" text-blue-800">{student.department}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500">Batch</p>
                  <p className=" text-blue-800">{student.batch}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500">Category</p>
                  <p className=" text-blue-800">{student.category}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500">Contact Number</p>
                  <p className=" text-blue-800">{student.contactNumber}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">
                Social Media Links
              </h2>
              <div className="space-y-3">
                {student.githubLink && (
                  <div>
                    <p className="text-sm text-blue-500">Github</p>
                    <Link href={student.githubLink} target="_blank">
                      <p className="text-blue-800">{student.githubLink}</p>
                    </Link>
                  </div>
                )}
                {student.linkedinLink && (
                  <div>
                    <p className="text-sm text-blue-500">LinkedIn</p>
                    <Link href={student.linkedinLink} target="_blank">
                      <p className="text-blue-800">{student.linkedinLink}</p>
                    </Link>
                  </div>
                )}
                {student.instagramLink && (
                  <div>
                    <p className="text-sm text-blue-500">Instagram</p>
                    <Link href={student.instagramLink} target="_blank">
                      <p className="text-blue-800">{student.instagramLink}</p>
                    </Link>
                  </div>
                )}
                {student.youtubeLink && (
                  <div>
                    <p className="text-sm text-blue-500">Youtube</p>
                    <Link href={student.youtubeLink} target="_blank">
                      <p className="text-blue-800">{student.youtubeLink}</p>
                    </Link>
                  </div>
                )}
                {student.facebookLink && (
                  <div>
                    <p className="text-sm text-blue-500">Facebook</p>
                    <Link href={student.facebookLink} target="_blank">
                      <p className="text-blue-800">{student.facebookLink}</p>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <hr className="md:col-span-2 border-t border-blue-100" />
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-blue-700 mb-1">
                Title
              </h2>
              <p className="text-blue-800 leading-relaxed">
                {student.postTitle}
              </p>
              <h2 className="text-xl font-semibold text-blue-700 mb-1 mt-6">
                Description
              </h2>
              <p className="text-blue-800 leading-relaxed">
                {student.description}
              </p>
              {student.talentMedia && student.talentMedia.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-blue-700 mb-5">
                    Talent Media
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {student.talentMedia.map(
                      (
                        { secure_url }: { secure_url: string },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="border border-blue-100 rounded-lg overflow-hidden shadow"
                        >
                          {secure_url.endsWith(".mp4") ? (
                            <video
                              controls
                              className="w-full h-64 object-cover bg-black"
                              preload="metadata"
                            >
                              <source src={secure_url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img
                              src={`${secure_url}?v=${index}`}
                              alt={`talent-media-${index}`}
                              className="w-full h-64 object-cover"
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
