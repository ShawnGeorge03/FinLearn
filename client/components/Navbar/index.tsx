'use client';

import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import NavLink from './NavLink';

import logoImg from '@/public/Logo_Transparent_Dark.png';
import style from '@/styles/components/Navbar.module.scss';
import NextLink from 'next/link';
import UserAvatar from './UserAvatar';

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
  {
    name: 'Research',
    href: '/research',
  },
  {
    name: 'Trading',
    href: '/trading',
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
        alignItems={'center'}
        h={16}
        justifyContent={'space-between'}>
        <IconButton
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={isOpen ? onClose : onOpen}
          size={'md'}
        />
        <HStack
          alignItems={'center'}
          spacing={8}>
          <Link
            as={NextLink}
            href="/">
            <Image
              alt="Logo"
              className={style.logo}
              src={logoImg.src}
            />
          </Link>
          {isSignedIn && (
            <HStack
              as={'nav'}
              display={{ base: 'none', md: 'flex' }}
              spacing={4}>
              {navLinks.map((link) => (
                <NavLink
                  href={link.href}
                  key={link.name}
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
          display={{ md: 'none' }}
          pb={4}>
          <Stack
            as={'nav'}
            spacing={4}>
            {navLinks.map((link) => (
              <NavLink
                href={link.href}
                key={link.name}
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
