'use strict';

const AWS = require('aws-sdk');
const Err = require('./error');
const upload = require('multer')();

module.exports = function Index(app) {
  app.get('/', (req, res, next) => {
    const KMS = new AWS.KMS({region: Config.get('aws:region')});

    if (Config.get('aws:key')) {
      return res.render('index', {title: 'ACS'});
    }

    return new Promise((resolve, reject) => {
      KMS.listAliases({}, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    }).then((keys) => {
      res.render('index', {title: 'ACS', kms: keys.Aliases});
    });
  });

  app.post('/v1/vault', upload.none(), require('./vault')());
  app.post('/v1/kms', upload.none(), require('./kms')());
  app.use(Err);
};
