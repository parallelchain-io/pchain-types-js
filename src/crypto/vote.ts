import { Signature } from "./signature";
import { Sha256Hash } from "./sha256hash";
import { u64 } from "./numbers";
import { ExtendedReader } from "./extended-reader";
import { ExtendedWriter } from "./extended-writer";
import { borshDeserialize, borshSerialize } from "../serde";
import { Phase } from "../hotstuff/quorum-certificate";

export interface Vote {
    app_id: u64,
    view_number: u64;
    block_hash: Sha256Hash;
    phase: Phase;
    signature: Signature;
}

export class Vote {
    app_id: u64;
    view_number: u64;
    block_hash: Sha256Hash;
    phase: Phase;
    signature: Signature;

    constructor(app_id: u64, view_number: u64, block_hash: Sha256Hash, phase: Phase, signature: Signature){
        this.app_id = app_id;
        this.view_number = view_number;
        this.block_hash = block_hash;
        this.phase = phase;
        this.signature = signature;
    }

    static schema = new Map([
        [Vote, {kind:'struct', fields:[
            ['app_id', 'u64'], 
            ['view_number', 'u64'], 
            ['block_hash','Sha256Hash'], 
            ['phase','Phase'],
            ['signature','signature']]
        }]
    ]);


    serialize = () => {
        const buffer = borshSerialize(this, Vote.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, Vote.schema, Vote, ExtendedReader);
        return deserialized;
    }
}