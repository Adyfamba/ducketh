# 🐥 DuckEth
_If it looks like an ERC20, and it quacks like an ERC20, then it must be an ERC20._

## Usage
Get bytecode with:

    web3.eth.getCode(ADDRESS)


Use with:

    npm install ducketh  // Coming soon

    ducketh.getClassStrict(BYTECODE);  // Returns 'ERC20'

## Limitations
- Doesn't work with proxy contracts
  - eg. USDC
- Doesn't check implementationm, only that the contract defines the required functions
  - By extension, if functionality is provided through fallback functions (openzeppelin's proxy contract does this), it will remain hidden to ducketh


## Notes
This doesn't work with proxy contracts :(

- Deployed bytecode vs creation bytecode
  - Note bytecode-examples is a mix

