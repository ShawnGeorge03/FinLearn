import { Types } from 'mongoose';

/*
Types needed for Learning models
*/
export interface Article {
  name: String;
  slug: String;
  createdAt: Date;
  updatedAt: Date;
  image?: String;
  author: String;
  contentType: String;
  articleText: String;
}

export interface Video {
  name: String;
  slug: String;
  createdAt: Date;
  updatedAt: Date;
  videoId: String;
  author: String;
  description?: String;
  contentType: String;
}

export interface Unit {
  name: String;
  slug: String;
  createdAt: Date;
  updatedAt: Date;
  content: [Types.ObjectId];
  model_type: String;
}

export interface Course {
  name: String;
  slug: String;
  icon: String;
  units: [Types.ObjectId];
}

export interface CourseProgress {
  courseID: Types.ObjectId;
  progress: Number;
}

export interface UnitProgress {
  unitID: Types.ObjectId;
  progress: Number;
}

export interface ArticleProgress {
  articleID: Types.ObjectId;
  progressPercent: Number;
}

export interface VideoProgress {
  videoID: Types.ObjectId;
  progressPercent: Number;
}

export interface LearningProgress {
  userID: Types.ObjectId;
  courses: [CourseProgress];
  units: [UnitProgress];
  videos: [VideoProgress];
  articles: [ArticleProgress];
}
