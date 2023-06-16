import { model, Schema } from 'mongoose';
import { Article } from '../../types/learning';

/*
The article model from our database
*/
const ArticleSchema = new Schema<Article>({
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
});

const modelArticle = model<Article>('Article', ArticleSchema);
export default modelArticle;
