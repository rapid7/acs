'use strict';

const encryptCipher = require('../../vault/ciphertext');
const STATUS_CODES = require('./status-codes');

module.exports = function Encrypt() {
  return (req, res, next) => {
    const plaintext = new Buffer(req.body.vault_secret).toString('base64');
    const key = Config.get('vault:transit_key');

    encryptCipher(key, plaintext).then((ciphertext) => {
      res.json({key, ciphertext});
    }).catch((err) => {
      next(err);
    });
  };
};