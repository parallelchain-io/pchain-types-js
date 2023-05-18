# Parallelchain Protocol Types JS
---

ParallelChain Mainnet Protocol Types JS (pchain-types-jS) is javascript version of [pchain_types](https://crates.io/crates/pchain-types). It follows the same serialization rules on defined common data structures which are essential to communicating with different systems in ParallelChain Mainnet blockchain. Details can be found in [Parallelchain Mainnet Protocol](https://github.com/parallelchain-io/parallelchain-protocol)

## Installation

The library is built with npm (8.x) and compatible to node (v16.x). 
pchain-types-js is available as an npm package

```bash
// with npm
npm install pchain-types-js

// with yarn
yarn install pchain-types-js
```

## Usage

```javascript
// Lexical
import Pchain from 'pchain-types-js';
// Non-lexical
const Pchain = require('pchain-types-js')
```

Serialization:

```js
let tx = new Transaction({
    signer, 
    priority_fee_per_gas,
    gas_limit, 
    max_base_fee_per_gas, 
    nonce,
    commands: [ 
      call_command 
    ]
} as InputTransaction);

let serialized_tx = tx.serialize();
```

Deserialization:

```js
let tx = Transaction.deserialize(serialized_tx) as Transaction;
```