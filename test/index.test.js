const chai = require('chai');
const ducketh = require('../index.js');

const bytecodeExamples = require('./bytecode-examples.json');

const assert = chai.assert;

describe('getClassStrict', function() {

  it('should correctly infer ERC20', function() {
    const bytecode = bytecodeExamples['DAIBytecode'];
    const result = ducketh.getClassStrict(bytecode);
    const expected = 'ERC20';
    assert.equal(result, expected, 'correctly inferred ERC20');
  });

  it('should return null if no match found', function() {
    const bytecode = bytecodeExamples['USDCBytecode'];
    const result = ducketh.getClassStrict(bytecode);
    const expected = null;
    assert.equal(result, expected, 'correctly returned null');
  });

  it('should correctly infer ERC721', function() {
    const bytecode = bytecodeExamples['NFTBytecode'];
    const result = ducketh.getClassStrict(bytecode);
    const expected = 'ERC721';
    assert.equal(result, expected, 'correctly inferred ERC721');
  });

});
