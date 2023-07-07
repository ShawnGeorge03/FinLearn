import { Request, Response } from 'express';
import { Course } from '../types/learning';

import modelCourse from '../models/Learning/course';

/**
 * Retrieves all Courses
 *
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 *
 * @return {Response} Response Object with an Error or All Courses
 */
export const getAllCourses = async (req: Request, res: Response) => {
  const courses = await modelCourse.find<Course[]>().select('-_id -__v -units');

  return !courses
    ? res.status(404).json({ message: 'Unable to pull Courses' })
    : res.status(200).json(courses);
};
