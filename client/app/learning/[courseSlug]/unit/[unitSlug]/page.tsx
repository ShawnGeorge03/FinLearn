'use client';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  Link,
  Progress,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '@clerk/nextjs';
import { IoNewspaperOutline } from '@react-icons/all-files/io5/IoNewspaperOutline';
import { IoVideocamOutline } from '@react-icons/all-files/io5/IoVideocamOutline';
import { useEffect, useState } from 'react';

import styles from '@/styles/pages/Unit.module.scss';
import {
  CourseWithUnits,
  UnitProgressData,
} from '@/types/components/Dashboard-Learning/types';

type CourseProps = {
  params: {
    courseSlug?: string;
    unitSlug?: string;
  };
};

export default function UnitPage({ params }: CourseProps) {
  const {
    center,
    container,
    header,
    title,
    progress,
    contentWrapper,
    content,
    unitWrapper,
  } = styles;

  const [course, setCourse] = useState<CourseWithUnits>();
  const [allUnitsProgress, setAllUnitsProgress] =
    useState<UnitProgressData[]>();

  const [selectedUnit, setSelectedUnit] = useState<string>(
    decodeURIComponent(params?.unitSlug as string),
  );

  const { userId } = useAuth();

  const getCourse = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/units?courseSlug=${params?.courseSlug}`,
      );
      const data: CourseWithUnits = await response.json();
      setCourse(data);
    } catch (error) {
      setCourse(undefined);
      console.error((error as Error).message);
    }
  };

  const getAllUnitsProgress = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/unitsProgress?userID=${userId}`,
      );
      const data: UnitProgressData[] = await response.json();
      setAllUnitsProgress(data);
    } catch (error) {
      setAllUnitsProgress(undefined);
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    getCourse();
    getAllUnitsProgress();
  }, [params]);

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
        <Text>Loading Unit</Text>
      </div>
    );

  const unit = course.units.find(({ slug }) => slug === selectedUnit);

  const unitProgress = () => {
    if (JSON.stringify(allUnitsProgress) === '{}') return 0;
    const data = allUnitsProgress?.find(({ slug }) => slug === selectedUnit);
    return data?.progress || 0;
  };

  if (course && !unit)
    return (
      <div className={center}>
        <Heading size="md">Unable to find Unit</Heading>
        <Link href={`/learning/${params?.courseSlug}`}>
          <Button>Back to {course.name}</Button>
        </Link>
      </div>
    );

  return (
    <div className={container}>
      <div className={header}>
        <h1 className={title}>{unit?.name}</h1>
        <Progress
          className={progress}
          hasStripe
          max={unit?.contents.length}
          min={0}
          value={unitProgress()}
        />
        <Text>
          {unitProgress()}/{unit?.contents.length} points
        </Text>
      </div>
      <div className={unitWrapper}>
        <Card variant="elevated">
          <CardHeader
            bg="brand.black"
            borderTopRadius="md"
            color="brand.white">
            <Heading
              size="md"
              textTransform="capitalize">
              {course.name}
            </Heading>
          </CardHeader>
          <CardBody
            bg="brand.gray"
            borderBottomRadius="md">
            {course?.units.map(({ name, slug }, unitKey) => {
              return (
                <Text
                  cursor={'pointer'}
                  key={unitKey}
                  onClick={() => setSelectedUnit(decodeURIComponent(slug))}
                  paddingBottom={3}
                  size="sm">
                  {name}
                </Text>
              );
            })}
          </CardBody>
        </Card>
      </div>
      <div className={contentWrapper}>
        {unit?.contents.map(({ name, contentType, slug }, contentKey) => {
          return (
            <div
              className={content}
              key={contentKey}>
              <Icon
                as={
                  contentType === 'video'
                    ? IoVideocamOutline
                    : IoNewspaperOutline
                }
                boxSize={8}
              />
              <Link
                href={`/learning/${params?.courseSlug}/${contentType}/${slug}`}>
                <Text>{name}</Text>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
