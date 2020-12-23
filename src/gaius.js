/**
 * **Gaius** is a library for fast functional programming.
 * @module gaius
 * @license MIT
 * @see {@link https://github.com/cotterell/gaius}
 * @see {@link https://www.npmjs.com/package/gaius}
 * @example
 * const gaius = require('gaius');
 */

/**
 * Return a _one-use_ generator that yields each item of `items`.
 * One-use: the returned generator object is a one use or temporary object.
 * @generator
 * @param {Iterable} items
 * @returns {Generator}
 * @yields each item of `items`
 */
var yielding = function* (items) {
  if (Symbol.iterator in items) {
    yield *items;
  } else {
    throw 'items is not iterable';
  } // if
}; // yielding

exports.yielding = yielding;

/**
 * Return a partial function that behaves like `f` called with the provided
 * `args`. If any arguments are supplied in a call to the partial function, then
 * they will immediately follow `args` in the call to `f`. If you let `g`
 * denote a partial function of `f`, then a call to `g(...supplied)` will return
 * `f(...args, ...supplied)`.
 * @example <caption>The following two line are equivalent:</caption>
 * const log = gaius.partial(console.log, '[gaius]');
 * const log = (...supplied) => console.log('[gaius]', ...supplied);
 * @param {Function} f function to partially apply
 * @param {...*} args arguments to provide for partial application
 * @returns {Function} `(...supplied) => f(...args, ...supplied)`
 */
var partial = function (f, ...args) {
  return (...supplied) => f(...args, ...supplied);
}; // partial

exports.partial = partial;
