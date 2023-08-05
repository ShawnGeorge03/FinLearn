import { Request, Response } from 'express';

import modelUser from '../../models/Account/user';
import modelArticle from '../../models/Learning/article';
import modelCourse from '../../models/Learning/course';
import modelProgress from '../../models/Learning/progress';
import modelUnit from '../../models/Learning/unit';
import { Article, Unit } from '../../types/learning';
import { createError } from '../../utils/error';
import { validateInput, validateUserID } from '../../utils/validate';
import { getCourseFromUnit } from './units';

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

/**
 * Retrives the progress of an article with 'articleId' and 'user'
 *
 * @param {Request} req - Must contain `articleId` and 'user' in query
 * @param {Response} res - Response Object
 *
 * @return {Promise}  Response Object with an Error or Article Progress value
 */
export const getArticleProgressBySlug = async (req: Request, res: Response) => {
  const userID = req.query.userID as string;
  const { status, error } = validateUserID(userID);

  if (!status) return res.status(400).json(error);

  const articleSlug = req.query.articleSlug as string;
  const validateSlug = validateInput('slug', articleSlug, 'articleSlug');

  if (!validateSlug.status) return res.status(400).json(validateSlug.error);

  const user = await modelUser.findOne({ userID: req.query.userID });
  if (!user)
    return res
      .status(404)
      .json(
        createError(
          'UserDoesNotExist',
          `User with ID: ${userID} does not exist`,
        ),
      );

  const article = await modelArticle.findOne({ slug: req.query.articleSlug });
  if (!article)
    return res
      .status(404)
      .json(
        createError(
          'ArticleDoesNotExist',
          `Failed to find Article with slug: ${articleSlug}`,
        ),
      );

  const progress = await modelProgress
    .findOne({
      userID: user._id,
    })
    .populate({
      path: 'articles',
      populate: {
        path: 'articleID',
        model: 'Article',
      },
    });

  if (progress == null)
    return res.status(200).json({
      progressPercent: 0,
    });
  const specificArticle = progress.articles.find(
    (entry) => (entry.articleID = article._id),
  );

  if (!specificArticle)
    return res.status(200).json({
      progressPercent: 0,
    });

  return res.status(200).json({
    progressPercent: specificArticle.progressPercent,
  });
};

/**
 * Updates the progress of a Article with 'articleId' and 'user'
 *
 * @param {Request} req - Must contain `articleProgressPercent` `articleSlug` and
 *                        `user` in query
 * @param {Response} res - Response Object
 *
 * @return {Promise}  Response Object with an Error or updated article progress
 */
export const updateArticleProgress = async (req: Request, res: Response) => {
  /* validation */
  const userID = req.body.userID as string;
  const { status, error } = validateUserID(userID, false);
  if (!status) return res.status(400).json(error);

  const articleSlug = req.body.articleSlug as string;
  const validateSlug = validateInput('slug', articleSlug, 'articleSlug');
  if (!validateSlug.status) return res.status(400).json(validateSlug.error);
  if (
    !req.body.articleProgressPercent ||
    isNaN(req.body.articleProgressPercent)
  )
    return res
      .status(400)
      .json(
        createError(
          'MissingBodyParams',
          'The body params requires numeric articleProgressPercent',
        ),
      );

  const progressPercentageCurrent: number = parseFloat(
    req.body.articleProgressPercent.toString(),
  );
  const user = await modelUser.findOne({ userID: req.body.userID });
  if (!user)
    return res
      .status(404)
      .json(
        createError(
          'UserDoesNotExist',
          `User with ID: ${userID} does not exist`,
        ),
      );

  const article = await modelArticle.findOne({ slug: req.body.articleSlug });
  if (!article)
    return res
      .status(404)
      .json(
        createError(
          'ArticleDoesNotExist',
          `Failed to find Article with slug: ${req.body.articleSlug}`,
        ),
      );

  const progress = await modelProgress.findOne({
    userID: user._id,
  });

  /* Find relevant information about parentUnit and parentCourse and sanity checking */
  const parentUnit = await modelUnit.findOne({
    content: { $all: [article._id] },
  });
  if (!parentUnit)
    return res
      .status(404)
      .json(
        createError(
          'ParentUnitNotFound',
          `Failed to find parentUnit of article: ${req.body.articleSlug}`,
        ),
      );
  const parentCourse = await modelCourse.findOne({
    units: { $all: [parentUnit._id] },
  });
  if (!parentCourse)
    return res
      .status(404)
      .json(
        createError(
          'ParentCourseNotFound',
          `Failed to find parentCourse of article: ${req.body.articleSlug}`,
        ),
      );

  if (!progress) {
    /* First content user has watched so inserrt into db */
    const completed = progressPercentageCurrent >= 0 ? 1 : 0;
    // eslint-disable-next-line new-cap
    const newCreation = new modelProgress({
      userID: user._id,
      courses: [
        {
          courseID: parentCourse._id,
          progress: completed,
        },
      ],
      units: [
        {
          unitID: parentUnit._id,
          progress: completed,
        },
      ],
      articles: [
        {
          articleID: article._id,
          progressPercent: progressPercentageCurrent,
          isComplete: progressPercentageCurrent >= 0,
        },
      ],
    });
    await newCreation.save();
    return res.send(newCreation);
  }
  /* User already has a progress elem then update the progres object */
  const indexArticle = progress.articles.findIndex(
    (elem) => elem.articleID.toString() == article._id.toString(),
  );
  const indexUnit = progress.units.findIndex(
    (elem) => elem.unitID.toString() == parentUnit._id.toString(),
  );
  const indexCourse = progress.courses.findIndex(
    (elem) => elem.courseID.toString() == parentCourse._id.toString(),
  );

  /* An article is just complete if its progress percentage increased from 0
   and it was previously incomplete */
  const isJustComplete =
    progressPercentageCurrent >= 0 &&
    ((indexArticle != -1 && !progress.articles[indexArticle].isComplete) ||
      indexArticle == -1);

  const increment = isJustComplete ? 1 : 0;
  // eslint-disable-next-line new-cap
  const updatedObject = new modelProgress({
    _id: progress._id,
    userID: user._id,
    courses:
      /* If parent course is not already added add it otherwise update it */
      indexCourse !== -1
        ? progress.courses.map((elem) => {
            return elem.courseID.toString() != parentCourse._id.toString()
              ? elem
              : { ...elem, progress: elem.progress + increment };
          })
        : [
            ...progress.courses,
            {
              courseID: parentCourse._id,
              progress: increment,
            },
          ],
    units:
      /* If parent unit is not already added add it otherwise update it */
      indexUnit !== -1
        ? progress.units.map((elem) => {
            return elem.unitID.toString() != parentUnit._id.toString()
              ? elem
              : { ...elem, progress: elem.progress + increment };
          })
        : [
            ...progress.units,
            {
              unitID: parentUnit._id,
              progress: increment,
            },
          ],
    articles:
      /* If article is not already added add it otherwise update it */
      indexArticle !== -1
        ? progress.articles.map((elem) => {
            return elem.articleID.toString() == article._id.toString()
              ? {
                  ...elem,
                  progressPercent: progressPercentageCurrent,
                  isComplete: elem.isComplete
                    ? elem.isComplete
                    : isJustComplete,
                }
              : elem;
          })
        : [
            ...progress.articles,
            {
              articleID: article._id,
              progressPercent: progressPercentageCurrent,
              isComplete: isJustComplete,
            },
          ],
  });
  updatedObject.isNew = false;
  await updatedObject?.save();
  return res.send(updatedObject);
};

export const getUnitFromArticle = async (article: Article) => {
  try {
    const unit = await modelUnit.findOne<Unit>({ content: article._id });
    return unit;
  } catch (error) {
    console.error('Cannot retrieve unit from article!');
  }
};

export const getFavouriteArticles = async (req: Request, res: Response) => {
  try {
    const favouriteArticles = await modelArticle.find<Article>({
      isFavourited: true,
    });

    const data: any = [];
    if (favouriteArticles) {
      await Promise.all(
        favouriteArticles.map(async (itemArticle: Article) => {
          try {
            const unit = await getUnitFromArticle(itemArticle);
            if (unit) {
              const course = await getCourseFromUnit(unit);
              if (course)
                data.push({
                  article: itemArticle,
                  courseSlug: course?.slug,
                });
            }
          } catch (error) {
            res
              .status(500)
              .json(
                createError(
                  'InternalServerError',
                  'Failed to retrieve relevant details from each article!',
                ),
              );
          }
        }),
      );
      return res.status(200).json(data);
    }
    res
      .status(500)
      .json(
        createError(
          'InternalServerError',
          'Failed to retrieve relevant details from each article!',
        ),
      );
  } catch (error) {
    res
      .status(500)
      .json(
        createError(
          'InternalServerError',
          'Failed to retrieve Favourite Articles',
        ),
      );
  }
};

export const toggleFavoriteArticle = async (req: Request, res: Response) => {
  const article: Article | null = await modelArticle.findOne<Article>({
    slug: req.body.slug,
  });

  if (!article)
    return res.status(400).json({ error: 'Missing slug in request body' });

  try {
    const updatedArticle = await modelArticle.findOneAndUpdate(
      { slug: article.slug },
      { isFavourited: !article.isFavourited },
      { new: true },
    );
    res.status(200).send(updatedArticle);
  } catch (error) {
    res.status(500).json(createError('InternalServerError', 'Toggle Fail'));
  }
};
