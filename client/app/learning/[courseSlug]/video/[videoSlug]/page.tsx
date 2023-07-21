'use client';

import { useEffect, useState } from 'react';

import SidePaneItem from '@/components/ContentVideo/SidePaneItem';
import YoutubePlayer from '@/components/ContentVideo/YoutubePlayer';
import styles from '@/styles/pages/Video.module.scss';
import { Video } from '@/types/learning';
import {
  Accordion,
  AspectRatio,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

import { ErrorResponse } from '@/types/base';
import { CourseWithUnits } from '@/types/components/Dashboard-Learning/types';
import { useAuth } from '@clerk/nextjs';

type VideoProps = {
  params: {
    courseSlug: string;
    videoSlug: string;
  };
};

export default function ContentPage({ params }: VideoProps) {
  const { center, container, title, unitLists } = styles;
  const { userId } = useAuth();
  const [video, setVideo] = useState<Video>();
  const [course, setCourse] = useState<CourseWithUnits>();
  const [videoProgress, setVideoProgress] = useState(0);

  const getCourseWithUnits = async () => {
    try {
      const url = `http://localhost:4000/units?courseSlug=${params?.courseSlug}`;
      const response = await fetch(url);
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

  const getVideo = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/video?videoSlug=${params?.videoSlug}`,
      );
      if (response.ok) {
        const data: Video = await response.json();
        setVideo(data);
      } else {
        const error: ErrorResponse = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getProgress = async () => {
    try {
      const progressResponse = await fetch(
        `http://localhost:4000/progress/video?userID=${userId}&videoSlug=${params.videoSlug}`,
      );
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setVideoProgress(progressData.progressPercent);
      } else {
        const error: ErrorResponse = await progressResponse.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCourseWithUnits();
    getVideo();
    getProgress();
  }, [params]);

  if (!course && !video)
    return (
      <div className={center}>
        <Spinner
          color="blue.500"
          emptyColor="gray.200"
          size="xl"
          speed="0.65s"
          thickness="4px"
        />
        <Text>Loading Video</Text>
      </div>
    );

  if (!userId || userId == null)
    return (
      <Spinner
        alignSelf="center"
        color="blue.500"
        emptyColor="gray.200"
        justifyContent="center"
        marginTop="240"
        size="xl"
        speed="0.65s"
        thickness="4px"
      />
    );

  return (
    <div className={container}>
      <h1 className={title}>{course?.name}</h1>
      <div className={unitLists}>
        <Accordion allowToggle>
          {course?.units.map(({ name, contents }, unitKey) => {
            return (
              <SidePaneItem
                contents={contents}
                courseSlug={params?.courseSlug as string}
                key={unitKey}
                name={name}
              />
            );
          })}
        </Accordion>
      </div>
      <Container
        maxW={'7xl'}
        p="12">
        <Heading as="h1">{video?.name}</Heading>
        <AspectRatio
          ratio={16 / 9}
          w="100%">
          <YoutubePlayer
            progressPercent={videoProgress}
            userId={userId}
            videoId={video?.videoId.toString() || ''}
            videoSlug={params.videoSlug}
          />
        </AspectRatio>

        <VStack
          alignItems="flex-start"
          paddingTop="40px"
          spacing="2">
          <Text
            as="p"
            fontSize="lg">
            {video?.description}
          </Text>
        </VStack>
      </Container>
    </div>
  );
}
