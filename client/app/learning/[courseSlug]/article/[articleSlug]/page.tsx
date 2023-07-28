'use client';
import {
  Accordion,
  Box,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import ArticleImage from '@/components/ContentArticle/ArticleImage';
import BlogAuthor from '@/components/ContentArticle/BlogAuthor';
import SidePaneItem from '@/components/ContentVideo/SidePaneItem';

import styles from '@/styles/pages/Article.module.scss';

import { ErrorResponse } from '@/types/base';
import { CourseWithUnits } from '@/types/components/Dashboard-Learning/types';
import { Article } from '@/types/learning';

type ArticleProps = {
  params: {
    courseSlug?: string;
    articleSlug?: string;
  };
};

const ArticleList = ({ params }: ArticleProps) => {
  const { center, container, title, unitLists } = styles;

  const [article, setArticle] = useState<Article>();
  const [course, setCourse] = useState<CourseWithUnits>();

  const getCourseWithUnits = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/units?courseSlug=${params?.courseSlug}`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/article?articleSlug=${params.articleSlug}`,
      );
      if (response.ok) {
        const data: Article = await response.json();
        setArticle(data);
      } else {
        const error: ErrorResponse = await response.json();
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
        <Heading>{article?.name}</Heading>

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
