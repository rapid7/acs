import {encrypt} from '../../kms';

export default async (req, res, next) => {
  const plaintext = req.body.secret;
  const submittedKeys = (
    (req.body.keys instanceof Array) ?
      req.body.keys :
      [req.body.keys]
  ).filter((k) => !!k);

  if (!submittedKeys || submittedKeys.length === 0) {
    return next(new Error('CMK(s) not selected'));
  }

  if (!plaintext) {
    return next(new Error('Plaintext not entered'));
  }

  // Deserialize form data
  const keys = submittedKeys.map((body) => {
    const {region, account, key} = JSON.parse(body);

    return encrypt({
      KeyId: key,
      Plaintext: plaintext,
      region,
      account
    });
  });
  let data;

  try {
    data = await Promise.all(keys);
  } catch (err) {
    return next(err);
  }

  const resp = data.map((key) => {
    if (key instanceof Error) {
      return {
        status: 'ERROR',
        account: key.account,
        region: key.region,
        text: key.message
      };
    }

    return {
      status: 'SUCCESS',
      account: key.account,
      region: key.region,
      text: `$tokend:
  type: kms
  resource: /v1/kms/decrypt
  region: ${key.region}
  ciphertext: "${key.ciphertext}"
  datakey: "${key.datakey}"`
    };
  });

  return res.json(resp);
};
