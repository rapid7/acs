'use strict';

const Winston = require('winston');

function Logger(level) {
  const logLevel = level || 'info';

  const logger = new Winston.Logger({
    level: logLevel,
    transports: [
      new Winston.transports.Console({
        colorize: true,
        timestamp: true,
        json: true,
        stringify: true
      })
    ]
  });

  return logger;
}

exports.attach = Logger;
