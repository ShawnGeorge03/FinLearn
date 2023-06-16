import { Article } from '../types/learning';
import modelArticle from '../models/Learning/article';
import { Request, Response } from 'express';

/* Controller method that uses the model modelCourse to retrieve all modelCourse objects */
// Take in course name, unit name, Article ID/Name then find the article with the given ID
const getArticleBySlug = async (req: Request, res: Response) => {
  if (!req.query.articleSlug) {
    return res.status(400).json({
      message: 'Please provide article slug',
    });
  }
  const article = await modelArticle.findOne<Article>({
    slug: req.query.articleSlug,
  });
  // Check if course exists
  if (!article)
    return res
      .status(404)
      .send({ message: 'Not Found: Article does not exist.' });
  return res.status(200).json({
    article: article,
  });
};

export default getArticleBySlug;
