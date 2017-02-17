const encryptCipher = require('../../vault/ciphertext');
const STATUS_CODES = require('./status-codes');

module.exports = function Encrypt() {
  return (req, res, next) => {
    const base64Plaintext = new Buffer(req.body.vault_secret).toString('base64');

    encryptCipher(base64Plaintext).then((ciphertext) => {
      res.send('$tokend:\n' +
        '  type: transit\n' +
        '  resource: /v1/transit/default/decrypt\n' +
        '  key: ' + Config.get('vault:transit_key') + '\n' +
        '  ciphertext: "' + ciphertext + '"\n');
    }).catch((err) => {
      Log.log('ERROR', err);
      const status = (err.statusCode) ? err.statusCode : STATUS_CODES.NOT_FOUND;
      const errors = [err.message];

      res.status(status).json({error: {errors}});
    });
  };
};
