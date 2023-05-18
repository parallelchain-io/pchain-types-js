import * as ed from "@noble/ed25519"
import { PrivateKey, PublicAddress } from "./crypto/public_address";
import { Signature } from "./crypto/signature";

export interface Keypair {
    public_key: PublicAddress;
    private_key: PrivateKey;
    generate: (private_key: Uint8Array | string) => Promise<Keypair>;
    sign: (message: Uint8Array) => Promise<Signature>;
}

export class Keypair {
    public_key: PublicAddress;
    private_key: PrivateKey;

    constructor(public_key: PublicAddress, private_key: PrivateKey){
        this.public_key = public_key;
        this.private_key = private_key;
    }

    static generate = async (private_key: Uint8Array | string = '') => {
        try {
            if(!private_key){
                const private_key = ed.utils.randomPrivateKey();
                const public_key = await ed.getPublicKey(private_key);
                return new Keypair(new PublicAddress(Buffer.from(public_key)), new PrivateKey(Buffer.from(private_key)));
            } else {
                const public_key = await ed.getPublicKey(private_key);
                return new Keypair(new PublicAddress(Buffer.from(public_key)), new PrivateKey(Buffer.from(private_key)));
            }
        } catch (e: any) {
            throw Error(e);
        }
    }

    sign = async (message: Uint8Array): Promise<Signature> => {
        try {
            const signed_message = await ed.sign(message, this.private_key.toBytes());
            return new Signature(Buffer.from(signed_message));
        } catch (e: any) {
            throw Error(e);
        }
    }

}