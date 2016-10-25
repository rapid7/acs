'use strict';

// Load nconf into the global namespace
global.Config = require('nconf').env()
  .argv()
  .file({ file: '/etc/acs/config.json' });
