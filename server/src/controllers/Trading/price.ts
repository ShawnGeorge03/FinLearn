import { Request, Response } from 'express';

import { getGlobalQuote } from '../../utils/query';

import { createError } from '../../utils/error';
import { validateInput } from '../../utils/validate';

/**
 * Retrieves the latest price for a given symbol
 *
 * @param {Request} req - Request Object must contain `symbol` in query
 * @param {Response} res - Response Object
 *
 * @return {Promise} Response Object with an Error or the Latest Price
 */
export const getTradingSymbolPrice = async (req: Request, res: Response) => {
  try {
    const symbol = req.query.symbol as string;

    const { status, error } = validateInput('symbol', symbol, 'symbol');
    if (!status) return res.status(400).json(error);

    const globalQuote = await getGlobalQuote(symbol);

    if (globalQuote === undefined)
      return res
        .status(400)
        .json(
          createError('AlphaVantageError', 'Unable to Retrive Latest Price'),
        );

    if (globalQuote === null)
      return res
        .status(400)
        .json(
          createError('InvalidTickerSymbol', `Symbol ${symbol} does not exist`),
        );

    res.status(200).json({
      symbol: globalQuote.symbol,
      price: globalQuote.price,
      change: globalQuote.change,
    });
  } catch (error) {
    res
      .status(500)
      .json(
        createError('InternalServerError', 'Failed to retrieve Latest Price'),
      );
  }
};
