import { load } from 'ts-dotenv';

export type AlphaVantageParams = Record<string, string | number>;

/**
 * Makes an API request to AlphaVantage.
 *
 * @param {AlphaVantageParams} params - The parameters to pass to the API.
 * @return {Promise} A Promise that resolves with the API response or rejects with an error.
 */
export const queryAlphaVantage = async (params: AlphaVantageParams) => {
  try {
    // Load and Set API key from environment variable
    const { ALPHAVANTAGE_API_KEY } = load({ ALPHAVANTAGE_API_KEY: String });

    // Serializes the Params Dictionary
    const serializedParams = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    // Sends the Request and returns a Response
    const url = `https://www.alphavantage.co/query?${serializedParams}&apikey=${ALPHAVANTAGE_API_KEY}`;
    const response: Response = await fetch(url);
    return response.ok ? await response.json() : {};
  } catch (error) {
    console.error(error);
    return {
      type: 'InternalServerError',
      message: 'An error occurred while making the API request.',
    };
  }
};

type GlobalQuoteResponse = {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
};

type GlobalQuote = {
  symbol: string;
  open: number;
  high: number;
  low: number;
  price: number;
  volume: number;
  latestTradingDate: string;
  previousClose: number;
  change: number;
  changePercent: string;
};

export const getGlobalQuote = async (
  symbol: string,
  isManipulated = false,
): Promise<GlobalQuote | undefined | null> => {
  const { 'Global Quote': globalQuote }: GlobalQuoteResponse =
    await queryAlphaVantage({
      function: 'GLOBAL_QUOTE',
      symbol: symbol,
    });

  if (!globalQuote) return undefined;

  if (Object.keys(globalQuote).length === 0) return null;

  const price = !isManipulated
    ? parseFloat(globalQuote['05. price'])
    : Math.random() +
      (parseFloat(globalQuote['03. high']) -
        parseFloat(globalQuote['04. low'])) +
      parseFloat(globalQuote['04. low']);

  return {
    symbol: globalQuote['01. symbol'],
    open: parseFloat(globalQuote['02. open']),
    high: parseFloat(globalQuote['03. high']),
    low: parseFloat(globalQuote['04. low']),
    price,
    volume: parseInt(globalQuote['06. volume']),
    latestTradingDate: globalQuote['07. latest trading day'],
    previousClose: parseFloat(globalQuote['08. previous close']),
    change: parseFloat(globalQuote['09. change']),
    changePercent: globalQuote['10. change percent'],
  };
};
