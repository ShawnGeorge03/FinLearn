import { Router } from 'express';

import { getStatus } from '../controllers/status';

import {
  getAllCourses,
  getAllUnitProgress,
  getAllUnitsBySlug,
  getArticleBySlug,
  getAutoCompleteResults,
  getFavouriteArticles,
  getFavouriteVideos,
  getLearningProgress,
  getSearchResults,
  getVideoBySlug,
  getVideoProgressBySlug,
  toggleFavoriteArticle,
  toggleFavoriteVideo,
  updateVideoProgress,
} from '../controllers/Learning';

import {
  getArticleProgressBySlug,
  updateArticleProgress,
} from '../controllers/Learning/article';
import { getSymbolAutoComplete, getTopStocks } from '../controllers/research';

import {
  buyStocks,
  getMaxStocks,
  getPortfolio,
  getTradingAccountInfo,
  getTradingSymbolPrice,
  sellStocks,
} from '../controllers/Trading/';

const api = Router();

/**
 * @route GET /status
 * @description Get Status of Database
 * @access public
 */
api.get('/status', getStatus);

/**
 * @route GET /courses
 * @description Get all the courses
 * @access public
 */
api.get('/courses', getAllCourses);

/**
 * @route GET /units
 * @description Get a specific course by ID
 * @access public
 */
api.get('/units', getAllUnitsBySlug);

/**
 * @route GET /article
 * @description Get all the articles
 * @access public
 */
api.get('/article', getArticleBySlug);

/**
 * @route GET /video
 * @description Get all videos in the database
 * @access public
 */
api.get('/video', getVideoBySlug);

/**
 * @route GET /search
 * @description Get all the search results
 * @access public
 */
api.get('/search', getSearchResults);

/**
 * @route GET /searchAutoComplete
 * @description Get all the autocomplete results
 * @access public
 */
api.get('/searchAutoComplete', getAutoCompleteResults);

/**
 * @route GET /learningProgress
 * @description Get course progress
 * @access public
 */
api.get('/learningProgress', getLearningProgress);

/**
 * @route GET /unitsProgress
 * @description Get a specific course by ID
 * @access public
 */
api.get('/unitsProgress', getAllUnitProgress);

/**
 * @route GET /top10Stocks
 * @description Get the Top 10 stocks to trade in the market
 * @access public
 */
api.get('/topStocks', getTopStocks);

/**
 * @route GET /symbolSearch
 * @description Get best matches for symbol keywords
 * @access public
 */
api.get('/symbolSearch', getSymbolAutoComplete);

/**
 * @route GET /progress
 * @description Get progress of a user for video
 * @access public
 */
api.get('/progress/video', getVideoProgressBySlug);

/**
 * @route GET /portfolio
 * @description Get portfolio of specific user
 * @access public
 */
api.get('/trading/portfolio', getPortfolio);

/**

 * @route PATCH /videoProgress
 * @description Update progress for user
 * @access public
 */
api.patch('/videoProgress', updateVideoProgress);

/**
 * @route GET /progress
 * @description Get progress of a user for article
 * @access public
 */
api.get('/progress/article', getArticleProgressBySlug);

/**

 * @route PATCH /articleProgress
 * @description Update progress for user
 * @access public
 */
api.patch('/articleProgress', updateArticleProgress);

/**
 * @route GET /favouriteArticles
 * @description Get all the favourited articles
 * @access public
 */
api.get('/favouriteArticles', getFavouriteArticles);

/**
 * @route GET /favouriteVideos
 * @description Get all the favourited videos
 * @access public
 */
api.get('/favouriteVideos', getFavouriteVideos);

/**
 * @route PATCH /toggleFavoriteArticles
 * @description Toggles isFavorited field in an Article
 * @access public
 */
api.patch('/toggleFavoriteArticle', toggleFavoriteArticle);

/**
 * @route PATCH /toggleFavoriteVideos
 * @description Toggles isFavorited field in a Video
 * @access public
 */
api.patch('/toggleFavoriteVideo', toggleFavoriteVideo);

/**
 * @route GET /latestPrice
 * @description Get latest price of a stock
 * @access public
 */
api.get('/trading/symbolPrice', getTradingSymbolPrice);

/*
 * @route GET /tradingAccInfo
 * @description Retrive Trading Account Info
 * @access public
 */
api.get('/trading/accountInfo', getTradingAccountInfo);

/*
 * @route GET /tradingAccInfo
 * @description Retrive Trading Account Info
 * @access public
 */
api.get('/trading/maxStocks', getMaxStocks);

/**
 * @route GET /tradingAccInfo
 * @description Retrive Trading Account Info
 * @access public
 */
api.post('/trading/buyStocks', buyStocks);

/**
 * @route GET /tradingAccInfo
 * @description Retrive Trading Account Info
 * @access public
 */
api.post('/trading/sellStocks', sellStocks);

export default api;
