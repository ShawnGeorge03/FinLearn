import { Request, Response } from 'express';

import modelUser from '../../models/Account/user';
import modelAccount from '../../models/Trading/account';
import modelPortfolio from '../../models/Trading/portfolio';

import { createError } from '../../utils/error';
import { getGlobalQuote } from '../../utils/query';
import {
  validateInput,
  validateTradeOrder,
  validateUserID,
} from '../../utils/validate';

const getTradingModels = async (userID: string, symbol: string) => {
  const user = await modelUser.findOne({ userID });
  const modelsStatus = false;

  if (!user)
    return {
      modelsStatus,
      modelsError: createError(
        'UserDoesNotExist',
        `User with ID: ${userID} does not exist`,
      ),
    };

  const tradingAccount = await modelAccount
    .findOne({ userID: user.id })
    .select('cash value holdings');

  if (!tradingAccount)
    return {
      modelsStatus,
      modelsError: createError(
        'UserDoesNotExist',
        `User with ID: ${userID} does not have a Trading Account`,
      ),
    };

  const portfolio = await modelPortfolio.findOne({ userID: user.id });

  if (!portfolio)
    return {
      modelsStatus,
      modelsError: createError(
        'UserDoesNotExist',
        `User with ID: ${userID} does not have a Trading Account`,
      ),
    };

  const quote = await getGlobalQuote(symbol);

  if (quote === undefined)
    return {
      modelsStatus,
      modelsError: createError(
        'AlphaVantageError',
        'Unable to Retrive Latest Price',
      ),
    };

  if (quote === null)
    return {
      modelsStatus,
      modelsError: createError(
        'InvalidTickerSymbol',
        `Symbol ${symbol} does not exist`,
      ),
    };

  return {
    modelsStatus: true,
    modelsError: {},
    tradingAccount,
    portfolio,
    price: quote.price,
  };
};

export const getMaxStocks = async (req: Request, res: Response) => {
  try {
    const userID = req.query.userID as string;
    const symbol = req.query.symbol as string;

    // Verify UserID
    const userIDValidation = validateUserID(userID);
    if (!userIDValidation.status)
      return res.status(400).json(userIDValidation.error);

    // Verify Symbol
    const symbolValidation = validateInput('symbol', symbol, 'symbol');
    if (!symbolValidation.status)
      return res.status(400).json(symbolValidation.error);

    const user = await modelUser.findOne({ userID });

    if (!user)
      return res
        .status(400)
        .json(
          createError(
            'UserDoesNotExist',
            `User with ID: ${userID} does not exist`,
          ),
        );

    const portfolio = await modelPortfolio.findOne({ userID: user.id });

    if (!portfolio)
      return res
        .status(400)
        .json(
          createError(
            'UserDoesNotExist',
            `User with ID: ${userID} does not have a Trading Account`,
          ),
        );

    if (!portfolio.holdings.equity.has(symbol))
      return res
        .status(400)
        .json(
          createError('InvalidTickerSymbol', `User does not own ${symbol}`),
        );

    const numStocksOwned = portfolio.holdings.equity
      .get(symbol)
      ?.reduce((accumulator, position) => {
        return accumulator + position.quantity;
      }, 0);

    res.status(200).json({
      max: numStocksOwned,
    });
  } catch (error) {
    res
      .status(500)
      .json(createError('InternalServerError', 'Failed to Find Max Stocks'));
  }
};

export const buyStocks = async (req: Request, res: Response) => {
  try {
    const { status, error, userID, symbol, order, quantity } =
      validateTradeOrder(
        req.body.userID as string,
        req.body.symbol as string,
        req.body.quantity as string,
        req.body.order as string,
      );
    if (!status || !userID || !symbol || !order || !quantity)
      return res.status(400).json(error);

    const { modelsStatus, modelsError, tradingAccount, portfolio, price } =
      await getTradingModels(userID, symbol);

    if (!modelsStatus || !tradingAccount || !portfolio || !price)
      return res.status(400).json(modelsError);

    tradingAccount.cash -= price * quantity;
    tradingAccount.save();

    if (portfolio.holdings.equity.has(symbol)) {
      const currValues = portfolio.holdings.equity.get(symbol);
      if (currValues)
        portfolio.holdings.equity.set(symbol, [
          ...currValues,
          { quantity, price },
        ]);
    } else portfolio.holdings.equity.set(symbol, [{ quantity, price }]);

    portfolio.history.equity.push({
      action: 'buy',
      order: 'market',
      symbol,
      quantity,
      price,
    });
    portfolio.save();

    res.status(200).json({
      cash: tradingAccount.cash,
      symbol,
      price,
    });
  } catch (error) {
    res
      .status(500)
      .json(createError('InternalServerError', 'Failed to Buy Stocks'));
  }
};

export const sellStocks = async (req: Request, res: Response) => {
  try {
    const { status, error, userID, symbol, order, quantity } =
      validateTradeOrder(
        req.body.userID as string,
        req.body.symbol as string,
        req.body.quantity as string,
        req.body.order as string,
      );
    if (!status || !userID || !symbol || !order || !quantity)
      return res.status(400).json(error);

    const { modelsStatus, modelsError, tradingAccount, portfolio, price } =
      await getTradingModels(userID, symbol);

    if (!modelsStatus || !tradingAccount || !portfolio || !price)
      return res.status(400).json(modelsError);

    if (!portfolio.holdings.equity.has(symbol))
      return res
        .status(400)
        .json(
          createError(
            'InvalidTradeOrder',
            `You do own ${symbol} in your holdings`,
          ),
        );

    const positions = portfolio.holdings.equity.get(symbol);

    if (positions) {
      const numStocksOwned = positions?.reduce((accumulator, position) => {
        return accumulator + position.quantity;
      }, 0);

      if ((numStocksOwned as number) < quantity)
        return res
          .status(400)
          .json(
            createError(
              'InvalidTradeOrder',
              `You only own ${numStocksOwned as number} shares of ${symbol} `,
            ),
          );

      for (let idx = 0; idx < positions?.length; idx++) {
        const unusedPositions = positions.filter(
          (value) => value !== positions[idx],
        );
        if (positions[idx].quantity > quantity) {
          portfolio.holdings.equity.set(symbol, [
            ...unusedPositions,
            {
              quantity: positions[idx].quantity - quantity,
              price: positions[idx].price,
            },
          ]);
          tradingAccount.cash += price * quantity;
          portfolio.history.equity.push({
            action: 'sell',
            order: 'market',
            price,
            quantity,
            symbol,
          });
          break;
        }

        if (positions[idx].quantity === quantity) {
          portfolio.holdings.equity.delete(symbol);
          tradingAccount.cash += price * quantity;
          portfolio.history.equity.push({
            action: 'sell',
            order: 'market',
            price,
            quantity,
            symbol,
          });
          break;
        }

        tradingAccount.cash += price * quantity;
        portfolio.history.equity.push({
          action: 'sell',
          order: 'market',
          price,
          quantity: positions[idx].quantity,
          symbol,
        });
        portfolio.holdings.equity.set(symbol, [...unusedPositions]);
      }
      portfolio.save();
      tradingAccount.save();

      res.status(200).json({
        cash: tradingAccount.cash,
        symbol,
        price,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json(createError('InternalServerError', 'Failed to Sell Stocks'));
  }
};
