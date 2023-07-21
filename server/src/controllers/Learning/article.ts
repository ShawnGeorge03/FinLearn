import { Request, Response } from 'express';

import modelArticle from '../../models/Learning/article';

import { Article } from '../../types/learning';

import { createError } from '../../utils/error';
import { validateInput } from '../../utils/validate';

/**
 * Retrieves an Article with a matching `slug`
 *
 * @param {Request} req - Must contain `articleSlug` in query
 * @param {Response} res - Response Object
 *
 * @return {Promise} Response Object with an Error or Article
 */
export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const articleSlug = req.query.articleSlug as string;
    const { status, error } = validateInput('slug', articleSlug, 'articleSlug');

    if (!status) return res.status(400).json(error);

    const article = await modelArticle.findOne<Article>({
      slug: articleSlug,
    });

    if (article) return res.status(200).json(article);

    res
      .status(404)
      .json(
        createError(
          'ArticleDoesNotExist',
          `Failed to find Article with slug: ${articleSlug}`,
        ),
      );
  } catch (error) {
    res
      .status(500)
      .json(createError('InternalServerError', 'Failed to retrieve Article'));
  }
};
