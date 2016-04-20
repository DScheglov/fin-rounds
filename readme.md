## module fin-rounds
The module contains classes that implement wide range of rounding algorithms
and provide infrastructure for polymorphic managing rounding processes.

<a name="rounding_methods_list"></a>
The implemented methods are the following:
* `javascript`, `native` - Javascript native call of Math.round
* `ceil` - Javascript native call of Math.ceil
* `floor` - Javascript native call of Math.floor
* `math` - Mathematical rounding - rounds .5 to nearest larger by module integer
* `bank`, `bankers` - Banker's rounding - rounds .5 to nearest even integer
* `random`, `stochastic` - Stochastic rounding - uses Math.random() to define rounding direction
(see [wiki](https://en.wikipedia.org/wiki/Rounding#Stochastic_rounding))
* `series`, `alternative` - The rounding algorithm that alternates direction of rounding
(see [wiki](https://en.wikipedia.org/wiki/Rounding#Alternating_tie-breaking)).
* `void`- The dummy algorithm that returns the original value without rounding

### Install
```shell
npm install fin-rounds
```

### Development & Testing
```shell
git clone https://github.com/DScheglov/fin-rounds.git
cd fin-rounds
npm install
npm test
```

### Usage
```javascript
var Round = require('fin-rounds').Round;

// Creating rounding function with banker's algorithm and
// 2-digits after coma precision
var round = new Round('bank', 2);

console.log(round(2.535));
console.log(round(3.525));
```
Output:
```shell
2.54
3.52
```
_______________________________
### Description

The module exports 3 classes:
* [**Round**](#class_round) - provides infrastructure for different rounding algorithm
* [**Precision**](#class_precision) - provides accuracy logic
* [**RoundError**](#class_rounderror) - provides identification of exception raised in the module

------------------------------
<a name="class_round"></a>
### class **Round**
Implements Function interface and wraps different methods of numbers rounding.
Also this class holds the collection of registered rounding algorithms and provides
polymorphic interface to use them.

* **constructor** - creates a function that provides rounding

##### Fields:
* *static* **allowedMethods**: `Array of String` - the names of registered rounding methods
* *static* **methods**: `Object` -  contains registered rounding methods
* *static* **Error**: `reference` - the reference to the [**RoundError**](#class_rounderror) class
* *static* **name**: `String` - the name of the rounding method
* **index**: `Number` - the number of calls of alternative rounding method. If you will use it in you own code,
you should to update this counter by yourself
* **precision**: `Precision` - the instance of [**Precision**](#class_precision) class that bound to the
constructed function

The fields of Round instance (`name`, `index`, `precision`) could be accessed inside
function that implements rounding algorithm by `this` reference. For example:
```javascript
function some_rounding_algo(amount) {
  if (amount < 0) {
    throw new RoundError(
      `The "${amount}" is illegal parameter for this algorithm`,
      this.name
    );
  }
  ...
}
```
or some like this:
```javascript
function rounding_meth(amount) {
  this.index ++;
  if (this.index % 2) {
    throw new RoundError('This strange methods works only for even calls', this.name);
  }
  ...
}
```

##### Methods:
* *static* register - registers a rounding method

<a name="round_constr"></a>
------------------------
#### constructor **Round**(method[, precision])
Creates a function that provides rounding according to `method` and with `precision`

* method: `String`, Rounding method. One of the listed above [methods](#rounding_methods_list)
* precision: `Number`, The number digits after/before come that will be considered due the rounding

Returns: `Round`

##### Example:
```javascript
var Round = require('fin-rounds').Round;
var round1 = Round('math', 6); // Mathematical rounding with 6-digits after come accuracy
// The code bellow will have the same effect:
var round2 = new Round('math', 6);

console.log(round1(1.58436587324657));
console.log(round2(1.58436587324657));
```
Output:
```shell
1.584366
1.584366
```

##### Example:
```javascript
var Round = require('fin-rounds').Round;
var round = Round('series', 1); // Alternative rounding with 1-digit after come accuracy

console.log(round(1.35));
console.log(round(2.65));
console.log(round(1.35));
console.log(round(1.35));
```
Output:
```shell
1.3
2.7
1.3
1.4
```


<a name="round_register"></a>
------------------------
#### *static* **Round.register**([method, ]fn)
Creates a function that provides rounding according to the `method` and with the `precision`

* method: `String`, the name of rounding method. Optional. If ommited the
`fn.name` will be used as name of rounding method
* fn: `Function`, the function that implements rounding algorithm

Returns: `Round`

##### *fn*(amount) - rounding algorithm implementation

* amount: `Number`, the amount shout be rounded.

If the `fn` should provide rounding to whole integer.
The `Round.register` decorates the algorithm function with
applying accuracy ratio and further normalization of rounded value.
If you code needs the parameters of precision it could access them
by `this.precision` inside you function.

##### Example:
```javascript
var Round = require('fin-rounds').Round;

Round.register('odd', round_odd);

var round = new Round('odd');

console.log(round(1.5));
console.log(round(2.5));

// Rounding 0.5 to the nearest odd integer
function round_odd(amount) {
  var floor = parseInt(amount, 10);
  var rest = Math.abs(amount - floor) * 2;
  var delta;
  if (rest > 1) delta = 1;
  else if (rest === 1 && floor % 2 === 0) delta = 1;
  else delta = 0;
  if (delta && amount < 0) delta = -delta;
  return (floor + delta);
}
```
Output:
```shell
1
3
```

<a name="class_precision"></a>
------------------------------
### class **Precision**
Provides accuracy logic and grants specified number of digits before or after coma
in rounded value.
If `precision < 0` the rounding will be processed to `|precision|` digits before coma,
otherwise -- after.

In major number of cases you do not need to use this Class directly.

* **constructor** - creates an instance of Precision class

##### Fields:
* **exponent**: `Number` - the number of digits before/after coma
* **ratio**: `Number` - the number is used to scale rounding numbers
* **reverse**: `Boolean` - the marker of reverse rounding (rounding to digits before coma)

##### Methods:
* **applyRatio** - multiply or divide the amount on precision ratio
* **normalize** - the reverse method to **applyRatio**
* *static* **decorate** -  decorates the algorithm function
with call of **applyRatio** before method call and **normalize**
after the method processed

<a name="precision_constr"></a>
-----------------------------
#### constructor **Precision**([precision])

* precision: `Number`, Number of digits after/before coma that should be granted after rounding. Optional.
If omitted the precision ratio will be equal to `1`.

returns: `Precision`, created Precision instance

<a name="precision_apply_ratio"></a>
------------------------------------
#### Precision#applyRatio(amount)
Multiplies or divides the amount on precision ratio

* amount: `Number`, the amount should be prepared for further whole integer rounding

returns: `Number`, the amount that is ready for whole-integer rounding

<a name="precision_normalize"></a>
--------------------------------------------
#### Precision#normalize(amount)
* amount `Number`, the result of whole-integer rounding

returns: `Number`, the scale-restored value

<a name="precision_decorate"></a>
#### *static* Precision.decorate(method)
Decorates the algorithm function with call of **Precision#applyRatio** before
`method` call and **Precision#normalize** after the `method` processed

* method `Function`, algorithm function that should be decorated

returns: `Function`, decorated function

<a name="class_rounderror"></a>
------------------------------------------------
### class **RoundError** *extends* **Error**
Exception class to identify errors in the fin-rounds module

* **constructor** -- creates an exception object

##### Fields:
* **message**: `String` - the error message
* **method**: `String` - the name of method generated the exception
* **name**: `String` - the name of exception is always `RoundError`.

<a name="rounderror_constr"></a>
#### constructor **RoundError**(msg, method)

* **msg**: `String`, the error message
* **method**: `String`, the method generated the error
