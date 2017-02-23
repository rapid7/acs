'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var alert = document.getElementById('alert'),
    response = document.getElementById('response');

  backends.forEach(function(el) {
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
          response.innerHTML = request.responseText;
        } else {
          // Error case
          var resp = JSON.parse(request.responseText);

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

          alert.innerHTML = resp.error.errors.reduce(function(errorString, error) {
            return errorString + error + '\n';
          }, '');
        }
      };
      request.send(data);
    });
  });

  document.querySelectorAll('ul.tab-nav li p.button').forEach(function(el) {
    el.addEventListener('click', function() {
      var href = document.querySelector(this.attributes['data-target'].value),
        tabList = this.parentNode.parentNode;

      if (tabList.querySelector('li p.active.button') !== null) {
        tabList.querySelector('li p.active.button').classList.remove('active');
      }
      this.classList.add('active');

      href.parentNode.querySelector('.tab-pane.active').classList.remove('active');
      href.classList.add('active');
    });
  });
});
