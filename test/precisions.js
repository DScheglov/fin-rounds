'use strict';

var assert = require('assert');
var fin_round = require('../');

describe('Rounding', function () {

  it ('should respect precision 1', function () {
    let round = fin_round.Round('native', 1);
    assert.equal(round(1), 1);
    assert.equal(round(1.5), 1.5);
    assert.equal(round(1.121), 1.1);
    assert.equal(round(1.151), 1.2);
    assert.equal(round(1.15), 1.2);
    assert.equal(round(1.25), 1.3);
  });

  it ('should respect precision 2', function () {
    let round = fin_round.Round('native', 2);
    assert.equal(round(1), 1);
    assert.equal(round(1.5), 1.5);
    assert.equal(round(1.121), 1.12);
    assert.equal(round(1.151), 1.15);
    assert.equal(round(1.15), 1.15);
    assert.equal(round(1.25012), 1.25);
    assert.equal(round(1.125), 1.13);
  });

  it ('should respect precision 3', function () {
    let round = fin_round.Round('bank', 3);
    assert.equal(round(1), 1);
    assert.equal(round(1.5), 1.5);
    assert.equal(round(1.15), 1.15);
    assert.equal(round(1.121), 1.121);
    assert.equal(round(1.1511), 1.151);
    assert.equal(round(1.25012), 1.25);
    assert.equal(round(1.125), 1.125);
    assert.equal(round(1.1234), 1.123);
    assert.equal(round(1.1235), 1.124);
    assert.equal(round(1.12351), 1.124);
  });

  it ('should respect precision 4', function () {
    let round = fin_round.Round('bank', 4);
    assert.equal(round(1), 1);
    assert.equal(round(1.5), 1.5);
    assert.equal(round(1.15), 1.15);
    assert.equal(round(1.121), 1.121);
    assert.equal(round(1.1511), 1.1511);
    assert.equal(round(1.25012), 1.2501);
    assert.equal(round(1.125), 1.125);
    assert.equal(round(1.1234), 1.1234);
    assert.equal(round(1.1235), 1.1235);
    assert.equal(round(1.12351), 1.1235);
    assert.equal(round(1.12355), 1.1236);
    assert.equal(round(1.12345), 1.1234);
  });

  it ('should respect precision 5', function () {
    let round = fin_round.Round('bank', 5);
    assert.equal(round(1), 1);
    assert.equal(round(1.5), 1.5);
    assert.equal(round(1.15), 1.15);
    assert.equal(round(1.121), 1.121);
    assert.equal(round(1.1511), 1.1511);
    assert.equal(round(1.25012), 1.25012);
    assert.equal(round(1.125), 1.125);
    assert.equal(round(1.1234), 1.1234);
    assert.equal(round(1.1235), 1.1235);
    assert.equal(round(1.12351), 1.12351);
    assert.equal(round(1.12355), 1.12355);
    assert.equal(round(1.123451), 1.12345);
    assert.equal(round(1.123455), 1.12346);
    assert.equal(round(1.123457), 1.12346);
  });

  it ('should respect precision 6', function () {
    let round = fin_round.Round('bank', 6);
    assert.equal(round(1), 1);
    assert.equal(round(1.5), 1.5);
    assert.equal(round(1.15), 1.15);
    assert.equal(round(1.121), 1.121);
    assert.equal(round(1.1511), 1.1511);
    assert.equal(round(1.25012), 1.25012);
    assert.equal(round(1.125), 1.125);
    assert.equal(round(1.1234), 1.1234);
    assert.equal(round(1.1235), 1.1235);
    assert.equal(round(1.12351), 1.12351);
    assert.equal(round(1.12355), 1.12355);
    assert.equal(round(1.123451), 1.123451);
    assert.equal(round(1.123455), 1.123455);
    assert.equal(round(1.123457), 1.123457);
    assert.equal(round(1.1234571), 1.123457);
    assert.equal(round(1.1234578), 1.123458);
    assert.equal(round(1.1234575), 1.123458);
    assert.equal(round(1.1234565), 1.123456);
  });

  it ('should respect precision -1', function () {
    let round = fin_round.Round('native', -1);
    assert.equal(round(1), 0);
    assert.equal(round(11), 10);
    assert.equal(round(15), 20);
    assert.equal(round(17), 20);
    assert.equal(round(110), 110);
    assert.equal(round(253), 250);
    assert.equal(round(355), 360);
  });

  it ('should respect precision -2', function () {
    let round = fin_round.Round('native', -2);
    assert.equal(round(1), 0);
    assert.equal(round(11), 0);
    assert.equal(round(15), 0);
    assert.equal(round(17), 0);
    assert.equal(round(110), 100);
    assert.equal(round(253), 300);
    assert.equal(round(350), 400);
    assert.equal(round(1110), 1100);
    assert.equal(round(1253), 1300);
    assert.equal(round(1350), 1400);
  });

  it ('should respect precision -3', function () {
    let round = fin_round.Round('native', -3);
    assert.equal(round(1), 0);
    assert.equal(round(11), 0);
    assert.equal(round(15), 0);
    assert.equal(round(17), 0);
    assert.equal(round(110), 0);
    assert.equal(round(643), 1000);
    assert.equal(round(500), 1000);
    assert.equal(round(1110), 1000);
    assert.equal(round(1553), 2000);
    assert.equal(round(1500), 2000);
    assert.equal(round(31110), 31000);
    assert.equal(round(-21553), -22000);
    assert.equal(round(42500), 43000);
  });

  it ('should respect precision -4', function () {
    let round = fin_round.Round('bank', -4);
    assert.equal(round(1), 0);
    assert.equal(round(11), 0);
    assert.equal(round(15), 0);
    assert.equal(round(17), 0);
    assert.equal(round(110), 0);
    assert.equal(round(643), 0);
    assert.equal(round(500), 0);
    assert.equal(round(1110), 0);
    assert.equal(round(1553), 0);
    assert.equal(round(5000), 0);
    assert.equal(round(7355.2342), 10000);
    assert.equal(round(31110), 30000);
    assert.equal(round(-21553), -20000);
    assert.equal(round(55000), 60000);
  });

  it ('should respect precision -5', function () {
    let round = fin_round.Round('bank', -5);
    assert.equal(round(1), 0);
    assert.equal(round(11), 0);
    assert.equal(round(15), 0);
    assert.equal(round(17), 0);
    assert.equal(round(110), 0);
    assert.equal(round(643), 0);
    assert.equal(round(500), 0);
    assert.equal(round(1110), 0);
    assert.equal(round(1553), 0);
    assert.equal(round(5000), 0);
    assert.equal(round(7355.2342), 0);
    assert.equal(round(31110), 0);
    assert.equal(round(-81553), -100000);
    assert.equal(round(550000), 600000);
  });

});
