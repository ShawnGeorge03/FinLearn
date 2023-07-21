'use client';

import { Heading } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { CopyrightStyles, Screener } from 'react-ts-tradingview-widgets';

import SymbolSearch from '@/components/SymbolSearch';
import TopStocks from '@/components/TopStocks/';

import styles from '@/styles/pages/Research.module.scss';

export default function ResearchPage() {
  const tradingViewStyles: CopyrightStyles = { parent: { display: 'none' } };

  const { container, searchWrapper } = styles;
  const router = useRouter();

  return (
    <div className={container}>
      <Heading
        as="h1"
        size="xl">
        Research
      </Heading>
      <div className={searchWrapper}>
        <SymbolSearch
          callback={(symbol: string) =>
            router.push(`/research/info?tvwidgetsymbol=${symbol}`)
          }
        />
      </div>
      <TopStocks />
      <Heading
        mb="1"
        mt="3"
        size="md"
        w="100%">
        Stock Screener
      </Heading>

      <Screener
        colorTheme="light"
        copyrightStyles={tradingViewStyles}
        defaultScreen="most_capitalized"
        largeChartUrl={`http://localhost:3000/research/info`}
        market="america"
        width="100%"
      />
    </div>
  );
}
