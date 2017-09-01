import rp from 'request-promise';

const TOKEND_ENDPOINT = `http://${Config.get('tokend:host')}:${Config.get('tokend:port')}${Config.get('tokend:path')}`;
const VAULT_ENDPOINT = Config.get('vault:endpoint');

const getToken = async () => {
  const body = await rp({uri: TOKEND_ENDPOINT, json: true});

  return body.token;
};

export const ciphertext = async (key, secret) => {
  const token = await getToken();

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

  const resp = await rp(options);

  return resp.data.ciphertext;
};


/**
 * Checks whether there is an actual Vault server running at the Vault endpoint
 *
 * @returns {boolean}
 */
export const checkVault = async () => {
  const VAULT_ENDPOINT = Config.get('vault:endpoint');

  try {
    await rp({uri: `${VAULT_ENDPOINT}/sys/health`, json: true});
  } catch (err) {
    return false;
  }

  return true;
};

export const checkTokend = async () => {
  try {
    await getToken();
  } catch (err) {
    return false;
  }

  return true;
};
