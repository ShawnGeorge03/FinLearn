import { HStack, Text } from '@chakra-ui/react';

type BlogAuthorProps = {
  date: string | undefined;
  name: string | undefined;
};

const BlogAuthor = ({ date, name }: BlogAuthorProps) => {
  const formattedDate = new Date(date as string).toLocaleDateString();

  return (
    <HStack
      alignItems="center"
      display="flex"
      marginTop="2"
      spacing="2">
      <Text fontWeight="medium">{name}</Text>
      <Text> — {formattedDate}</Text>
    </HStack>
  );
};

export default BlogAuthor;
