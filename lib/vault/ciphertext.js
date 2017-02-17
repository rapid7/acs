'use strict';

const rp = require('request-promise');
const transitKey = Config.get('vault:transit_key');

const TOKEND_ENDPOINT = 'http://localhost:4500/v1/token/default';
const VAULT_ENDPOINT = `http${Config.get('vault:tls') ? 's' : ''}://${Config.get('vault:host')}:${Config.get('vault:port')}`;

const getToken = () => rp({uri: TOKEND_ENDPOINT, json: true}).then((body) => body.token);

module.exports = function generateCiphertext(secret) {
  return getToken().then((token) => {
    const options = {
      method: 'POST',
      uri: `${VAULT_ENDPOINT}/v1/transit/encrypt/${transitKey}`,
      body: {
        plaintext: secret
      },
      headers: {
        'X-Vault-Token': token
      },
      json: true
    };

    return rp(options);
  }).then((resp) => resp.data.ciphertext);
};
