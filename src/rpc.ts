import { ExtendedReader } from "./crypto/extended-reader";
import { ExtendedWriter } from "./crypto/extended-writer";
import { borshDeserialize, borshSerialize } from "./serde";
import { u32, u64 } from "./crypto/numbers";
import { Sha256Hash } from "./crypto/sha256hash";
import { PublicAddress } from "./crypto/public_address";
import { Block, BlockHeader } from "./block";
import { Transaction, CommandReceipt } from "./transaction";
import { Stake } from "./stake";
import { Option } from "./crypto/option";

export class SubmitTransactionRequest{
    transaction: Transaction
    
    constructor(transaction: Transaction){
        this.transaction = transaction;
    }

    serialize = () => {
        return this.transaction.serialize();
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = Transaction.deserialize(buffer);
        return new SubmitTransactionRequest(deserialized);
    }
}

export class SubmitTransactionResponse {
    error: SubmitTransactionError | null;

    constructor({error}: SubmitTransactionResponse) {
        this.error = error;
    }

    static schema = new Map([[SubmitTransactionResponse, {kind:'struct', fields:[
        ['error','optionU8']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, SubmitTransactionResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, SubmitTransactionResponse.schema, SubmitTransactionResponse, ExtendedReader);
        return deserialized as SubmitTransactionResponse;
    }
}

export enum SubmitTransactionError{
    UnacceptableNonce = 0,
    MempoolFull = 1,
    Other = 2
}


export class TransactionRequest {
    transaction_hash: Sha256Hash;
    include_receipt: boolean;
    
    constructor({transaction_hash, include_receipt}: TransactionRequest){
        this.transaction_hash = transaction_hash;
        this.include_receipt = include_receipt;
    }

    static schema = new Map([[TransactionRequest, {kind:'struct', fields:[
        ['transaction_hash','sha256Hash'],
        ['include_receipt','boolean']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, TransactionRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, TransactionRequest.schema, TransactionRequest, ExtendedReader);
        return deserialized as TransactionRequest;
    }
}

export class TransactionResponse {
    transaction: Transaction | null;
    receipt: CommandReceipt[] | null;
    block_hash: Sha256Hash | null;
    position: u32 | null;

    constructor({transaction, receipt, block_hash, position}: TransactionResponse) {
        this.transaction = transaction;
        this.receipt = receipt;
        this.block_hash = block_hash;
        this.position = position;
    }

    static schema = new Map([[TransactionResponse, {kind:'struct', fields:[
        ['transaction','optionTransaction'],
        ['receipt','optionReceipt'],
        ['block_hash','optionSha256Hash'],
        ['position','optionU32']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, TransactionResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, TransactionResponse.schema, TransactionResponse, ExtendedReader);
        return deserialized as TransactionResponse;
    }

}

export class TransactionPositionRequest {
    transaction_hash: Sha256Hash;

    constructor({transaction_hash}: TransactionPositionRequest) {
        this.transaction_hash = transaction_hash;
    }

    static schema = new Map([[TransactionPositionRequest, {kind:'struct', fields:[
        ['transaction_hash','sha256Hash'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, TransactionPositionRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, TransactionPositionRequest.schema, TransactionPositionRequest, ExtendedReader);
        return deserialized as TransactionPositionRequest;
    }
}

export class TransactionPositionResponse {
    transaction_hash: Sha256Hash | null;
    block: Sha256Hash | null;
    position: u32 | null;

    constructor({transaction_hash, block, position}: TransactionPositionResponse) {
        this.transaction_hash = transaction_hash;
        this.block = block;
        this.position = position;
    }

    static schema = new Map([[TransactionPositionResponse, {kind:'struct', fields:[
        ['transaction_hash','optionSha256Hash'],
        ['block', 'optionSha256Hash'],
        ['position', 'optionU32']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, TransactionPositionResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, TransactionPositionResponse.schema, TransactionPositionResponse, ExtendedReader);
        return deserialized as TransactionPositionResponse;
    }
}

export class ReceiptRequest {
    transaction_hash: Sha256Hash;

    constructor({transaction_hash}: ReceiptRequest) {
        this.transaction_hash = transaction_hash;
    }

    static schema = new Map([[ReceiptRequest, {kind:'struct', fields:[
        ['transaction_hash','sha256Hash'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, ReceiptRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, ReceiptRequest.schema, ReceiptRequest, ExtendedReader);
        return deserialized as ReceiptRequest;
    }
}

export class ReceiptResponse {
    transaction_hash: Sha256Hash;
    receipt: CommandReceipt[] | null;
    block_hash: Sha256Hash | null;
    position: u32 | null;

    constructor({transaction_hash, receipt, block_hash, position}: ReceiptResponse) {
        this.transaction_hash = transaction_hash;
        this.receipt = receipt;
        this.block_hash = block_hash;
        this.position = position;
    }

    static schema = new Map([[ReceiptResponse, {kind:'struct', fields:[
        ['transaction_hash','sha256Hash'],
        ['receipt','optionReceipt'],
        ['block_hash','optionSha256Hash'],
        ['position','optionU32']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, ReceiptResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, ReceiptResponse.schema, ReceiptResponse, ExtendedReader);
        return deserialized as ReceiptResponse;
    }
}

export class BlockRequest {
    block_hash: Sha256Hash;

    constructor({block_hash}: BlockRequest) {
        this.block_hash = block_hash;
    }

    static schema = new Map([[BlockRequest, {kind:'struct', fields:[
        ['block_hash','sha256Hash'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, BlockRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, BlockRequest.schema, BlockRequest, ExtendedReader);
        return deserialized as BlockRequest;
    }

}

export class BlockResponse {
    block: Block | null;

    constructor({block}: BlockResponse) {
        this.block = block;
    }

    static schema = new Map([[BlockResponse, {kind:'struct', fields:[
        ['block','optionBlock'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, BlockResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, BlockResponse.schema, BlockResponse, ExtendedReader);
        return deserialized as BlockResponse;
    }
}

export class BlockHeaderRequest {
    block_hash: Sha256Hash;

    constructor({block_hash}: BlockHeaderRequest) {
        this.block_hash = block_hash;
    }

    static schema = new Map([[BlockHeaderRequest, {kind:'struct', fields:[
        ['block_hash','sha256Hash']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, BlockHeaderRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, BlockHeaderRequest.schema, BlockHeaderRequest, ExtendedReader);
        return deserialized as BlockHeaderRequest;
    }
}

export class BlockHeaderResponse {
    block_header: BlockHeader | null;

    constructor({block_header}: BlockHeaderResponse) {
        this.block_header = block_header;
    }

    static schema = new Map([[BlockHeaderResponse, {kind:'struct', fields:[
        ['block_header','optionBlockHeader'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, BlockHeaderResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, BlockHeaderResponse.schema, BlockHeaderResponse, ExtendedReader);
        return deserialized as BlockHeaderResponse;
    }
}

export class BlockHeightByHashRequest {
    block_hash: Sha256Hash;

    constructor({block_hash}: BlockHeightByHashRequest) {
        this.block_hash = block_hash;
    }

    static schema = new Map([[BlockHeightByHashRequest, {kind:'struct', fields:[
        ['block_hash','sha256Hash'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, BlockHeightByHashRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, BlockHeightByHashRequest.schema, BlockHeightByHashRequest, ExtendedReader);
        return deserialized as BlockHeightByHashRequest;
    }
}

export class BlockHeightByHashResponse {
    block_hash: Sha256Hash;
    block_height: u64 | null;

    constructor({block_hash, block_height}: BlockHeightByHashResponse) {
        this.block_hash = block_hash;
        this.block_height = block_height;
    }

    static schema = new Map([[BlockHeightByHashResponse, {kind:'struct', fields:[
        ['block_hash','sha256Hash'],
        ['block_height','optionU64']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, BlockHeightByHashResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, BlockHeightByHashResponse.schema, BlockHeightByHashResponse, ExtendedReader);
        return deserialized as BlockHeightByHashResponse;
    }
}

export class BlockHashByHeightRequest {
    block_height: u64;

    constructor({block_height}: BlockHashByHeightRequest) {
        this.block_height = block_height;
    }

    static schema = new Map([[BlockHashByHeightRequest, {kind:'struct', fields:[
        ['block_height','u64'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, BlockHashByHeightRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, BlockHashByHeightRequest.schema, BlockHashByHeightRequest, ExtendedReader);
        return deserialized as BlockHashByHeightRequest;
    }
}

export class BlockHashByHeightResponse {
    block_height: u64;
    block_hash: Sha256Hash | null;

    constructor({block_height, block_hash}: BlockHashByHeightResponse) {
        this.block_hash = block_hash;
        this.block_height = block_height;
    }

    static schema = new Map([[BlockHashByHeightResponse, {kind:'struct', fields:[
        ['block_height','U64'],
        ['block_hash','optionSha256Hash']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, BlockHashByHeightResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, BlockHashByHeightResponse.schema, BlockHashByHeightResponse, ExtendedReader);
        return deserialized as BlockHashByHeightResponse;
    }
}

export class HighestCommittedBlockResponse {
    block_hash: Sha256Hash | null;

    constructor({block_hash}: HighestCommittedBlockResponse) {
        this.block_hash = block_hash;
    }

    static schema = new Map([[HighestCommittedBlockResponse, {kind:'struct', fields:[
        ['block_hash','optionSha256Hash']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, HighestCommittedBlockResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, HighestCommittedBlockResponse.schema, HighestCommittedBlockResponse, ExtendedReader);
        return deserialized as HighestCommittedBlockResponse;
    }
}

export class StateRequest {
    accounts: Set<PublicAddress>;
    include_contract: boolean;
    storage_keys: Map<PublicAddress, Set<Uint8Array>>;

    constructor({accounts, include_contract, storage_keys}: StateRequest) {
        this.accounts = accounts;
        this.include_contract = include_contract;
        this.storage_keys = storage_keys;
    }

    static schema = new Map([[StateRequest, {kind:'struct', fields:[
        ['accounts','setAddress'],
        ['include_contract','boolean'],
        ['storage_keys','mapAddressToKeys']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, StateRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, StateRequest.schema, StateRequest, ExtendedReader);
        return deserialized as StateRequest;
    }

}

export class StateResponse {
    accounts: Map<PublicAddress, Account>;
    storage_tuples: Map<PublicAddress, Map<Uint8Array, Uint8Array>>;
    block_hash: Sha256Hash;

    constructor({accounts, storage_tuples, block_hash}: StateResponse) {
        this.accounts = accounts;
        this.storage_tuples = storage_tuples;
        this.block_hash = block_hash;
    }

    static schema = new Map([[StateResponse, {kind:'struct', fields:[
        ['accounts','mapAddressToAccounts'],
        ['storage_tuples','mapAddressToTuples'],
        ['block_hash','sha256Hash']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, StateResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, StateResponse.schema, StateResponse, ExtendedReader);
        return deserialized as StateResponse;
    }

}
export type Account = AccountWithContract | AccountWithoutContract;

export class AccountWithContract {
    nonce: u64;
    balance: u64;
    contract: Option<Buffer> | null;
    cbi_version: u32 | null;
    storage_hash: Sha256Hash | null;
    static index: number = 0;

    constructor({nonce, balance, contract, cbi_version, storage_hash}: AccountWithContract) {
        this.nonce = nonce;
        this.balance = balance;
        this.contract = contract;
        this.cbi_version = cbi_version;
        this.storage_hash = storage_hash;
    }

    index = () => {
        return AccountWithContract.index;
    }

    static schema = new Map([[AccountWithContract, {kind:'struct', fields:[
        ['nonce','u64'],
        ['balance','u64'],
        ['contract','optionOptionVector'],
        ['cbi_version','optionU32'],
        ['storage_hash','optionSha256Hash'],
    ]}]])


    serialize = () => {
        const buffer = borshSerialize(this, AccountWithContract.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, AccountWithContract.schema, AccountWithContract, ExtendedReader);
        return deserialized as AccountWithContract;
    }
}

export class AccountWithoutContract {
    nonce: u64;
    balance: u64;
    cbi_version: u32 | null;
    storage_hash: Sha256Hash | null;
    static index: number = 1;

    constructor({nonce, balance, cbi_version, storage_hash}: AccountWithoutContract) {
        this.nonce = nonce;
        this.balance = balance;
        this.cbi_version = cbi_version;
        this.storage_hash = storage_hash;
    }

    index = () => {
        return AccountWithoutContract.index;
    }

    static schema = new Map([[AccountWithoutContract, {kind:'struct', fields:[
        ['nonce','u64'],
        ['balance','u64'],
        ['cbi_version','optionU32'],
        ['storage_hash','optionSha256Hash'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, AccountWithoutContract.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, AccountWithoutContract.schema, AccountWithoutContract, ExtendedReader);
        return deserialized as AccountWithoutContract;
    }
}

export class ValidatorSetsRequest {
    include_prev: boolean;
    include_prev_delegators: boolean;
    include_curr: boolean;
    include_curr_delegators: boolean;
    include_next: boolean;
    include_next_delegators: boolean;

    constructor({include_prev, include_prev_delegators, include_curr, include_curr_delegators,include_next, include_next_delegators}: ValidatorSetsRequest) {
        this.include_prev = include_prev;
        this.include_prev_delegators = include_prev_delegators;
        this.include_curr = include_curr;
        this.include_curr_delegators = include_curr_delegators;
        this.include_next = include_next;
        this.include_next_delegators = include_next_delegators;
    }

    static schema = new Map([[ValidatorSetsRequest, {kind:'struct', fields:[
        ['include_prev','boolean'],
        ['include_prev_delegators','boolean'],
        ['include_curr','boolean'],
        ['include_curr_delegators','boolean'],
        ['include_next','boolean'],
        ['include_next_delegators','boolean'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, ValidatorSetsRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, ValidatorSetsRequest.schema, ValidatorSetsRequest, ExtendedReader);
        return deserialized as ValidatorSetsRequest;
    }
}

export class ValidatorSetsResponse {
    prev_validator_set: Option<ValidatorSet> | null;
    curr_validator_set: ValidatorSet | null;
    next_validator_set: ValidatorSet | null;
    block_hash: Sha256Hash;

    constructor({prev_validator_set, curr_validator_set, next_validator_set, block_hash}: ValidatorSetsResponse) {
        this.prev_validator_set = prev_validator_set;
        this.curr_validator_set = curr_validator_set;
        this.next_validator_set = next_validator_set;
        this.block_hash = block_hash;
    }

    static schema = new Map([[ValidatorSetsResponse, {kind:'struct', fields:[
        ['prev_validator_set','optionOptionValidatorSet'],
        ['curr_validator_set','optionValidatorSet'],
        ['next_validator_set','optionValidatorSet'],
        ['block_hash','sha256Hash'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, ValidatorSetsResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, ValidatorSetsResponse.schema, ValidatorSetsResponse, ExtendedReader);
        return deserialized as ValidatorSetsResponse;
    }
}

export type ValidatorSet = PoolsWithDelegator | PoolsWithoutDelegator;

export class PoolsWithDelegator {
    pools: PoolWithDelegator[]
    static index: number = 0;

    constructor({pools}: PoolsWithDelegator) {
        this.pools = pools;
    }

    static schema = new Map([[PoolsWithDelegator, {kind:'struct', fields:[
        ['pools','poolsWithDelegator'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, PoolsWithDelegator.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, PoolsWithDelegator.schema, PoolsWithDelegator, ExtendedReader);
        return deserialized as PoolsWithDelegator;
    }

}

export class PoolsWithoutDelegator {
    pools: PoolWithoutDelegator[]
    static index: number = 1;

    constructor({pools}: PoolsWithoutDelegator) {
        this.pools = pools;
    }

    static schema = new Map([[PoolsWithoutDelegator, {kind:'struct', fields:[
        ['pools','poolsWithoutDelegator'],
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, PoolsWithoutDelegator.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, PoolsWithoutDelegator.schema, PoolsWithoutDelegator, ExtendedReader);
        return deserialized as PoolsWithoutDelegator;
    }

}

export type Pool = PoolWithDelegator | PoolWithoutDelegator;

export class PoolWithDelegator {
    operator: PublicAddress;
    power: u64;
    commission_rate: number;
    operator_stake: Stake | null;
    delegated_stakes: Stake[];
    static index: number = 0;

    constructor({operator, power, commission_rate, operator_stake, delegated_stakes}: PoolWithDelegator) {
        this.operator = operator;
        this.power = power;
        this.commission_rate = commission_rate;
        this.operator_stake = operator_stake;
        this.delegated_stakes = delegated_stakes;
    }

    index = () => {
        return PoolWithDelegator.index;
    }

    static schema = new Map([[PoolWithDelegator, {kind:'struct', fields:[
        ['operator','PublicAddress'],
        ['power','u64'],
        ['commission_rate','u8'],
        ['operator_stake','optionStake'],
        ['delegated_stakes','stakes']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, PoolWithDelegator.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, PoolWithDelegator.schema, PoolWithDelegator, ExtendedReader);
        return deserialized as PoolWithDelegator;
    }
}

export class PoolWithoutDelegator {
    operator: PublicAddress;
    power: u64;
    commission_rate: number;
    operator_stake: Stake | null;
    static index: number = 1;

    constructor({operator, power, commission_rate, operator_stake}: PoolWithoutDelegator) {
        this.operator = operator;
        this.power = power;
        this.commission_rate = commission_rate;
        this.operator_stake = operator_stake;
    }

    index = () => {
        return PoolWithoutDelegator.index;
    }

    static schema = new Map([[PoolWithoutDelegator, {kind:'struct', fields:[
        ['operator','PublicAddress'],
        ['power','u64'],
        ['commission_rate','u8'],
        ['operator_stake','optionStake']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, PoolWithoutDelegator.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, PoolWithoutDelegator.schema, PoolWithoutDelegator, ExtendedReader);
        return deserialized as PoolWithoutDelegator;
    }
}

export class PoolsRequest {
    operators: Set<PublicAddress>;
    include_stakes: boolean;

    constructor({operators, include_stakes}: PoolsRequest) {
        this.operators = operators;
        this.include_stakes = include_stakes;
    }

    static schema = new Map([[PoolsRequest, {kind:'struct', fields:[
        ['operators','setAddress'],
        ['include_stakes','boolean']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, PoolsRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, PoolsRequest.schema, PoolsRequest, ExtendedReader);
        return deserialized as PoolsRequest;
    }
}

export class PoolsResponse {
    pools: Map<PublicAddress, Option<Pool>>;
    block_hash: Sha256Hash;

    constructor({pools, block_hash}: PoolsResponse) {
        this.pools = pools;
        this.block_hash = block_hash;
    }

    static schema = new Map([[PoolsResponse, {kind:'struct', fields:[
        ['pools','mapAddressToPool'],
        ['block_hash','sha256Hash']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, PoolsResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, PoolsResponse.schema, PoolsResponse, ExtendedReader);
        return deserialized as PoolsResponse;
    }
}

export class DepositsRequest {
    stakes: Set<[PublicAddress, PublicAddress]>;

    constructor({stakes}: DepositsRequest) {
        this.stakes = stakes;
    }

    static schema = new Map([[DepositsRequest, {kind:'struct', fields:[
        ['stakes','setAddresses']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, DepositsRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, DepositsRequest.schema, DepositsRequest, ExtendedReader);
        return deserialized as DepositsRequest;
    }
}

export class DepositsResponse {
    deposits: Map<[PublicAddress, PublicAddress], Option<Deposit>>;
    block_hash: Sha256Hash;

    constructor({deposits, block_hash}: DepositsResponse) {
        this.deposits = deposits;
        this.block_hash = block_hash;
    }

    static schema = new Map([[DepositsResponse, {kind:'struct', fields:[
        ['deposits','mapAddressesToDeposit'],
        ['block_hash','sha256Hash']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, DepositsResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, DepositsResponse.schema, DepositsResponse, ExtendedReader);
        return deserialized as DepositsResponse;
    }
}

export class Deposit {
    owner: PublicAddress;
    balance: u64;
    auto_stake_rewards: boolean;

    constructor({owner, balance, auto_stake_rewards}: Deposit) {
        this.owner = owner;
        this.balance = balance;
        this.auto_stake_rewards = auto_stake_rewards;
    }

    static schema = new Map([[Deposit, {kind:'struct', fields:[
        ['owner', 'PublicAddress'],
        ['balance','u64'],
        ['auto_stake_rewards','boolean']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, Deposit.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, Deposit.schema, Deposit, ExtendedReader);
        return deserialized as Deposit;
    }
}

export class StakesRequest {
    stakes: Set<[PublicAddress, PublicAddress]>;

    constructor({stakes}: StakesRequest) {
        this.stakes = stakes;
    }

    static schema = new Map([[StakesRequest, {kind:'struct', fields:[
        ['stakes','setAddresses']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, StakesRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, StakesRequest.schema, StakesRequest, ExtendedReader);
        return deserialized as StakesRequest;
    }
}

export class StakesResponse {
    stakes: Map<[PublicAddress, PublicAddress], Option<Stake>>;
    block_hash: Sha256Hash;

    constructor({stakes, block_hash}: StakesResponse) {
        this.stakes = stakes;
        this.block_hash = block_hash;
    }

    static schema = new Map([[StakesResponse, {kind:'struct', fields:[
        ['stakes','mapAddressesToStake'],
        ['block_hash','sha256Hash']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, StakesResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, StakesResponse.schema, StakesResponse, ExtendedReader);
        return deserialized as StakesResponse;
    }
}

export class ViewRequest {
    target: PublicAddress;
    method: string;
    args: Uint8Array[] | null;

    constructor({target, method, args}: ViewRequest) {
        this.target = target;
        this.method = method;
        this.args = args;
    }

    static schema = new Map([[ViewRequest, {kind:'struct', fields:[
        ['target','PublicAddress'],
        ['method','string'],
        ['args','optionArgs']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, ViewRequest.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserializedCommand = borshDeserialize(buffer, ViewRequest.schema, ViewRequest, ExtendedReader);
        return deserializedCommand as ViewRequest;
    }
}

export class ViewResponse {
    receipt: CommandReceipt;

    constructor({receipt}: ViewResponse) {
        this.receipt = receipt;
    }

    static schema = new Map([[ViewResponse, {kind:'struct', fields:[
        ['receipt','commandReceipt']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, ViewResponse.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, ViewResponse.schema, ViewResponse, ExtendedReader);
        return deserialized as ViewResponse;
    }

}