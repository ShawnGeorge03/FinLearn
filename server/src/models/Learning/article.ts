import { Schema, model } from 'mongoose';

import { Article } from '../../types/learning';

/*
  The Article Model will be used to store individual articles.
*/
const ArticleSchema = new Schema<Article>(
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
    image: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      immutable: true,
      default: 'article',
    },
    articleText: {
      type: String,
      required: true,
    },
    isFavourited: {
      type: Boolean,
      default: false,
    },
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

const modelArticle = model<Article>('Article', ArticleSchema);
export default modelArticle;
