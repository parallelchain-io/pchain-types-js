import { base64ToBytes, bytesToBase64Url } from "../helpers";
import { Serializable } from "../serde/serializable";

export class Base64URL extends Serializable {
  value: string;

  constructor(input: string | { value: string }) {
    super();
    if (typeof input === "string") {
      this.value = input;
    } else if (typeof input.value === "string") {
      this.value = input.value;
    } else {
      throw Error(`Invalid ${this.constructor.name} input`);
    }
  }

  toBytes() {
    return base64ToBytes(this.value);
  }

  /// encode takes in a slice of bytes and returns the bytes encoded as a Base64URL String
  static encode(buffer: Buffer): Base64URL {
    const base64url = bytesToBase64Url(buffer);
    return new Base64URL(base64url);
  }

  /// decode takes in a string and tries to decode it into a Vector of bytes. It returns a base64::DecodeError if `string`
  /// is not valid Base64URL.
  static decode(text: string): Buffer {
    const buffer = base64ToBytes(text);
    return buffer;
  }
}
