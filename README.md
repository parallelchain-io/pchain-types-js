# Parallelchain Protocol Types JS

_The latest version is 5.0.0, please refer to migration-guide-5-0-0 for upgrading._

## Introduction

ParallelChain Mainnet Protocol Types JS (pchain-types-js) is primarily a TypeScript version of [the pchain_types Rust crate](https://crates.io/crates/pchain-types). It serves as the base building block for TypeScript/ JavasScript developers to interact with the [Parallelchain Mainnet Protocol](https://github.com/parallelchain-io/parallelchain-protocol). It can be used alone, or as part of, higher-level libraries such as [pchain-client-js](https://github.com/parallelchain-io/pchain-client-js).

The package implements the data types used in the [Parallelchain Mainnet Protocol](https://github.com/parallelchain-io/parallelchain-protocol), including:

- Request and response types from RPC API exposed by ParallelChain Fullnodes
- Entity types on the blockchain such as Block, Transaction, and CommandReceipts
- Input types to invoke Transaction Commands which are inbuilt to the ParallelChain runtime

The package also includes other helper utilities:

- Cryptographic primitives such as keypair generation, SHA256 hashing
- Serialization and deserialization helpers, see the [section on Borsh Serialization Format](#borsh-serialization-format)

---

## Installation

The library is built with npm (8.x) and compatible to node (v16.x).
`pchain-types-js` is available as an npm package

```bash
// with npm
npm install pchain-types-js

// with yarn
yarn add pchain-types-js
```

---

## Usage

```javascript
// Lexical/ ES6/ ESM/ TypeScript
import * as PChainTypes from "pchain-types-js";
// or
import { Transaction } from "pchain-types-js";

// Non-lexical/ CommonJS/ Node.js
const PChainTypes = require("pchain-types-js");
// or
const Transaction = require("pchain-types-js").Transaction;
```

Serialization:

```js
const tx = new Transaction({
    signer,
    priority_fee_per_gas,
    gas_limit,
    max_base_fee_per_gas,
    nonce,
    commands: [
      call_command
    ]
} as InputTransaction);

const serializedTx = tx.serialize();
```

Deserialization:

```js
const tx = Transaction.deserialize(serializedTx);
```

---

## Borsh Serialization Format

Data types in the Parallelchain Mainnet Protocol are serialized based on the [Borsh serialization format](https://borsh.io/).

It is recommended that most users consume TypeScript types exposed in this library, without dealing with the specifics of the Borsh protocol.

Users who wish to dive deeper should know that this project has adopted the official JavaScript implementation from the Borsh team, which is the [borsh-js project](https://github.com/near/borsh-js). However, we have modified the code to use an internal implementation, based of v0.7.0 of `borsh-js`, to better support our use cases. Refer to the following sections for differences between the two, and reference examples.

We recognise that `borsh-js` will likely receive updates in future, and our eventual goal is update `pchain-types-js` to fully rely on upgraded version of `borsh-js` as a dependency. When we doing so, we will adopt communtiy feedback to minimise breakages and disruption.

### Differences with `borsh-js` v0.7.0

- `pchain-types-js` supports serde of Boolean or Set types, now missing from `borsh-js`

- `pchain-types-js` adds new type of `bytearray`, to deserialize variable length byte arrays into JavaScript Uint8Arrays, instead of an array of numbers

- `pchain-types-js` implements Option data type differently.  
  We have chosen this way for consistency with Enum's representation using an external wrapper class. It also has the benefit of representing nested Options of Options unambiguously.

To illustrate, here we compare a deserialized Option<Deposit> type:

pchain--types-js' Option representation

```
Option {
  value: null | Deposit {
    owner: PublicAddress {...},
    balance: BigNumber,
    auto_stake_rewards: boolean
  }
}
```

borsh-js' default Option representation

```
nulll | Deposit {
  owner: PublicAddress {...},
  balance: BigNumber,
  auto_stake_rewards: boolean
}
```

### Borsh Schema Reference Examples

These are examples as implemented by `pchain-types-js`.  
Top-level types must either be Structs or Enums.
They are composed of other more basic types.

---

Struct

```
// Define a struct with a single `transaction` field of type transaction
{ kind: "struct", fields: [["transaction", Transaction]] },

// Define an empty struct
{ kind: "struct", fields: [] }
```

Enum

```
// Define an Enum Account, which has 2 variants AccountWithContract or AccountWithoutContract
// The field "enum" is the discriminator, containing either "accountWithContract" or "accountWithoutContract"
// In each enum, only a single variant field can be populated.
// In this case, "accountWithContract" or "accountWithoutContract" field will point to the respective variant instance.
[
  Account,
  {
    kind: "enum",
    field: "enum",
    values: [
      ["accountWithContract", AccountWithContract],
      ["accountWithoutContract", AccountWithoutContract],
    ],
  },
]

```

---

Uint8 and variants

```
// Define "commission_rate" as a single unsigned 8-bit integer
["commission_rate", "u8"],
// Define "power" as a single unsigned 64-bit integer
["power", "u64"],
```

String

```
// Define "method" as a string
// Serializes to an array of valid UTF-8 bytes
["method", "string"]
```

Boolean

```
// Define "auto_stake_rewards" as boolean
["auto_stake_rewards", "boolean"]
```

---

Set

```
// Define "accounts" field as a set of PublicAddress
[
  "accounts",
  {
    kind: "set",
    type: PublicAddress,
  },
]
```

Map

```
// Define "accounts" field as a map of PublicAddress to Account
[
  "accounts",
  {
    kind: "map",
    key: PublicAddress,
    value: Account,
  },
]
```

Option

```
// Define "block" field as an Option of Block
[
  "block",
  {
    kind: "option",
    type: Block,
  },
]
```

---

Fixed Length Array of Specific Type

```
// Define "stakes" field as a set of arrays, each containing 2 PublicAddresses
[
  "stakes",
  {
    kind: "set",
    type: [PublicAddress, 2],
  },
]
```

Variable Length Array of Specific Type

```
// Define "delegated_stakes" field as a variable length of individual stakes
// Length will automatically read and included when serialized
["delegated_stakes", [Stake]],
```

Fixed Length Byte Array

```
// Define a "value" field as a byte array of length 32
["value", [32]]
```

Variable Length Byte Array

```
// Define "return_values" field as byte array of variable length,
// Length will automatically read and included when serialized
// Use this to ensure deserialization to a single Uint8Array, instead of a normal Array of numbers
["return_values", { kind: "bytearray" }],
```
