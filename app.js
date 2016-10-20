const express = require('express');
const expressWinston = require('express-winston');
const path = require('path');
const favicon = require('serve-favicon');
const Logger = require('./lib/logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./lib/config')

const routes = require('./routes/index');
const encrypt = require('./routes/encrypt');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
global.Log = Logger.attach(Config.get('log:level'));
app.use(expressWinston.logger({
  winstonInstance: global.Log,
  expressFormat: true,
  level: Config.get('log:level'),
  baseMeta: {source: 'request', type: 'request'}
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/encrypt', encrypt);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
    // log to console for ajax errors
    console.log('message: ' + err.message + '\nerror: ' + err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
