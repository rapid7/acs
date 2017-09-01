import Winston from 'winston';
import expressWinston from 'express-winston';

/**
 * Create a logger instance
 * @param {string} level
 * @returns {Winston.Logger}
 * @constructor
 */
const attach = (level) => {
  const logLevel = level.toUpperCase() || 'INFO';

  const javaLogLevels = {
    levels: {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      VERBOSE: 3,
      DEBUG: 4,
      SILLY: 5
    },
    colors: {
      ERROR: 'red',
      WARN: 'yellow',
      INFO: 'green',
      DEBUG: 'blue'
    }
  };

  return new Winston.Logger({
    level: logLevel,
    levels: javaLogLevels.levels,
    colors: javaLogLevels.colors,
    transports: [
      new Winston.transports.Console({
        timestamp: true,
        json: Config.get('log:json'),
        stringify: Config.get('log:json'),
        colorize: Config.get('colorize')
      })
    ]
  });
};

/**
 * Generates middleware for Express to log incoming requests
 * @param {Winston.Logger} logger
 * @param {string} level
 * @returns {expressWinston.logger}
 * @constructor
 */
const requests = (logger, level) => {
  const logLevel = level.toUpperCase() || 'INFO';

  return expressWinston.logger({
    winstonInstance: logger,
    expressFormat: false,
    msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    level: logLevel,
    baseMeta: {sourceName: 'request'},
    meta: true,
    bodyBlacklist: ['secret', 'keys']
  });
};

export default {
  attach,
  requests
};
