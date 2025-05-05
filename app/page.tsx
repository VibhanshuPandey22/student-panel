// "use client";
// import { Heart } from "lucide-react";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import axios from "axios";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";

// export default function Dashboard() {
//   const [students, setStudents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   // useEffect(() => {
//   //   console.log(students);
//   // }, [students]);

//   function HeartToggle() {
//     const [liked, setLiked] = useState(false);

//     return (
//       <button
//         onClick={(e) => {
//           e.preventDefault(); // Prevent navigating when clicked
//           setLiked(!liked);
//         }}
//         className="transition-colors"
//       >
//         <Heart
//           className={`h-5 w-5 ${
//             liked ? "text-red-500 fill-red-500" : "text-gray-400"
//           }`}
//         />
//       </button>
//     );
//   }

//   async function fetchStudents() {
//     try {
//       const response = await axios.get("http://localhost:3000/api/posts");
//       if (response.data.success) {
//         setStudents(response.data.data);
//       } else {
//         setStudents([]);
//       }
//     } catch (error) {
//       console.error("Error fetching posts", error);
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-semibold text-blue-700">
//           Student Dashboard
//         </h1>
//       </div>

//       {students.length === 0 ? (
//         <div>No data present</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {students.map((student) => (
//             <Card
//               key={student._id}
//               className="relative overflow-hidden border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
//             >
//               <Link href={`/students/${student._id}`}>
//                 <CardContent className="p-6">
//                   <div className="flex items-center space-x-4">
//                     <div className="h-16 w-16 rounded-full flex justify-center items-center overflow-hidden border-2 border-blue-200">
//                       <Image
//                         src={
//                           student.studentPhoto.secure_url || "/placeholder.svg"
//                         }
//                         alt={student.name}
//                         width={100}
//                         height={100}
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-lg font-medium text-blue-800 truncate">
//                         {student.name}
//                       </h3>
//                       <p className="text-sm text-blue-600">
//                         {student.enrollmentNumber}
//                       </p>
//                       <p className="text-sm text-blue-500">
//                         {student.department}
//                       </p>
//                       <p className="text-sm text-blue-400">
//                         Batch: {student.batch}
//                       </p>
//                       <p className="text-sm text-blue-400">
//                         {student.category}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Link>

//               <CardFooter className="p-4 pt-0 flex justify-end">
//                 <HeartToggle />
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Pusher from "pusher-js";

export default function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<string[]>([]); // Track liked posts in state

  useEffect(() => {
    fetchStudents();

    // Initialize Pusher and subscribe to the student-channel
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("student-channel");

    // Bind to the 'student-liked' event and update the like count for the correct student
    channel.bind("student-liked", (data: { id: string; likes: number }) => {
      setStudents((prev) =>
        prev.map((student) =>
          student._id === data.id ? { ...student, likes: data.likes } : student
        )
      );
    });

    // Cleanup the Pusher subscription on component unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // Load liked posts from localStorage on mount
  useEffect(() => {
    const savedLikedPosts = JSON.parse(
      localStorage.getItem("likedPosts") || "[]"
    );
    setLikedPosts(savedLikedPosts);
  }, []);

  // Function to handle the like button click
  async function handleLike(postId: string) {
    const hasLiked = likedPosts.includes(postId);

    // Send a request to the backend with the like status
    const response = await fetch(`/api/like/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hasLiked, // true if the post has been liked before, false otherwise
      }),
    });

    const data = await response.json();

    if (data.success) {
      let updatedLikedPosts: string[];

      if (hasLiked) {
        // If the post was already liked, remove it from likedPosts state and localStorage
        updatedLikedPosts = likedPosts.filter((id: string) => id !== postId);
      } else {
        // If the post was not liked, add it to likedPosts state and localStorage
        updatedLikedPosts = [...likedPosts, postId];
      }

      setLikedPosts(updatedLikedPosts); // Update state
      localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts)); // Update localStorage
    }
  }

  async function fetchStudents() {
    try {
      const response = await axios.get("/api/posts");
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-blue-700">
          Student Dashboard
        </h1>
      </div>

      {students.length === 0 ? (
        <div>No data present</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card
              key={student._id}
              className="relative overflow-hidden border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
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
                        {student.category}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Link>

              <CardFooter className="p-4 pt-0 flex justify-end">
                <button
                  onClick={() => handleLike(student._id)}
                  className={`flex items-center space-x-2 `}
                >
                  <Heart
                    id={`like-button-${student._id}`}
                    className={`${
                      likedPosts.includes(student._id)
                        ? "fill-red-600 text-red-600"
                        : "text-gray-600"
                    } h-5 w-5 transition-all duration-200 `}
                  />
                  <span>{student.likes}</span>
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
