import { ExtendedReader } from "./crypto/extended-reader";
import { ExtendedWriter } from "./crypto/extended-writer";
import { u32, u64 } from "./crypto/numbers";
import { PublicAddress } from "./crypto/public_address";
import { Sha256Hash } from "./crypto/sha256hash";
import { borshDeserialize, borshSerialize } from "./serde";

export class ParamsFromBlockchain {
    this_block_number: u64;
    prev_block_hash: Sha256Hash;
    this_base_fee: u64;
    timestamp: u32;
    random_bytes: Sha256Hash;
    proposer_address: PublicAddress;
    treasury_address: PublicAddress;

    constructor( this_block_number: u64, prev_block_hash: Sha256Hash, this_base_fee: u64, timestamp: u32, random_bytes: Sha256Hash, proposer_address: PublicAddress, treasury_address: PublicAddress,){
        this.this_block_number = this_block_number;
        this.prev_block_hash = prev_block_hash;
        this.this_base_fee = this_base_fee;
        this.timestamp = timestamp;
        this.random_bytes = random_bytes;
        this.proposer_address = proposer_address;
        this.treasury_address = treasury_address;
    }

    static schema = new Map([[ParamsFromBlockchain, {kind:'struct', fields:[['this_block_number','u64'], ['prev_block_hash','Sha256Hash'], ['this_base_fee','u64'], ['timestamp','u32'], ['random_bytes','Sha256Hash'], ['proposer_address','PublicAddress'], ['treasury_address','PublicAddress']]}]])

        serialize = () => {
            const buffer = borshSerialize(this, ParamsFromBlockchain.schema, ExtendedWriter);
            return buffer;
        }
    
        static deserialize = (buffer: Buffer) => {
            const deserializedTx = borshDeserialize(buffer, ParamsFromBlockchain.schema, ParamsFromBlockchain, ExtendedReader);
            return deserializedTx;
        }
}