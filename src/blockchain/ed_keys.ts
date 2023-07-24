import { base64ToBytes, bytesToBase64Url } from "../helpers";
import { Serializable } from "../serde/serializable";
export class PublicAddress extends Serializable {
  value: Buffer;

  constructor(input: Buffer | string | { value: Uint8Array }) {
    super();
    let input_buffer;
    if (typeof input === "string") {
      input_buffer = base64ToBytes(input);
    } else if (Buffer.isBuffer(input)) {
      input_buffer = input;
    } else if (input.value instanceof Uint8Array) {
      input_buffer = Buffer.from(input.value);
    } else {
      throw Error(`Invalid ${this.constructor.name} input`);
    }

    if (input_buffer.byteLength === 32) {
      this.value = input_buffer;
    } else {
      throw Error(`Invalid ${this.constructor.name} length`);
    }
  }

  toBytes() {
    return this.value;
  }

  toBase64url() {
    return bytesToBase64Url(this.value);
  }
}

// take care not to inherit between PrivateKey and PublicAddress
// as these two entities serve very different purposes, even though they share a similar shape

export class PrivateKey extends Serializable {
  value: Buffer;

  constructor(input: Buffer | string | { value: Uint8Array }) {
    super();
    let input_buffer;
    if (typeof input === "string") {
      input_buffer = base64ToBytes(input);
    } else if (Buffer.isBuffer(input)) {
      input_buffer = input;
    } else if (input.value instanceof Uint8Array) {
      input_buffer = Buffer.from(input.value);
    } else {
      throw Error(`Invalid ${this.constructor.name} input`);
    }

    if (input_buffer.byteLength === 32) {
      this.value = input_buffer;
    } else {
      throw Error(`Invalid ${this.constructor.name} length`);
    }
  }

  toBytes() {
    return this.value;
  }

  toBase64url() {
    return bytesToBase64Url(this.value);
  }
}
