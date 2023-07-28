'use client';
import { Grid, GridItem, Spinner } from '@chakra-ui/react';

import UnitGrid from '@/components/Dashboard-Learning/UnitGrid';
import { ErrorResponse } from '@/types/base';
import {
  CourseWithUnits,
  Unit,
} from '@/types/components/Dashboard-Learning/types';
import {
  Course,
  LearningProgressResponse,
  UnitWithProgress,
} from '@/types/learning';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Dashboard-Learning/Sidebar';
import styles from '../../styles/pages/Dashboard.module.scss';

const DashboardPage = () => {
  const { userId } = useAuth();
  const [exploreCourses, setExploreCourses] = useState<Array<Course>>([]);
  const [userCourses, setUserCourses] = useState<Array<Course>>([]);
  const [isSideBarReady, setIsSideBarReady] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [units, setUnits] = useState<Array<Unit>>();
  const [isUnitGridReady, setIsUnitGridReady] = useState(false);
  const [userUnits, setUserUnits] = useState<Array<UnitWithProgress>>([]);

  const isCourseInList = (courses: Course[], slug: string): boolean => {
    for (const course of courses) if (course.slug === slug) return true;
    return false;
  };

  const getCourses = async () => {
    if (!userId) return;
    try {
      /* set users courses*/
      const userCoursesResponse: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/learningProgress?userID=${userId}`,
      );
      let loadedUserCourses: Course[] = [];
      let loadedUserUnits: UnitWithProgress[] = [];
      if (userCoursesResponse.ok) {
        const userCoursesData: LearningProgressResponse =
          await userCoursesResponse.json();
        loadedUserCourses = userCoursesData.courses.map(
          (elem) => elem.courseID,
        );
        setUserCourses(loadedUserCourses);
        loadedUserUnits = userCoursesData.units.map((elem) => {
          return { unit: elem.unitID, progress: elem.progress };
        });
        setUserUnits(loadedUserUnits);
      } else {
        const error: ErrorResponse = await userCoursesResponse.json();
        console.error(error);
      }

      /* set explore courses*/
      const exploreCoursesResponse: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses`,
      );
      const exploreCoursesData: Course[] = await exploreCoursesResponse.json();
      const filteredCourses = exploreCoursesData.filter(
        (elem) => !isCourseInList(loadedUserCourses, elem.slug),
      );

      setExploreCourses(filteredCourses);

      /* set default selected course*/
      loadedUserCourses.length > 0
        ? setSelectedCourse(loadedUserCourses[0])
        : setSelectedCourse(filteredCourses[0]);
      setIsSideBarReady(true);
    } catch (error) {
      console.error((error as Error).message);
    }
  };
  useEffect(() => {
    getCourses();
  }, [userId]);
  /* Without a dependency array the call to get all courses is only made once */

  const getUnits = async () => {
    if (!selectedCourse) return;

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/units?courseSlug=${selectedCourse?.slug}`;
      const response = await fetch(url);
      const data: CourseWithUnits = await response.json();
      setUnits(data.units);
      setIsUnitGridReady(true);
    } catch (error) {
      setUnits(undefined);
      console.error((error as Error).message);
    }
  };
  useEffect(() => {
    setIsUnitGridReady(false);
    getUnits();
  }, [selectedCourse]);

  if (!isSideBarReady)
    return (
      <div className={styles.center}>
        <Spinner
          color="blue.500"
          emptyColor="gray.200"
          m={'auto'}
          size="xl"
          speed="0.65s"
          thickness="4px"
        />
      </div>
    );

  return (
    <>
      <Grid
        gap={4}
        h="800px"
        m={3}
        templateColumns="repeat(3, 1fr)">
        <GridItem colSpan={1}>
          <Sidebar
            exploreCourses={exploreCourses}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            userCourses={userCourses}
          />
        </GridItem>
        <GridItem colSpan={2}>
          {isUnitGridReady && units && selectedCourse ? (
            <UnitGrid
              courseSlug={selectedCourse.slug}
              units={units}
              userUnits={userUnits}
            />
          ) : (
            <div className={styles.center}>
              <Spinner size="lg" />
            </div>
          )}
        </GridItem>
      </Grid>
    </>
  );
};

export default DashboardPage;
