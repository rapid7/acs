const encryptCipher = require('../../encrypt_ciphertext');

module.exports = function Encrypt() {
  return (req, res, next) => {
    const base64Plaintext = new Buffer(req.body.plaintext).toString('base64');

    encryptCipher(base64Plaintext).then((ciphertext) => {
      res.json({key: Config.get('acs:transit_key'), ciphertext});
    }).catch((err) => {
      Log.log('ERROR', err);
      const status = (err.statusCode) ? err.statusCode : 404;

      res.status(status).json({error: err.error});
    });
  };
};
