import {encrypt} from '../../vault';

export default async (req, res, next) => {
  if (!req.body.secret) {
    return next(new Error('Plaintext not entered'));
  }

  const plaintext = Buffer.from(req.body.secret, 'utf-8').toString('base64');
  const key = Config.get('vault:transit_key');
  let ciphertext;

  try {
    ciphertext = await encrypt(key, plaintext);
  } catch (err) {
    return next(err);
  }

  Log.log('INFO', 'Vault: Successfully encrypted secret.');
  res.json({
    status: 'SUCCESS',
    text: `$tokend:
  type: transit
  resource: /v1/transit/default/decrypt
  key: ${Config.get('vault:transit_key')}
  ciphertext: "${ciphertext}"`
  });
};
