/**
 * **Gaius** is a library for fast functional programming.
 * @module gaius
 * @example
 * const gaius = require('gaius');
 */

/**
 * Return a _one-use_ generator that yields each item of `items`. If `items` is
 * not iterable and `items.length` is a defined property, then each
 * item is yielded using array-like access. One-use: the generator object is a
 * one use or temporary object.
 * @generator
 * @param {Iterable} items
 * @returns {Generator}
 * @yields each item of `items`
 */
var from = function* (items) {
    if (Symbol.iterator in items) {
        yield *items;
    } else if ('length' in items) {
        const length = items.length;
        let index = 0;
        while (index < length) {
            yield items[index];
            index += 1;
        } // while
    } else {
        throw 'items is not iterable';
    } // if
}; // from

exports.from = from;

/**
 * Return a partial function that behaves like `f` called with the provided
 * `args`. If any arguments are supplied in a call to the partial function, then
 * they will immediately follow `args` in the call to `f`. If you let `g`
 * denote a partial function of `f`, then a call to `g(..supplied)` will return
 * `f(...args, ...supplied)`.
 * @param {Function} f function to partially apply
 * @param {...*} args arguments to provide for partial application
 * @returns {Function} `(...supplied) => f(...args, ...supplied)`
 */
var partial = function (f, ...args) {
  return (...supplied) => f(...args, ...supplied);
}; // partial

exports.partial = partial;
