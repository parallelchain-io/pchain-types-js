import { Sha256Hash } from "../hash/sha256hash";
import { PublicAddress } from "../blockchain/ed_keys";
import { Block, BlockHeader } from "../blockchain/block";
import {
  Transaction,
  CommandReceipt,
  Receipt,
} from "../blockchain/transaction";
import { Stake } from "../blockchain/stake";
import { Option } from "../serde/option";
import { Serializable } from "../serde/serializable";
import { Enum, TypeCtorParams, u32, u64 } from "../constants";

export class SubmitTransactionRequest extends Serializable {
  transaction: Transaction;

  constructor({ transaction }: TypeCtorParams<SubmitTransactionRequest>) {
    super();
    this.transaction = transaction;
  }
}

export class SubmitTransactionResponse extends Serializable {
  error: Option<SubmitTransactionError>;

  constructor({ error }: TypeCtorParams<SubmitTransactionResponse>) {
    super();
    this.error = error;
  }
}

export enum SubmitTransactionError {
  UnacceptableNonce = 0,
  MempoolFull = 1,
  Other = 2,
}

export class TransactionRequest extends Serializable {
  transaction_hash: Sha256Hash;
  include_receipt: boolean;

  constructor({
    transaction_hash,
    include_receipt,
  }: TypeCtorParams<TransactionRequest>) {
    super();
    this.transaction_hash = transaction_hash;
    this.include_receipt = include_receipt;
  }
}

export class TransactionResponse extends Serializable {
  transaction: Option<Transaction>;
  receipt: Option<Receipt>;
  block_hash: Option<Sha256Hash>;
  position: Option<u32>;

  constructor({
    transaction,
    receipt,
    block_hash,
    position,
  }: TypeCtorParams<TransactionResponse>) {
    super();
    this.transaction = transaction;
    this.receipt = receipt;
    this.block_hash = block_hash;
    this.position = position;
  }
}

export class TransactionPositionRequest extends Serializable {
  transaction_hash: Sha256Hash;

  constructor({
    transaction_hash,
  }: TypeCtorParams<TransactionPositionRequest>) {
    super();
    this.transaction_hash = transaction_hash;
  }
}

export class TransactionPositionResponse extends Serializable {
  transaction_hash: Option<Sha256Hash>;
  block: Option<Sha256Hash>;
  position: Option<u32>;

  constructor({
    transaction_hash,
    block,
    position,
  }: TypeCtorParams<TransactionPositionResponse>) {
    super();
    this.transaction_hash = transaction_hash;
    this.block = block;
    this.position = position;
  }
}

export class ReceiptRequest extends Serializable {
  transaction_hash: Sha256Hash;

  constructor({ transaction_hash }: TypeCtorParams<ReceiptRequest>) {
    super();
    this.transaction_hash = transaction_hash;
  }
}

export class ReceiptResponse extends Serializable {
  transaction_hash: Sha256Hash;
  receipt: Option<Receipt>;
  block_hash: Option<Sha256Hash>;
  position: Option<u32>;

  constructor({
    transaction_hash,
    receipt,
    block_hash,
    position,
  }: TypeCtorParams<ReceiptResponse>) {
    super();
    this.transaction_hash = transaction_hash;
    this.receipt = receipt;
    this.block_hash = block_hash;
    this.position = position;
  }
}

export class BlockRequest extends Serializable {
  block_hash: Sha256Hash;

  constructor({ block_hash }: TypeCtorParams<BlockRequest>) {
    super();
    this.block_hash = block_hash;
  }
}

export class BlockResponse extends Serializable {
  block: Option<Block>;

  constructor({ block }: TypeCtorParams<BlockResponse>) {
    super();
    this.block = block;
  }
}

export class BlockHeaderRequest extends Serializable {
  block_hash: Sha256Hash;

  constructor({ block_hash }: TypeCtorParams<BlockHeaderRequest>) {
    super();
    this.block_hash = block_hash;
  }
}

export class BlockHeaderResponse extends Serializable {
  block_header: Option<BlockHeader>;

  constructor({ block_header }: TypeCtorParams<BlockHeaderResponse>) {
    super();
    this.block_header = block_header;
  }
}

export class BlockHeightByHashRequest extends Serializable {
  block_hash: Sha256Hash;

  constructor({ block_hash }: TypeCtorParams<BlockHeightByHashRequest>) {
    super();
    this.block_hash = block_hash;
  }
}

export class BlockHeightByHashResponse extends Serializable {
  block_hash: Sha256Hash;
  block_height: Option<u64>;

  constructor({
    block_hash,
    block_height,
  }: TypeCtorParams<BlockHeightByHashResponse>) {
    super();
    this.block_hash = block_hash;
    this.block_height = block_height;
  }
}

export class BlockHashByHeightRequest extends Serializable {
  block_height: u64;

  constructor({ block_height }: TypeCtorParams<BlockHashByHeightRequest>) {
    super();
    this.block_height = block_height;
  }
}

export class BlockHashByHeightResponse extends Serializable {
  block_height: u64;
  block_hash: Option<Sha256Hash>;

  constructor({
    block_height,
    block_hash,
  }: TypeCtorParams<BlockHashByHeightResponse>) {
    super();
    this.block_hash = block_hash;
    this.block_height = block_height;
  }
}

export class HighestCommittedBlockResponse extends Serializable {
  block_hash: Option<Sha256Hash>;

  constructor({ block_hash }: TypeCtorParams<HighestCommittedBlockResponse>) {
    super();
    this.block_hash = block_hash;
  }
}

export class StateRequest extends Serializable {
  accounts: Set<PublicAddress>;
  include_contract: boolean;
  storage_keys: Map<PublicAddress, Set<Uint8Array>>;

  constructor({
    accounts,
    include_contract,
    storage_keys,
  }: TypeCtorParams<StateRequest>) {
    super();
    this.accounts = accounts;
    this.include_contract = include_contract;
    this.storage_keys = storage_keys;
  }
}

export class StateResponse extends Serializable {
  accounts: Map<PublicAddress, Account>;
  storage_tuples: Map<PublicAddress, Map<Uint8Array, Uint8Array>>;
  block_hash: Sha256Hash;

  constructor({
    accounts,
    storage_tuples,
    block_hash,
  }: TypeCtorParams<StateResponse>) {
    super();
    this.accounts = accounts;
    this.storage_tuples = storage_tuples;
    this.block_hash = block_hash;
  }
}
export class ValidatorSetsRequest extends Serializable {
  include_prev: boolean;
  include_prev_delegators: boolean;
  include_curr: boolean;
  include_curr_delegators: boolean;
  include_next: boolean;
  include_next_delegators: boolean;

  constructor({
    include_prev,
    include_prev_delegators,
    include_curr,
    include_curr_delegators,
    include_next,
    include_next_delegators,
  }: TypeCtorParams<ValidatorSetsRequest>) {
    super();
    this.include_prev = include_prev;
    this.include_prev_delegators = include_prev_delegators;
    this.include_curr = include_curr;
    this.include_curr_delegators = include_curr_delegators;
    this.include_next = include_next;
    this.include_next_delegators = include_next_delegators;
  }
}

export class ValidatorSetsResponse extends Serializable {
  // the inner Option is set to None if we are at epoch 0
  prev_validator_set: Option<Option<ValidatorSet>>;
  curr_validator_set: Option<ValidatorSet>;
  next_validator_set: Option<ValidatorSet>;
  block_hash: Sha256Hash;

  constructor({
    prev_validator_set,
    curr_validator_set,
    next_validator_set,
    block_hash,
  }: TypeCtorParams<ValidatorSetsResponse>) {
    super();
    this.prev_validator_set = prev_validator_set;
    this.curr_validator_set = curr_validator_set;
    this.next_validator_set = next_validator_set;
    this.block_hash = block_hash;
  }
}

export class PoolsRequest extends Serializable {
  operators: Set<PublicAddress>;
  include_stakes: boolean;

  constructor({ operators, include_stakes }: TypeCtorParams<PoolsRequest>) {
    super();
    this.operators = operators;
    this.include_stakes = include_stakes;
  }
}

export class PoolsResponse extends Serializable {
  pools: Map<PublicAddress, Option<Pool>>; // maps pool operator to pool
  block_hash: Sha256Hash;

  constructor({ pools, block_hash }: TypeCtorParams<PoolsResponse>) {
    super();
    this.pools = pools;
    this.block_hash = block_hash;
  }
}

export class StakesRequest extends Serializable {
  stakes: Set<[PublicAddress, PublicAddress]>; // first is pool operator, second is owner

  constructor({ stakes }: TypeCtorParams<StakesRequest>) {
    super();
    this.stakes = stakes;
  }
}

export class StakesResponse extends Serializable {
  stakes: Map<[PublicAddress, PublicAddress], Option<Stake>>;
  block_hash: Sha256Hash;

  constructor({ stakes, block_hash }: TypeCtorParams<StakesResponse>) {
    super();
    this.stakes = stakes;
    this.block_hash = block_hash;
  }
}
export class DepositsRequest extends Serializable {
  stakes: Set<[PublicAddress, PublicAddress]>; // first address is pool operator, second is owner

  constructor({ stakes }: TypeCtorParams<DepositsRequest>) {
    super();
    this.stakes = stakes;
  }
}

export class DepositsResponse extends Serializable {
  deposits: Map<[PublicAddress, PublicAddress], Option<Deposit>>;
  block_hash: Sha256Hash;

  constructor({ deposits, block_hash }: TypeCtorParams<DepositsResponse>) {
    super();
    this.deposits = deposits;
    this.block_hash = block_hash;
  }
}

export class Deposit extends Serializable {
  owner: PublicAddress;
  balance: u64;
  auto_stake_rewards: boolean;

  constructor({ owner, balance, auto_stake_rewards }: TypeCtorParams<Deposit>) {
    super();
    this.owner = owner;
    this.balance = balance;
    this.auto_stake_rewards = auto_stake_rewards;
  }
}

/* Account-related types */

export class Account extends Enum {
  accountWithContract?: AccountWithContract;
  accountWithoutContract?: AccountWithoutContract;
}

export class AccountWithContract extends Serializable {
  nonce: u64;
  balance: u64;
  contract: Option<Uint8Array>;
  cbi_version: Option<u32>;
  storage_hash: Option<Sha256Hash>;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  static index: number = 0;

  constructor({
    nonce,
    balance,
    contract,
    cbi_version,
    storage_hash,
  }: TypeCtorParams<AccountWithContract>) {
    super();
    this.nonce = nonce;
    this.balance = balance;
    this.contract = contract;
    this.cbi_version = cbi_version;
    this.storage_hash = storage_hash;
  }

  index() {
    return AccountWithContract.index;
  }
}

export class AccountWithoutContract extends Serializable {
  nonce: u64;
  balance: u64;
  cbi_version: Option<u32>;
  storage_hash: Option<Sha256Hash>;
  static index: number = 1;

  constructor({
    nonce,
    balance,
    cbi_version,
    storage_hash,
  }: TypeCtorParams<AccountWithoutContract>) {
    super();
    this.nonce = nonce;
    this.balance = balance;
    this.cbi_version = cbi_version;
    this.storage_hash = storage_hash;
  }

  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index() {
    return AccountWithoutContract.index;
  }
}

export class ViewRequest extends Serializable {
  target: PublicAddress;
  method: Uint8Array;
  args: Option<Uint8Array[]>;

  constructor({ target, method, args }: TypeCtorParams<ViewRequest>) {
    super();
    this.target = target;
    this.method = method;
    this.args = args;
  }
}

export class ViewResponse extends Serializable {
  receipt: CommandReceipt;

  constructor({ receipt }: TypeCtorParams<ViewResponse>) {
    super();
    this.receipt = receipt;
  }
}

/* Staking-related types */
export class ValidatorSet extends Enum {
  poolsWithDelegator?: PoolWithDelegator[]; // with stakes
  poolsWithoutDelegator?: PoolWithoutDelegator[];
}

export class Pool extends Enum {
  poolWithDelegator?: PoolWithDelegator; // with stakes
  poolWithoutDelegator?: PoolWithoutDelegator;
}

export class PoolWithDelegator extends Serializable {
  operator: PublicAddress;
  power: u64;
  commission_rate: number;
  operator_stake: Option<Stake>;
  delegated_stakes: Stake[];
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  static index: number = 0;

  constructor({
    operator,
    power,
    commission_rate,
    operator_stake,
    delegated_stakes,
  }: TypeCtorParams<PoolWithDelegator>) {
    super();
    this.operator = operator;
    this.power = power;
    this.commission_rate = commission_rate;
    this.operator_stake = operator_stake;
    this.delegated_stakes = delegated_stakes;
  }

  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index() {
    return PoolWithDelegator.index;
  }
}

export class PoolWithoutDelegator extends Serializable {
  operator: PublicAddress;
  power: u64;
  commission_rate: number;
  operator_stake: Option<Stake>;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  static index: number = 1;

  constructor({
    operator,
    power,
    commission_rate,
    operator_stake,
  }: TypeCtorParams<PoolWithoutDelegator>) {
    super();
    this.operator = operator;
    this.power = power;
    this.commission_rate = commission_rate;
    this.operator_stake = operator_stake;
  }
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index() {
    return PoolWithoutDelegator.index;
  }
}
