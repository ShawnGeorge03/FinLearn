import { Box, Image, Link } from '@chakra-ui/react';

type ArticleImageProps = {
  image: string | undefined;
};
const ArticleImage = ({ image }: ArticleImageProps) => {
  if (image == undefined) return <></>;

  return (
    <Box
      borderRadius="lg"
      overflow="hidden">
      <Link
        _hover={{ textDecoration: 'none' }}
        textDecoration="none">
        <Image
          _hover={{
            transform: 'scale(1.05)',
          }}
          alt="some text"
          float="left"
          objectFit="contain"
          src={image.toString()}
          transform="scale(1.0)"
          transition="0.3s ease-in-out"
          width="100%"
        />
      </Link>
    </Box>
  );
};
export default ArticleImage;
