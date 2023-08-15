'use client';

import {
  Box,
  Button,
  Center,
  ChakraProvider,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  extendTheme,
} from '@chakra-ui/react';
import { SignUpButton } from '@clerk/nextjs';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0e4ff',
      100: '#cbb2ff',
      200: '#a480ff',
      300: '#7a4dff',
      400: '#641bfe',
      500: '#5a01e5',
      600: '#5200b3',
      700: '#430081',
      800: '#2d004f',
      900: '#14001f',
    },
  },
  fonts: {
    heading: `'Josefin Sans', sans-serif`,
    body: `'Josefin Sans', sans-serif`,
  },
});

type Highlights = {
  icon: string;
  title: string;
  description: string;
};

const highlights: Highlights[] = [
  {
    icon: '🦺',
    title: 'No Risk',
    description:
      'With FinLearn, users can learn to manage money without the risk of incurring any financial loss. The sandbox environment provides a safe space for experimentation and learning.',
  },
  {
    icon: '🔍️',
    title: 'Curated Lessons',
    description:
      'The platform offers expert-curated lessons that cover a wide range of financial concepts, including saving, budgeting, investing, insuring, and managing debts.',
  },
  {
    icon: '💸',
    title: 'Skills for Independence',
    description:
      'FinLearn equips young adults with the essential skills needed to lead an independent lifestyle and make informed financial decisions.',
  },
];

export default function Home() {
  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.lg">
        <Center
          minHeight="80vh"
          p={4}>
          <VStack>
            <Container
              maxW="container.md"
              textAlign="center">
              <Heading
                color="gray.700"
                mb={4}
                size="2xl">
                Learn about money by playing with it.
              </Heading>

              <Text
                color="gray.500"
                fontSize="xl">
                FinLearn offers you exclusive content to learn about money along
                with a sandbox environment to practice your learnings.
              </Text>

              <SignUpButton>
                <Button
                  colorScheme="linkedin"
                  marginBlock={8}>
                  Get me in now →
                </Button>
              </SignUpButton>

              <Text
                color="gray.500"
                fontSize="sm"
                my={2}>
                1457+ learners have signed up in the last 30 days
              </Text>
            </Container>
          </VStack>
        </Center>
      </Container>
      <div style={{ background: 'black' }}>
        <Container
          maxW="container.lg"
          py={[8, 28]}>
          <SimpleGrid
            minChildWidth="300px"
            spacingX={10}
            spacingY={20}>
            {highlights.map(({ icon, title, description }, idx: number) => (
              <Box
                key={idx}
                p={4}
                rounded="md">
                <Text fontSize="4xl">{icon}</Text>
                <Text
                  color="white"
                  fontWeight={500}>
                  {title}
                </Text>
                <Text
                  color="gray.500"
                  mt={4}>
                  {description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </div>
    </ChakraProvider>
  );
}
