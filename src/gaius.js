'use strict';

/**
 * **Gaius** is a library for fast functional programming.
 *
 * [![github](https://img.shields.io/badge/github-cotterell%2Fgaius-blue?style=flat&logo=github)](https://github.com/cotterell/gaius)
 * @module gaius
 * @example
 * const gaius = require('gaius');
 */


/**
 * Return a _one-use_ generator that yields `f(item)` for each `item` of
 * `items`. One-use: the returned generator object is a one use or temporary
 * object.
 * @generator
 * @function
 * @param {Iterable} items items to use
 * @param {Function} f mapping function
 * @yields `f(item)` for each `item` of `items`
 */
export function* map(items, f) {
  if (f == null) {
    yield* yielding(items);
  } else {
    for (item of items) {
      yield f(item);
    } // for
  } // if
}; // map

/**
 * Represents a monad.
 *
 * 1. `M(x).bind(f).value == f(x).value`
 * 2. `M(x).bind(Monad).value == M(x).value`
 * 3. `M(x).bind(f).bind(g).value == M(x).bind(x => f(x).bind(g)).value`
 */
export class Monad {
  /**
   * Construct a monad.
   * @constructor
   * @param {*} value the monadic value
   */
  constructor(value) {
    if (value instanceof Monad) {
      this.value = value.value;
    } else {
      this.value = value;
    } // if
    this.isPrimitive = value !== Object(value);
    this.isIterable = !this.isPrimitive && (Symbol.iterator in value);
  } // constructor

  /**
   *
   * @param {function} f a monadic function
   * @return {Monad|*}
   */
  bind(f) {
    return f(this.value);
  } // bind

  /**
   *
   * @param {function} f a monadic function
   * @return {Monad|*}
   */
  map(f) {
    if (this.isIterable) {
      return this.bind((value) => new Monad(map(value, f)));
    } else {
      return this.bind((value) => new Monad(f(value)));
    } // if
  } // map
} // Monad

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
 * @return {Function} `(...supplied) => f(...args, ...supplied)`
 */
export const partial = function(f, ...args) {
  return (...supplied) => f(...args, ...supplied);
}; // partial


/**
 * Represents an arithmetic progression of numbers in a specified range.
 * @kind class
 * @namespace Range
 * @constructor
 * @param {number} [start=0]
 * @param {number} stop
 * @param {number} [step=1]
 * @example
 * Range(10) // new Range(10)
 * @example <caption>Every `Range` object is iterable:</caption>
 * const Range = gaius.Range;
 * @example
 * Array.from(Range(3));    // [0, 1, 2]
 * Array.from(Range(3, 6)); // [3, 4, 5]
 * @example
 * for (num of Range(10)) console.log(num);
 */
export const Range = function(start, stop, step = undefined) {
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
   */
  this.values = function* () {
    let value = this.start;
    while (value < this.stop) {
      yield value;
      value += this.step;
    } // while
  }; // values

  this[Symbol.iterator] = this.values;

  // get this[Symbol.toStringTag]() {
  //  return `range(${this.start}, ${this.stop}, ${this.step})`;
  // } // toStringTag
}; // range

/**
 * Return a _one-use_ generator that yields each item of `items`.
 * One-use: the returned generator object is a one use or temporary object.
 * @generator
 * @function
 * @param {Iterable} items
 * @yields each item of `items`
 */
export const yielding = function* (items) {
  if (Symbol.iterator in items) {
    yield* items;
  } else {
    throw new Error('items is not iterable');
  } // if
}; // yielding
