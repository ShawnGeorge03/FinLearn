'use client';

import { Box, Flex, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import {
  AdvancedRealTimeChart,
  CompanyProfile,
} from 'react-ts-tradingview-widgets';

import SymbolSearch from '@/components/SymbolSearch';

import styles from '@/styles/pages/ResearchInfo.module.scss';

type ResearchInfoProps = {
  searchParams: {
    tvwidgetsymbol: string;
  };
};

export default function ResearchInfoPage({ searchParams }: ResearchInfoProps) {
  const { container, searchWrapper } = styles;
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
