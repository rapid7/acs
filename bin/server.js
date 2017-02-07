#!/usr/bin/env node

const args = require('yargs')
  .usage('Usage: $0 [args]')
  .option('c', {
    alias: 'config',
    describe: 'Load configuration from file',
    type: 'string'
  })
  .help('help')
  .argv;

const express = require('express');
const HTTP = require('http');
const Path = require('path');
const Logger = require('../lib/logger');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const Favicon = require('serve-favicon');

const app = express();
const server = HTTP.createServer(app);

// Load nconf into the global namespace
global.Config = require('nconf').env()
  .argv();

if (args.c) {
  Config.file(Path.resolve(process.cwd(), args.c));
}
Config.defaults(require('../config/defaults.json'));

global.Log = Logger.attach(Config.get('log:level'));

// Add request logging middleware
if (Config.get('log:requests')) {
  app.use(Logger.requests(Log, Config.get('log:level')));
}

// Add middleware for paring JSON requests
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: false}));

app.use(CookieParser());

// view engine setup
app.set('views', Path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(express.static(Path.join(__dirname, '..', 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));


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
