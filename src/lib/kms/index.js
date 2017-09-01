import AWS from 'aws-sdk';
import crypto from 'crypto';

/**
 * Validates the KMS keys provided in the Config.
 *
 * @returns {Promise<Array>}
 */
export const check = async () => {
  const regions = Config.get('aws:region');
  const validatedRegions = Object.keys(regions).map(async (region) => {
    const key = regions[region];
    const KMS = new AWS.KMS({region});

    try {
      await KMS.describeKey({KeyId: key}).promise();
    } catch (err) {
      return false;
    }

    return {region, key};
  });

  const regionData = await Promise.all(validatedRegions);
  const filtered = regionData.filter((r) => !!r);

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
export const encrypt = async ({region, KeyId, Plaintext}) => {
  const kms = new AWS.KMS({region});
  let dataKey;

  try {
    dataKey = await kms.generateDataKey({KeyId, KeySpec: 'AES_256'}).promise();
  } catch (err) {
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
    datakey: dataKey.CiphertextBlob.toString('base64'),
    ciphertext: ciphertext.toString('base64')
  };
};
