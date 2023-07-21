/* eslint-disable camelcase */
import { Request, Response } from 'express';

import { createError } from '../utils/error';
import { queryAlphaVantage } from '../utils/query';

import { TopStocksResults } from '../types/research';

/**
 *
 * @param {Request} req - Must contain `userID` in body
 * @param {Response} res - Response Object
 *
 * @return {Response} - Response Object with an Error or Success
 */
export const getTopStocks = async (req: Request, res: Response) => {
  try {
    const { top_gainers, top_losers, most_actively_traded }: TopStocksResults =
      await queryAlphaVantage({ function: 'TOP_GAINERS_LOSERS' });

    const response = {
      topGainers: top_gainers
        ? top_gainers.slice(0, 10).map((stock) => stock.ticker)
        : [],
      topLosers: top_losers
        ? top_losers.slice(0, 10).map((stock) => stock.ticker)
        : [],
      mostActivelyTraded: most_actively_traded
        ? most_actively_traded.slice(0, 10).map((stock) => stock.ticker)
        : [],
    };

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json(
        createError('InternalServerError', 'Failed to retrieve Top Stocks'),
      );
  }
};

type SymbolSearchResults = {
  symbol: string;
  name: string;
};

/**
 * Retrieves a list of best matches for a given symbol query
 *
 * @param {Request} req - Must contain `searchText` in query
 * @param {Response} res - Response Object
 *
 * @return {Promise} Response Object with an Error or SymbolSearchResults
 */
export const getSymbolAutoComplete = async (req: Request, res: Response) => {
  const searchText = req.query.searchText as string;
  if (!searchText)
    return res.status(400).json({ message: 'Please provide searchText' });

  const userIDRegex = /^[A-Za-z]+/;
  if (!userIDRegex.test(searchText))
    return res.status(400).json({ message: 'Invalid searchText' });

  try {
    const { bestMatches }: { bestMatches: Record<string, string>[] } =
      await queryAlphaVantage({
        function: 'SYMBOL_SEARCH',
        keywords: searchText,
      });

    if (!bestMatches)
      return res.status(400).json({ message: 'Unable Find Results' });

    const result: SymbolSearchResults[] = bestMatches
      .filter((result) => {
        return result['3. type'] === 'Equity';
      })
      .map((result) => {
        return {
          symbol: result['1. symbol'],
          name: result['2. name'],
        };
      });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: 'Unable Search Symbol' });
  }
};
