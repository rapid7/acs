import {ciphertext} from '../../vault';

export default async (req, res, next) => {
  const plaintext = new Buffer(req.body.secret).toString('base64');
  const key = Config.get('vault:transit_key');
  let encryptedCiphertext;

  try {
    encryptedCiphertext = await ciphertext(key, plaintext);
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
  ciphertext: "${encryptedCiphertext}"`
  });
};
