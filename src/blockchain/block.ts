import { QuorumCertificate } from "./quorum_certificate";
import { Receipt, Transaction } from "./transaction";
import { BloomFilter } from "./bloom_filter";
import { PublicAddress } from "./ed_keys";
import { Sha256Hash } from "../hash/sha256hash";
import { Serializable } from "../serde/serializable";
import { TypeCtorParams, u32, u64 } from "../constants";

export class Block extends Serializable {
  blockHeader: BlockHeader;
  transactions: Transaction[];
  receipts: Receipt[];
  // one transaction could have many commands and hence command receipts
  // receipts is an array of command receipt arrays, one for each transaction

  constructor({ blockHeader, transactions, receipts }: TypeCtorParams<Block>) {
    super();
    this.blockHeader = blockHeader;
    this.transactions = transactions;
    this.receipts = receipts;
  }
}

// --------------------------BLOCK HEADER-------------------------- //

export class BlockHeader extends Serializable {
  hash: Sha256Hash;
  height: u64;
  justify: QuorumCertificate;
  data_hash: Sha256Hash;
  chain_id: u64;
  proposer: PublicAddress;
  timestamp: u32;
  base_fee: u64;
  gas_used: u64; // total gas consumed
  txs_hash: Sha256Hash;
  receipts_hash: Sha256Hash;
  state_hash: Sha256Hash;
  log_bloom: BloomFilter;

  constructor({
    chain_id,
    hash,
    height,
    justify,
    data_hash,
    proposer,
    timestamp,
    base_fee,
    log_bloom,
    txs_hash,
    state_hash,
    receipts_hash,
    gas_used,
  }: BlockHeader) {
    super();
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
}
