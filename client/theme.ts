import { extendTheme } from '@chakra-ui/react';
/*
color theme for chakra ui
*/
const theme = extendTheme({
  colors: {
    brand: {
      gray: '#D9D9D9',
      black: '#000000',
      white: '#FFFFFF',
      blue: '#4880C8',
    },
  },
  font: {
    heading: `'Josefin Sans', sans-serif`,
    body: `'Josefin Sans', sans-serif`,
  },
});

export default theme;
