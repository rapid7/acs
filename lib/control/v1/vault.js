'use strict';

const encryptCipher = require('../../vault/ciphertext');
const STATUS_CODES = require('./status-codes');

module.exports = function Encrypt() {
  return (req, res, next) => {
    const base64Plaintext = new Buffer(req.body.plaintext_secret).toString('base64');

    encryptCipher(base64Plaintext).then((ciphertext) => {
      res.json({key: Config.get('acs:transit_key'), ciphertext});
    }).catch((err) => {
      Log.log('ERROR', err);
      const status = (err.statusCode) ? err.statusCode : STATUS_CODES.NOT_FOUND;

      res.status(status).json({error: err.error});
    });
  };
};
