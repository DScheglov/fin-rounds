'use strict';

var assert = require('assert');
var fin_round = require('../');

describe('Method random', function() {

  it('should grant small differance between upped and downed roundings (positive number)', function() {
    let count = 10000;
    let rnd = fin_round.Round('random');
    let i = count;
    let results = {'1': 0, '2': 0};
    while(i--) results[rnd(1.5)]++;
    let prec = 100 * Math.abs(results[1] - results[2]) / count;
    assert.ok(prec < 10); // the difference between upped and downed is less then 10%
  });

  it('should grant small differance between upped and downed roundings (negative number)', function() {
    let count = 10000;
    let rnd = fin_round.Round('random');
    let i = count;
    let results = {'-1': 0, '-2': 0};
    while(i--) results[rnd(-1.5)]++;
    let prec = 100 * Math.abs(results[-1] - results[-2]) / count;
    assert.ok(prec < 10);
  });

});
