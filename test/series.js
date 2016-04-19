'use strict';

var assert = require('assert');
var fin_round = require('../');

describe('Method series', function () {

  it('should alternate rounding of 2.5 between 2 and 3', function (){
    var round = fin_round.Round('series');
    assert.equal(round(2.5), 2);
    assert.equal(round(2.5), 3);
  });

  it('should alternate rounding of -2.5 between -3 and -2', function (){
    var round = fin_round.Round('series');
    assert.equal(round(-2.5), -3);
    assert.equal(round(-2.5), -2);
  });

  it('should alternate rounding of 2.5 to 2 and -2.5 to -2', function (){
    var round = new fin_round.Round('series');
    assert.equal(round(2.5), 2);
    assert.equal(round(-2.5), -2);
  });

  it('should alternate rounding rule of 0.5 between up and down rule', function (){
    var round = new fin_round.Round('series');
    var values = [1.5, 2.5, -3.5, 1.5, -2.5, -2.5, 1.5, -0.5, 0.5, 0.6];
    for (let i=0; i<values.length; i++) {
      let value = values[i];
      let result = round(value);
      if (i%2 === 0) assert.ok(result < value);
      else assert.ok(result > value);
    }
  });

});
