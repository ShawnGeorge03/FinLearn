export type TopStocksResults = {
  top_gainers: StockSliderInfo[];
  top_losers: StockSliderInfo[];
  most_actively_traded: StockSliderInfo[];
};

type StockSliderInfo = {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
};
