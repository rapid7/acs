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
 * Validates that retrieving the plaintext datakey and performing a decrypt on your cipher secret
 * returns the expected original secret
 * @param params
 * @returns {Promise}
 */
const round_trip_decrypt = (params) => new Promise((resolve, reject) => {
  let region = params.region;
  const kms = new AWS.KMS({region});


  kms.decrypt({
    CiphertextBlob: params.encryptedDataKey
  }, (err, kmsDecryptResponse) => {
    if (err) {
      return reject(err);
    }
    if (kmsDecryptResponse) {
      if (kmsDecryptResponse.Plaintext.toString('base64') !== params.plainTextDataKey.toString('base64')) {
        resolve(false);
      }
      const decipher = crypto.createDecipher('aes-256-cbc', kmsDecryptResponse.Plaintext);
      let decryptedPlaintext = decipher.update(params.cipherTextSecret, 'base64', 'utf8');

      decryptedPlaintext += decipher.final('utf8');
      if (decryptedPlaintext !== params.plainTextSecret) {
        resolve(false);
      }
      resolve(true);
    }
  });
});

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
        const roundTripParams = {
          encryptedDataKey: kmsResponse.CiphertextBlob,
          cipherTextSecret: ciphertext,
          region,
          plainTextDataKey: kmsResponse.Plaintext,
          plainTextSecret: params.Plaintext
        };

        round_trip_decrypt(roundTripParams).then((roundTripStatus) => {
          resolve({
            region,
            datakey: kmsResponse.CiphertextBlob.toString('base64'),
            ciphertext: ciphertext.toString('base64'),
            roundTripStatus
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
