// Request Error will be used to handle User Request related Errors
type RequestErrorTypes =
  | 'MissingBodyParams'
  | 'MissingQueryParams'
  | 'MissingUserID'
  | 'InvalidUserID'
  | 'MissingSlug'
  | 'InvalidSlug'
  | 'InvalidTradeOrder'
  | 'InvalidTradeStockQuantity'
  | 'InvalidTickerSymbol'
  | 'AlphaVantageError'
  | 'ParentUnitNotFound'
  | 'ParentCourseNotFound'
  | 'PortfolioDoesNotExist';

// Database Error will be used to handle Mongo Query related Errors
type DatabaseErrorTypes =
  | 'CoursesDoesNotExist'
  | 'CourseDoesNotExist'
  | 'UnitDoesNotExist'
  | 'ArticleDoesNotExist'
  | 'VideoDoesNotExist'
  | 'UserDoesNotExist'
  | 'UserProgressDoesNotExist'
  | 'DuplicateUserID';

// Clerk Error will be used to handle Clerk related Errors
type ClerkErrorTypes = 'UnknownEvent';

type ErrorTypes =
  | RequestErrorTypes
  | DatabaseErrorTypes
  | ClerkErrorTypes
  | 'InternalServerError';

type ErrorResponse = {
  type: ErrorTypes;
  message: string;
};

/**
 * Generates an Error Response
 *
 * @param {ErrorTypes} type - Error Class
 * @param {string} message - Error Message
 *
 * @return {ErrorResponse} Response Object for Errors
 */
export const createError = (
  type: ErrorTypes,
  message: string,
): ErrorResponse => {
  return { type, message };
};
