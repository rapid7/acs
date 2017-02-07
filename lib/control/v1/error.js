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
  const error = {
    error: {
      name: err.name,
      message: err.message
    }
  };
  const statusCode = err.statusCode || STATUS_CODES.BAD_REQUEST;

  // Include response headers if it's a HTTP error
  if (err.response) {
    const defaultHeaders = {
      Accept: 'application/json',
      'Accept-Charset': 'utf-8'
    };

    error.error.headers = Object.assign(defaultHeaders, err.response.headers);
  }

  Log.log('ERROR', error);
  res.status(statusCode).json(error);
};
