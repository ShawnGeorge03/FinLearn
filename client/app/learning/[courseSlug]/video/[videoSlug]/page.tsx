'use client';

import { useEffect, useState } from 'react';

import { Video } from '@/types/learning';
import YoutubePlayer from '@/components/ContentVideo/YoutubePlayer';
import { Course } from '../../page';
import {
  Heading,
  Text,
  Container,
  VStack,
  Spinner,
  Accordion,
  AspectRatio,
} from '@chakra-ui/react';

import styles from '@/styles/pages/Course.module.scss';
import SidePaneItem from '@/components/ContentVideo/SidePaneItem';

type VideoProps = {
  params: {
    courseSlug?: string;
    videoSlug?: string;
  };
};

type CourseVideo = {
  video: Video;
};

export default function ContentPage({ params }: VideoProps) {
  const { container, title, unitLists } = styles;

  const [courseVideo, setCourseVideo] = useState<CourseVideo>();
  const [course, setCourse] = useState<Course>();

  const fetchVideo = async () => {
    try {
      const urlCourse = `http://localhost:4000/units?courseSlug=${params?.courseSlug}`;
      const responseCourse = await fetch(urlCourse);
      const dataCourse: Course = await responseCourse.json();
      const url = `http://localhost:4000/video?videoSlug=${params?.videoSlug}`;
      const response = await fetch(url);
      const data: CourseVideo = await response.json();
      setCourse(dataCourse);
      setCourseVideo(data);
    } catch (error) {
      setCourseVideo(undefined);
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [params]);

  return (
    <div className={container}>
      <h1 className={title}>{course?.name}</h1>
      <div className={unitLists}>
        <Accordion allowToggle>
          {course?.units.map(({ name, contents }, unitKey) => {
            return (
              <SidePaneItem
                key={unitKey}
                contents={contents}
                name={name}
                courseSlug={params?.courseSlug as string}
              />
            );
          })}
        </Accordion>
      </div>
      {courseVideo == undefined ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          marginTop="240"
          justifyContent="center"
          alignSelf="center"
        />
      ) : (
        <Container
          maxW={'7xl'}
          p="12">
          <Heading as="h1">{courseVideo.video.name}</Heading>

          <AspectRatio
            ratio={16 / 9}
            w="100%">
            <YoutubePlayer videoId={courseVideo.video.videoId.toString()} />
          </AspectRatio>

          <VStack
            paddingTop="40px"
            spacing="2"
            alignItems="flex-start">
            <Text
              as="p"
              fontSize="lg">
              {courseVideo.video.description}
            </Text>
          </VStack>
        </Container>
      )}
    </div>
  );
}
