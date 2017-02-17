'use strict';

const STATUS_CODES = require('./status-codes');

/**
 * Express middleware for error handling
 * @param {Error} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {function} next
 * @constructor
 */
module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  Log.log('ERROR', err);
  const status = err.statusCode || STATUS_CODES.BAD_REQUEST;
  const errors = [err.message];

  // Include response headers if it's a HTTP error
  if (err.response) {
    error.error.headers = err.response.headers;
  }

  Log.log('ERROR', error);
  res.status(statusCode).json(error);
};
