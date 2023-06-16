import { NavLinkProps } from '@/types/base';
import { Link } from '@chakra-ui/react';

const NavLink = ({ href, name }: NavLinkProps) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{ textDecoration: 'none', bg: 'brand.white' }}
    href={href}>
    {name}
  </Link>
);
export default NavLink;
