'use strict';

const AWS = require('aws-sdk');
const crypto = require('crypto');

/**
 * Validates the KMS keys provided in the Config.
 *
 * @returns {Promise}
 */
const check = () => {
  const regions = Config.get('aws:region');
  const validatedRegions = Object.keys(regions).map((region) => {
    const key = regions[region];
    const KMS = new AWS.KMS({region});

    return new Promise((resolve, reject) => {
      KMS.describeKey({KeyId: key}, (err, data) => {
        if (err) {
          resolve(false);
        }

        resolve({region, key});
      });
    });
  });

  return Promise.all(validatedRegions).then((regions) => {
    const filtered = regions.filter((r) => !!r);

    if (filtered.length === 0) {
      throw new Error('No valid KMS keys');
    }

    return filtered;
  });
};

const _round_trip_decrypt = (params) => new Promise((resolve, reject) => {
  let region = params.region;
  const kms = new AWS.KMS({region});


  kms.decrypt({
    CiphertextBlob: params.encryptedDataKey
  }, (err, data) => {
    if (err) {
      return reject(err);
    }
    if (data) {
      if (data.Plaintext.toString('base64') !== params.plaintextDataKey.toString('base64')) {
        resolve(false);
      }
      const decipher = crypto.createDecipher('aes-256-cbc', data.Plaintext);
      let decryptedPlaintext = decipher.update(params.ciphertextSecret, 'base64', 'utf8');

      decryptedPlaintext += decipher.final('utf8');
      if (decryptedPlaintext !== params.plaintextSecret) {
        resolve(false);
      }
      resolve(true);
    }
  });
});

/**
 * Encrypt the data
 *
 * @param params
 * @param region
 * @return {Promise}
 */
const encrypt = (params, region) => {
  const kms = new AWS.KMS({region});

  return new Promise((resolve, reject) => {
    kms.generateDataKey({
      KeyId: params.KeyId,
      KeySpec: 'AES_256'
    }, (kmsError, kmsResponse) => {
      if (kmsError) {
        return reject(kmsError);
      }
      if (kmsResponse) {
        const aesCipher = crypto.createCipher('aes-256-cbc', kmsResponse.Plaintext);
        let ciphertext = aesCipher.update(params.Plaintext, 'utf8', 'base64');

        ciphertext += aesCipher.final('base64');
        const roundtripParams = {
          encryptedDataKey: kmsResponse.CiphertextBlob,
          ciphertextSecret: ciphertext,
          region,
          plaintextDataKey: kmsResponse.Plaintext,
          plaintextSecret: params.Plaintext
        };

        _round_trip_decrypt(roundtripParams).then((data) => {
          resolve({
            region,
            datakey: kmsResponse.CiphertextBlob.toString('base64'),
            ciphertext,
            status: data
          });
        });
      }
    });
  });
};

module.exports = {
  encrypt,
  check
};


