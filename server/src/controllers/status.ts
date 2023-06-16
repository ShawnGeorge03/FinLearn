import { Request, Response } from 'express';
import { connection } from 'mongoose';

export const getStatus = (req: Request, res: Response) => {
  const { readyState } = connection;
  const validStates = [1, 2];
  return validStates.includes(readyState)
    ? res.status(200).json({ message: 'UP' })
    : res.status(500).json({ message: 'DOWN' });
};
