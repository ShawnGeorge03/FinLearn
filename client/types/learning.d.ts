/*
Types needed for Learning models
*/

export type Course = {
  name: string;
  slug: string;
  icon: string;
};

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
  isFavourited: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string;
  author: string;
  contentType: string;
  articleText: string;
};

export interface Video {
  name: string;
  slug: string;
  isFavourited: boolean;
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
