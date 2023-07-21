import { model, Schema } from 'mongoose';

import { Course } from '../../types/learning';

/*
The course model from our database
*/
const CourseSchema = new Schema<Course>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      required: true,
    },
    units: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Unit',
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

const modelCourse = model<Course>('Course', CourseSchema);
export default modelCourse;
