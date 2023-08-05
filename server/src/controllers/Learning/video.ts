import { Request, Response } from 'express';
import modelUser from '../../models/Account/user';
import modelCourse from '../../models/Learning/course';
import modelProgress from '../../models/Learning/progress';
import modelUnit from '../../models/Learning/unit';
import modelVideo from '../../models/Learning/video';
import { Unit, Video } from '../../types/learning';
import { createError } from '../../utils/error';
import { validateInput, validateUserID } from '../../utils/validate';
import { getCourseFromUnit } from './units';

/**
 * Retrieves a Video with a matching `videoSlug`
 *
 * @param {Request} req - Must contain `videoSlug` in query
 * @param {Response} res - Response Object
 *
 * @return {Promise} Response Object with an Error or Video
 */
export const getVideoBySlug = async (req: Request, res: Response) => {
  try {
    const videoSlug = req.query.videoSlug as string;
    const { status, error } = validateInput('slug', videoSlug, 'videoSlug');

    if (!status) return res.status(400).json(error);

    const video = await modelVideo
      .findOne<Video>({
        slug: videoSlug,
      })
      .select('-slug -contentType');

    if (video) return res.status(200).json(video);

    res
      .status(404)
      .json(
        createError(
          'VideoDoesNotExist',
          `Failed to find Video with slug: ${videoSlug}`,
        ),
      );
  } catch (error) {
    res
      .status(500)
      .json(createError('InternalServerError', 'Failed to Retrieve Video'));
  }
};

/**
 * Retrives the progress of a video with 'videoId' and 'user'
 *
 * @param {Request} req - Must contain `videoId` and 'user' in query
 * @param {Response} res - Response Object
 *
 * @return {Promise}  Response Object with an Error or Video Progress value
 */
export const getVideoProgressBySlug = async (req: Request, res: Response) => {
  const userID = req.query.userID as string;
  const { status, error } = validateUserID(userID);

  if (!status) return res.status(400).json(error);

  const videoSlug = req.query.videoSlug as string;
  const validateSlug = validateInput('slug', videoSlug, 'videoSlug');

  if (!validateSlug.status) return res.status(400).json(validateSlug.error);

  const user = await modelUser.findOne({ userID: req.query.userID });
  if (!user)
    return res
      .status(404)
      .json(
        createError(
          'UserDoesNotExist',
          `User with ID: ${userID} does not exist`,
        ),
      );

  const video = await modelVideo.findOne({ slug: req.query.videoSlug });
  if (!video)
    return res
      .status(404)
      .json(
        createError(
          'VideoDoesNotExist',
          `Failed to find Video with slug: ${videoSlug}`,
        ),
      );

  const progress = await modelProgress
    .findOne({
      userID: user._id,
    })
    .populate({
      path: 'videos',
      populate: {
        path: 'videoID',
        model: 'Video',
      },
    });

  if (progress == null)
    return res.status(200).json({
      progressPercent: 0,
    });
  const specificVideo = progress.videos.find(
    (entry) => (entry.videoID = video._id),
  );

  if (!specificVideo)
    return res.status(200).json({
      progressPercent: 0,
    });

  return res.status(200).json({
    progressPercent: specificVideo.progressPercent,
  });
};

/**
 * Retrives the progress of a video with 'videoId' and 'user'
 *
 * @param {Request} req - Must contain `videoId` and 'user' in query
 * @param {Response} res - Response Object
 *
 * @return {Promise}  Response Object with an Error or updated video progress
 */
export const updateVideoProgress = async (req: Request, res: Response) => {
  /* validation */
  const userID = req.body.userID as string;
  const { status, error } = validateUserID(userID);
  if (!status) return res.status(400).json(error);

  const videoSlug = req.body.videoSlug as string;
  const validateSlug = validateInput('slug', videoSlug, 'videoSlug');
  if (!validateSlug.status) return res.status(400).json(validateSlug.error);

  if (!req.body.videoProgressPercent || isNaN(req.body.videoProgressPercent))
    return res
      .status(400)
      .json(
        createError(
          'MissingBodyParams',
          'The body params requires numeric videoProgressPercent',
        ),
      );

  const progressPercentageCurrent: number = parseFloat(
    req.body.videoProgressPercent.toString(),
  );
  const user = await modelUser.findOne({ userID: req.body.userID });
  if (!user)
    return res
      .status(404)
      .json(
        createError(
          'UserDoesNotExist',
          `User with ID: ${userID} does not exist`,
        ),
      );

  const video = await modelVideo.findOne({ slug: req.body.videoSlug });
  if (!video)
    return res
      .status(404)
      .json(
        createError(
          'VideoDoesNotExist',
          `Failed to find Video with slug: ${req.body.videoSlug}`,
        ),
      );

  const progress = await modelProgress.findOne({
    userID: user._id,
  });

  /* Find relevant information about parentUnit and parentCourse and sanity checking */
  const parentUnit = await modelUnit.findOne({
    content: { $all: [video._id.toString()] },
  });

  if (!parentUnit)
    return res
      .status(404)
      .json(
        createError(
          'ParentUnitNotFound',
          `Failed to find parentUnit of video: ${req.body.videoSlug}`,
        ),
      );
  const parentCourse = await modelCourse.findOne({
    units: { $all: [parentUnit._id] },
  });
  if (!parentCourse)
    return res
      .status(404)
      .json(
        createError(
          'ParentCourseNotFound',
          `Failed to find parentCourse of video: ${req.body.videoSlug}`,
        ),
      );

  if (!progress) {
    /* First content user has watched so inserrt into db */
    const completed = progressPercentageCurrent >= 70 ? 1 : 0;
    // eslint-disable-next-line new-cap
    const newCreation = new modelProgress({
      userID: user._id,
      courses: [
        {
          courseID: parentCourse._id,
          progress: completed,
        },
      ],
      units: [
        {
          unitID: parentUnit._id,
          progress: completed,
        },
      ],
      videos: [
        {
          videoID: video._id,
          progressPercent: progressPercentageCurrent,
          isComplete: progressPercentageCurrent >= 70,
        },
      ],
    });
    await newCreation.save();
    return res.send(newCreation);
  }
  /* User already has a progress elem then update the progres object */
  const indexVideo = progress.videos.findIndex(
    (elem) => elem.videoID.toString() == video._id.toString(),
  );
  const indexUnit = progress.units.findIndex(
    (elem) => elem.unitID.toString() == parentUnit._id.toString(),
  );
  const indexCourse = progress.courses.findIndex(
    (elem) => elem.courseID.toString() == parentCourse._id.toString(),
  );

  /* A video was just completed if its progress went over 70 and it was previously incomplete */
  const isJustComplete =
    progressPercentageCurrent >= 70 &&
    ((indexVideo != -1 && !progress.videos[indexVideo].isComplete) ||
      indexVideo == -1);

  const increment = isJustComplete ? 1 : 0;
  // eslint-disable-next-line new-cap
  const updatedObject = new modelProgress({
    _id: progress._id,
    userID: user._id,
    courses:
      /* If parent course is not already added add,it otherwise update it */
      indexCourse !== -1
        ? progress.courses.map((elem) => {
            return elem.courseID.toString() != parentCourse._id.toString()
              ? elem
              : { ...elem, progress: elem.progress + increment };
          })
        : [
            ...progress.courses,
            {
              courseID: parentCourse._id,
              progress: increment,
            },
          ],
    units:
      /* If parent unit is not already added add,it otherwise update it */
      indexUnit !== -1
        ? progress.units.map((elem) => {
            return elem.unitID.toString() != parentUnit._id.toString()
              ? elem
              : { ...elem, progress: elem.progress + increment };
          })
        : [
            ...progress.units,
            {
              unitID: parentUnit._id,
              progress: increment,
            },
          ],
    videos:
      /* If video is not already added add,it otherwise update it */
      indexVideo !== -1
        ? progress.videos.map((elem) => {
            return elem.videoID.toString() == video._id.toString()
              ? {
                  ...elem,
                  progressPercent: progressPercentageCurrent,
                  isComplete: elem.isComplete
                    ? elem.isComplete
                    : isJustComplete,
                }
              : elem;
          })
        : [
            ...progress.videos,
            {
              videoID: video._id,
              progressPercent: progressPercentageCurrent,
              isComplete: isJustComplete,
            },
          ],
  });
  updatedObject.isNew = false;
  await updatedObject?.save();
  return res.send(updatedObject);
};

export const getUnitFromVideo = async (video: Video) => {
  try {
    const unit = await modelUnit.findOne<Unit>({ content: video._id });
    return unit;
  } catch (error) {
    console.error('Cannot retrieve unit from video!');
  }
};

export const getFavouriteVideos = async (req: Request, res: Response) => {
  try {
    const favouriteVideos = await modelVideo.find<Video>({
      isFavourited: true,
    });

    const data: any = [];
    if (favouriteVideos) {
      await Promise.all(
        favouriteVideos.map(async (itemVideo: Video) => {
          try {
            const unit = await getUnitFromVideo(itemVideo);
            if (unit) {
              const course = await getCourseFromUnit(unit);
              if (course)
                data.push({
                  video: itemVideo,
                  courseSlug: course?.slug,
                });
            }
          } catch (error) {
            res
              .status(500)
              .json(
                createError(
                  'InternalServerError',
                  'Failed to retrieve relevant details from each video!',
                ),
              );
          }
        }),
      );
      return res.status(200).json(data);
    }
    res
      .status(500)
      .json(
        createError(
          'InternalServerError',
          'Failed to retrieve relevant details from each video!',
        ),
      );
  } catch (error) {
    res
      .status(500)
      .json(
        createError(
          'InternalServerError',
          'Failed to retrieve Favourite Videos',
        ),
      );
  }
};

export const toggleFavoriteVideo = async (req: Request, res: Response) => {
  const video: Video | null = await modelVideo.findOne<Video>({
    slug: req.body.slug,
  });

  if (!video)
    return res.status(400).json({ error: 'Missing slug in request body' });

  try {
    const updatedVideo = await modelVideo.findOneAndUpdate(
      { slug: video.slug },
      { isFavourited: !video.isFavourited },
      { new: true },
    );
    res.status(200).send(updatedVideo);
  } catch (error) {
    res.status(500).json(createError('InternalServerError', 'Toggle Fail'));
  }
};
