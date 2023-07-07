import { Request, Response } from 'express';

import modelArticle from '../models/Learning/article';
import { Article } from '../types/learning';

/**
 * Retrieves an Article with a matching `slug`
 *
 * @param {Request} req - Must contain `articleSlug` in query
 * @param {Response} res - Response Object
 *
 * @return {Response} Response Object with an Error or Article
 */
export const getArticleBySlug = async (req: Request, res: Response) => {
  if (!req.query.articleSlug)
    return res.status(400).json({
      message: 'Please provide article slug',
    });

  const article = await modelArticle.findOne<Article>({
    slug: req.query.articleSlug,
  });

  return !article
    ? res.status(404).send({ message: 'Not Found: Article does not exist.' })
    : res.status(200).json({ article: article });
};
