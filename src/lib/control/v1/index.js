import {check} from '../../kms';
import {checkVault} from '../../vault';
import Err from './error';
import vaultRoute from './vault';
import kmsRoute from './kms';

let version;

try {
  version = require('../../../version.json').version;
} catch (ex) {
  version = '0.0.0';
}

export default (app) => {
  const backends = {};

  app.get('/v1/index', async (req, res, next) => {
    let results;

    try {
      results = await check();
      backends.kms = results;
      if (results.length === 0) {
        return next(new Error('No valid KMS keys'));
      }
    } catch (err) {
      // If we get a KMS error we don't want to output that error to the frontend.
      // Instead, we want to log the error and continue. This way the KMS backend
      // will be marked as false.
      Log.log('ERROR', err);
      backends.kms = false;
    }

    backends.vault = await checkVault();

    res.json({
      title: 'ACS',
      version,
      backends
    });
  });

  app.post('/v1/vault', vaultRoute);
  app.post('/v1/kms', kmsRoute);
  app.use(Err);
};
