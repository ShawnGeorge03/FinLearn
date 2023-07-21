import { Request, Response } from 'express';
import { PipelineStage } from 'mongoose';

import modelCourse from '../../models/Learning/course';

import { createError } from '../../utils/error';
import { validateInput } from '../../utils/validate';

/**
 * Retrieves a List of Best Course Matches
 *
 * @param {Request} req - Must contain `searchText` in query
 * @param {Response} res - Response Object
 *
 * @return {Promise} Response Object with an Error or List of Best Matches
 */
export const getSearchResults = async (req: Request, res: Response) => {
  try {
    const searchText = req.query.searchText as string;
    const { status, error } = validateInput('text', searchText, 'searchText');

    if (!status) return res.status(400).json(error);

    const pipeline: PipelineStage[] = [
      {
        $search: {
          index: 'search-learning',
          text: {
            query: searchText,
            path: {
              wildcard: '*',
            },
            fuzzy: {},
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          slug: 1,
          icon: 1,
        },
      },
    ];

    const result = await modelCourse.aggregate(pipeline);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json(
        createError('InternalServerError', 'Failed to retrieve Search Results'),
      );
  }
};

/**
 * Retrieves a List of Best Course or Unit Matches
 *
 * @param {Request} req - Must contain `searchText` in query
 * @param {Response} res - Response Object
 *
 * @return {Promise} Response Object with an Error or List of Best Matches
 */
export const getAutoCompleteResults = async (req: Request, res: Response) => {
  try {
    const searchText = req.query.searchText as string;
    const { status, error } = validateInput('text', searchText, 'searchText');

    if (!status) return res.status(400).json(error);

    const pipeline: PipelineStage[] = [
      {
        $search: {
          index: 'autoComplete-courses',
          autocomplete: {
            query: searchText,
            path: 'name',
            tokenOrder: 'sequential',
          },
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          name: 1,
          slug: 1,
        },
      },
      {
        $set: {
          source: 'course',
        },
      },
      {
        $unionWith: {
          coll: 'units',
          pipeline: [
            {
              $search: {
                index: 'autoComplete-units',
                autocomplete: {
                  query: searchText,
                  path: 'name',
                  tokenOrder: 'sequential',
                },
              },
            },
            {
              $limit: 10,
            },
            {
              $project: {
                name: 1,
                slug: 1,
              },
            },
            {
              $set: {
                source: 'unit',
              },
            },
          ],
        },
      },
    ];

    const result = await modelCourse.aggregate(pipeline);
    const data = [];

    if (result)
      for (const item of result)
        if (item.source === 'course')
          data.push({
            name: item.name,
            source: item.source,
            href: `/learning/${item.slug}`,
          });
        else if (item.source === 'unit') {
          const course = await modelCourse.findOne({
            units: { $eq: item._id },
          });
          data.push({
            name: item.name,
            source: item.source,
            href: `/learning/${course?.slug}/unit/${item.slug}`,
          });
        }

    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json(
        createError(
          'InternalServerError',
          'Failed to retrieve Autocomplete Results',
        ),
      );
  }
};
