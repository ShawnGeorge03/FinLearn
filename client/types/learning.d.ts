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
  slug: string;
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
export interface UnitWithProgress {
  unit: Unit;
  progress: number;
}

export interface LearningProgressResponse {
  userId: string;
  courses: [
    {
      courseID: Course;
      progress: number;
    },
  ];
  units: [
    {
      unitID: Unit;
      progress: number;
    },
  ];
  videos: [
    {
      videoID: string;
      progressPercent: number;
    },
  ];
  article: [
    {
      articleID: string;
      progressPercent: number;
    },
  ];
}
