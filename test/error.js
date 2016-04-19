'use strict';

var assert = require('assert');
var fin_round = require('../');

describe('Round', function () {

  it ('should generate error if method was not registered', function () {
    var round, errorCoutch = false;
    try {
      round = fin_round.Round('un_existing_method', 3);
    } catch(err) {
      errorCoutch = true;
      assert.ok(err);
      assert.ok(err instanceof fin_round.RoundError);
      assert.ok(err.message, 'Method "un_existing_method" is not registered as rounding algorithm');
    }
    assert.ok(errorCoutch);
    assert.ok(!round);
  })

});
