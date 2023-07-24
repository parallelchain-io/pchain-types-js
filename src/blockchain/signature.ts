import { bytesToBase64Url, base64ToBytes } from "../helpers";
import { Serializable } from "../serde/serializable";
export class Signature extends Serializable {
  signature: Buffer;

  constructor(input: Buffer | string | { signature: Uint8Array }) {
    super();
    let input_buffer;
    if (typeof input === "string") {
      input_buffer = base64ToBytes(input);
    } else if (Buffer.isBuffer(input)) {
      input_buffer = input;
    } else if (input.signature instanceof Uint8Array) {
      input_buffer = Buffer.from(input.signature);
    } else {
      throw Error(`Invalid ${this.constructor.name} input`);
    }

    if (input_buffer.byteLength === 64) {
      this.signature = input_buffer;
    } else {
      throw Error(`Invalid ${this.constructor.name} length`);
    }
  }

  toBytes() {
    return this.signature;
  }

  toBase64url() {
    return bytesToBase64Url(this.signature);
  }
}
