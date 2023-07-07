import { Request, Response } from 'express';

import { modelUser } from '../models/Account/user';

/**
 *
 * @param {Request} req - Must contain `userID` in body
 * @param {Response} res - Response Object
 *
 * @return {Response} - Response Object with an Error or Success
 */
export const createNewUser = (req: Request, res: Response) => {
  if (!req.body.userID)
    return res.status(400).json({ message: 'Missing userID' });

  const userIDRegex = /^user_[A-z0-9]+/;
  if (!userIDRegex.test(req.body.userID))
    return res.status(400).json({ message: 'Invalid userID' });

  modelUser
    .create(req.body)
    .then(() => res.status(200).json({ message: 'user added successfully' }))
    .catch((err) => {
      err.code === 11000 // error code 11000 : duplicate entry
        ? res
            .status(400)
            .json({ message: 'User already exists', error: err.message })
        : res
            .status(400)
            .json({ message: 'Failed to add user', error: err.message });
    });
};

/**
 * Retrives all Users
 *
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 *
 * @return {Response} Response Object with an Error or All Users
 */
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await modelUser.find().select('-_id -__v');

  return !users
    ? res.status(500).json({ error: 'Internal server error' })
    : res.status(200).json(users);
};
