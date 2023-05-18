import { base64ToBytes, bytesToBase64Url } from "./functions";

export interface PublicAddress {
    value: Buffer;
}

export class PublicAddress {
    value: Buffer;

    constructor(value: Buffer | string){
        let value_buffer;
        if(typeof value == 'string'){
            value_buffer = base64ToBytes(value);
            if(value_buffer.byteLength == 32){
                this.value = value_buffer;
            }
            else {
                throw Error('Invalid Public Address')
            }
        } else if (value.byteLength == 32){
            this.value = value;
        } else {
            throw Error('Invalid Public Address length')
        }
    }

    toBytes = () => {
        return new Uint8Array(this.value);
    }

    toBase64url = () => {
        return bytesToBase64Url(this.value);
    }

    serialize = () => {
        return this.value;
    }

    static deserialize = (buffer: Buffer) => {
        return new PublicAddress(buffer);
    }
}

export class PrivateKey extends PublicAddress{
    constructor(value: Buffer | string){
        super(value);
        let value_buffer;
        if(typeof value == 'string'){
            value_buffer = base64ToBytes(value);
            if(value_buffer.byteLength == 32){
                this.value = value_buffer;
            }
            else {
                throw Error('Invalid Private Key')
            }
        } else if (value.byteLength == 32){
            this.value = value;
        } else {
            throw Error('Invalid Private Key length')
        }
    }

    static deserialize = (buffer: Buffer) => {
        return new PrivateKey(buffer);
    }
}
