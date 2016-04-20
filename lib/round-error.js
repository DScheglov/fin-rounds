
/**
 * @class RoundError - Exception class to identify errors in the fin-rounds module
 * @extends Error
 *
 * @param  {String} msg        the error message
 * @param  {String} method     the method that throw the exception
 * @return {RoundError}        the RoundError object
 */
function RoundError(msg, method) {
  var err = Error.call(this, msg)
  err.method = method;
  err.__proto__ = RoundError.prototype;
  return err;
}
RoundError.prototype = Object.create(Error.prototype);
RoundError.prototype.constructor = RoundError;

/**
 * The name of Exception class
 */
RoundError.prototype.name = "RoundError"

/**
 * The method generated the exception
 */
RoundError.prototype.method;

module.exports = exports = RoundError;
