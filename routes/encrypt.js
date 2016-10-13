const express = require('express');
const router = express.Router();
const encryptCipher = require('../lib/encrypt_ciphertext');

router.post('/get_ct_json', function(req, res, next) {
  req._routeBlacklists.body = ['plaintext_secret'];
  base64Plaintext = new Buffer(req.body.plaintext_secret).toString('base64');
  encryptCipher(base64Plaintext).then((ciphertext) => {
    res.json({key: Config.get('acs:transit_key'), ciphertext});
  }).catch((err) => {
    console.log(err);
    res.json({error: err});
  });
});

module.exports = router;
