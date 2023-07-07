import { Request, Response } from 'express';
import { connection } from 'mongoose';

/**
 * Retrives the Connection Status of MongoDB Atlas
 *
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 *
 * @return {Response} - Response Object with an Error or Article
 */
export const getStatus = (req: Request, res: Response) => {
  const { readyState } = connection;
  const validStates = [1, 2];
  return validStates.includes(readyState)
    ? res.status(200).json({ message: 'UP' })
    : res.status(500).json({ message: 'DOWN' });
};
