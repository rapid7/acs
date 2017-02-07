'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var submit = document.querySelector('#secret_submit');
  var alert = document.querySelector('#alert');
  var response = document.querySelector('#response');

  submit.addEventListener('click', function() {
    var request = new XMLHttpRequest();
    var data = {
      plaintext: document.querySelector('#plaintext_secret').value
    };

    request.open('POST', '/v1/vault', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = function() {
      var resp = '';

      try {
        resp = JSON.parse(request.responseText);
      } catch (ex) {}

      if (request.status >= 200 && request.status < 400) {
        alert.classList.add('hidden');
        alert.innerHTML = '';

        response.classList.remove('hidden');
        response.innerHTML = '$tokend\n' +
          '  type: transit\n' +
          '  resource: /v1/transit/default/decrypt\n' +
          '  key: ' + resp.key + '\n' +
          '  ciphertext: "' + resp.ciphertext + '"\n';
      } else {
        // Error case
        response.classList.add('hidden');
        response.innerHTML = '';

        alert.classList.remove('hidden');
        if (!resp.error) {
          alert.innerHTML = 'Check logs for stacktrace, error is undefined';

          return;
        }

        resp.error.errors.forEach(function(err) {
          alert.innerHTML += err + '\n';
        });
      }
    };
    request.send(JSON.stringify(data));
  });
});
