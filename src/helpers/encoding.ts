import BN from "bn.js";

/**
 * bytesToBase64Url converts a Uint8Array Buffer into a base64url encoded string
 */
export const bytesToBase64Url = (buffer: Uint8Array) => {
  return base64Tobase64url(Buffer.from(buffer).toString("base64"));
};

/**
 * base64Tobase64url converts a base64 encoded string into a base64url encoded string
 */
export const base64Tobase64url = (stringB64: string) =>
  stringB64.replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");

/**
 * base64ToBytes converts a base64 encoded string into a Uint8Array
 */
export const base64ToBytes = (text: string) => {
  return Buffer.from(text, "base64");
};

/**
 * base64URLToUint8Array converts a base64url encoded string into a Uint8Array
 */
export const base64URLToUint8Array = (text: string) => {
  return Buffer.from(text, "base64url");
};

/**
 * Converts Buffer into a u64 integer
 */
export const bytesToBigInt = (bytes: Buffer) => {
  if (bytes.byteLength == 8) {
    let num1: BN | number = new BN(bytes.readUInt8(0));
    num1 = new BN(Math.pow(256, 0)).mul(num1);
    let num2: BN | number = new BN(bytes.readUInt8(1));
    num2 = new BN(Math.pow(256, 1)).mul(num2);
    let num3: BN | number = new BN(bytes.readUInt8(2));
    num3 = new BN(Math.pow(256, 2)).mul(num3);
    let num4: BN | number = new BN(bytes.readUInt8(3));
    num4 = new BN(Math.pow(256, 3)).mul(num4);
    let num5: BN | number = new BN(bytes.readUInt8(4));
    num5 = new BN(Math.pow(256, 4)).mul(num5);
    let num6: BN | number = new BN(bytes.readUInt8(5));
    num6 = new BN(Math.pow(256, 5)).mul(num6);
    let num7: BN | number = new BN(bytes.readUInt8(6));
    num7 = new BN(Math.pow(256, 6)).mul(num7);
    let num8: BN | number = new BN(bytes.readUInt8(7));
    num8 = new BN(Math.pow(256, 6)).mul(num8);
    num8 = num8.mul(new BN(256));

    return num1
      .add(num2.add(num3.add(num4.add(num5.add(num6.add(num7.add(num8)))))))
      .toString();
  }
  return 0;
};

/**
 * Converts Buffer into a u32 integer
 */
export const bytesToU32 = (bytes: Buffer) => {
  if (bytes.byteLength == 4) {
    const num = bytes.readUInt32LE(0);
    return num;
  }
  return 0;
};

/**
 * Converts Buffer into a UTF8
 */
export const bytesToUTF8 = (bytes: Buffer) => {
  const string = new TextDecoder().decode(bytes);
  return string;
};
