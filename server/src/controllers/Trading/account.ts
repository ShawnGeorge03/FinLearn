import { Request, Response } from 'express';

import modelUser from '../../models/Account/user';

import modelAccount from '../../models/Trading/account';

import { createError } from '../../utils/error';
import { validateUserID } from '../../utils/validate';

/**
 * Retrieves a Trading Account for a user
 *
 * @param {Request} req - Must contain `userID` in query
 * @param {Response} res - Response Object
 *
 * @return {Promise} Response Object with an Error or Account Information
 */
export const getTradingAccountInfo = async (req: Request, res: Response) => {
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

    const tradingAccount = await modelAccount
      .findOne({ userID: user.id })
      .select('cash value');

    if (!tradingAccount)
      return res
        .status(404)
        .json(
          createError(
            'UserDoesNotExist',
            `User with ID: ${userID} does not have a Trading Account`,
          ),
        );

    res.status(200).json(tradingAccount);
  } catch (error) {
    res
      .status(500)
      .json(
        createError(
          'InternalServerError',
          'Failed to retrieve User Trading Account',
        ),
      );
  }
};
