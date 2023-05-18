import { ExtendedReader } from "./crypto/extended-reader";
import { ExtendedWriter } from "./crypto/extended-writer";
import { QuorumCertificate } from "./hotstuff/quorum-certificate";
import { borshDeserialize, borshSerialize } from "./serde";
import { CommandReceipt, Transaction } from "./transaction";
import { BloomFilter } from "./crypto/bloomFilter";
import { u32, u64 } from "./crypto/numbers";
import { PublicAddress } from "./crypto/public_address";
import { Sha256Hash } from "./crypto/sha256hash";

export interface Block {
    header: BlockHeader;
    transactions: Transaction[];
    receipts: CommandReceipt[][];
}

export class Block{

    blockHeader: BlockHeader | undefined;
    transactions: Transaction[];
    receipts: CommandReceipt[][];

    constructor({blockHeader, transactions, receipts}: Block){
        this.blockHeader = blockHeader;
        this.transactions = transactions;
        this.receipts = receipts;
    }

    static schema = new Map([
        [Block, {kind:'struct', fields:[
            ['blockHeader', 'blockHeader'], 
            ['transactions','transactions'], 
            ['receipts','receipts']]
        }]
    ]);

    // impl Serializable<Block> for Block {}
    serialize = () => {
        const buffer = borshSerialize(this, Block.schema, ExtendedWriter);
        return buffer;
    }

    // impl Deserializable<Block> for Block {}
    static deserialize = (buffer: Buffer) => {
        const deserializedTx = borshDeserialize(buffer, Block.schema, Block, ExtendedReader);
        return deserializedTx;
    }
}

// --------------------------BLOCK HEADER-------------------------- //

export interface BlockHeader {
    hash: Sha256Hash;
    height: u64;
    justify: QuorumCertificate;
    data_hash: Sha256Hash;
    chain_id: u64;
    proposer: PublicAddress;
    timestamp: u32;
    base_fee: u64;
    gas_used: u64;
    txs_hash: Sha256Hash;
    state_hash: Sha256Hash;
    receipts_hash: Sha256Hash;
    log_bloom: BloomFilter;
}

export class BlockHeader {

    chain_id: u64;
    hash: Sha256Hash;
    height: u64;
    justify: QuorumCertificate;
    data_hash: Sha256Hash;
    proposer: PublicAddress;
    timestamp: u32;
    base_fee: u64;
    gas_used: u64;
    txs_hash: Sha256Hash;
    state_hash: Sha256Hash;
    receipts_hash: Sha256Hash;
    log_bloom: BloomFilter;

    constructor({chain_id,  hash, height, justify, data_hash, proposer, timestamp, base_fee, log_bloom, txs_hash, state_hash, receipts_hash, gas_used}:BlockHeader){
        this.chain_id = chain_id;
        this.hash = hash;
        this.height = height;
        this.justify = justify;
        this.data_hash = data_hash;
        this.proposer = proposer;
        this.timestamp = timestamp;
        this.base_fee = base_fee;
        this.log_bloom = log_bloom;
        this.txs_hash = txs_hash;
        this.state_hash = state_hash;
        this.receipts_hash = receipts_hash;
        this.gas_used = gas_used;
    }

    
    static schema = new Map([[BlockHeader, {kind:'struct', fields:[
        ['hash','Sha256Hash'],
        ['height','u64'],
        ['justify','QuorumCertificate'],
        ['data_hash','Sha256Hash'],
        ['chain_id','u64'], 
        ['proposer','PublicAddress'],
        ['timestamp','u32'],
        ['base_fee','u64'],
        ['gas_used','u64'],
        ['txs_hash','Sha256Hash'], 
        ['receipts_hash','Sha256Hash'], 
        ['state_hash','Sha256Hash'], 
        ['log_bloom','BloomFilter']]}]])

    // impl Serializable<BlockHeader> for BlockHeader {}
    serialize = () => {
        const buffer = borshSerialize(this, BlockHeader.schema, ExtendedWriter);
        return buffer;
    }

    // impl Deserializable<BlockHeader> for BlockHeader {}
    static deserialize = (buffer: Buffer) => {
        const deserialized_block_header = borshDeserialize(buffer, BlockHeader.schema, BlockHeader, ExtendedReader);
        return deserialized_block_header as BlockHeader;
    }
}

export enum TryFromHotStuffBlockError{
    WrongNumberOfSlots,
    WrongTimestampLength,
    WrongTxsHashLength,
    WrongStateHashLength,
    WrongReceiptsHashLength,
    WronglySerializedTransaction,
    WronglyAuthenticatedTransaction,
    WrongReceipt,
}