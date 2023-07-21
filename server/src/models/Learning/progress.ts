import { Schema, model } from 'mongoose';

import { LearningProgress } from '../../types/learning';

const ProgressSchema = new Schema<LearningProgress>(
  {
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
        isComplete: {
          type: Boolean,
          defult: false,
        },
      },
    ],
    articles: [
      {
        articleID: {
          type: Schema.Types.ObjectId,
          ref: 'Article',
        },
        progressPercent: Number,
        isComplete: {
          type: Boolean,
          defult: false,
        },
      },
    ],
  },
  {
    toJSON: {
      // This function returns a JSON without id, __v
      transform: (doc, ret) => {
        delete ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const modelProgress = model<LearningProgress>(
  'LearningProgress',
  ProgressSchema,
);
export default modelProgress;
