import {encrypt} from '../../kms';

export default async (req, res, next) => {
  const plaintext = req.body.secret;
  let keyObj;

  try {
    keyObj = JSON.parse(req.body.key);
  } catch (err) {
    console.log(err);
    keyObj = null;
  }

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
    return next(err);
  }

  const resp = {
    region: data.region
  };

  if (data instanceof Error) {
    resp.status = 'ERROR';
    resp.text = data.message;
  } else {
    resp.status = 'SUCCESS';
    resp.text = `$tokend:
type: kms
resource: /v1/kms/decrypt
region: ${data.region}
ciphertext: "${data.ciphertext}"
datakey: "${data.datakey}"`;
  }

  return res.json(resp);
};
