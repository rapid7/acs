import {encrypt} from '../../kms';

export default async (req, res, next) => {
  const plaintext = req.body.secret;
  const keyObj = JSON.parse(req.body.kms_key);

  if (!keyObj) {
    return next(new Error('CMK not defined'));
  }

  if (!plaintext) {
    return next(new Error('Plaintext not entered'));
  }

  const region = keyObj.region;
  const key = keyObj.key;
  const params = {
    KeyId: key,
    Plaintext: plaintext,
    region
  };

  let data;

  try {
    data = await encrypt(params);
  } catch (err) {
    return {
      status: 'ERROR',
      region: key.region,
      text: err.message
    };
  }

  return res.json({
    status: 'SUCCESS',
    region: key.region,
    text: `$tokend:
type: kms
resource: /v1/kms/decrypt
region: ${key.region}
ciphertext: "${key.ciphertext}"
datakey: "${key.datakey}"`
  });
};
