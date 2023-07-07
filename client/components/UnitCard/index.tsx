'use client';

import { Card, CardHeader, CardBody } from '@chakra-ui/react';
import { Heading, Text } from '@chakra-ui/react';

import styles from '@/styles/components/UnitCard.module.scss';
import Link from 'next/link';

type UnitProps = {
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

const UnitCard = ({ name, courseSlug, contents }: UnitProps) => {
  const { unitHeader, contentWrapper } = styles;

  return (
    <Card variant="elevated">
      <CardHeader
        bg="brand.black"
        color="brand.white"
        borderTopRadius="md"
        className={unitHeader}>
        <Heading
          size="md"
          textTransform="capitalize">
          {name}
        </Heading>
      </CardHeader>
      <CardBody
        bg="brand.gray"
        borderBottomRadius="md"
        className={contentWrapper}>
        {contents.map(({ name, slug, contentType }, contentKey) => {
          return (
            <Link
              key={contentKey}
              href={`/learning/${courseSlug}/${contentType}/${slug}`}>
              <Text size="sm"> {name} </Text>
            </Link>
          );
        })}
      </CardBody>
    </Card>
  );
};

export default UnitCard;
