'use strict';

const encryptCipher = require('../../vault/ciphertext');
const STATUS_CODES = require('./status-codes');

module.exports = function Encrypt() {
  return (req, res, next) => {
    const plaintext = new Buffer(req.body.vault_secret).toString('base64');
    const key = Config.get('vault:transit_key');

    encryptCipher(key, plaintext).then((ciphertext) => {
      Log.log('INFO', 'Vault: Successfully encrypted secret.');
      res.send('$tokend:\n' +
        '  type: transit\n' +
        '  resource: /v1/transit/default/decrypt\n' +
        '  key: ' + Config.get('vault:transit_key') + '\n' +
        '  ciphertext: "' + ciphertext + '"\n');
    }).catch((err) => {
      next(err);
    });
  };
};
