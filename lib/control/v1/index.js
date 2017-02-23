'use strict';

const AWS = require('aws-sdk');
const Err = require('./error');
const upload = require('multer')();
const rp = require('request-promise');

// Hit the Vault health check endpoint to see if we're actually working with a Vault server


/**
 * Checks whether there is an actual Vault server running at the Vault endpoint
 *
 * @returns {Promise}
 */
const checkVault = function() {
  const VAULT_ENDPOINT = Config.get('vault:endpoint');

  return rp({uri: `${VAULT_ENDPOINT}/sys/health`, json: true})
    .then(() => true)
    .catch(() => false);
};


module.exports = function Index(app) {
  app.get('/', function(req, res, next) {
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
    }).catch((err) => {
      next(err);
    });
  });

  app.post('/v1/vault', upload.none(), require('./vault')());
  app.post('/v1/kms', upload.none(), require('./kms')());
  app.use(Err);
};
