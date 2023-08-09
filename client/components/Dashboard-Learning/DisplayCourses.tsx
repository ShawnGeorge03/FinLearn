'use client';

import { Course } from '@/types/learning';
import {
  CardBody,
  CardHeader,
  Flex,
  HStack,
  Heading,
  Icon,
  Stack,
  StackDivider,
} from '@chakra-ui/react';
import { AiFillCaretRight } from '@react-icons/all-files/ai/AiFillCaretRight';
import styles from '../../styles/components/sidebar.module.scss';

type DisplayCoursesProps = {
  courses: Course[];
  headerString: 'My Courses' | 'Explore';
  selectedCourse: Course | undefined;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | undefined>>;
};

const DisplayCourses = ({
  courses,
  headerString,
  selectedCourse,
  setSelectedCourse,
}: DisplayCoursesProps) => {
  const findCourseByName = (name: string) => {
    for (let i = 0; i < courses.length; i++)
      if (courses[i].name == name) return courses[i];

    courses[0];
  };
  const handleClick = (e: any) => {
    setSelectedCourse(findCourseByName((e.target.parentElement as any).id));
  };
  return (
    <>
      <CardHeader>
        <Flex justifyContent="space-between">
          <Heading size="md">{headerString}</Heading>
        </Flex>
      </CardHeader>
      <hr className={styles.divider} />
      <CardBody>
        <Stack
          divider={<StackDivider borderColor="brand.white" />}
          spacing="4">
          {courses.map((course) => (
            <HStack
              id={course.name.toString()}
              key={course.name.toString()}
              onClick={handleClick}
              textColor={
                selectedCourse && selectedCourse.name == course.name
                  ? 'brand.blue'
                  : 'brand.black'
              }>
              <Heading
                display={'inline'}
                size="xs"
                textTransform="uppercase">
                {course.name}
              </Heading>
              {selectedCourse && selectedCourse.name == course.name && (
                <Icon
                  as={AiFillCaretRight}
                  boxSize={'m'}
                  ml={2}
                />
              )}
            </HStack>
          ))}
        </Stack>
      </CardBody>
    </>
  );
};
export default DisplayCourses;
