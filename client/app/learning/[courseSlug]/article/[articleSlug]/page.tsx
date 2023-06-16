'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '@/types/learning';
import {
  Box,
  Heading,
  Link,
  Image,
  Text,
  Divider,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  Accordion,
  Container,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import BlogAuthor from '@/components/ContentArticle/BlogAuthor';
import ArticleImage from '@/components/ContentArticle/ArticleImage';
import styles from '@/styles/pages/Course.module.scss';
import SidePaneItem from '@/components/ContentVideo/SidePaneItem';
import { Course } from '../../page';

type ArticleProps = {
  params: {
    courseSlug?: string;
    articleSlug?: string;
  };
};

const ArticleList = ({ params }: ArticleProps) => {
  const [article, setArticle] = useState<Article>();
  const [course, setCourse] = useState<Course>();
  const { container, title, unitLists } = styles;

  const getArticle = async () => {
    try {
      const urlCourse = `http://localhost:4000/units?courseSlug=${params?.courseSlug}`;
      const responseCourse = await fetch(urlCourse);
      const dataCourse: Course = await responseCourse.json();
      // update to better promise handling
      const response: Response = await fetch(
        `http://localhost:4000/articles?articleSlug=${params.articleSlug}`
      );
      setCourse(dataCourse);
      const jsonData: any = await response.json();
      setArticle(jsonData.article);
    } catch (e: any) {
      console.error(e.message);
    }
  };

  /* Without a dependency array the call to get all article is only made once */
  useEffect(() => {
    getArticle();
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
      {article == undefined ? (
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
        <Container maxW={'7xl'}>
          <Heading>{article?.name}</Heading>

          <Box>
            <BlogAuthor
              name={String(article.author)}
              date={String(article.createdAt)}
            />
          </Box>

          <Divider marginTop="5" />
          <Wrap
            spacing="30px"
            marginTop="5">
            <WrapItem width={{ base: '100%', sm: '45%', md: '45%', lg: '30%' }}>
              <Box w="100%">
                <ArticleImage image={article.image} />
              </Box>
            </WrapItem>
          </Wrap>
          <VStack
            paddingTop="20px"
            spacing="2"
            alignItems="flex-start">
            <Text fontSize="lg">{article?.articleText} </Text>
          </VStack>
        </Container>
      )}
    </div>
  );
};

export default ArticleList;
