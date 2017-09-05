import http from 'http';

const M_REJECT_CHARS = /\W/g;
const M_DELIMITERS = /\s/g;

// Reverse-map status names to codes
export default Object.keys(http.STATUS_CODES).reduce((accumulator, code) => {
  const message = http.STATUS_CODES[code];
  let name = message.replace(M_DELIMITERS, '_');

  name = name.replace(M_REJECT_CHARS, '');
  name = name.toUpperCase();

  accumulator[name] = Number(code);

  return accumulator;
}, {});
