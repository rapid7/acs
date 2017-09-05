import AWS from 'aws-sdk';
import crypto from 'crypto';

/**
 * Validates the KMS keys provided in the Config.
 *
 * @returns {Promise<Array>}
 */
export const check = async () => {
  const keys = Config.get('aws');
  const validatedKeys = keys.map(async ({region, key}) => {
    const KMS = new AWS.KMS({region});
    let resp;

    try {
      resp = (await KMS.describeKey({KeyId: key}).promise()).KeyMetadata;
    } catch (err) {
      return false;
    }

    return {
      account: resp.AWSAccountId,
      key: resp.KeyId,
      region
    };
  });

  const keyData = await Promise.all(validatedKeys);
  const filtered = keyData.filter((k) => !!k);

  if (filtered.length === 0) {
    throw new Error('No valid KMS keys');
  }

  return filtered;
};

/**
 * Encrypt the data by creating a new datakey and generate the ciphertext secret locally
 *
 * @param {Object} params
 * @param {string} params.region
 * @param {string} params.KeyId
 * @param {string} params.Plaintext
 * @return {Promise<Object>}
 */
export const encrypt = async ({region, account, KeyId, Plaintext}) => {
  const kms = new AWS.KMS({region});
  let dataKey;

  try {
    dataKey = await kms.generateDataKey({KeyId, KeySpec: 'AES_256'}).promise();
  } catch (err) {
    if (!err.hasOwnProperty('account')) {
      err.account = account;
    }

    if (!err.hasOwnProperty('region')) {
      err.region = region;
    }

    return err;
  }

  const aesCipher = crypto.createCipher('aes-256-cbc', dataKey.Plaintext);
  let ciphertext = aesCipher.update(Plaintext, 'utf8', 'base64');

  ciphertext += aesCipher.final('base64');

  return {
    region,
    account,
    datakey: dataKey.CiphertextBlob.toString('base64'),
    ciphertext: ciphertext.toString('base64')
  };
};
