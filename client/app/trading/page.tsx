'use client';

import SymbolSearch from '@/components/SymbolSearch';
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { CopyrightStyles, MiniChart } from 'react-ts-tradingview-widgets';

import useWindowWidth from '@/hooks/useWindowWidth';
import { ErrorResponse } from '@/types/base';

import styles from '@/styles/pages/Trading.module.scss';

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const tradingViewStyles: CopyrightStyles = { parent: { display: 'none' } };

type AccountInfo = {
  cash: number;
  value: number;
};

type SymbolPrice = {
  symbol: string;
  price: string;
};

type TradeOrderResponse = {
  cash: number;
  symbol: string;
  price: number;
};

export default function TradingPage() {
  const { userId } = useAuth();

  // Used for Preview Modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [accInfo, setAccInfo] = useState<AccountInfo>();
  const [action, setAction] = useState<string>('buy');
  const [quantity, setQuantity] = useState<number>();
  const [symbol, setSymbol] = useState<string>();
  const [price, setPrice] = useState<number>();

  const windowWidth = useWindowWidth();

  const {
    center,
    container,
    accountInfo,
    info,
    valueName,
    valueText,
    searchWrapper,
    tradeWrapper,
    symbolInfo,
    tradeContainer,
    optionsWrapper,
    orderWrapper,
    amountsWrapper,
    amountContainer,
    showMax,
    buttonWrapper,
  } = styles;

  const getAccountInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/trading/accountInfo?userID=${userId}`,
      );

      if (response.ok) {
        const data: AccountInfo = await response.json();
        setAccInfo(data);
      } else {
        const error: ErrorResponse = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPrice = async () => {
    try {
      const response: Response = await fetch(
        `http://localhost:4000/trading/symbolPrice?symbol=${symbol}`,
      );
      if (response.ok) {
        const data: SymbolPrice = await response.json();
        setPrice(parseFloat(data.price));
      } else {
        const error: ErrorResponse = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const getMaxStocks = async () => {
    try {
      const response: Response = await fetch(
        `http://localhost:4000/trading/maxStocks?userID=${userId}&symbol=${symbol}`,
      );
      if (response.ok) {
        const data = await response.json();
        return parseInt(data.max);
      }
      const error: ErrorResponse = await response.json();
      console.error(error);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const buyStocks = async () => {
    try {
      const response: Response = await fetch(
        `http://localhost:4000/trading/buyStocks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userId,
            symbol,
            quantity,
            order: 'market',
          }),
        },
      );
      if (response.ok) {
        const data: TradeOrderResponse = await response.json();
        setAccInfo({
          cash: data.cash,
          value: accInfo?.value as number,
        });
        alert(`${symbol} was bought at ${USDollar.format(data.price)}`);
      } else {
        const error: ErrorResponse = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const sellStocks = async () => {
    try {
      const response: Response = await fetch(
        `http://localhost:4000/trading/sellStocks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userId,
            symbol,
            quantity,
            order: 'market',
          }),
        },
      );
      if (response.ok) {
        const data: TradeOrderResponse = await response.json();
        setAccInfo({
          cash: data.cash,
          value: accInfo?.value as number,
        });
        alert(`${symbol} was sold at ${USDollar.format(data.price)}`);
      } else {
        const error: ErrorResponse = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    getAccountInfo();
  }, []);

  const spacing = useBreakpointValue({ base: '20%', md: '51%' });

  if (!accInfo)
    return (
      <div className={center}>
        <Spinner
          color="blue.500"
          emptyColor="gray.200"
          size="xl"
          speed="0.65s"
          thickness="4px"
        />
        <Text>Loading Trading Account</Text>
      </div>
    );

  const getMaxQuantity = async () => {
    if (action === 'buy') return Math.floor(accInfo.cash / (price as number));
    if (action === 'sell') return await getMaxStocks();
  };

  const submitOrder = async () => {
    onClose();
    if (action === 'buy') await buyStocks();
    if (action === 'sell') await sellStocks();
  };

  return (
    <div className={container}>
      <HStack
        justifyContent={'space-between'}
        spacing={spacing}>
        <Heading
          as="h1"
          size="xl">
          Trading
        </Heading>
        <Link
          as="a"
          href="/trading/trade-history"
          ml="5">
          <Button>History</Button>
        </Link>
      </HStack>

      <div className={searchWrapper}>
        <SymbolSearch
          callback={(symbol: string) => {
            setSymbol(symbol);
            getPrice();
          }}
        />
        <div className={accountInfo}>
          <Text className={`${info} ${valueName}`}> Account Value </Text>
          <Text className={`${info} ${valueName}`}>Cash</Text>
          <Text className={`${info} ${valueText}`}>
            {USDollar.format(accInfo.value)}
          </Text>
          <Text className={`${info} ${valueText}`}>
            {USDollar.format(accInfo.cash)}
          </Text>
        </div>
      </div>
      <div className={tradeWrapper}>
        <div className={symbolInfo}>
          {symbol && (
            <MiniChart
              autosize={windowWidth <= 790}
              colorTheme="light"
              copyrightStyles={tradingViewStyles}
              dateRange="1M"
              height="270"
              largeChartUrl={`http://localhost:3000/research/info`}
              symbol={symbol}
              width="560"
            />
          )}
        </div>

        <div className={tradeContainer}>
          <div className={optionsWrapper}>
            <FormControl className={orderWrapper}>
              <FormLabel>Order Type</FormLabel>
              <Select
                placeholder="Market"
                width="100%"></Select>
            </FormControl>

            <FormControl>
              <FormLabel>Action</FormLabel>
              <Select
                onChange={(e) => setAction(e.target.value)}
                value={action}
                width={'100%'}>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </Select>
            </FormControl>
          </div>
          <div className={amountsWrapper}>
            <FormControl
              className={amountContainer}
              mr={'10%'}>
              <FormLabel>Quantity</FormLabel>
              <NumberInput
                defaultValue={0}
                min={0}
                onChange={(_, value) => setQuantity(value)}
                value={quantity}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <Button
              className={showMax}
              colorScheme="gray"
              maxWidth="30%"
              onClick={async () => setQuantity(await getMaxQuantity())}>
              Show Max
            </Button>
          </div>

          <ButtonGroup
            className={buttonWrapper}
            spacing="25">
            <Button
              colorScheme="red"
              onClick={() => {
                setAction('buy');
                setQuantity(undefined);
                setSymbol(undefined);
                setPrice(undefined);
              }}
              size={'lg'}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => onOpen()}
              size={'lg'}>
              Preview Order
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table>
                <Tbody>
                  <Tr>
                    <Td>
                      <b>
                        {`${symbol} : ${
                          action.charAt(0).toUpperCase() + action.slice(1)
                        } at Market`}
                      </b>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Price</Td>
                    <Td>{USDollar.format(price as number)}</Td>
                  </Tr>
                  <Tr>
                    <Td>Quantity</Td>
                    <Td>{quantity}</Td>
                  </Tr>
                  <Tr>
                    <Td>Estimated Total</Td>
                    <Td>
                      {USDollar.format(
                        (quantity as number) * (price as number),
                      )}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={onClose}
              variant="ghost">
              Change Order
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                await submitOrder();
              }}>
              Submit Order
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
