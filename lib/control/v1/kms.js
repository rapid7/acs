'use strict';

const KMS = require('../../kms');

module.exports = () => (req, res, next) => {
  const plaintext = req.body.kms_secret;

  const keyObj = JSON.parse(req.body.kms_key);

  if (!keyObj) {
    return next(new Error('CMK not defined'));
  }

  if (!plaintext) {
    return next(new Error('Plaintext not defined'));
  }

  const region = keyObj.region;
  const key = keyObj.key;
  const params = {
    KeyId: key,
    Plaintext: plaintext,
    region
  };

  return KMS.encrypt(params).then((data) => {
    res.send(
      '$tokend:\n' +
      '  type: kms\n' +
      '  resource: /v1/kms/decrypt\n' +
      '  Region: ' + data.region + '\n' +
      '  Ciphertext: "' + data.ciphertext + '"\n' +
      '  DataKey: "' + data.datakey + '"\n' +
      '  RoundtripStatus: ' + data.roundTripStatus + '\n');
  }).catch((err) => {
    next(err);
  });
};
