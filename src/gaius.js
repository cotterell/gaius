/**
 * **Gaius** is a library for fast functional programming.
 * @module gaius
 * @see [![github](https://img.shields.io/badge/github-cotterell%2Fgaius-blue?style=flat&logo=github)](https://github.com/cotterell/gaius)
 * @example
 * const gaius = require('gaius');
 */


 /**
 * Return a _one-use_ generator that yields `f(item)` for each `item` of `items`.
 * One-use: the returned generator object is a one use or temporary object.
 * @generator
 * @function
 * @param {Iterable} items items to use
 * @param {Function} f mapping function
 * @returns {Generator}
 * @yields `f(item)` for each `item` of `items`
 */
const map = function* (items, f) {
  if (f == null) {
    yield* yielding(items);
  } else {
    for (item of items) {
      yield f(item);
    } // for
  } // if
}; // map

exports.map = map;

/**
 * Return a monad.
 *
 * 1. `M(x).bind(f).value == f(x).value`
 * 2. `M(x).bind(Monad).value == M(x).value`
 * 3. `M(x).bind(f).bind(g).value == M(x).bind(x => f(x).bind(g)).value`
 * @kind class
 * @namespace Monad
 * @constructor
 * @param {*} value the monadic value
 */
const Monad = function(value) {

  if (!new.target) {
    return new Monad(value);
  } // if

  if (value instanceof Monad) {
    this.value = value.value;
  } else {
    this.value = value;
  } // if

  this.isPrimitive = value !== Object(value);
  this.isIterable = !this.isPrimitive && (Symbol.iterator in value)

  /**
  *
   * @function
   * @param {function} f a monadic function
   * @returns {Monad|*}
   */
  this.bind = (f) => f(this.value);

  this.map = (f) => {
    if (this.isIterable) {
      return this.bind(value => Monad(exports.map(value, f)));
    } else {
      return this.bind(value => Monad(f(value)));
    } // if
  }; // map

  if (this.isIterable) {
    this.filter = (f) => {
      const filter = function* (values) {
        for (value of values) {
          if (f(value)) {
            yield value;
          } // if
        } // for
      }; // filtered
      return this.bind(value => Monad(filter(value)));
    };
  } // if

}; // Monad

exports.Monad = Monad;

/**
 * Return a partial function that behaves like `f` called with the provided
 * `args`. If any arguments are supplied in a call to the partial function, then
 * they will immediately follow `args` in the call to `f`. If you let `g`
 * denote a partial function of `f`, then a call to `g(...supplied)` will return
 * `f(...args, ...supplied)`.
 * @function
 * @example <caption>The following two line are equivalent:</caption>
 * const log = gaius.partial(console.log, '[gaius]');
 * const log = (...supplied) => console.log('[gaius]', ...supplied);
 * @param {Function} f function to partially apply
 * @param {...*} args arguments to provide for partial application
 * @returns {Function} `(...supplied) => f(...args, ...supplied)`
 */
const partial = function (f, ...args) {
  return (...supplied) => f(...args, ...supplied);
}; // partial

exports.partial = partial;

/**
 * Represents an arithmetic progression of numbers in a specified range.
 * @kind class
 * @namespace Range
 * @constructor
 * @param {number} [start=0]
 * @param {number} stop
 * @param {number} [step=1]
 * @example <caption>Just like the {@link Array} class, `Range` is directly callable without using the `new` keyword.</caption>
 * Range(10) // new Range(10)
 * @example <caption>Every `Range` object is iterable:</caption>
 * const Range = gaius.Range;
 * @example
 * Array.from(Range(3));    // [0, 1, 2]
 * Array.from(Range(3, 6)); // [3, 4, 5]
 * @example
 * for (num of Range(10)) console.log(num);
 */
const Range = function(start, stop, step = undefined) {

  if (!new.target) {
    return new Range(start, stop, step);
  } // if

  this.start = stop === undefined ? 0 : start;
  this.stop = stop === undefined ? start : stop;
  this.step = step === undefined ? 1 : step;

  /**
   * Return a _one-use_ generator that yields each number in the range.
   * One-use: the returned generator object is a one use or temporary object.
   * @instance
   * @memberof Range
   * @generator
   * @returns {Generator} `start`, `start+step`, `...`, `stop`
   *          (**excluding** `stop`)
   */
  this.values = function* () {
    let value = this.start;
    while (value < this.stop) {
      yield value;
      value += this.step;
    } // while
  } // values

  this[Symbol.iterator] = this.values;

  //get this[Symbol.toStringTag]() {
  //  return `range(${this.start}, ${this.stop}, ${this.step})`;
  //} // toStringTag

}; // range

exports.Range = Range;

/**
 * Return a _one-use_ generator that yields each item of `items`.
 * One-use: the returned generator object is a one use or temporary object.
 * @generator
 * @function
 * @param {Iterable} items
 * @returns {Generator}
 * @yields each item of `items`
 */
const yielding = function* (items) {
  if (Symbol.iterator in items) {
    yield *items;
  } else {
    throw 'items is not iterable';
  } // if
}; // yielding

exports.yielding = yielding;
