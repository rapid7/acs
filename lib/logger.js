'use strict';

const Winston = require('winston');

function Logger(level) {
  const logLevel = (level || 'info').toLowerCase();

  const logger = new Winston.Logger({
    level: logLevel,
    transports: [
      new Winston.transports.Console({
        colorize: false,
        timestamp: true,
        json: true,
        stringify: true
      })
    ]
  });

  return logger;
}

exports.attach = Logger;
