import { Request, Response } from 'express';

import { modelUser } from '../models/Account/user';

export const createNewUser = (req: Request, res: Response) => {
  modelUser
    .create(req.body)
    .then((data) => res.json({ message: 'user added successfully', data }))
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

export const getAllUsers = (req: Request, res: Response) => {
  modelUser
    .find()
    .select('-_id -__v')
    .then((data) => res.status(200).json(data))
    .catch((error: Error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    });
};
