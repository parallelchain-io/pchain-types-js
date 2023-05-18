import { ExtendedReader } from "./crypto/extended-reader";
import { ExtendedWriter } from "./crypto/extended-writer";
import { borshDeserialize, borshSerialize } from "./serde";
import { u64 } from "./crypto/numbers";
import { PublicAddress } from "./crypto/public_address";

export class Stake {
    owner: PublicAddress;
    power: u64;

    constructor({owner, power}: Stake){
        this.owner = owner;
        this.power = power;
    }

    static schema = new Map([[Stake, {kind:'struct', fields:[
        ['owner','PublicAddress'],
        ['power','u64']
    ]}]])

    serialize = () => {
        const buffer = borshSerialize(this, Stake.schema, ExtendedWriter);
        return buffer;
    }

    static deserialize = (buffer: Buffer) => {
        const deserialized = borshDeserialize(buffer, Stake.schema, Stake, ExtendedReader);
        return deserialized as Stake;
    }
}