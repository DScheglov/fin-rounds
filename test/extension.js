'use strict';

var assert = require('assert');
var fin_round = require('../');
var round_odd = require('./test-data/round-odd');

describe('Round', function () {

  it('should be extensible', function () {
    assert.ok(!fin_round.Round.methods['round_odd']);
    assert.equal(fin_round.Round.allowedMethods.indexOf('round_odd'), -1);
    fin_round.Round.register(round_odd);

    assert.ok(fin_round.Round.methods['round_odd']);
    assert.ok(fin_round.Round.allowedMethods.indexOf('round_odd') >= 0);

    var round = fin_round.Round('round_odd');
    assert.equal(round(1.1), 1);
    assert.equal(round(1.6), 2);
    assert.equal(round(1.5), 1);
  });

});
