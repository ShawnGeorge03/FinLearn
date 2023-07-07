'use client';

import ArticleImage from '@/components/ContentArticle/ArticleImage';
import BlogAuthor from '@/components/ContentArticle/BlogAuthor';
import SidePaneItem from '@/components/ContentVideo/SidePaneItem';
import styles from '@/styles/pages/Article.module.scss';
import { Article } from '@/types/learning';
import {
  Accordion,
  Box,
  Container,
  Divider,
  Heading,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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
        `http://localhost:4000/article?articleSlug=${params.articleSlug}`,
      );
      setCourse(dataCourse);
      const jsonData: any = await response.json();
      setArticle(jsonData.article);
    } catch (error) {
      console.error((error as Error).message);
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
                contents={contents}
                courseSlug={params?.courseSlug as string}
                key={unitKey}
                name={name}
              />
            );
          })}
        </Accordion>
      </div>
      {article == undefined ? (
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
      ) : (
        <Container maxW={'7xl'}>
          <Heading>{article?.name}</Heading>

          <Box>
            <BlogAuthor
              date={String(article.createdAt)}
              name={String(article.author)}
            />
          </Box>

          <Divider marginTop="5" />
          <Wrap
            marginTop="5"
            spacing="30px">
            <WrapItem width={{ base: '100%', sm: '45%', md: '45%', lg: '30%' }}>
              <Box w="100%">
                <ArticleImage image={article.image} />
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
      )}
    </div>
  );
};

export default ArticleList;
