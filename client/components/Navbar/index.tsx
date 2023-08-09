'use client';

import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';

import useWindowWidth from '@/hooks/useWindowWidth';
import logoImg from '@/public/Logo_Transperant_light.png';
import styles from '@/styles/components/Navbar.module.scss';

const navLinks = [
  {
    name: 'Dashboard',
    href: '/dashboard',
  },
  {
    name: 'Learning',
    href: '/learning',
  },
  {
    name: 'Research',
    href: '/research',
  },
  {
    name: 'Trading',
    href: '/trading',
  },
  {
    name: 'Favourites',
    href: '/dashboard/favourites',
  },
];

type NavLinkProps = {
  href: string;
  name: string;
};

const NavLink = ({ href, name }: NavLinkProps) => (
  <Link
    _hover={{ textDecoration: 'none', bg: 'brand.grey' }}
    color={'white'}
    href={href}
    px={2}
    py={1}
    rounded={'md'}>
    {name}
  </Link>
);

const NavButtons = () => (
  <ButtonGroup gap="2">
    <SignUpButton>
      <Button
        colorScheme="linkedin"
        variant="solid">
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

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isSignedIn } = useAuth();

  const { icon, logoWrapper, logo } = styles;

  const windowWidth = useWindowWidth();

  return (
    <Box
      bg="black"
      px={2}>
      <Flex
        alignItems={'center'}
        h={16}
        justifyContent={'space-between'}>
        <IconButton
          _hover={{
            backgroundColor: 'transparent',
          }}
          aria-label={'Open Menu'}
          bg={'transparent'}
          className={icon}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={isOpen ? onClose : onOpen}
        />
        <Link
          className={logoWrapper}
          href={'/'}>
          <Image
            alt="Logo"
            className={logo}
            fit="contain"
            loading="eager"
            paddingLeft={3}
            src={logoImg.src}
          />
        </Link>
        <Box paddingRight={3}>
          {!isSignedIn && windowWidth > 660 && <NavButtons />}
          {isSignedIn && windowWidth > 660 && (
            <HStack>
              {navLinks.map(({ name, href }, idx) => (
                <NavLink
                  href={href}
                  key={idx}
                  name={name}
                />
              ))}
              <UserButton />
            </HStack>
          )}
        </Box>
      </Flex>
      {isOpen && windowWidth < 660 && (
        <Box pb={4}>
          <Stack
            alignItems="center"
            as="nav"
            spacing={4}>
            {isSignedIn ? (
              navLinks.map(({ name, href }, idx) => (
                <NavLink
                  href={href}
                  key={idx}
                  name={name}
                />
              ))
            ) : (
              <NavButtons />
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};
export default Navbar;
