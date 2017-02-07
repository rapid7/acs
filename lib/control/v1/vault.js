const encryptCipher = require('../../vault/ciphertext');

module.exports = function Encrypt() {
  return (req, res, next) => {
    const base64Plaintext = new Buffer(req.body.plaintext).toString('base64');

    encryptCipher(key, plaintext).then((ciphertext) => {
      Log.log('INFO', 'Vault: Successfully encrypted secret.');
      res.send('$tokend:\n' +
        '  type: transit\n' +
        '  resource: /v1/transit/default/decrypt\n' +
        '  key: ' + Config.get('vault:transit_key') + '\n' +
        '  ciphertext: "' + ciphertext + '"\n');
    }).catch((err) => {
      Log.log('ERROR', err);
      const status = (err.statusCode) ? err.statusCode : 404;

      res.status(status).json({error: err.error});
    });
  };
};
