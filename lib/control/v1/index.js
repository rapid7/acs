'use strict';

const Err = require('./error');
const upload = require('multer')();

module.exports = function Index(app) {
  app.get('/', function(req, res, next) {
    res.render('index', {title: 'ACS'});
  });

  app.post('/v1/vault', upload.none(), require('./vault')());
  app.use(Err);
};
