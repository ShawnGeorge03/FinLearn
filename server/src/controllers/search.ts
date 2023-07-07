import { Request, Response } from 'express';

import modelCourse from '../models/Learning/course';

export const getSearchResults = async (req: Request, res: Response) => {
  try {
    const pipeline = [
      {
        $search: {
          index: 'search-learning',
          text: {
            query: req.query.text,
            path: {
              wildcard: '*',
            },
            fuzzy: {},
          },
        },
      },
    ];
    const result = await modelCourse.aggregate(pipeline);
    res.status(200).send(result);
  } catch (e: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAutoCompleteResults = async (req: Request, res: Response) => {
  try {
    const pipeline = [
      {
        $search: {
          index: 'autoComplete-courses',
          autocomplete: {
            query: req.query.text,
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
                  query: req.query.text,
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

    res.status(200).send(data);
  } catch (e: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
