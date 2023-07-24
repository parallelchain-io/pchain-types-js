// import, declare, register all type schemas in this file only
// registration done only once to avoid any circular imports or dependency issues

import {
  Block,
  BlockHeader,
  BloomFilter,
  Call,
  CommandReceipt,
  Commit,
  CreateDeposit,
  CreatePool,
  DeletePool,
  Deploy,
  Generic,
  Log,
  NextEpoch,
  Phase,
  Precommit,
  Prepare,
  PublicAddress,
  QuorumCertificate,
  SetDepositSettings,
  SetPoolSettings,
  Signature,
  SignatureSet,
  Stake,
  StakeDeposit,
  Command,
  TopUpDeposit,
  Transaction,
  Transfer,
  UnstakeDeposit,
  WithdrawDeposit,
  PrivateKey,
  MerkleProof,
  StateProof,
  StateProofItemType,
  StateProofNonce,
  StateProofBalance,
  StateProofCode,
  StateProofCbiVersion,
  StateProofStorage,
  StateProofItem,
  SignedTx,
  Base64URL,
  Receipt,
} from "../blockchain";
import { Sha256Hash } from "../hash";
import {
  Account,
  AccountWithContract,
  AccountWithoutContract,
  BlockHashByHeightRequest,
  BlockHashByHeightResponse,
  BlockHeaderRequest,
  BlockHeaderResponse,
  BlockHeightByHashRequest,
  BlockHeightByHashResponse,
  BlockRequest,
  BlockResponse,
  Deposit,
  DepositsRequest,
  DepositsResponse,
  HighestCommittedBlockResponse,
  Pool,
  PoolWithDelegator,
  PoolWithoutDelegator,
  PoolsRequest,
  PoolsResponse,
  ReceiptRequest,
  ReceiptResponse,
  StakesRequest,
  StakesResponse,
  StateRequest,
  StateResponse,
  SubmitTransactionRequest,
  SubmitTransactionResponse,
  TransactionPositionRequest,
  TransactionPositionResponse,
  TransactionRequest,
  TransactionResponse,
  ValidatorSet,
  ValidatorSetsRequest,
  ValidatorSetsResponse,
  ViewRequest,
  ViewResponse,
} from "../rpc";
import {
  InheritsSerializable,
  InheritsEnum,
  BorshStruct,
  BorshEnum,
} from "./borsh_internal_types";
import { deserializeUnchecked, serialize } from "./borsh_internal";

//
// THINGS to note when adding to the schema
// 1. Struct fields MUST be listed in the same order as per the original Rust declarations; the order will affect the serde ouput
// 2. Any new schema declared using new Map() MUST include the allowed type declaration for type safety
// 3. Struct fields should match TypeScript class declarations for proper type hints
//

export const BLOCK_SCHEMA = new Map<
  InheritsSerializable | InheritsEnum,
  BorshStruct | BorshEnum
>([
  [
    Block,
    {
      kind: "struct",
      fields: [
        ["blockHeader", BlockHeader],
        ["transactions", [Transaction]],
        ["receipts", [Receipt]],
      ],
    },
  ],
  [
    BlockHeader,
    {
      kind: "struct",
      fields: [
        ["hash", Sha256Hash],
        ["height", "u64"],
        ["justify", QuorumCertificate],
        ["data_hash", Sha256Hash],
        ["chain_id", "u64"],
        ["proposer", PublicAddress],
        ["timestamp", "u32"],
        ["base_fee", "u64"],
        ["gas_used", "u64"],
        ["txs_hash", Sha256Hash],
        ["receipts_hash", Sha256Hash],
        ["state_hash", Sha256Hash],
        ["log_bloom", BloomFilter],
      ],
    },
  ],
  [
    QuorumCertificate,
    {
      kind: "struct",
      fields: [
        ["app_id", "u64"], // equivalent field is called chain_id in Rust code
        ["view", "u64"],
        ["block", Sha256Hash],
        ["phase", Phase],
        ["sigs", SignatureSet], // equivalent field is called signatures in Rust code
      ],
    },
  ],
  //
  // Phase
  //
  [
    Phase,
    {
      kind: "enum",
      field: "enum",
      values: [
        ["generic", Generic],
        ["prepare", Prepare],
        ["precommit", Precommit],
        ["commit", Commit],
      ],
    },
  ],
  [
    Generic,
    {
      kind: "struct",
      fields: [],
    },
  ],
  [
    Prepare,
    {
      kind: "struct",
      fields: [],
    },
  ],
  [
    Precommit,
    {
      kind: "struct",
      fields: [["view", "u64"]],
    },
  ],
  [
    Commit,
    {
      kind: "struct",
      fields: [["view", "u64"]],
    },
  ],
  //
  // SingatureSet
  //
  [
    SignatureSet,
    {
      kind: "struct",
      fields: [["signatures", [{ kind: "option", type: Signature }]]],
    },
  ],
  [
    // equivalent is called SignatureBytes in Rust code
    Signature,
    {
      kind: "struct",
      fields: [["signature", [64]]],
    },
  ],
  //
  // Transaction
  //
  [
    Transaction,
    {
      kind: "struct",
      fields: [
        ["signer", PublicAddress],
        ["nonce", "u64"],
        ["commands", [Command]],
        ["gas_limit", "u64"],
        ["max_base_fee_per_gas", "u64"],
        ["priority_fee_per_gas", "u64"],
        ["signature", Signature],
        ["hash", Sha256Hash],
      ],
    },
  ],
  [
    SignedTx,
    {
      kind: "struct",
      fields: [
        ["signer", PublicAddress],
        ["nonce", "u64"],
        ["commands", [Command]],
        ["gas_limit", "u64"],
        ["max_base_fee_per_gas", "u64"],
        ["priority_fee_per_gas", "u64"],
        ["signature", Signature],
        ["hash", Sha256Hash],
      ],
    },
  ],
  [
    PublicAddress,
    {
      kind: "struct",
      fields: [["value", [32]]],
    },
  ],
  [
    PrivateKey,
    {
      kind: "struct",
      fields: [["value", [32]]],
    },
  ],
  [
    Sha256Hash,
    {
      kind: "struct",
      fields: [["hash", [32]]],
    },
  ],
  [
    BloomFilter,
    {
      kind: "struct",
      fields: [["filter", [256]]],
    },
  ],
  //
  // Receipt
  //
  [
    Receipt,
    {
      kind: "struct",
      fields: [["command_receipts", [CommandReceipt]]],
    },
  ],
  [
    CommandReceipt,
    {
      kind: "struct",
      fields: [
        ["exit_status", "u8"], // represents TypeScript numeric enum ExitStatus
        ["gas_used", "u64"],
        ["return_values", { kind: "bytearray" }],
        ["logs", [Log]],
      ],
    },
  ],
  [
    Log,
    {
      kind: "struct",
      fields: [
        ["topic", { kind: "bytearray" }],
        ["value", { kind: "bytearray" }],
      ],
    },
  ],
  [
    Base64URL,
    {
      kind: "struct",
      fields: [["value", "string"]],
    },
  ],
]);

export const COMMAND_SCHEMA = new Map<
  InheritsSerializable | InheritsEnum,
  BorshStruct | BorshEnum
>([
  // equivalent Command variants are suffixed with "Input" in Rust code
  // e.g. TransferInput, DeployInput, CallInput, etc.
  [
    Command,
    {
      kind: "enum",
      field: "enum",
      values: [
        ["transfer", Transfer],
        ["deploy", Deploy],
        ["call", Call],
        ["createPool", CreatePool],
        ["setPoolSettings", SetPoolSettings],
        ["deletePool", DeletePool],
        ["createDeposit", CreateDeposit],
        ["setDepositSettings", SetDepositSettings],
        ["topUpDeposit", TopUpDeposit],
        ["withdrawDeposit", WithdrawDeposit],
        ["stakeDeposit", StakeDeposit],
        ["unstakeDeposit", UnstakeDeposit],
        ["nextEpoch", NextEpoch],
      ],
    },
  ],
  [
    Transfer,
    {
      kind: "struct",
      fields: [
        ["recipient", PublicAddress],
        ["amount", "u64"],
      ],
    },
  ],
  [
    Deploy,
    {
      kind: "struct",
      fields: [
        ["contract", { kind: "bytearray" }],
        ["cbi_version", "u32"],
      ],
    },
  ],
  [
    Call,
    {
      kind: "struct",
      fields: [
        ["target", PublicAddress],
        ["method", "string"],
        ["args", { kind: "option", type: [{ kind: "bytearray" }] }], // equivalent field is called "arguments" in Rust code
        ["amount", { kind: "option", type: "u64" }],
      ],
    },
  ],
  [CreatePool, { kind: "struct", fields: [["commission_rate", "u8"]] }],
  [SetPoolSettings, { kind: "struct", fields: [["commission_rate", "u8"]] }],
  [DeletePool, { kind: "struct", fields: [] }],
  [
    CreateDeposit,
    {
      kind: "struct",
      fields: [
        ["operator", PublicAddress],
        ["balance", "u64"],
        ["auto_stake_rewards", "boolean"],
      ],
    },
  ],
  [
    SetDepositSettings,
    {
      kind: "struct",
      fields: [
        ["operator", PublicAddress],
        ["auto_stake_rewards", "boolean"],
      ],
    },
  ],
  [
    TopUpDeposit,
    {
      kind: "struct",
      fields: [
        ["operator", PublicAddress],
        ["amount", "u64"],
      ],
    },
  ],
  [
    WithdrawDeposit,
    {
      kind: "struct",
      fields: [
        ["operator", PublicAddress],
        ["max_amount", "u64"],
      ],
    },
  ],
  [
    StakeDeposit,
    {
      kind: "struct",
      fields: [
        ["operator", PublicAddress],
        ["max_amount", "u64"],
      ],
    },
  ],
  [
    UnstakeDeposit,
    {
      kind: "struct",
      fields: [
        ["operator", PublicAddress],
        ["max_amount", "u64"],
      ],
    },
  ],
  [NextEpoch, { kind: "struct", fields: [] }],
]);

export const RPC_SCHEMA = new Map<
  InheritsSerializable | InheritsEnum,
  BorshStruct | BorshEnum
>([
  [BlockRequest, { kind: "struct", fields: [["block_hash", Sha256Hash]] }],
  [
    BlockResponse,
    {
      kind: "struct",
      fields: [
        [
          "block",
          {
            kind: "option",
            type: Block,
          },
        ],
      ],
    },
  ],
  [
    BlockHeaderRequest,
    { kind: "struct", fields: [["block_hash", Sha256Hash]] },
  ],
  [
    BlockHeaderResponse,
    {
      kind: "struct",
      fields: [["block_header", { kind: "option", type: BlockHeader }]],
    },
  ],
  [
    TransactionRequest,
    {
      kind: "struct",
      fields: [
        ["transaction_hash", Sha256Hash],
        ["include_receipt", "boolean"],
      ],
    },
  ],
  [
    TransactionResponse,
    {
      kind: "struct",
      fields: [
        ["transaction", { kind: "option", type: Transaction }],
        ["receipt", { kind: "option", type: Receipt }],
        ["block_hash", { kind: "option", type: Sha256Hash }],
        ["position", { kind: "option", type: "u32" }],
      ],
    },
  ],
  //
  //
  [
    TransactionPositionRequest,
    { kind: "struct", fields: [["transaction_hash", Sha256Hash]] },
  ],
  [
    TransactionPositionResponse,
    {
      kind: "struct",
      fields: [
        ["transaction_hash", { kind: "option", type: Sha256Hash }],
        ["block", { kind: "option", type: Sha256Hash }], // equivalent field is called block_hash in Rust code
        ["position", { kind: "option", type: "u32" }],
      ],
    },
  ],
  //
  //
  [
    BlockHashByHeightRequest,
    { kind: "struct", fields: [["block_height", "u64"]] },
  ],
  [
    BlockHashByHeightResponse,
    {
      kind: "struct",
      fields: [
        ["block_height", "u64"],
        ["block_hash", { kind: "option", type: Sha256Hash }],
      ],
    },
  ],
  [
    BlockHeightByHashRequest,
    { kind: "struct", fields: [["block_hash", Sha256Hash]] },
  ],
  [
    BlockHeightByHashResponse,
    {
      kind: "struct",
      fields: [
        ["block_hash", Sha256Hash],
        ["block_height", { kind: "option", type: "u64" }],
      ],
    },
  ],
  [
    SubmitTransactionRequest,
    { kind: "struct", fields: [["transaction", Transaction]] },
  ],
  [
    SubmitTransactionResponse,
    {
      kind: "struct",
      fields: [
        [
          "error",
          {
            kind: "option",
            type: "u8", // represents TypeScript numeric enum SubmitTransactionError
          },
        ],
      ],
    },
  ],
  [
    ReceiptRequest,
    { kind: "struct", fields: [["transaction_hash", Sha256Hash]] },
  ],
  [
    ReceiptResponse,
    {
      kind: "struct",
      fields: [
        ["transaction_hash", Sha256Hash],
        ["receipt", { kind: "option", type: Receipt }],
        ["block_hash", { kind: "option", type: Sha256Hash }],
        ["position", { kind: "option", type: "u32" }],
      ],
    },
  ],
  [
    HighestCommittedBlockResponse,
    {
      kind: "struct",
      fields: [["block_hash", { kind: "option", type: Sha256Hash }]],
    },
  ],
  [
    StateRequest,
    {
      kind: "struct",
      fields: [
        [
          "accounts",
          {
            kind: "set",
            type: PublicAddress,
          },
        ],
        ["include_contract", "boolean"],
        [
          "storage_keys",
          {
            kind: "map",
            key: PublicAddress,
            value: {
              kind: "set",
              type: { kind: "bytearray" },
            },
          },
        ],
      ],
    },
  ],
  [
    StateResponse,
    {
      kind: "struct",
      fields: [
        [
          "accounts",
          {
            kind: "map",
            key: PublicAddress,
            value: Account,
          },
        ],
        [
          "storage_tuples",
          {
            kind: "map",
            key: PublicAddress,
            value: {
              kind: "map",
              key: { kind: "bytearray" },
              value: { kind: "bytearray" },
            },
          },
        ],
        ["block_hash", Sha256Hash],
      ],
    },
  ],
  //
  // Account
  //
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
  ],
  [
    AccountWithContract,
    {
      kind: "struct",
      fields: [
        ["nonce", "u64"],
        ["balance", "u64"],
        ["contract", { kind: "option", type: { kind: "bytearray" } }],
        ["cbi_version", { kind: "option", type: "u32" }],
        ["storage_hash", { kind: "option", type: Sha256Hash }],
      ],
    },
  ],
  [
    AccountWithoutContract,
    {
      kind: "struct",
      fields: [
        ["nonce", "u64"],
        ["balance", "u64"],
        ["cbi_version", { kind: "option", type: "u32" }],
        ["storage_hash", { kind: "option", type: Sha256Hash }],
      ],
    },
  ],
  //
  // Validator
  //
  [
    ValidatorSetsRequest,
    {
      kind: "struct",
      fields: [
        ["include_prev", "boolean"],
        ["include_prev_delegators", "boolean"],
        ["include_curr", "boolean"],
        ["include_curr_delegators", "boolean"],
        ["include_next", "boolean"],
        ["include_next_delegators", "boolean"],
      ],
    },
  ],
  [
    ValidatorSetsResponse,
    {
      kind: "struct",
      fields: [
        [
          "prev_validator_set",
          {
            kind: "option",
            type: {
              kind: "option",
              type: ValidatorSet,
            },
          },
        ],
        ["curr_validator_set", { kind: "option", type: ValidatorSet }],
        ["next_validator_set", { kind: "option", type: ValidatorSet }],
        ["block_hash", Sha256Hash],
      ],
    },
  ],
  [
    PoolWithDelegator,
    {
      kind: "struct",
      fields: [
        ["operator", PublicAddress],
        ["power", "u64"],
        ["commission_rate", "u8"],
        ["operator_stake", { kind: "option", type: Stake }],
        ["delegated_stakes", [Stake]],
      ],
    },
  ],
  [
    PoolWithoutDelegator,
    {
      kind: "struct",
      fields: [
        ["operator", PublicAddress],
        ["power", "u64"],
        ["commission_rate", "u8"],
        ["operator_stake", { kind: "option", type: Stake }],
      ],
    },
  ],
  [
    ValidatorSet,
    {
      kind: "enum",
      field: "enum",
      values: [
        ["poolsWithDelegator", [PoolWithDelegator]],
        ["poolsWithoutDelegator", [PoolWithoutDelegator]],
      ],
    },
  ],
  [
    Pool,
    {
      kind: "enum",
      field: "enum",
      values: [
        ["poolWithDelegator", PoolWithDelegator],
        ["poolWithoutDelegator", PoolWithoutDelegator],
      ],
    },
  ],
  [
    Stake,
    {
      kind: "struct",
      fields: [
        ["owner", PublicAddress],
        ["power", "u64"],
      ],
    },
  ],
  //
  // Deposit
  [
    DepositsRequest,
    {
      kind: "struct",
      fields: [
        [
          "stakes",
          {
            kind: "set",
            type: [PublicAddress, 2], // fixed array of 2 addresses, first is operator, second is owner
          },
        ],
      ],
    },
  ],
  [
    DepositsResponse,
    {
      kind: "struct",
      fields: [
        [
          "deposits",
          {
            kind: "map",
            key: [PublicAddress, 2],
            value: {
              kind: "option",
              type: Deposit,
            },
          },
        ],
        ["block_hash", Sha256Hash],
      ],
    },
  ],
  [
    Deposit,
    {
      kind: "struct",
      fields: [
        ["owner", PublicAddress],
        ["balance", "u64"],
        ["auto_stake_rewards", "boolean"],
      ],
    },
  ],
  //
  // Pools
  [
    PoolsRequest,
    {
      kind: "struct",
      fields: [
        [
          "operators",
          {
            kind: "set",
            type: PublicAddress,
          },
        ],
        ["include_stakes", "boolean"],
      ],
    },
  ],
  [
    PoolsResponse,
    {
      kind: "struct",
      fields: [
        [
          "pools",
          {
            kind: "map",
            key: PublicAddress, // pool operator
            value: {
              kind: "option",
              type: Pool,
            },
          },
        ],
        ["block_hash", Sha256Hash],
      ],
    },
  ],
  // Stakes
  [
    StakesRequest,
    {
      kind: "struct",
      fields: [
        [
          "stakes",
          {
            kind: "set",
            type: [PublicAddress, 2], // fixed of 2 addresses, first is operator, second is owner
          },
        ],
      ],
    },
  ],
  [
    StakesResponse,
    {
      kind: "struct",
      fields: [
        [
          "stakes",
          {
            kind: "map",
            key: [PublicAddress, 2],
            value: {
              kind: "option",
              type: Stake,
            },
          },
        ],
        ["block_hash", Sha256Hash],
      ],
    },
  ],
  [
    ViewRequest,
    {
      kind: "struct",
      fields: [
        ["target", PublicAddress],
        ["method", "string"], // Rust struct represents as a byte array (of UTF-8), both are equivalent when serialized
        [
          "args",
          {
            kind: "option",
            type: [{ kind: "bytearray" }],
          },
        ],
      ],
    },
  ],
  [ViewResponse, { kind: "struct", fields: [["receipt", CommandReceipt]] }],
]);

export const PROOFS_SCHEMA = new Map<
  InheritsSerializable | InheritsEnum,
  BorshStruct | BorshEnum
>([
  [
    MerkleProof,
    {
      kind: "struct",
      fields: [
        ["root_hash", Sha256Hash],
        ["total_leaves_count", "u64"],
        ["leaf_indices", ["u32"]], // array of integers, integer i represents the i-th leaf to prove
        ["leaf_hashes", [Sha256Hash]],
        ["proof", { kind: "bytearray" }],
      ],
    },
  ],
  [
    StateProof,
    {
      kind: "struct",
      fields: [
        ["root_hash", Sha256Hash],
        ["address", PublicAddress],
        ["item", StateProofItem],
        ["proof", [{ kind: "bytearray" }]], // array of byte arrays which represents sequence of nodes traversed using pre-order
      ],
    },
  ],
  [
    StateProofItem,
    {
      kind: "struct",
      fields: [
        ["type", StateProofItemType], // type field points to StateProofItemType
        ["value", { kind: "bytearray" }],
      ],
    },
  ],
  [
    StateProofItemType,
    {
      kind: "enum",
      field: "enum",
      values: [
        ["nonce", StateProofNonce],
        ["balance", StateProofBalance],
        ["code", StateProofCode],
        ["cbiVersion", StateProofCbiVersion],
        ["storage", StateProofStorage],
      ],
    },
  ],
  [StateProofNonce, { kind: "struct", fields: [] }],
  [StateProofBalance, { kind: "struct", fields: [] }],
  [StateProofCode, { kind: "struct", fields: [] }],
  [StateProofCode, { kind: "struct", fields: [] }],
  [
    StateProofStorage,
    {
      kind: "struct",
      fields: [
        ["storageHash", Sha256Hash],
        ["value", { kind: "bytearray" }],
      ],
    },
  ],
]);

export const PCHAIN_SCHEMA = new Map<
  InheritsSerializable | InheritsEnum,
  BorshStruct | BorshEnum
>([...BLOCK_SCHEMA, ...COMMAND_SCHEMA, ...RPC_SCHEMA, ...PROOFS_SCHEMA]);

export interface ISerializable {
  deserialize: (buffer: Buffer | ArrayBuffer) => unknown;
  serialize: () => Buffer;
  prototype: any;
}

const registerSchema = () => {
  for (const [klass] of PCHAIN_SCHEMA) {
    // deserialize method accepts both Buffer or ArrayBuffer
    // to handle Axios `arraybuffer` responseType being different in Node.js and browser
    // it is convenient that callling Buffer.from() on Buffer will return the same type
    (klass as unknown as ISerializable).deserialize = function (
      buffer: Buffer | ArrayBuffer
    ): unknown {
      return deserializeUnchecked(
        PCHAIN_SCHEMA,
        klass as any,
        Buffer.from(buffer)
      );
    };

    (klass as unknown as ISerializable).prototype.serialize =
      function (): Buffer {
        return Buffer.from(serialize(PCHAIN_SCHEMA, this));
      };
  }
};

registerSchema();
