const chai = require('chai');
const expect = chai.expect;
const gaius = require('../src/gaius.js');

describe('gaius.partial', () => {
    it('is a function', () => {
        expect(gaius.partial).to.be.an.instanceof(Function);
    });
});
