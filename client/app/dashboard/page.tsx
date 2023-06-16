'use client';
import React from 'react';
import { Grid, GridItem, Spinner, Center, Text } from '@chakra-ui/react';

import UnitGrid from '@/components/Dashboard-Learning/UnitGrid';
import Sidebar from '../../components/Dashboard-Learning/Sidebar';
import { useUser, useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Course } from '@/types/learning';
import {
  CourseWithUnits,
  Unit,
} from '@/types/components/Dashboard-Learning/types';
import styles from '../../styles/pages/Dashboard.module.scss';

const DashboardPage = () => {
  const { user } = useUser();
  const { isLoaded, userId } = useAuth();
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [isSideBarReady, setIsSideBarReady] = useState(false);
  const [selectedCourse, setSeletctedCourse] = useState<Course>();
  const [units, setUnits] = useState<Array<Unit>>();
  const [isUnitGridReady, setIsUnitGridReady] = useState(false);
  const getUnits = async () => {
    if (!selectedCourse) {
      return;
    }
    try {
      const url = `http://localhost:4000/units?courseSlug=${selectedCourse?.slug}`;
      const response = await fetch(url);
      const data: CourseWithUnits = await response.json();
      setUnits(data.units);
      setIsUnitGridReady(true);
    } catch (error) {
      setUnits(undefined);
      console.error((error as Error).message);
    }
  };
  const getCourses = async () => {
    try {
      // update to better promise handling
      const response: Response = await fetch('http://localhost:4000/courses');
      const jsonData: any = await response.json();
      setCourses(jsonData);
      setSeletctedCourse(jsonData[0]);
      setIsSideBarReady(true);
    } catch (e: any) {
      console.error(e.message);
    }
  };
  /* Without a dependency array the call to get all courses is only made once */
  useEffect(() => {
    getCourses();
  }, []);
  useEffect(() => {
    setIsUnitGridReady(false);
    getUnits();
  }, [selectedCourse]);

  if (!isLoaded || !userId || !isSideBarReady) {
    // need to check for userId as well as its a protected route {
    return (
      <div className={styles.center}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          m={'auto'}
        />
      </div>
    );
  }

  return (
    <>
      <Grid
        h="800px"
        templateColumns="repeat(3, 1fr)"
        gap={4}
        m={3}>
        <GridItem colSpan={1}>
          <Sidebar
            courses={courses}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSeletctedCourse}
          />
        </GridItem>
        <GridItem colSpan={2}>
          {isUnitGridReady && units && selectedCourse ? (
            <UnitGrid
              units={units}
              courseSlug={selectedCourse.slug}
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
