import { bytesToBase64Url } from "../helpers";
import { Serializable } from "../serde/serializable";
export class BloomFilter extends Serializable {
  filter: Buffer;

  constructor(input: Buffer | { filter: Uint8Array }) {
    super();
    if (Buffer.isBuffer(input)) {
      this.filter = input;
    } else if (input.filter instanceof Uint8Array) {
      this.filter = Buffer.from(input.filter);
    } else {
      throw new Error(`Invalid ${this.constructor.name} input`);
    }
  }

  toBytes() {
    return this.filter;
  }

  toBase64url() {
    return bytesToBase64Url(this.filter);
  }
}
