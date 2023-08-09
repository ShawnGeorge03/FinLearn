export type AccountInfo = {
  cash: number;
  value: number;
};

export type SymbolPrice = {
  symbol: string;
  price: string;
};

export type TradeOrderResponse = {
  cash: number;
  symbol: string;
  price: number;
};

export type TradingProps = {
  searchParams: {
    symbol: string;
  };
};
