'use strict';

const AWS = require('aws-sdk');

module.exports = function KMS() {
  return (req, res, next) => {
    const kms = new AWS.KMS({region: Config.get('aws:region')});

    return new Promise((resolve, reject) => {
      const plaintext = req.body.kms_secret;
      let key = Config.get('aws:key');

      key = key || req.body.kms_key;

      if (!key) {
        reject(new Error('CMK not defined'));
      }

      if (!plaintext) {
        reject(new Error('Plaintext not defined'));
      }

      const params = {
        KeyId: key,
        Plaintext: plaintext
      };

      kms.encrypt(params, (err, data) => {
        if (err) {
          return reject(err);
        }

        resolve({
          ciphertext: data.CiphertextBlob,
          key: data.KeyId
        });
      });
    }).then((data) => {
      res.send('$tokend:\n' +
        '  type: kms\n' +
        '  resource: /v1/kms/decrypt\n' +
        '  ciphertext: "' + data.ciphertext.toString('base64') + '"\n');
    }).catch((err) => {
      next(err);
    });
  };
};
