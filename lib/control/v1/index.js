'use strict';

const Err = require('./error');

module.exports = function Index(app) {
  app.get('/', function(req, res, next) {
    res.render('index', {title: 'ACS'});
  });

  app.post('/v1/encrypt', require('./encrypt')());

  app.use(Err);
};
