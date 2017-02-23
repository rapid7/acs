'use strict';

const rp = require('request-promise');

const TOKEND_ENDPOINT = `http://${Config.get('tokend:host')}:${Config.get('tokend:port')}${Config.get('tokend:path')}`;
const VAULT_ENDPOINT = Config.get('vault:endpoint');

const getToken = () => rp({uri: TOKEND_ENDPOINT, json: true}).then((body) => body.token);

module.exports = function generateCiphertext(key, secret) {
  return getToken().then((token) => {
    const options = {
      method: 'POST',
      uri: `${VAULT_ENDPOINT}/transit/encrypt/${key}`,
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
