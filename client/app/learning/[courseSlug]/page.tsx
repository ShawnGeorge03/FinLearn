'use client';

import { Spinner, Text } from '@chakra-ui/react';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

import UnitCard from '@/components/UnitCard';
import UnitListItem from '@/components/UnitListItem';

import styles from '@/styles/pages/Course.module.scss';

import { ErrorResponse } from '@/types/base';
import {
  CourseWithUnits,
  UnitProgressData,
} from '@/types/components/Dashboard-Learning/types';

type CourseProps = {
  params: {
    courseSlug?: string;
  };
};

export default function CoursePage({ params }: CourseProps) {
  const { center, container, title, unitLists, unitsWrapper } = styles;

  const [course, setCourse] = useState<CourseWithUnits>();
  const [allUnitsProgress, setAllUnitsProgress] = useState<UnitProgressData[]>(
    [],
  );

  const { userId } = useAuth();

  const getCourseWithUnits = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/units?courseSlug=${params?.courseSlug}`,
      );
      if (response.ok) {
        const data: CourseWithUnits = await response.json();
        setCourse(data);
      } else {
        const error: ErrorResponse = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllUnitsProgress = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/unitsProgress?userID=${userId}`,
      );
      if (response.ok) {
        const data: UnitProgressData[] = await response.json();
        setAllUnitsProgress(data);
      } else {
        const error: ErrorResponse = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCourseWithUnits();
    getAllUnitsProgress();
  }, [params]);

  const unitProgress = (selectedUnit: string) => {
    if (JSON.stringify(allUnitsProgress) === '[]') return 0;
    const data = allUnitsProgress?.find(({ slug }) => slug === selectedUnit);
    return data?.progress || 0;
  };

  if (!course)
    return (
      <div className={center}>
        <Spinner
          color="blue.500"
          emptyColor="gray.200"
          size="xl"
          speed="0.65s"
          thickness="4px"
        />
        <Text>Loading Course</Text>
      </div>
    );

  return (
    <div className={container}>
      <h1 className={title}>{course?.name}</h1>
      <div className={unitLists}>
        {course?.units.map(({ name, contents, slug }, unitKey) => {
          return (
            <UnitListItem
              href={`/learning/${params?.courseSlug}/unit/${slug}`}
              key={unitKey}
              max={contents.length}
              name={name}
              value={unitProgress(slug)}
            />
          );
        })}
      </div>
      <div className={unitsWrapper}>
        {course?.units.map(({ name, contents }, unitKey) => {
          return (
            <UnitCard
              contents={contents}
              courseSlug={params?.courseSlug as string}
              key={unitKey}
              name={name}
            />
          );
        })}
      </div>
    </div>
  );
}
