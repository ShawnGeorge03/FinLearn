'use client';

import { SignUp } from '@clerk/nextjs';
import { Center } from '@chakra-ui/react';

export default function Page() {
  return (
    <Center marginY={'6vh'}>
      <SignUp
        appearance={{
          layout: {
            logoPlacement: 'inside',
          },
          variables: {
            colorPrimary: 'black',
          },
        }}
      />
    </Center>
  );
}
