import { Request, Response } from 'express';
import { Video } from '../types/learning';

import modelVideo from '../models/Learning/video';

/**
 * Retrives a Video with a matching `slug`
 *
 * @param {Request} req - Must contain `videoSlug` in query
 * @param {Response} res - Response Object
 *
 * @return {Response}  Response Object with an Error or Video
 */
export const getVideoBySlug = async (req: Request, res: Response) => {
  // Checks if the field `videoSlug` is included in the query
  if (!req.query.videoSlug)
    return res
      .status(400)
      .json({ message: 'Invalid Request: Missing field "videoSlug".' });

  const video = await modelVideo.findOne<Video>({ slug: req.query.videoSlug });

  return !video
    ? res.status(404).send({ message: 'Not Found: Video does not exist.' })
    : res.status(200).json({ video: video });
};
