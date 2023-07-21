'use client';

import { Button, ButtonGroup, Spinner } from '@chakra-ui/react';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';

const UserAvatar = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <Spinner size="md" />;

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
