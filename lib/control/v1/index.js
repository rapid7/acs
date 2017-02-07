'use strict';

const Err = require('./error');

module.exports = function Index(app) {
  app.get('/', function(req, res, next) {
    res.render('index', {title: 'ACS'});
  });

  app.post('/encrypt/get_ct_json', require('./encrypt')());

  app.use(Err);
};
