'use client';

import {
  Box,
  Button,
  Flex,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import {
  AdvancedRealTimeChart,
  CompanyProfile,
} from 'react-ts-tradingview-widgets';

import SymbolSearch from '@/components/SymbolSearch';

type ResearchInfoProps = {
  searchParams: {
    tvwidgetsymbol: string;
  };
};

export default function ResearchInfoPage({ searchParams }: ResearchInfoProps) {
  const router = useRouter();

  const parseSymbol = (tvwidgetsymbol: string) => {
    try {
      return !tvwidgetsymbol.includes(':')
        ? tvwidgetsymbol
        : tvwidgetsymbol.split(':')[1];
    } catch (error) {
      /**
       * User tries to access this page without passing a symbol gets
       * redirected to the Research Page
       */
      router.push('/research');
    }
  };

  const symbol = parseSymbol(searchParams.tvwidgetsymbol);

  return (
    <>
      <Heading
        marginLeft={'10px'}
        marginTop={10}>
        {symbol}
        <Flex
          alignItems="right"
          h="10vh"
          justifyContent="flex-end"
          marginRight={8}>
          <Button
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            bg={useColorModeValue('#151f21', 'gray.900')}
            color={'white'}
            onClick={() => router.push(`/trading`)}
            px={8}
            rounded={'md'}>
            Trade {symbol}
          </Button>
        </Flex>
      </Heading>

      <Flex
        justifyContent={'center'}
        marginLeft={300}>
        <Box>
          <SymbolSearch
            callback={(symbol: string) =>
              router.push(`/research/info?tvwidgetsymbol=${symbol}`)
            }
          />
        </Box>
      </Flex>
      <Box marginTop={100}>
        <AdvancedRealTimeChart symbol={symbol}></AdvancedRealTimeChart>
      </Box>
      <CompanyProfile
        height={400}
        symbol={symbol}
        width="100%"></CompanyProfile>
    </>
  );
}
