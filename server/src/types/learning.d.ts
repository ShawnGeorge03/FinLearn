import { Document, Types } from 'mongoose';

/*
Types needed for Learning models
*/
export interface Article extends Document {
  _id: Types.ObjectId;
  name: String;
  slug: String;
  createdAt: Date;
  updatedAt: Date;
  image?: String;
  author: String;
  contentType: 'article';
  articleText: String;
  isFavourited: Boolean;
}

export interface FavouriteArticles {
  article: Article;
  courseSlug: String;
}

export interface Video extends Document {
  _id: Types.ObjectId;
  name: String;
  slug: String;
  createdAt: Date;
  updatedAt: Date;
  videoId: String;
  author: String;
  description?: String;
  contentType: 'video';
  isFavourited: Boolean;
}

export interface Unit {
  _id: Types.ObjectId;
  name: String;
  slug: String;
  createdAt: Date;
  updatedAt: Date;
  content: [Types.ObjectId];
  model_type: String;
}

export interface Course {
  _id: Types.ObjectId;
  name: String;
  slug: String;
  icon: String;
  units: [Types.ObjectId];
}

export interface CourseProgress {
  courseID: Types.ObjectId;
  progress: number;
}

export interface UnitProgress {
  unitID: Types.ObjectId;
  progress: number;
}

export interface ArticleProgress {
  articleID: Types.ObjectId;
  progressPercent: number;
  isComplete: Boolean;
}

export interface VideoProgress {
  videoID: Types.ObjectId;
  progressPercent: number;
  isComplete: Boolean;
}

export interface LearningProgress {
  userID: Types.ObjectId;
  courses: [CourseProgress];
  units: [UnitProgress];
  videos: [VideoProgress];
  articles: [ArticleProgress];
}
