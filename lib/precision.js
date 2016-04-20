
/**
 * @class Precision - class Precision is used to cache the precisioning ratio
 *
 * @param  {Number} precision      Number of digits after/before coma that
 * should be garanted after rounding
 * @return {Precision}             The created Precision object
 */
function Precision(precision) {
  this.exponent = precision;
  this.ratio = getPrecisionRatio(this.exponent);
  this.reverse = this.exponent < 0;
  return this;
}


/**
 * @member Precision#applyRatio(amount) -- multipy or devide the amount on
 * precision retio
 *
 * @param {Number} amount         the amount should be transfered to the state for
 * further whole integer rounding
 * @returns {Number}              the amount that is ready for whole-integer rounding
 */
Precision.prototype.applyRatio = applyRatio;


/**
 * @member Precision#normalize(amount) -- the reverse method to `Precision#applyRatio`
 *
 * @param {Number} amount        the result of whole-integer rounding
 * @returns {Number}             the scale-restored value
 */
Precision.prototype.normalize = normalize;


/**
 * @memberof Precision
 * @static Precision#decorate(method) - decorates the algorithm function
 * with call of `Precision@applyRatio` before method call and `Precision@normalize`
 * after the method processed
 *
 * @param {Function} method   algorithm function that should be decorated
 * @returns {Function}        decorated function
 *
 */
Precision.decorate = decorate;

module.exports = exports = Precision;

function getPrecisionRatio(precision) {

  if (!precision) return 1;

  precision = Math.abs(precision);

  switch (precision) {
    case  1: return 10;
    case  2: return 100;
    case  3: return 1000;
    case  4: return 10000;
    case  5: return 100000;
  }

  return eval('1e' + precision);

}

function applyRatio(value) {
  if (this.ratio === 1) return value;
  if (this.reverse) return value / this.ratio;
  return value * this.ratio;
}

function normalize(value) {
  if (this.ratio === 1) return value;
  if (this.reverse) return value * this.ratio;
  return value / this.ratio;
}

function decorate(method) {
  return function (amount) {
    if (this.precision.ratio === 1) return method.call(this, amount)
    amount = this.precision.applyRatio(amount);
    var res = method.call(this, amount);
    return this.precision.normalize(res);
  }
}
