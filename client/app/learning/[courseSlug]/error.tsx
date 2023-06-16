'use client'; // Error components must be Client Components

import { useEffect } from 'react';

import styles from '@/styles/pages/Course.module.scss';
import { Button, Heading } from '@chakra-ui/react';
import Link from 'next/link';

export default function Error({ error }: { error: Error }) {
  useEffect(() => console.error(error), [error]);

  const { center } = styles;

  return (
    <div className={center}>
      <Heading size="md">Unable to find the Course</Heading>
      <Link href="/learning">
        <Button>Choose another Course.</Button>
      </Link>
    </div>
  );
}
