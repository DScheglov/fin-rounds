function RoundError(msg, method) {
  var err = Error.call(this, msg)
  err.method = method;
  err.name = "RoundError";
  err.__proto__ = RoundError.prototype;
  return err;
}
RoundError.prototype = Object.create(Error.prototype, {
  constructor: {value: RoundError}
});
RoundError.prototype.constructor = RoundError;

module.exports = exports = RoundError;
