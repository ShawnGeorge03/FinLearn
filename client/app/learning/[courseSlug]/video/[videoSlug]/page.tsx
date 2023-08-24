'use client';

import SidePaneItem from '@/components/ContentVideo/SidePaneItem';
import YoutubePlayer from '@/components/ContentVideo/YoutubePlayer';
import FavoriteButton from '@/components/FavoriteButton';
import styles from '@/styles/pages/Video.module.scss';
import { useEffect, useState } from 'react';

import { Video } from '@/types/learning';
import {
  Accordion,
  AspectRatio,
  Container,
  HStack,
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
  const [color, setColor] = useState<'gray' | 'yellow'>('gray');
  const [isFavourited, setIsFavourited] = useState<boolean>(false);

  useEffect(() => {
    setColor(isFavourited ? 'yellow' : 'gray');
  }, [isFavourited]);

  const getCourseWithUnits = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/units?courseSlug=${params?.courseSlug}`;
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
        `${process.env.NEXT_PUBLIC_API_URL}/video?videoSlug=${params?.videoSlug}`,
      );
      if (response.ok) {
        const data: Video = await response.json();
        setVideo(data);
        setIsFavourited(data.isFavourited);
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
        `${process.env.NEXT_PUBLIC_API_URL}/progress/video?userID=${userId}&videoSlug=${params.videoSlug}`,
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

  const toggleIsFavorite = async () => {
    const data = {
      slug: params?.videoSlug,
    };

    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    try {
      const response: Response = await fetch(
        `http://localhost:4000/toggleFavoriteVideo`,
        requestOptions,
      );
      if (response.ok) {
        const data: Video = await response.json();
        setVideo(data);
        setIsFavourited(data.isFavourited);
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
        <HStack>
          <Heading as="h1">{video?.name}</Heading>
          <FavoriteButton
            color={color}
            onClickButton={toggleIsFavorite}
            size="sm"
          />
        </HStack>
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
