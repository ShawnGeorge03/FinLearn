import { HStack, Text } from '@chakra-ui/react';
import React from 'react';

type BlogAuthorProps = {
  date: string;
  name: string;
};

const BlogAuthor: React.FC<BlogAuthorProps> = (props: BlogAuthorProps) => {
  return (
    <HStack
      alignItems="center"
      display="flex"
      marginTop="2"
      spacing="2">
      <Text fontWeight="medium">By: {props.name}</Text>
      <Text>— {props.date}</Text>
    </HStack>
  );
};
export default BlogAuthor;
