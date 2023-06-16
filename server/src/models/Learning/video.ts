import { model, Schema } from 'mongoose';
import { Video } from '../../types/learning';

/*
The video model from our database
*/
const VideoSchema = new Schema<Video>({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  videoId: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  contentType: {
    type: String,
    required: true,
    immutable: true,
    default: 'article',
  },
});

const modelVideo = model<Video>('Video', VideoSchema);
export default modelVideo;
