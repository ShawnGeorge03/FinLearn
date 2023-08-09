'use client';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { CompanyProfile, CopyrightStyles } from 'react-ts-tradingview-widgets';

import SymbolSearch from '@/components/SymbolSearch';

import styles from '@/styles/pages/ResearchMoreInfo.module.scss';

import dynamic from 'next/dynamic';
const AdvancedRealTimeChartNoSSR = dynamic(
  () =>
    import('react-ts-tradingview-widgets').then((w) => w.AdvancedRealTimeChart),
  {
    ssr: false,
  },
);

type ResearchInfoProps = {
  searchParams: {
    tvwidgetsymbol: string;
  };
};

const tradingViewStyles: CopyrightStyles = { parent: { display: 'none' } };

export default function ResearchInfoPage({ searchParams }: ResearchInfoProps) {
  const router = useRouter();

  const parseSymbol = (tvwidgetsymbol: string) => {
    try {
      if (tvwidgetsymbol.length === 0) throw new Error();
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

  const { container, searchWrapper, chart } = styles;

  return (
    <div className={container}>
      <Flex
        alignContent={'center'}
        justifyContent={'space-between'}
        marginBottom={5}>
        <Heading
          as="h1"
          size="xl">
          {symbol}
        </Heading>
        <Link href={`/trading?symbol=${symbol}`}>
          <Button
            colorScheme="blue"
            px={8}
            rounded="md">
            Trade {symbol}
          </Button>
        </Link>
      </Flex>
      <div className={searchWrapper}>
        <SymbolSearch
          callback={(symbol: string) =>
            router.push(`/research/info?tvwidgetsymbol=${symbol}`)
          }
        />
      </div>
      <Box marginBottom={10}>
        <AdvancedRealTimeChartNoSSR
          autosize
          container_id={chart}
          copyrightStyles={tradingViewStyles}
          symbol={symbol}
        />
      </Box>
      <CompanyProfile
        copyrightStyles={tradingViewStyles}
        height={400}
        symbol={symbol}
        width="100%"
      />
    </div>
  );
}
