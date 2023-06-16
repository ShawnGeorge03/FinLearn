'use client';

import { SignUpButton, SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import { Button, ButtonGroup, Spinner } from '@chakra-ui/react';
import { useEffect } from 'react';

const UserAvatar = () => {
  const { isLoaded, userId, isSignedIn } = useAuth();

  useEffect(() => {
    const body = { userID: userId }; // description is the key which is the same as the database schema field

    const postData = async () => {
      const response = await fetch(`http://localhost:4000/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    };

    postData().catch(console.error);
  }, [userId]);

  if (!isLoaded) {
    return <Spinner size="md" />;
  }

  return isSignedIn ? (
    <UserButton afterSignOutUrl="/" />
  ) : (
    <ButtonGroup gap="2">
      <SignUpButton>
        <Button
          colorScheme="linkedin"
          variant="outline">
          Sign Up
        </Button>
      </SignUpButton>
      <SignInButton>
        <Button
          colorScheme="linkedin"
          variant="solid">
          Sign In
        </Button>
      </SignInButton>
    </ButtonGroup>
  );
};

export default UserAvatar;
