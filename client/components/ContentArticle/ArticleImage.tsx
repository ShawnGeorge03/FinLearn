import { Link, Image, Box } from '@chakra-ui/react';

type ArticleImageProps = {
  image: String | undefined;
};
const ArticleImage = ({ image }: ArticleImageProps) => {
  if (image == undefined) {
    return <></>;
  }

  return (
    <Box
      borderRadius="lg"
      overflow="hidden">
      <Link
        textDecoration="none"
        _hover={{ textDecoration: 'none' }}>
        <Image
          float="left"
          transform="scale(1.0)"
          src={image.toString()}
          alt="some text"
          objectFit="contain"
          width="100%"
          transition="0.3s ease-in-out"
          _hover={{
            transform: 'scale(1.05)',
          }}
        />
      </Link>
    </Box>
  );
};
export default ArticleImage;
