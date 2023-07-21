import { Router } from 'express';

import { getStatus } from '../controllers/status';

import {
  getAllCourses,
  getAllUnitProgress,
  getAllUnitsBySlug,
  getArticleBySlug,
  getAutoCompleteResults,
  getLearningProgress,
  getSearchResults,
  getVideoBySlug,
  getVideoProgressBySlug,
  updateVideoProgress,
} from '../controllers/Learning';

import { getSymbolAutoComplete, getTopStocks } from '../controllers/research';

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

 * @route PATCH /videoProgress
 * @description Update progress for user
 * @access public
 */
api.patch('/videoProgress', updateVideoProgress);

export default api;
