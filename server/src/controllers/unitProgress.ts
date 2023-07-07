import { Request, Response } from 'express';
import { modelUser } from '../models/Account/user';
import { modelProgress } from '../models/Learning/progress';

/**
 * Retrieves progress of all the units of a user
 *
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 *
 * @return {Response} - Response Object with an Error or user Progress
 */
export const getUnitProgress = async (req: Request, res: Response) => {
  // Checks if userID is part of the query
  if (!req.query.userID)
    return res.status(400).json({ message: 'Missing userID' });

  const userIDRegex = /^user_[A-z0-9]+/;
  if (!userIDRegex.test(req.query.userID as string))
    return res.status(400).json({ message: 'Invalid userID' });

  const user = await modelUser.findOne({
    userID: req.query.userID,
  });

  if (!user)
    return res.status(400).json({
      message: 'User not found with the given userID',
    });

  const progress = await modelProgress
    .findOne({ userID: user._id })
    .populate({
      path: 'units',
      populate: {
        path: 'unitID',
        model: 'Unit',
      },
    })
    .select('units -_id');

  if (!progress) return res.status(404).json({ message: 'Progress not found' });

  const unitProgress = progress.units;

  return unitProgress
    ? res.status(200).json(unitProgress)
    : res.status(404).json({ message: 'Unit progress not found' });
};
