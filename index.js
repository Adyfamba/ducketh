const web3utils = require('web3-utils');
const _ = require('underscore');


const supportedClasses = [
  'ERC20',
  'ERC721'
];
const classToABIMap = {
  'ERC20': 'IERC20',
  'ERC721': 'IERC721'
};

function isERC20(bytecode) {
  const abi = require('./abi/IERC20.json');
  let functionSelectors = getFunctionSelectors(abi);
  return checkConforms(bytecode, functionSelectors);
}

function isERC721(bytecode) {
  const abi = require('./abi/IERC721.json');
  let functionSelectors = getFunctionSelectors(abi);
  return checkConforms(bytecode, functionSelectors);
}

// Returns the contract class that is a perfect match
function getClassStrict(bytecode) {
  let abis = _.map(supportedClasses, (e) => {
    return require(`./abi/${classToABIMap[e]}`);
  });
  for (let i = 0; i < abis.length; i++) {
    let abi = abis[i];
    let contractClass = supportedClasses[i];
    let functionSelectors = getFunctionSelectors(abi);
    if (checkConforms(bytecode, functionSelectors)) {
      return contractClass;
    }
  }
  return null;
}

// Guesses the contract class by returning the one with the most matching functions
function getClassGuess(bytecode) {
  let abis = _.map(supportedClasses, (e) => {
    return require(`./abi/${classToABIMap[e]}`);
  });
  let matchingFunctionCounts = _.map(abis, (abi) => {
    let functionSelectors = getFunctionSelectors(abi);
    return countConformingFunctions(bytecode, functionSelectors);
  });
  let matchingFunctionTotals = _.map(abis, (abi) => {
    return getFunctionSelectors(abi).length;
  });
  let bestMatchCount = _.max(matchingFunctionCounts);
  let bestMatchIndex = _.indexOf(matchingFunctionCounts, bestMatchCount);
  return [supportedClasses[bestMatchIndex], bestMatchCount / matchingFunctionTotals[bestMatchIndex]];

}

function getFunctionSelectors(abi) {
  return _.map(abi.abi, (e) => {
    // TODO: special handling for struct
    let parameters = _.pluck(e.inputs, 'type');
    let parametersString = parameters.join(',');

    let functionSignature = `${e.name}(${parametersString})`;
    let functionSelector = web3utils.keccak256(functionSignature).substring(0, 10);
    return {
      signature: functionSignature,
      selector: functionSelector
    };
  });
}


function countConformingFunctions(bytecode, functionSelectors) {
  return _.reduce(functionSelectors, (memo, e) => {
    let matches = bytecode.match(e.selector.substring(2));
    if (matches !== null) {
      return memo + 1;
    } else {
      return memo;
    }
  }, 0);
}


function checkConforms(bytecode, functionSelectors) {
  return countConformingFunctions(bytecode, functionSelectors) === functionSelectors.length;
}


module.exports = {
  getClass: getClassStrict,
  getClassStrict: getClassStrict,
  getClassGuess: getClassGuess
};
