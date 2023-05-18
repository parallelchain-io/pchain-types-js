import { base64ToBytes, bytesToBase64Url } from "./functions";

export interface Sha256Hash {
    hash: Buffer;
}

export class Sha256Hash {
    hash: Buffer;

    constructor(hash:Buffer | string){
        let hash_buffer;
        if(typeof hash == 'string'){
            hash_buffer = base64ToBytes(hash);
            if(hash_buffer.byteLength == 32){
                this.hash = hash_buffer;
            }
            else {
                throw Error('Invalid hash')
            }
        } else if (hash.byteLength == 32){
            this.hash = hash;
        } else {
            throw Error('Invalid hash length')
        }
    }

    toBytes = () => {
        return this.hash;
    }

    toBase64url = () => {
        return bytesToBase64Url(new Uint8Array(this.hash));
    }
}