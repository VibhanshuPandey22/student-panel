// import { Document } from "mongoose";

// export interface IPost extends Document {
//   name: string;
//   enrollmentNo: string;
//   department: string;
//   batch: string;
//   contactNumber?: string;
//   category: string;
//   githubLink?: string;
//   linkedinLink?: string;
//   instagramLink?: string;
//   youtubeLink?: string;
//   facebookLink?: string;
//   postTitle: string;
//   description: string;
//   studentPhoto: string;
//   talentMedia?: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface IPost extends Document {
  name: string;
  enrollmentNo: string;
  department: string;
  batch: string;
  contactNumber?: string;
  category: string;
  githubLink?: string;
  linkedinLink?: string;
  instagramLink?: string;
  youtubeLink?: string;
  facebookLink?: string;
  postTitle: string;
  description: string;
  studentPhoto: {
    public_id: string;
    secure_url: string;
  };
  talentMedia: {
    public_id: string;
    secure_url: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
