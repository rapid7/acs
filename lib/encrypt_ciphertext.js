'use strict';

const rp = require('request-promise');
const Vaulted = require('vaulted');
const defaultTransitKey = Config.get('acs:transit_key');

const VAULT_CLIENT = new Vaulted({
  vault_host: Config.get('vault:host'),
  vault_port: Config.get('vault:port'),
  vault_ssl: Config.get('vault:ssh'),
});

const getToken = function() {
  return rp({
    uri: 'http://localhost:4500/v1/token/default',
    json: true}
  ).then((body) => {
    return body.token;
  });
}

module.exports = function generateCiphertext(secret) {
  let t;

  return getToken().then((token) => {
    t = token;
    return VAULT_CLIENT.prepare(token);
  }).then((client) => {
    return client.encryptTransitPlainText({
      id: defaultTransitKey,
      body: {
        plaintext: secret
      },
      token: t
    })
  }).then((response) => {
    return response.data.ciphertext;
  });
}

