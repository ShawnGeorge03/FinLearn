'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';

import { AllCourseProps } from '@/types/learning';

/* An indiviudal course card, with all relevant properties passed in as props */
const CourseCard = ({ name, slug, icon }: AllCourseProps) => {
  return (
    <Link href={`/learning/${slug}`}>
      <>
        <Card
          background={'gray.200'}
          borderRadius={10}
          cursor={'pointer'}
          height={250}
          width={250}>
          <CardHeader></CardHeader>
          <CardBody>
            <Flex
              alignItems={'center'}
              direction="column"
              justifyContent={'center'}>
              <Text
                align="center"
                fontSize="3xl"
                fontWeight={'bold'}>
                {name}
              </Text>
              <Image
                alt={name}
                h={90}
                mt={2}
                src={icon}
                w={90}></Image>
            </Flex>
          </CardBody>
        </Card>
      </>
    </Link>
  );
};

export default CourseCard;
