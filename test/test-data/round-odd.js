module.exports = exports =  function round_odd(amount) {
  var floor = parseInt(amount, 10);
  var rest = Math.abs(amount - floor) * 2;
  var delta;
  if (rest > 1) delta = 1;
  else if (rest === 1 && floor % 2 === 0) delta = 1;
  else delta = 0;
  if (delta && amount < 0) delta = -delta;
  return (floor + delta);
}
