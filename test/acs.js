'use strict';

const request = require('supertest');
const express = require('express');
const should = require('chai').should();
const app = express();

describe('POST encrypt/get_ct_json', function() {
  it('responds with a json error', function() {
    request(app)
      .post('/encrypt/get_ct_json')
      .expect(200, {
        error: 'Error: connect ECONNREFUSED 127.0.0.1:4500'
      });
  });
});
