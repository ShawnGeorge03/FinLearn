import { Request, Response } from 'express';

import { MongoServerError } from 'mongodb';

import { WebhookEvent } from '@clerk/clerk-sdk-node';

import modelUser from '../../models/Account/user';
import { createError } from '../../utils/error';
import { validateUserID } from '../../utils/validate';

/**
 * Add User to Database
 *
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 *
 * @return {Response} - Response Object with an Error or Success
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body as WebhookEvent;

    if (type === 'user.created') {
      const { status, error } = validateUserID(data.id);
      if (!status) return res.status(404).json(error);

      await modelUser.create({ userID: data.id });
      return res.status(201).json({ message: 'User created successfully!' });
    }
    res
      .status(404)
      .json(createError('UnknownEvent', `${type} is unknown to this Endpoint`));
  } catch (error) {
    // error code 11000 : duplicate entry
    if (error instanceof MongoServerError && error.code === 11000)
      return res
        .status(400)
        .json(createError('DuplicateUserID', error.message));

    res
      .status(500)
      .json(createError('InternalServerError', 'Failed to Add New User'));
  }
};
