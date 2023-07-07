import { Schema, model } from 'mongoose';

import { LearningProgress } from '../../types/learning';

const ProgressSchema = new Schema<LearningProgress>({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
    unique: true,
  },
  courses: [
    {
      courseID: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
      progress: Number, // Should be number of contents completed
    },
  ],
  units: [
    {
      unitID: {
        type: Schema.Types.ObjectId,
        ref: 'Unit',
      },
      progress: Number, // Should be number of contents completed
    },
  ],
  videos: [
    {
      videoID: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
      progressPercent: Number,
    },
  ],
  articles: [
    {
      articleID: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
      },
      progressPercent: Number,
    },
  ],
});

export const modelProgress = model<LearningProgress>(
  'LearningProgress',
  ProgressSchema,
);
