'use client';
import {
  Accordion,
  Box,
  Container,
  HStack,
  Heading,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import FavoriteButton from '@/components/FavoriteButton';

import ArticleImage from '@/components/ContentArticle/ArticleImage';
import BlogAuthor from '@/components/ContentArticle/BlogAuthor';
import SidePaneItem from '@/components/ContentVideo/SidePaneItem';

import styles from '@/styles/pages/Article.module.scss';

import { ErrorResponse } from '@/types/base';
import { CourseWithUnits } from '@/types/components/Dashboard-Learning/types';
import { Article } from '@/types/learning';
import { useAuth } from '@clerk/nextjs';

type ArticleProps = {
  params: {
    courseSlug?: string;
    articleSlug?: string;
  };
};

const ArticleList = ({ params }: ArticleProps) => {
  const { center, container, title, unitLists } = styles;
  const { userId } = useAuth();
  const [article, setArticle] = useState<Article>();
  const [course, setCourse] = useState<CourseWithUnits>();
  const [articleProgressPercent, setArticleProgress] = useState(0);

  const patchProgress = async () => {
    try {
      const requestBody = {
        userID: userId,
        articleSlug: params.articleSlug,
        articleProgressPercent: 100,
      };
      const fetchOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Specifying JSON content in the headers
        },
        body: JSON.stringify(requestBody), // Convert the object to JSON string
      };

      const updateResponse = await fetch(
        'http://localhost:4000/articleProgress',
        fetchOptions,
      );

      if (updateResponse.ok)
        // Progress updated successfully
        setArticleProgress(100); // Update the local progress state
      else {
        const error: ErrorResponse = await updateResponse.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [color, setColor] = useState<'gray' | 'yellow'>('gray');
  const [isFavourited, setIsFavourited] = useState<boolean>(false);

  useEffect(() => {
    setColor(isFavourited ? 'yellow' : 'gray');
  }, [isFavourited]);

  const getCourseWithUnits = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/units?courseSlug=${params?.courseSlug}`,
      );
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

  const getArticle = async () => {
    try {
      const response: Response = await fetch(
        `http://localhost:4000/article?articleSlug=${params.articleSlug}`,
      );
      if (response.ok) {
        const data: Article = await response.json();
        setArticle(data);
        setIsFavourited(data.isFavourited);
      } else {
        const error: ErrorResponse = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleIsFavorite = async () => {
    const data = {
      slug: article?.slug,
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
        `http://localhost:4000/toggleFavoriteArticle`,
        requestOptions,
      );
      if (response.ok) {
        const data: Article = await response.json();
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
        `http://localhost:4000/progress/article?userID=${userId}&articleSlug=${params.articleSlug}`,
      );
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setArticleProgress(progressData.progressPercent);
        if (articleProgressPercent != 100) await patchProgress();
      } else {
        const error: ErrorResponse = await progressResponse.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* Without a dependency array the call to get all article is only made once */
  useEffect(() => {
    getCourseWithUnits();
    getArticle();
    getProgress();
  }, [params]);

  if (!course && !article)
    return (
      <div className={center}>
        <Spinner
          color="blue.500"
          emptyColor="gray.200"
          size="xl"
          speed="0.65s"
          thickness="4px"
        />
        <Text>Loading Article</Text>
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
      <Container maxW={'7xl'}>
        <HStack>
          <Heading>{article?.name}</Heading>
          <FavoriteButton
            color={color}
            onClickButton={toggleIsFavorite}
            size="sm"
          />
        </HStack>

        <Box>
          <BlogAuthor
            date={article?.createdAt}
            name={article?.author}
          />
        </Box>

        <Wrap
          marginTop="5"
          spacing="30px">
          <WrapItem width={{ base: '100%', sm: '45%', md: '45%', lg: '30%' }}>
            <Box w="100%">
              <ArticleImage image={article?.image} />
            </Box>
          </WrapItem>
        </Wrap>

        <VStack
          alignItems="flex-start"
          paddingTop="20px"
          spacing="2">
          <Text fontSize="lg">{article?.articleText} </Text>
        </VStack>
      </Container>
    </div>
  );
};

export default ArticleList;
