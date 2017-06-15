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

/**
 * Encrypt the data by creating a new datakey and generate the ciphertext secret locally
 *
 * @param params
 * @return {Promise}
 */
const encrypt = (params) => {
  const region = params.region;
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
        resolve({
          region,
          datakey: kmsResponse.CiphertextBlob.toString('base64'),
          ciphertext: ciphertext.toString('base64')
        });
      }
    });
  });
};

module.exports = {
  encrypt,
  check
};
