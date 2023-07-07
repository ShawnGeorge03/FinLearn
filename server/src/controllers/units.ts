import { Request, Response } from 'express';
import { Types } from 'mongoose';

import modelCourse from '../models/Learning/course';
import modelArticle from '../models/Learning/article';
import modelVideo from '../models/Learning/video';
import modelUnit from '../models/Learning/unit';

import { Course, Unit, Article, Video } from '../types/learning';

type PopulatedUnit = {
  name: String;
  slug: String;
  contents: Array<Article | Video | null>;
};

/*Retrieves an Article or Video based on the given content ID*/
const populateContent = async (
  contentId: Types.ObjectId,
): Promise<Article | Video | null> => {
  const requiredFields = 'name slug contentType -_id';
  const video: Video | null = await modelVideo
    .findById(contentId)
    .select(requiredFields);
  const article: Article | null = await modelArticle
    .findById(contentId)
    .select(requiredFields);
  return video ? video : article;
};

/*Retrieves a course with the specified slug, populates its units with contents (Articles or Videos),
and returns the course information*/
export const getCourse = async (req: Request, res: Response) => {
  // Checks if the field `courseSlug` is included in the query
  if (!req.query.hasOwnProperty('courseSlug'))
    return res
      .send(400)
      .json({ message: 'Invalid Request: Missing field "courseSlug".' });

  const courseSlug = req.query.courseSlug as string;

  // Check if slug parameter is missing
  if (!courseSlug)
    return res
      .status(400)
      .send({ message: 'Invalid Request: Missing parameter "courseSlug".' });

  // Verify slug using Regex (lowercase letters followed by a hyphen)
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(courseSlug))
    return res
      .status(400)
      .send({ message: 'Invalid Request: Invalid "courseSlug".' });

  // Find course with the specified slug
  const course = await modelCourse.findOne<Course>({ slug: courseSlug });

  // Check if course exists
  if (!course)
    return res
      .status(404)
      .send({ message: 'Not Found: Course does not exist.' });

  const unitID: Array<Types.ObjectId> = course.units;
  let units: Array<PopulatedUnit> = [];

  // Populate each unit with its contents
  for (let i = 0; i < unitID.length; i++) {
    const unit: Unit | null = await modelUnit.findById(unitID[i]);
    if (unit)
      units.push({
        name: unit.name,
        slug: unit.slug,
        contents: await Promise.all(
          unit.content.map(async (id) => await populateContent(id)),
        ),
      });
  }

  // Return course information
  return res.status(200).json({
    name: course?.name,
    units: units,
  });
};
