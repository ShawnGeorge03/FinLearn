import { Request, Response } from 'express';

import modelUser from '../../models/Account/user';
import modelProgress from '../../models/Learning/progress';

import { createError } from '../../utils/error';
import { validateUserID } from '../../utils/validate';

/**
 * Endpoint to get a user's learning progress from their userId
 *
 * @param {Request} req - Must contain `userID` in query
 * @param {Response} res - Response Object
 *
 * @return {Promise} LearningProgress with courses and units populated
 */
export const getLearningProgress = async (req: Request, res: Response) => {
  try {
    const userID = req.query.userID as string;
    const { status, error } = validateUserID(userID);

    if (!status) return res.status(400).json(error);

    const user = await modelUser.findOne({ userID });

    if (!user)
      return res
        .status(404)
        .json(
          createError(
            'UserDoesNotExist',
            `User with ID: ${userID} does not exist`,
          ),
        );

    const learningProgress = await modelProgress
      .findOne({
        userID: user._id,
      })
      .populate({
        path: 'courses',
        populate: {
          path: 'courseID',
          model: 'Course',
        },
      })
      .populate({
        path: 'units',
        populate: {
          path: 'unitID',
          model: 'Unit',
        },
      })
      .select('-userID -articles -videos');

    if (!learningProgress)
      return res
        .status(404)
        .json(
          createError(
            'UserProgressDoesNotExist',
            `No Learning Progress found for User with ID: ${userID}`,
          ),
        );

    res.status(200).json(learningProgress);
  } catch (error) {
    res
      .status(500)
      .json(
        createError('InternalServerError', 'Failed to retrieve User Progress'),
      );
  }
};
