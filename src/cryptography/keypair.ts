import * as ed from "@noble/ed25519";
import { PrivateKey, PublicAddress } from "../blockchain/ed_keys";
import { Signature } from "../blockchain/signature";

// convenience type, not included in schema
export class Keypair {
  constructor(
    public public_key: PublicAddress,
    public private_key: PrivateKey
  ) {}

  static async generate(private_key: Uint8Array | string = "") {
    if (!private_key) {
      const private_key = ed.utils.randomPrivateKey();
      const public_key = await ed.getPublicKey(private_key);
      return new Keypair(
        new PublicAddress(Buffer.from(public_key)),
        new PrivateKey(Buffer.from(private_key))
      );
    } else {
      const public_key = await ed.getPublicKey(private_key);
      return new Keypair(
        new PublicAddress(Buffer.from(public_key)),
        new PrivateKey(Buffer.from(private_key))
      );
    }
  }

  async sign(message: Uint8Array): Promise<Signature> {
    const signed_message = await ed.sign(message, this.private_key.toBytes());
    return new Signature(Buffer.from(signed_message));
  }
}
