"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  // useEffect(() => {
  //   console.log(students);
  // }, [students]);

  async function fetchStudents() {
    try {
      const response = await axios.get("http://localhost:3000/api/posts");
      if (response.data.success) {
        setStudents(response.data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching posts", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) {
    e.stopPropagation();
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/posts/${id}`
        );
        if (response.data.success) {
          // Option 1: refetch students
          await fetchStudents();
          // Option 2: Update state without refetching
          // setStudents(prev => prev.filter(student => student._id !== id))
        } else {
          alert(response.data.message || "Failed to delete student.");
        }
      } catch (error: any) {
        console.error("Error deleting student:", error);
        alert(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-blue-700">
          Student Dashboard
        </h1>
        <Link href="/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create
          </Button>
        </Link>
      </div>

      {students.length === 0 ? (
        <div>No data present</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card
              key={student._id}
              className="overflow-hidden border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/students/${student._id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full flex justify-center items-center overflow-hidden border-2 border-blue-200">
                      <Image
                        src={
                          student.studentPhoto.secure_url || "/placeholder.svg"
                        }
                        alt={student.name}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-blue-800 truncate">
                        {student.name}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {student.enrollmentNumber}
                      </p>
                      <p className="text-sm text-blue-500">
                        {student.department}
                      </p>
                      <p className="text-sm text-blue-400">
                        Batch: {student.batch}
                      </p>
                      <p className="text-sm text-blue-400">
                        {student.enrollmentNumber}
                      </p>
                      <p className="text-sm text-blue-400">
                        {student.category}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Link>
              <CardFooter className="bg-blue-50 px-6 py-3 flex justify-end space-x-2">
                <Link href={`/edit/${student._id}`}>
                  <Button
                    onClick={(e) => e.stopPropagation()}
                    variant="outline"
                    className="text-blue-600 border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                  >
                    Edit
                  </Button>
                </Link>
                <Button
                  onClick={(e) => handleDelete(e, student._id)}
                  variant="ghost"
                  className="text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
