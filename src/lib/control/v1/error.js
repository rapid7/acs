import STATUS_CODES from './status-codes';

/**
 * Express middleware for error handling
 * @param {Error} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {function} next
 * @constructor
 */
export default (err, req, res, next) => { // eslint-disable-line no-unused-vars
  Log.log('ERROR', err);
  const status = err.statusCode || STATUS_CODES.BAD_REQUEST;

  res.status(status).json(err.message);
};
