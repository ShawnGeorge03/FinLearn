'use client';

import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Image,
  Link,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NavLink from './NavLink';

import style from '@/styles/components/Navbar.module.scss';
import logoImg from '@/public/Logo_Transparent_Dark.png';
import UserAvatar from './UserAvatar';
import NextLink from 'next/link';

import { useAuth } from '@clerk/nextjs';

const navLinks = [
  {
    name: 'Dashboard',
    href: '/dashboard',
  },
  {
    name: 'Learning',
    href: '/learning',
  },
];

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isSignedIn } = useAuth();

  return (
    <Box
      bg="brand.gray"
      px={4}>
      <Flex
        h={16}
        alignItems={'center'}
        justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack
          spacing={8}
          alignItems={'center'}>
          <Link
            as={NextLink}
            href="/">
            <Image
              className={style.logo}
              src={logoImg.src}
              alt="Logo"
            />
          </Link>
          {isSignedIn && (
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  href={link.href}
                  name={link.name}
                />
              ))}
            </HStack>
          )}
        </HStack>
        <Flex alignItems={'center'}>
          <UserAvatar />
        </Flex>
      </Flex>

      {isOpen ? (
        <Box
          pb={4}
          display={{ md: 'none' }}>
          <Stack
            as={'nav'}
            spacing={4}>
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                href={link.href}
                name={link.name}
              />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};
export default Navbar;
