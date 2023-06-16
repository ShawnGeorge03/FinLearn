import { Request, Response } from 'express';

import modelVideo from '../models/Learning/video';

import { Video } from '../types/learning';

export const getContentVideo = async (req: Request, res: Response) => {
  // Checks if the field `videoSlug` is included in the query
  if (!req.query.hasOwnProperty('videoSlug'))
    return res
      .send(400)
      .json({ message: 'Invalid Request: Missing field "videoSlug".' });

  const videoSlug = req.query.videoSlug as string;

  // Check if slug parameter is missing
  if (!videoSlug)
    return res
      .status(400)
      .send({ message: 'Invalid Request: Missing parameter "videoSlug".' });

  const video = await modelVideo.findOne<Video>({ slug: req.query.videoSlug });

  // Check if course exists
  if (!video)
    return res
      .status(404)
      .send({ message: 'Not Found: Video does not exist.' });
  return res.status(200).json({
    video: video,
  });
};

export default getContentVideo;
