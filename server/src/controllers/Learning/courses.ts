import { Request, Response } from 'express';

import modelCourse from '../../models/Learning/course';

import { Course } from '../../types/learning';

import { createError } from '../../utils/error';

/**
 * Retrieves all Courses
 *
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 *
 * @return {Promise} Response Object with an Error or All Courses
 */
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await modelCourse.find<Course[]>().select('-units');

    return !courses
      ? res
          .status(404)
          .json(
            createError('CoursesDoesNotExist', 'Failed to retrieve Courses'),
          )
      : res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json(createError('InternalServerError', 'Failed to retrieve Courses'));
  }
};
