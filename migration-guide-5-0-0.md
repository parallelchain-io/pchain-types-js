This guide lists changes that developers should take note of when upgrading to 5.0.0 from earlier versions.

## Introduction

The primary goal of 5.0.0 was to apply the Borsh serialization/ deserialization standards in a consistent and maintainable way. Please refer to our new reference section in the README that documents our usage of Borsh.

Another major change was to provide, through unit tests, samples of how the various classes and types are serialized.

Finally, the code has been reorganised to be easier to import, and updated with consistent syntax.

## Changes

### Import from the module root

Previously, certain types were exposed only through sub-paths in the module. Now, everything is meant to be imported from the root path.  
It is recommended to use named imports for specific classes that are required, instead of the entire `pchain-types-js` namespace.
This will improve type checking, aliasing, and allow tree-shaking where applicable.

Before

```TypeScript
import { NumberType, u32, u64 } from "pchain-types-js/lib/crypto/numbers";
```

After

```TypeScript
import { NumberType, u32, u64 } from "pchain-types-js";
```

---

### Consistent representation of the Option type

Previously, some Options were represented as the union of value or null <value | null>, whereas other Options were wrapped in the Option class.

For consistency, all Option types are now wrapped in the Option class with the `value` field pointing to the either the object or null. This allows for a faithful representation of complex types such as `Option<Option<SomeValue>>`.

**Example One**

The usage of Option is found mainly in the RPC responses, for example, in the BlockResponse type:

Before

```
BlockResponse {
  block: Block {
    blockHeader: BlockHeader,
    transactions: [Transaction],
    receipts: [Receipt]
  }
}
```

```TypeScript
const response = await this.networking.post_response("block", request.serialize()); // inputs separately defined, refer to pchain-client-js for full example code
const blockResponse: BlockResponse = BlockResponse.deserialize(response);
if (blockResponse.block) {
  // .block is directly of type Block, can be null
    const { blockHeader, transactions, receipts } = blockResponse.block;
}
```

After

```
BlockResponse {
  block: Option {
    value: Block {
      blockHeader: BlockHeader,
      transactions: [Transaction],
      receipts: [Receipt]
    }
  }
}
```

```TypeScript
const response = await this.networking.post_response("block", request.serialize());  // inputs separately defined, refer to pchain-client-js for full example code
const blockResponse: BlockResponse = BlockResponse.deserialize(response);
if (blockResponse.block.value) {
  // .block is of type Option, need .value to further resole to type Block, can be null
  const { blockHeader, transactions, receipts } = blockResponse.block.value;
}
```

**Example Two**

Another commonly used type that is affected by the Option change is the Call Command, as follows:

Before

```TypeScript
// note the change in enum type of Call as well, see section below on Enum
//
// destructuring a Call
const { target, method, args, amount } = call as Command.Call;
//
// creating a new Call
const topupDepositCall = new Command.Call({
  target: this.contract_address,
  amount: null,
  method: "topup_deposit",
  args: [
      Buffer.from(operator.toBytes()),
      ...
  ]
})
```

After

```TypeScript
//
// destructuring a Call
const { target, method, args: argOption, amount: amountOption } = call as Call;
// note args and amount are of type Option
// value is the respective type or null
const args = argOption.value;
const amount = amountOption.value;
//
// creating a new Call, note the usage of the Command enum to nest the Call, see section below on Enum
const topupDepositCall = new Command({
  call: new Call({
    target: this.contract_address,
    amount: new Option<BN>({ value: null }), // pass null to Option if there is no value
    method: "topup_deposit",
    args: new Option({
      value: [
        Buffer.from(operator.toBytes()),
        ...
      ],
    }),
  })
});
```

---

### Updated representation of Enum type to follow `borsh-js` convention

All enum types now inherit from a wrapper abstract class called Enum.  
The class has an "enum" discriminator field and a key-value pair that points to the discriminated variant type.

This affects the following types:

- StateProofItem
- Phase
- Command
- Account
- ValidatorSet
- Pool

**Example one**  
Changes to the Command enum, showing the Call and Stake Deposit variants

Before:

```TypeScript
// Sample Command.Call
// Call {
//    target: PublicAddress {...},
//    method: 'claim_unlocked_tokens',
//    args: [ [Uint8Array] ],
//    amount: <BN: 0>,
//    index: 2
// }
//
// destructuring a Call command
const block: Block = await getLatestBlock(); // method defined separately
// parse first transaction of the block
const commands = block?.transactions?.[0]?.commands;
// need to check the type of command, index 2 being the Call command
if (commands?.[0]?.index === 2) {
  const call = commands?.[0] as Command.Call;
  const { target, method, args, amount } = call;
}
```

```TypeScript
// build a new StakeDeposit command
const transaction = new Transaction({
  commands: [
    // notice the Command type was passed directly
    new Command.StakeDeposit({
      operator: new PublicAddress(
        "R5aexUGcjnUwYuy7JrffNb8hsdmEllWEoMoodJ4s3xQ"
      ),
      max_amount: new BN(100),
    }),
  ],
  signer: keypair1.public_key, // assume keypair initialized separately
  nonce: 1,
});
const signedTx = await transaction.toSignedTx(keypair1);
```

After

```TypeScript
// Sample nested Call
// Command {
//   call: Call {
//     target: PublicAddress {...},
//     method: 'claim_unlocked_tokens',
//     args: Option { value: [ [Uint8Array] ] },
//     amount: Option { value: <BN: 0> },
//     index: 2
//   },
//   enum: 'call'
// }
//
// destructuring a command
const block: Block = await getLatestBlock();  // method defined separately
// parse first transaction of the block
const commands = block?.transactions?.[0]?.commands;
if (commands?.[0]?.enum === "call") {
  // check the enum to be sure it is safe to cast
  const { target, method, args: argOption, amount: amountOption } = call;
  // note args and amount are of type Option
  const args = argOption?.value;
  const amount = amountOption?.value;
}
```

```TypeScript
// build a new StakeDeposit command
const transaction = new Transaction({
  commands: [
    // notice the Command type now nests StakeDeposit
    new Command({
      stakeDeposit: new StakeDeposit({
        operator: new PublicAddress(
          "R5aexUGcjnUwYuy7JrffNb8hsdmEllWEoMoodJ4s3xQ"
        ),
        max_amount: new BN(100),
      }),
    }),
  ],
  signer: keypair1.public_key, // assume keypair initialized separately
  nonce: 1,
});
const signedTx = await transaction.toSignedTx(keypair1);
```

**Example two**
Changes to the ValidatorSet enum, specifically the PoolsWithoutDelegator variant

Before

```
// ValidatorSet is really just an instance of PoolsWithoutDelegator
PoolsWithoutDelegator: {
  pools: [
    PoolWithoutDelegator { ... },
    PoolWithoutDelegator { ... }
  ]
}
```

```TypeScript
const validatorSet: ValidatorSet = await getCurrentValidatorSet(); // implemented separately
const pools = validatorSet.pools;
// ValidatorSet has a pools property
// pools is an array of PoolWithoutDelegator, but you just have to assume based on your request
for (const pool of pools) {
  const power = pool.power;
  const operator = pool.operator;
}
```

After

```
ValidatorSet {
  poolsWithoutDelegator: [
    PoolWithoutDelegator { ... },
    PoolWithoutDelegator { ... }
  ]
}
```

```TypeScript
const validatorSet: ValidatorSet = await getCurrentValidatorSet(); // implemented separately
// ValidatorSet is now an enum which has the variant poolsWithoutDelegator
if (validatorSet?.enum === "poolsWithoutDelegator") {
    // check the enum to be sure it is safe to cast
    const pools = validatorSet.poolsWithoutDelegator as PoolWithoutDelegator[];
    for (const pool of pools) {
        const power = pool.power;
        const operator = pool.operator;
    }
}
```

## Deprecations

The following methods/ properties are marked as deprecated and will be removed in a future release.
Please refer to individual descriptions for alternatives to use

- serializeNum
- deserializeNum
- index discriminators on Enum type
