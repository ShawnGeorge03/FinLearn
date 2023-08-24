import { Link } from '@chakra-ui/react';

type NavLinkProps = {
  href: string;
  name: string;
};

const NavLink = ({ href, name }: NavLinkProps) => (
  <Link
    _hover={{ textDecoration: 'none', bg: 'brand.white' }}
    href={href}
    px={2}
    py={1}
    rounded={'md'}>
    {name}
  </Link>
);
export default NavLink;
