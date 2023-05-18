import { ExtendedReader } from "../crypto/extended-reader";
import { ExtendedWriter } from "../crypto/extended-writer";
import { borshSerialize, borshDeserialize} from "../serde";
import { u64 } from "../crypto/numbers";
import { SignatureSet } from "../crypto/signature-set";
import { Sha256Hash } from "../crypto/sha256hash";

type AppID = u64;
type ViewNumber = u64;

export interface QuorumCertificate{
    app_id: AppID;
    view: ViewNumber;
    block: Sha256Hash;
    phase: Phase;
    sigs: SignatureSet;
}

export type Phase = Generic | Prepare | Precommit | Commit;

export class Generic {
    static index = 0;
};


export class Prepare {
    static index = 1;
}

export class Precommit {
    view: u64;
    static index = 2;
    constructor({view}: Precommit){
        this.view = view
    }
}

export class Commit {
    view: u64;
    static index = 3;
    constructor({view}: Precommit){
        this.view = view
    }
}

export class QuorumCertificate {
    app_id: AppID;
    view: ViewNumber;
    block: Sha256Hash;
    phase: Phase;
    sigs: SignatureSet;

    constructor({app_id, view, block, sigs, phase}: QuorumCertificate){
        this.app_id = app_id;
        this.view = view;
        this.block = block;
        this.phase = phase;
        this.sigs = sigs;
    }

    static schema = new Map([
        [QuorumCertificate, {kind:'struct', fields:[
            ['app_id', 'u64'], 
            ['view', 'u64'], 
            ['block','sha256Hash'], 
            ['phase', 'Phase'],
            ['sigs', 'signatureSet']]
        }]
    ]);

    serialize = () => {
        const buffer = borshSerialize(this, QuorumCertificate.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserializedQC = borshDeserialize(buffer, QuorumCertificate.schema, QuorumCertificate, ExtendedReader);
        return deserializedQC as QuorumCertificate;
    }
}