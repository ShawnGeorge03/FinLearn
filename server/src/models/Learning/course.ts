import { model, Schema } from 'mongoose';
import { Course } from '../../types/learning';

/*
The course model from our database
*/
const CourseSchema = new Schema<Course>({
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
});

const modelCourse = model<Course>('Course', CourseSchema);
export default modelCourse;
