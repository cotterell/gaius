import { expect } from 'chai';
import * as gaius from '../src/gaius.js';

describe('gaius.partial', () => {

  it('is a function', () => {
    expect(gaius.partial).to.be.an.instanceof(Function);
  });

  it('returns a function', () => {
    const f = () => {};
    const g = gaius.partial(f);
    expect(g).to.be.an.instanceof(Function);
  });

  it('returns a partial function', () => {

    const f = (...fArgs) => Array.of(...fArgs);
    const testArgs = [ 42, '42', [42], null ];
    const n = testArgs.length;

    const message = function (...info) {
      const [ args, supplied, actual, expected ] = info.map(JSON.stringify);
      return `defined g(..supplied) = f(...${args}, ...supplied);
      calling f(...${args}, ...${supplied}) = ${expected};
      calling g(...${supplied}) = ${actual}`;
    }; // message

    for (let i = 0; i < n; ++i) {
      const args = testArgs.slice(0, i);
      const supplied = testArgs.slice(i);
      const g = gaius.partial(f, ...args);
      const actual = g(...supplied);
      const expected = f(...args, ...supplied);
      const msg = message(args, supplied, actual, expected);
      expect(actual).to.eql(expected, msg);
    } // for

  });

});
