'use strict';

const KMS = require('../../kms');
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
  let regions = [];
  const backends = {};

  app.get('/', function(req, res, next) {
    return KMS.check().then((r) => {
      regions = r;
      backends.kms = true;
    }).catch((err) => {
      // If we get a KMS error we don't want to output that error to the frontend.
      // Instead, we want to log the error and continue. This way the KMS backend
      // will be marked as false.
      Log.log('ERROR', err);
      backends.kms = false;
    }).then(() => checkVault()).then((hasVault) => {
      backends.vault = hasVault;
    }).then(() => {
      res.render('index', {title: 'ACS', kms: regions, backends});
    }).catch((err) => {
      next(err);
    });
  });

  app.post('/v1/vault', upload.none(), require('./vault')());
  app.post('/v1/kms', upload.none(), require('./kms')());
  app.use(Err);
};
