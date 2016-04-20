var RoundError = require('./round-error');
var Precision = require('./precision');


/**
 * Round  class Round implements Function interface and wraps
 * different methods of numbers rounding.
 *
 * @param  {String} method    Rounding method
 * @param  {Number} precision The precision of rounding. The number digits
 * after/before come that will be considered due the rounding
 * @return {Round}            The rounding function that receives number and
 * returns rounded number
 */
function Round(method, precision) {
  var self = this instanceof Round ? this : {};
  self.precision = new Precision(precision);
  self.index = 0;
  self.name = method;
  if (typeof Round.methods[method] !== 'function') {
    throw new RoundError(
      `Method "${method}" is not registered as rounding algorithm`,
      method
    );
  }
  var round = Round.methods[method].bind(self);
  round.__proto__ = Round.prototype;
  return round;
}

Round.prototype = Object.create(Function.prototype);
Round.prototype.constructor = Round;


/**
 * @member Round.allowedMethods {Array}   static the array of rigistered
 * rounding methods
 */
Round.allowedMethods = [];


/**
 * Round.methods {Object}  the hash array of rigistered rounding methods
 */
Round.methods = {};


/**
 * @memberof Round
 * @static Round.register(method, fn)  the method registers rounding methods
 *
 * @param {String} method  the name of rounding method
 * @param {Function} fn    the function that implements rounding algorithm
 * @returns {Round}        the reference to the @class Round
 *
 * @function fn([precision, ]amount) - rounding algorithm implements
 *
 * @param {Precision} precision    optional parameter that can be used to provide
 * precisioning
 * @param {Number} amount          the amout shout be rounded.
 *
 * @description If the `precision` parameter are in list of formal parameters of
 * rounding algorithm the one should provide accuracy of rounding by itself.
 * Instead of the case without precision the algorithm should provide rounding
 * to whole integer. The `Round.register` decorates the algorithm function with
 * applying accuracy ratio and further normalization of rounded value.
 */
Round.register = register;


/**
 * @static {RoundError} Round.Error - the reference to the RoundError class
 */
Round.Error = RoundError;


/**
 * Embeded rounding algorith:
 *
 * javascript, native       Javascript native call of Math.round
 * ceil                     Javascript native call of Math.ceil
 * floor                    Javascript native call of Math.floor
 * math                     Mathematical rounding - 0.5 rounds to nearest larger
 *                          by module integer
 * bank, bankers            Banker's rounding - 0.5 rounds to nearest even integer
 * random, stochastic       Stochastic rounding - uses Math.random() to define
 *                          rounding direction
 * series, alternative      The rounding algorithm that alternates direction of
 *                          rounding.
 * void                     The dummy algorithm that returns the original value
 *                          without rounding
 */
Round.register('javascript',round_native);
Round.register('native', round_native);
Round.register('ceil',  round_ceil);
Round.register('floor', round_floor);
Round.register('math', round_math);
Round.register('bank', round_bank);
Round.register('bankers', round_bank);
Round.register('stochastic', round_rnd);
Round.register('random', round_rnd);
Round.register('series', round_series);
Round.register('alternative', round_series);
Round.register('void', round_void);


module.exports = exports = {
  Round: Round,
  Precision: Precision,
  RoundError: RoundError
}

function register(method, fn) {
  if (method instanceof Function) {
    fn = method;
    method = fn.name;
  }
  Round.methods[method] = (method != 'void') ? Precision.decorate(fn) : fn;
  Round.allowedMethods = Object.keys(Round.methods);
  return Round;
};

function round_native(amount) {
  return Math.round(amount);
}

function round_ceil(amount) {
  return Math.ceil(amount);
}

function round_floor(amount) {
  return Math.floor(amount);
}

function round_math(amount) {
  var floor = parseInt(amount, 10);
  var rest = Math.abs(amount - floor) * 2;
  var delta;
  if (rest > 1) delta = 1;
  else if (rest === 1 && floor >=0) delta = 1;
  else delta = 0;
  if (delta && amount < 0) delta = -delta;
  return (floor + delta);
}

function round_bank(amount) {
  var floor = parseInt(amount, 10);
  var rest = Math.abs(amount - floor) * 2;
  var delta;
  if (rest > 1) delta = 1;
  else if (rest === 1 && floor % 2 != 0) delta = 1;
  else delta = 0;
  if (delta && amount < 0) delta = -delta;
  return (floor + delta);
}

function round_rnd(amount) {
  var floor = parseInt(amount, 10);
  var rest = Math.abs(amount - floor) * 2;
  var delta;
  if (rest > 1) delta = 1;
  else if (rest === 1 && amount < 0) delta = (2 * Math.random() > 1) ? 0 : 1;
  else if (rest === 1) delta = (2 * Math.random() > 1) ? 1 : 0;
  else delta = 0;
  if (delta && amount < 0) delta = -delta;
  return (floor + delta);
}

function round_series(amount) {
  var floor = parseInt(amount, 10);
  var rest = Math.abs(amount - floor) * 2;
  var delta;
  if (rest > 1) delta = 1;
  else if (rest === 1) {
    if (amount < 0) delta = (++this.index) % 2;
    else delta = (this.index++) % 2;
  }
  else delta = 0;
  if (delta && amount < 0) delta = -delta;
  return(floor + delta);
}

function round_void(amount) {
  return amount;
}
