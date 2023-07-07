import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Link,
  Text,
} from '@chakra-ui/react';

type SidePaneItemProp = {
  name: string;
  courseSlug: string;
  contents: [
    {
      name: string;
      slug: string;
      contentType: 'video' | 'article';
    },
  ];
};

const SidePaneItem = ({ name, contents, courseSlug }: SidePaneItemProp) => {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box
            as="span"
            flex="1"
            textAlign="left">
            {name}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {contents.map(({ name, slug, contentType }, contentKey) => {
          return (
            <Link
              key={contentKey}
              href={`/learning/${courseSlug}/${contentType}/${slug}`}>
              <Text
                size="sm"
                marginTop="10">
                {name}
              </Text>
            </Link>
          );
        })}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default SidePaneItem;
