import { Td, Tr } from '@chakra-ui/react';

type TradeHistoryRowProps = {
  symbol: string;
  price: number;
  quantity: number;
  action: string;
};

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const TradeHistoryRow = ({
  symbol,
  price,
  quantity,
  action,
}: TradeHistoryRowProps) => {
  return (
    <Tr>
      <Td>{symbol}</Td>
      <Td>{USDollar.format(price)}</Td>
      <Td>{quantity}</Td>
      <Td>{action}</Td>
    </Tr>
  );
};

export default TradeHistoryRow;
