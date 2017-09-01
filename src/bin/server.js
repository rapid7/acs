#!/usr/bin/env node
import express from 'express';
import http from 'http';
import path from 'path';
import Logger from '../lib/logger';
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import nconf from 'nconf';

const app = express();
const server = http.createServer(app);

// Load nconf into the global namespace
global.Config = nconf.env()
  .argv({
    config: {
      alias: 'c',
      description: 'Load configuration from file',
      type: 'string'
    },
    colorize: {
      describe: 'Colorize log output',
      type: 'boolean',
      default: false
    },
    help: {
      alias: 'h',
      describe: 'Help',
      type: 'boolean'
    }
  }, 'Usage: $0 [args]');

if (Config.get('help') || Config.get('h')) {
  process.stdout.write(Config.stores.argv.help());
  process.exit();
}

if (Config.get('config')) {
  Config.file(path.resolve(process.cwd(), Config.get('config')));
}
Config.defaults(require('../config/defaults.json'));

global.Log = Logger.attach(Config.get('log:level'));

// Add request logging middleware
if (Config.get('log:requests')) {
  app.use(Logger.requests(Log, Config.get('log:level')));
}

Config.set('vault:endpoint', `http${Config.get('vault:tls') ? 's' : ''}://${Config.get('vault:host')}:${Config.get('vault:port')}/${Config.get('vault:api')}`);

// Add middleware for paring JSON requests
app.use(BodyParser.json());
app.use(CookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

require('../lib/control/v1/')(app);

// Instantiate server and start it
const host = Config.get('service:host');
const port = Config.get('service:port');

server.on('error', (err) => {
  Log.log('ERROR', err);
});

server.listen(port, host, () => {
  Log.log('INFO', `Listening on ${host}:${port}`);
});
