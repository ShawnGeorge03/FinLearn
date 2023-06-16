'use client';

import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  HStack,
  StackDivider,
  Stack,
  Divider,
  Icon,
} from '@chakra-ui/react';
import styles from '../../styles/components/sidebar.module.scss';
import { Course } from '@/types/learning';
import { AiFillCaretRight } from '@react-icons/all-files/ai/AiFillCaretRight';

type SideBarProps = {
  courses: Course[];
  selectedCourse: Course | undefined;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | undefined>>;
};

const Sidebar = ({
  courses,
  selectedCourse,
  setSelectedCourse,
}: SideBarProps) => {
  const findCourseByName = (name: string) => {
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].name == name) {
        return courses[i];
      }
    }
    return courses[0];
  };
  const handleClick = (e: any) => {
    setSelectedCourse(findCourseByName((e.target.parentElement as any).id));
  };
  return (
    <Card bg="brand.gray">
      <CardHeader>
        <Heading size="md">Explore</Heading>
      </CardHeader>
      <Divider className={styles.divider} />
      <CardBody>
        <Stack
          divider={<StackDivider color="brand.black" />}
          spacing="4">
          {courses.map((course) => (
            <HStack
              key={course.name.toString()}
              id={course.name.toString()}
              onClick={handleClick}
              textColor={
                selectedCourse && selectedCourse.name == course.name
                  ? 'brand.blue'
                  : 'brand.black'
              }>
              <Heading
                size="xs"
                display={'inline'}
                textTransform="uppercase">
                {course.name}
              </Heading>
              {selectedCourse && selectedCourse.name == course.name && (
                <Icon
                  as={AiFillCaretRight}
                  ml={2}
                  boxSize={'m'}
                />
              )}
            </HStack>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
};
export default Sidebar;
