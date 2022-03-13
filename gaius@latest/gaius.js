"use strict";require("core-js/modules/es.array.slice.js");require("core-js/modules/es.function.name.js");require("core-js/modules/es.array.from.js");require("core-js/modules/es.regexp.exec.js");require("core-js/modules/es.array.is-array.js");require("regenerator-runtime/runtime.js");require("core-js/modules/es.string.iterator.js");require("core-js/modules/es.array.iterator.js");require("core-js/modules/web.dom-collections.iterator.js");require("core-js/modules/es.array.map.js");require("core-js/modules/es.symbol.iterator.js");require("core-js/modules/es.object.to-string.js");require("core-js/modules/es.symbol.js");require("core-js/modules/es.symbol.description.js");require("core-js/modules/es.function.bind.js");require("core-js/modules/es.array.filter.js");require("core-js/modules/es.array.concat.js");function _createForOfIteratorHelper(o,allowArrayLike){var it=typeof Symbol!=="undefined"&&o[Symbol.iterator]||o["@@iterator"];if(!it){if(Array.isArray(o)||(it=_unsupportedIterableToArray(o))||allowArrayLike&&o&&typeof o.length==="number"){if(it)o=it;var i=0;var F=function F(){};return{s:F,n:function n(){if(i>=o.length)return{done:true};return{done:false,value:o[i++]}},e:function e(_e){throw _e},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var normalCompletion=true,didErr=false,err;return{s:function s(){it=it.call(o)},n:function n(){var step=it.next();normalCompletion=step.done;return step},e:function e(_e2){didErr=true;err=_e2},f:function f(){try{if(!normalCompletion&&it["return"]!=null)it["return"]()}finally{if(didErr)throw err}}}}function _unsupportedIterableToArray(o,minLen){if(!o)return;if(typeof o==="string")return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}function _arrayLikeToArray(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++){arr2[i]=arr[i]}return arr2}/**
 * **Gaius** is a library for fast functional programming.
 *
 * [![github](https://img.shields.io/badge/github-cotterell%2Fgaius-blue?style=flat&logo=github)](https://github.com/cotterell/gaius)
 * @module gaius
 * @example
 * const gaius = require('gaius');
 */ /**
 * Return a _one-use_ generator that yields `f(item)` for each `item` of `items`.
 * One-use: the returned generator object is a one use or temporary object.
 * @generator
 * @function
 * @param {Iterable} items items to use
 * @param {Function} f mapping function
 * @returns {Generator}
 * @yields `f(item)` for each `item` of `items`
 */var map=/*#__PURE__*/regeneratorRuntime.mark(function _callee(items,f){var _iterator,_step;return regeneratorRuntime.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:if(!(f==null)){_context.next=4;break}return _context.delegateYield(yielding(items),"t0",2);case 2:_context.next=21;break;case 4:_iterator=_createForOfIteratorHelper(items);_context.prev=5;_iterator.s();case 7:if((_step=_iterator.n()).done){_context.next=13;break}item=_step.value;_context.next=11;return f(item);case 11:_context.next=7;break;case 13:_context.next=18;break;case 15:_context.prev=15;_context.t1=_context["catch"](5);_iterator.e(_context.t1);case 18:_context.prev=18;_iterator.f();return _context.finish(18);case 21:case"end":return _context.stop();}}},_callee,null,[[5,15,18,21]])});// map
exports.map=map;/**
 * Return a monad.
 *
 * 1. `M(x).bind(f).value == f(x).value`
 * 2. `M(x).bind(Monad).value == M(x).value`
 * 3. `M(x).bind(f).bind(g).value == M(x).bind(x => f(x).bind(g)).value`
 * @kind class
 * @namespace Monad
 * @constructor
 * @param {*} value the monadic value
 */var Monad=function _target(value){var _this=this;if(!(this instanceof _target?this.constructor:void 0)){return new Monad(value)}// if
if(value instanceof Monad){this.value=value.value}else{this.value=value}// if
this.isPrimitive=value!==Object(value);this.isIterable=!this.isPrimitive&&Symbol.iterator in value;/**
  *
   * @function
   * @param {function} f a monadic function
   * @returns {Monad|*}
   */this.bind=function(f){return f(_this.value)};this.map=function(f){if(_this.isIterable){return _this.bind(function(value){return Monad(exports.map(value,f))})}else{return _this.bind(function(value){return Monad(f(value))})}// if
};// map
if(this.isIterable){this.filter=function(f){var filter=/*#__PURE__*/regeneratorRuntime.mark(function _callee2(values){var _iterator2,_step2;return regeneratorRuntime.wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_iterator2=_createForOfIteratorHelper(values);_context2.prev=1;_iterator2.s();case 3:if((_step2=_iterator2.n()).done){_context2.next=10;break}value=_step2.value;if(!f(value)){_context2.next=8;break}_context2.next=8;return value;case 8:_context2.next=3;break;case 10:_context2.next=15;break;case 12:_context2.prev=12;_context2.t0=_context2["catch"](1);_iterator2.e(_context2.t0);case 15:_context2.prev=15;_iterator2.f();return _context2.finish(15);case 18:case"end":return _context2.stop();}}},_callee2,null,[[1,12,15,18]])});// filtered
return _this.bind(function(value){return Monad(filter(value))})}}// if
};// Monad
exports.Monad=Monad;/**
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
 */var partial=function partial(f){for(var _len=arguments.length,args=new Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){args[_key-1]=arguments[_key]}return function(){for(var _len2=arguments.length,supplied=new Array(_len2),_key2=0;_key2<_len2;_key2++){supplied[_key2]=arguments[_key2]}return f.apply(void 0,args.concat(supplied))}};// partial
exports.partial=partial;/**
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
 */var Range=function _target2(start,stop){var step=arguments.length>2&&arguments[2]!==undefined?arguments[2]:undefined;if(!(this instanceof _target2?this.constructor:void 0)){return new Range(start,stop,step)}// if
this.start=stop===undefined?0:start;this.stop=stop===undefined?start:stop;this.step=step===undefined?1:step;/**
   * Return a _one-use_ generator that yields each number in the range.
   * One-use: the returned generator object is a one use or temporary object.
   * @instance
   * @memberof Range
   * @generator
   * @returns {Generator} `start`, `start+step`, `...`, `stop`
   *          (**excluding** `stop`)
   */this.values=/*#__PURE__*/regeneratorRuntime.mark(function _callee3(){var value;return regeneratorRuntime.wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:value=this.start;case 1:if(!(value<this.stop)){_context3.next=7;break}_context3.next=4;return value;case 4:value+=this.step;_context3.next=1;break;case 7:case"end":return _context3.stop();}}},_callee3,this)});// values
this[Symbol.iterator]=this.values;//get this[Symbol.toStringTag]() {
//  return `range(${this.start}, ${this.stop}, ${this.step})`;
//} // toStringTag
};// range
exports.Range=Range;/**
 * Return a _one-use_ generator that yields each item of `items`.
 * One-use: the returned generator object is a one use or temporary object.
 * @generator
 * @function
 * @param {Iterable} items
 * @returns {Generator}
 * @yields each item of `items`
 */var yielding=/*#__PURE__*/regeneratorRuntime.mark(function _callee4(items){return regeneratorRuntime.wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:if(!(Symbol.iterator in items)){_context4.next=4;break}return _context4.delegateYield(items,"t0",2);case 2:_context4.next=5;break;case 4:throw"items is not iterable";case 5:case"end":return _context4.stop();}}},_callee4)});// yielding
exports.yielding=yielding;
//# sourceMappingURL=gaius.js.map
