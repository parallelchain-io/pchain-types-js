import { bytesToBase64Url, base64ToBytes } from "./functions";

export interface Signature {
    signature: Buffer;
}

export class Signature {
    signature: Buffer;

    constructor(signature: Buffer | string){
        let signature_buffer;
        if(typeof signature == 'string'){
            signature_buffer = base64ToBytes(signature);
            if(signature_buffer.byteLength == 64){
                this.signature = signature_buffer;
            }
            else {
                throw Error('Invalid Signature')
            }
        } else if (signature.byteLength == 64){
            this.signature = signature;
        } else {
            throw Error('Invalid Signature length')
        }
    }

    toBytes = () => {
        return this.signature;
    }

    toBase64url = () => {
        return bytesToBase64Url(this.signature);
    }

    static schema = new Map([
        [   Signature, 
            {
                kind:'struct', 
                fields:[
                    ['signature', 'bytes64']
                ]
        }]
    ]);

    serialize = () => {
        return this.signature;
    }

    static deserialize = (buffer: Buffer) => {
        return new Signature(buffer);
    }
}