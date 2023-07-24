import { base64ToBytes, bytesToBase64Url } from "../helpers";
import { Serializable } from "../serde/serializable";

export class Sha256Hash extends Serializable {
  hash: Buffer;

  constructor(input: Buffer | string | { hash: Uint8Array }) {
    super();
    let input_buffer;
    if (typeof input === "string") {
      input_buffer = base64ToBytes(input);
    } else if (Buffer.isBuffer(input)) {
      input_buffer = input;
    } else if (input.hash instanceof Uint8Array) {
      input_buffer = Buffer.from(input.hash);
    } else {
      throw Error(`Invalid ${this.constructor.name} input`);
    }

    if (input_buffer.byteLength === 32) {
      this.hash = input_buffer;
    } else {
      throw Error(`Invalid ${this.constructor.name} length`);
    }
  }

  toBytes() {
    return this.hash;
  }

  toBase64url() {
    return bytesToBase64Url(this.hash);
  }
}
