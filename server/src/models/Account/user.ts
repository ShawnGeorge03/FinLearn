import { Schema, model } from 'mongoose';

import { User } from '../../types/user';

const UserSchema = new Schema<User>({
  userID: {
    type: String,
    required: true,
    immutable: true,
    unique: true,
  },
});

export const modelUser = model<User>('User', UserSchema);
