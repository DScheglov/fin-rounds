
/**
 * Precision - class Precision is used to cache the precisioning ratio
 *
 * @param  {Number}       Number of digits after coma that should be garanted after rounding
 * @return {Precision}    The created Precision object
 */
function Precision(precision) {
  this.exponent = precision;
  this.ratio = getPrecisionRatio(this.exponent);
  this.reverse = this.exponent < 0;
  return this;
}

Precision.prototype.applyRatio = applyRatio;
Precision.prototype.normalize = normalize;
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
  if (this.reverse) return value / this.ratio;
  return value * this.ratio;
}

function normalize(value) {
  if (this.reverse) return value * this.ratio;
  return value / this.ratio;
}

function decorate(method) {
  return function (precision, amount) {
    if (precision.ratio === 1) return method.call(this, amount)
    amount = precision.applyRatio(amount);
    var res = method.call(this, amount);
    return precision.normalize(res);
  }
}
