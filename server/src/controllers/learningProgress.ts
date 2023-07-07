import { Request, Response } from 'express';
import { modelUser } from '../models/Account/user';
import { modelProgress } from '../models/Learning/progress';

/**
 * Endpoint to get a user's learning progress from their userId
 *
 *  @param {Request} req - Request Object with user's clerk userId as querryParam
 *  @param {Response} res - Response Object
 *
 * @return {Response} LearningProgress with courses and units populated
 */
export const getLearningProgress = async (req: Request, res: Response) => {
  if (!req.query.userID)
    return res.status(400).json({
      message: 'Please provide userID',
    });

  const userIDRegex = /^user_[A-z0-9]+/;
  if (!userIDRegex.test(req.query.userID.toString()))
    return res.status(400).json({ message: 'Invalid userID' });

  const user = await modelUser.findOne({
    userID: req.query.userID,
  });
  if (!user)
    return res.status(400).json({
      message: 'User not found with the given userID',
    });

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
    });

  !learningProgress ? res.status(404).send({}) : res.send(learningProgress);
};
