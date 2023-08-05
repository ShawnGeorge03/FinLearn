import { createError } from './error';

type InputTypes = 'user' | 'text' | 'slug' | 'symbol';

const validInputRegex: Record<InputTypes, RegExp> = {
  user: /^user_[A-z0-9]+/,
  text: /^[a-zA-Z0-9&]+$/,
  slug: /^[a-z0-9-]+$/,
  symbol: /^[A-Z0-9.]{1,10}$/,
};

/**
 * Validates UserID
 *
 * @param {string} userID - The User ID to validate
 * @param {boolean} isQuery - User ID should be in the Query
 *
 * @return {boolean} True if the User ID is valid, else throws Error
 */
export const validateUserID = (userID: string, isQuery = true) => {
  if (userID === undefined)
    if (isQuery)
      // Handles Missing Query Param
      return {
        status: false,
        error: createError(
          'MissingQueryParams',
          'The request params requires userID="user_ + alphanumeric"',
        ),
      };
    // Handles Missing Body Param
    else
      return {
        status: false,
        error: createError(
          'MissingBodyParams',
          'The request params requires userID="user_ + alphanumeric"',
        ),
      };

  const errorMsg = 'userID must be "user_ + alphanumeric"';

  // Handles Null UserID
  if (userID === null)
    return { status: false, error: createError('InvalidUserID', errorMsg) };

  // Handles Blank UserID
  if (userID.length === 0)
    return { status: false, error: createError('MissingUserID', errorMsg) };

  // Checks if UserID follows the format
  if (!validInputRegex.user.test(userID))
    return { status: false, error: createError('InvalidUserID', errorMsg) };

  return { status: true, error: {} };
};

/**
 * Validate a field from teh Request
 *
 * @param {InputTypes} type - Type of Input
 * @param {string} input - Value from the Request
 * @param {string=} fieldName - Field from the Request (Defaults to 'field')
 *
 * @return {boolean} True if the input is valid else throws Error
 */
export const validateInput = (
  type: InputTypes,
  input: string,
  fieldName = 'field',
) => {
  // Handles Missing Query Param
  if (input === undefined)
    return {
      status: false,
      error: createError(
        'MissingQueryParams',
        `The request params requires ${fieldName}`,
      ),
    };

  const errorMsg =
    `${fieldName} must be an alphanumeric string` +
    (type === 'slug' ? ' with "-" for spaces' : '');

  // Handles Null Input
  if (input === null)
    return { status: false, error: createError('InvalidSlug', errorMsg) };

  // Handles Blank Input
  if (input.length === 0)
    return { status: false, error: createError('MissingSlug', errorMsg) };

  // Checks if Input follows the format
  if (!validInputRegex[type].test(input))
    return { status: false, error: createError('InvalidSlug', errorMsg) };

  return { status: true, error: {} };
};

export const validateStockQuantity = (quantity: string) => {
  if (quantity === undefined)
    return {
      status: false,
      error: createError(
        'MissingBodyParams',
        'The request params requires quantity',
      ),
    };

  if (quantity === null || parseInt(quantity) <= 0)
    return {
      status: false,
      error: createError(
        'InvalidTradeStockQuantity',
        'quantity must be greater than 0',
      ),
    };

  return { status: true, error: {} };
};

export const validateTradeOrder = (
  userID: string,
  symbol: string,
  quantity: string,
  order: string,
) => {
  // Missing Body
  if (!userID && !symbol && !quantity && !order)
    return {
      status: false,
      error: createError(
        'MissingBodyParams',
        'Requires the following fields: [userID, symbol, order, quantity]',
      ),
    };

  // Verify UserID
  const userIDValidation = validateUserID(userID, false);
  if (!userIDValidation.status) return { ...userIDValidation };

  // Verify Symbol
  const symbolValidation = validateInput('symbol', symbol, 'symbol');
  if (!symbolValidation.status) return { ...symbolValidation };

  // Verify Quantity
  const quantityValidation = validateStockQuantity(quantity);
  if (!quantityValidation.status) return { ...quantityValidation };

  // Verify Order
  if (order !== 'market')
    return {
      status: false,
      error: createError(
        'InvalidTradeOrder',
        'Stocks can only be traded using `market` order',
      ),
    };

  return {
    status: true,
    error: {},
    userID,
    symbol,
    order,
    quantity: parseInt(quantity),
  };
};
