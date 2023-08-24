import {
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { CopyrightStyles, MiniChart } from 'react-ts-tradingview-widgets';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaQuestion } from '@react-icons/all-files/fa/FaQuestion';

import styles from '@/styles/components/TopStocks.module.scss';

type TopStocksMode = 'topGainers' | 'topLosers' | 'mostActivelyTraded';
type TopStocksResults = Record<TopStocksMode, string[]>;

export default function TopStocks() {
  const [topStocks, setTopStocks] = useState<TopStocksResults>();
  const [mode, setMode] = useState<TopStocksMode>('topGainers');

  const twStyles: CopyrightStyles = { parent: { display: 'none' } };

  const modeToText = {
    topGainers: 'Top Gainers',
    topLosers: 'Top Losers',
    mostActivelyTraded: 'Most Actively Traded',
  };

  const getTopStocks = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/topStocks`,
      );
      const data: TopStocksResults = await response.json();
      setTopStocks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTopStocks();
  }, []);

  const { container, center, wrapper, content, question } = styles;

  const isEmpty =
    topStocks && Object.values(topStocks).every((value) => value.length === 0);

  return (
    <>
      <Menu isLazy>
        <Flex
          alignItems="center"
          gap="2"
          marginBottom={'20px'}
          marginTop={'10px'}
          minWidth="max-content">
          <Heading
            mb="1"
            mt="3"
            size="md"
            w="100%">
            {modeToText[mode]}
          </Heading>
          <Spacer />
          <MenuButton
            aria-label="Options"
            as={IconButton}
            icon={<ChevronDownIcon />}
            variant="outline"
          />
        </Flex>
        <MenuList>
          <MenuItem onClick={() => setMode('topGainers')}>Top Gainers</MenuItem>
          <MenuItem onClick={() => setMode('topLosers')}>Top Losers</MenuItem>
          <MenuItem onClick={() => setMode('mostActivelyTraded')}>
            Most Actively Traded
          </MenuItem>
        </MenuList>
      </Menu>

      <div className={topStocks ? container : center}>
        {isEmpty && (
          <div className={center}>
            <FaQuestion className={question} />
            No Results
          </div>
        )}
        {topStocks && topStocks[mode].length !== 0 && (
          <div className={wrapper}>
            {topStocks[mode].map((symbol: string, idx) => {
              return (
                <div
                  className={content}
                  key={idx}>
                  <MiniChart
                    colorTheme="light"
                    copyrightStyles={twStyles}
                    largeChartUrl={`http://localhost:3000/research/info`}
                    symbol={symbol.replace('+', '')} // MiniChart does not recognize tickers with '+' - shows loading icon indefinitely
                    width={'auto'}
                  />
                </div>
              );
            })}
          </div>
        )}
        {!topStocks && (
          <Spinner
            color="blue.500"
            emptyColor="gray.200"
            m={'auto'}
            size="xl"
            speed="0.65s"
            thickness="4px"
          />
        )}
      </div>
    </>
  );
}
