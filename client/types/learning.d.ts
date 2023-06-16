/*
Types needed for Learning models
*/

export interface Course {
  name: string;
  slug: string;
  icon: string;
}

export interface AllCourseProps {
  name: string;
  slug: string;
  icon: string;
}

export interface Unit {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  content: Array<Article | Video>;
}

export type Article = {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  author: string;
  contentType: string;
  articleText: string;
};

export interface Video {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  videoId: string;
  author: string;
  description?: string;
}
