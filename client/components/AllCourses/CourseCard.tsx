'use client';

import {
  Flex,
  Text,
  Card,
  CardHeader,
  CardBody,
  Image,
  Link,
} from '@chakra-ui/react';

import { AllCourseProps } from '@/types/learning';

/* An indiviudal course card, with all relevant properties passed in as props */
const CourseCard = ({ name, slug, icon }: AllCourseProps) => {
  return (
    <Link href={`/learning/${slug}`}>
      <>
        <Card
          cursor={'pointer'}
          background={'gray.200'}
          height={250}
          width={250}
          borderRadius={10}>
          <CardHeader></CardHeader>
          <CardBody>
            <Flex
              direction="column"
              justifyContent={'center'}
              alignItems={'center'}>
              <Text
                align="center"
                fontWeight={'bold'}
                fontSize="3xl">
                {name}
              </Text>
              <Image
                mt={2}
                w={90}
                h={90}
                src={icon}
                alt={name}></Image>
            </Flex>
          </CardBody>
        </Card>
      </>
    </Link>
  );
};

export default CourseCard;
