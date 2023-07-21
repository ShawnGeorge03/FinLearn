import { Text } from '@chakra-ui/react';

import styles from '@/styles/components/SymbolCard.module.scss';

type SymbolCardProps = {
  name: string;
  symbol: string;
  callback: (symbol: string) => void;
};

const SymbolCard = ({ name, symbol, callback }: SymbolCardProps) => {
  const { container } = styles;

  return (
    <div
      className={container}
      onClick={() => callback(symbol)}>
      <Text
        fontSize="xl"
        paddingRight={'4em'}>
        {symbol}
      </Text>
      <Text fontSize="md"> {name}</Text>
    </div>
  );
};

export default SymbolCard;
