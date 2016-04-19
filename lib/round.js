var RoundError = require('./round-error');
var Precision = require('./precision');


function Round(method, precision) {
  var self = this instanceof Round ? this : {};
  self.precision = new Precision(precision);
  self.index = 0;
  if (typeof Round.methods[method] !== 'function') {
    throw new RoundError(
      `Method "${method}" is not registered as rounding algorithm`,
      method
    );
  }
  return Round.methods[method].bind(self, self.precision);
}

Round.prototype = Object.create(Function.prototype);
Round.prototype.constructor = Round;
Round.allowedMethods = [];
Round.methods = {};
Round.register = register;
Round.Error = RoundError;

Round.register('javascript',round_native);
Round.register('native', round_native);
Round.register('ceil',  round_ceil);
Round.register('floor', round_floor);
Round.register('math', round_math);
Round.register('bank', round_bank);
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
  Round.methods[method] = (fn.length === 1) ? Precision.decorate(fn) : fn;
  Round.allowedMethods = Object.keys(Round.methods);
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

function round_void(precision, amount) {
  return amount;
}
