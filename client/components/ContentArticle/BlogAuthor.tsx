import React, { useState, useEffect } from 'react';
import { HStack, Tag, SpaceProps, Text } from '@chakra-ui/react';

interface IBlogTags {
  tags: Array<string>;
  marginTop?: SpaceProps['marginTop'];
}
type BlogAuthorProps = {
  date: String;
  name: String;
};
const BlogAuthor: React.FC<BlogAuthorProps> = (props: BlogAuthorProps) => {
  return (
    <HStack
      marginTop="2"
      spacing="2"
      display="flex"
      alignItems="center">
      <Text fontWeight="medium">By: {props.name}</Text>
      <Text>— {props.date}</Text>
    </HStack>
  );
};
export default BlogAuthor;
