# ACS -- Automatic Ciphertext Service
Turns your plaintext secret into a ciphertext encoded with a named key
through the magic of vault's transit backend or KMS encryption.

## Getting started (development)

1. Get vault up and running (ACS currently has only been tested against vault 0.6.0)

    ```bash
    $ vault server -dev -dev-root-token-id="your-root-token"

    # In another terminal
    $ export VAULT_ADDR='http://127.0.0.1:8200'
    $ vault mount transit
    $ vault write -f transit/keys/your_acs_key
    ```

1. start tokend's metadata-server

    ```bash
    $ cd /path/to/tokend/ && npm run metadata-server
    ```

1. start tokend's warden-mock

    ```bash
    $ cd /path/to/tokend && npm run warden-mock -- your-root-token
    ```

1. start tokend

    ```bash
    $ cd /path/to/tokend && npm run dev
    ```

1. Start ACS

    ```bash
    $ cd /path/to/acs && npm run dev
    ```

1. Navigate to localhost:3001 in your browser


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
  },
  "service": {
    "host": "localhost",
    "port": 3000
  },
  "aws": {
    "region": "us-east-1",
    "key": "OPTIONAL"
  }
}
```

If using KMS, you can optionally specify a KMS key to use to encrypt all
secrets. If not specified, the user can select which key to use from a
drop down.
