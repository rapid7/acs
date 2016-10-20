$(document).on('click', '#secret_submit', function () {
  $.post('/encrypt/get_ct_json', {
    plaintext_secret: $('#plaintext_secret').val()
  },
  function(json) {
    if (json.error) {
      $('#alert').addClass('alert-error');
      $('#alert').attr('style', 'display: block !important');
      if (json.error.message) {
        $('#alert').html(json.error.message);
      } else {
        $('#alert').html('Check logs for stacktrace, error is undefined');
      }
    } else {
      $('#response').attr('style', 'display: block !important');
      $("#response").html('- $tokend\n  - ciphertext: ' + json.ciphertext + '\n  - resource: /v1/transit/default/' + json.key);
    }
  });
});
