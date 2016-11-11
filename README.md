# ACS -- Automatic Ciphertext Service
Turns your plaintext secret into a ciphertext encoded with a named key through the magic of vault's transit backend.

## Getting started (development)

1. Get vault up and running (ACS currently has only been tested against vault 0.6.0)
  * `export VAULT_DEV_ROOT_TOKEN="your-root-token"`
  * `vault server --dev`
  * `vault mount transit`
  * `vault write -f transit/keys/your_acs_key`
2. start tokend's metadata-server
  * `cd /path/to/tokend/ && npm run metadata-server`
3. start tokend's warden-mock
  * `export VAULT_ADDR='http://127.0.0.1:8200'`
  * `cd /path/to/tokend && npm run warden-mock -- your-root-token`
4. start tokend
  * `export VAULT_ADDR='http://127.0.0.1:8200'`
  * `cd /path/to/tokend && npm start -- -c config/dev.json`
5. start ACS
  * `cd /path/to/acs`
  * `export PORT=3001`
  * `npm start -- -c config/dev.json`
  * navigate to localhost:3001 in your browser

### Configuration

You specify a configuration file at run time like this:
`npm start -- -c path/to/your/config.json`

Here is a full example of a config.json with all of the available configuration parameters:

```json
{
  "acs": {
    "transit_key": "your_acs_key"
  },
  "vault": {
    "host": "127.0.0.1",
    "port": 8200,
    "ssl": false
  },
  "tokend": {
    "host": "localhost",
    "port": 4500,
    "path": "/v1/token/default"
  },
  "log": {
    "level": "info"
  }
}
```
