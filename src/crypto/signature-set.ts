import { ExtendedReader } from "./extended-reader";
import { ExtendedWriter } from "./extended-writer";
import { borshDeserialize, borshSerialize } from "../serde";
import { Signature } from "./signature";

export interface SignatureSet {
    signatures: (Signature | null)[];
}

export class SignatureSet{

    signatures: (Signature | null)[];

    constructor({signatures}: SignatureSet){
        this.signatures = signatures;
    }

    static schema = new Map([
        [SignatureSet, {kind:'struct', fields:[
            ['signatures', 'signatures']]
        }]
    ]);

    serialize = () => {
        const buffer = borshSerialize(this, SignatureSet.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserializedSigs = borshDeserialize(buffer, SignatureSet.schema, SignatureSet, ExtendedReader);
        return deserializedSigs as SignatureSet;
    }
}