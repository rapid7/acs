'use strict';

const AWS = require('aws-sdk');

module.exports = function KMS() {
  return (req, res, next) => new Promise((resolve, reject) => {
    const plaintext = req.body.kms_secret;

    const keyObj = JSON.parse(req.body.kms_key);

    if (!keyObj) {
      reject(new Error('CMK not defined'));
    }

    if (!plaintext) {
      reject(new Error('Plaintext not defined'));
    }

    const region = keyObj.region;
    const key = keyObj.key;

    const params = {
      KeyId: key,
      Plaintext: plaintext
    };

    const kms = new AWS.KMS({region});

    kms.encrypt(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve({
        ciphertext: data.CiphertextBlob,
        key: data.KeyId,
        region
      });
    });
  }).then((data) => {
    res.send('$tokend:\n' +
      '  type: kms\n' +
      '  resource: /v1/kms/decrypt\n' +
      '  region: ' + data.region + '\n' +
      '  ciphertext: "' + data.ciphertext.toString('base64') + '"\n');
  }).catch((err) => {
    next(err);
  });
};
