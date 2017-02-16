'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var alert = document.getElementById('alert'),
    response = document.getElementById('response');

  ['kms', 'vault'].forEach(function(el) {
    var submit = document.getElementById(el + '_secret_submit'),
      form = document.getElementById(el + '_form');
    submit.addEventListener('click', function() {
      var request = new XMLHttpRequest(),
        data = new FormData(form);

      request.open('POST', '/v1/' + el, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          alert.classList.add('hidden');
          alert.classList.remove('alert');
          alert.innerHTML = '';

          response.classList.remove('hidden');
          response.innerHTML = request.responseText
        } else {
          var resp = JSON.parse(request.responseText);

          // Error case
          response.classList.add('hidden');
          response.innerHTML = '';
          // Reset the error field
          alert.innerHTML = '';

          alert.classList.add('alert');
          alert.classList.remove('hidden');
          if (!resp.error) {
            alert.innerHTML = 'An unknown error has occured.';

            return;
          }

          resp.error.errors.forEach(function(err) {
            alert.innerHTML += err + '\n';
          });
        }
      };
      request.send(data);
    });
  });

  document.querySelectorAll('ul.tab-nav li p.button').forEach(function(el) {
    el.addEventListener('click', function() {
      var href = document.querySelector(this.attributes['data-target'].value),
        tabList = this.parentNode.parentNode;

      tabList.querySelector('li p.active.button').classList.remove('active');
      this.classList.add('active');

      href.parentNode.querySelector('.tab-pane.active').classList.remove('active');
      href.classList.add('active');

      return false;
    });
  });
});
