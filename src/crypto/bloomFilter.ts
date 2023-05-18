import { bytesToBase64Url } from "./functions";

export interface BloomFilter {
    filter: Buffer;
} 

export class BloomFilter { 
    filter: Buffer;

    constructor(filter: Buffer){
        this.filter = filter;
    }

    toBytes = () => {
        return this.filter;
    }

    toBase64url = () => {
        return bytesToBase64Url(this.filter);
    }
}