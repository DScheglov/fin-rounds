'use strict';

var assert = require('assert');
var fin_round = require('../');
var cases = require('./test-data/cases');

var method;
for (method in cases) {
  describe(`Method ${method}`, function() {
    let round = new fin_round.Round(method);
    let mCases = cases[method];
    let aCase;

    for (aCase of mCases) {
      let value = aCase[0];
      let result = aCase[1];
      it (`should round ${value} to ${result}`, function () {
        assert.equal(round(value), result);
      });
    }

  });

}
