import { ExtendedReader } from "./crypto/extended-reader";
import { ExtendedWriter } from "./crypto/extended-writer";
import { borshDeserialize, borshSerialize } from "./serde";
import { u32, u64 } from "./crypto/numbers";
import { Sha256Hash } from "./crypto/sha256hash";
import { PublicAddress } from "./crypto/public_address";

export interface MerkleProof{
    /// Merkle root hash required in the proof
    root_hash: string;
    /// Number of Leaves in the Merkle Tree
    total_leaves_count:  u64;
    /// Vector of u32 integers. Integer li[i] represents the i-th leave to prove in the Trie
    leaf_indices:  u32[];
    /// Vector of sha256 hashes
    leaf_hashes: string[];
    /// Bytes used for verification
    proof: string;
}

export type StorageHash = Sha256Hash;
export type StateProofItem = [StateProofItemType | Storage, Uint8Array]
/**
    * Protocol type - StateProof
*/    
export interface StateProof{
    root_hash: Sha256Hash;
    item: StateProofItem;
    address: PublicAddress;
    proof: Uint8Array[];
}

export class Storage {
    hash: StorageHash;
    value: Uint8Array;

    constructor(hash:StorageHash, value:Uint8Array){
        this.hash = hash;
        this.value = value;
    }
}

export enum StateProofItemType{
    Nonce = 0,
    Balance = 1,
    Code = 2,
    CbiVersion = 3
}

export class MerkleProof{
    root_hash:string;
    total_leaves_count:u64;
    leaf_indices: u32[];
    leaf_hashes:string[];
    proof:string;
    
    constructor({root_hash, total_leaves_count, leaf_indices, leaf_hashes, proof}: MerkleProof){
        this.root_hash = root_hash;
        this.total_leaves_count = total_leaves_count;
        this.leaf_indices = leaf_indices;
        this.leaf_hashes = leaf_hashes;
        this.proof = proof;
    }

    static schema = new Map([[MerkleProof, {kind:'struct', fields:[['root_hash','sha256Hash'],['total_leaves_count','u64'], ['leaf_indices','VectorU32'], ['leaf_hashes','VectorSha256Hash'], ['proof','base64URL']]}]])

    serialize = () => {
        try {
            const buffer = borshSerialize(this, MerkleProof.schema, ExtendedWriter);
            return buffer;
        } catch (e: any) {
            throw Error(e);
        }
    }

    static deserialize = (buffer: Buffer) => {
        try {    
            const deserializedTx = borshDeserialize(buffer, MerkleProof.schema, MerkleProof, ExtendedReader);
            return deserializedTx;
        } catch (e: any) {
            throw Error(e);
        }
    }
}

/** 
 * @class StateProof
 * @field root_hash
 * @field address
 * @field item
 * @field proof
*/
export class StateProof{
    root_hash: Sha256Hash;
    item: StateProofItem;
    address: PublicAddress;
    proof: Uint8Array[];

    constructor({root_hash, item, address, proof}: StateProof){
        this.root_hash = root_hash;
        this.item = item;
        this.address = address;
        this.proof = proof;
    }

    static schema = new Map([[StateProof, {kind:'struct', fields:[
        ['root_hash','Sha256Hash'],
        ['address','PublicAddress'], 
        ['item','StateProofItem'], 
        ['proof','VectorOfVector']
    ]}]])

    serialize = () => {
        try {
            const buffer = borshSerialize(this, StateProof.schema, ExtendedWriter);
            return buffer;
        } catch (e: any) { 
            throw Error(e);
        }
    }

    static deserialize = (buffer: Buffer) => {
        try {
            const deserializedTx = borshDeserialize(buffer, StateProof.schema, StateProof, ExtendedReader);
            return deserializedTx;
        } catch (e: any) {
            throw Error(e);
        }
    }
}