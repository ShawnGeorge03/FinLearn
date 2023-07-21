import { Schema, model } from 'mongoose';

import { User } from '../../types/user';

const UserSchema = new Schema<User>(
  {
    userID: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
    },
  },
  {
    toJSON: {
      // This function returns a JSON without id, __v, id
      transform: (doc, ret) => {
        delete ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const modelUser = model<User>('User', UserSchema);
export default modelUser;
