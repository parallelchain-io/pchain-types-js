import { expect } from "chai";
import {
  base64ToBytes,
  base64Tobase64url,
  base64URLToUint8Array,
  bytesToBase64Url,
} from "../../src";

describe("Encoding Helpers", () => {
  const base64 = "GVs/bG8rIFdvcmxkIQ+=";
  const bytes = Buffer.from(base64, "base64");
  const expectedBase64Url = "GVs_bG8rIFdvcmxkIQ-";

  it("bytesToBase64Url should encode bytes", () => {
    const bytes = Buffer.from("hello world");
    const base64 = bytesToBase64Url(bytes);
    expect(base64).to.eql("aGVsbG8gd29ybGQ");
  });

  it("base64Tobase64url should convert empty string as empty string", () => {
    const base64 = "";
    const expectedBase64Url = "";
    const result = base64Tobase64url(base64);
    expect(result).eql(expectedBase64Url);
  });

  it("base64Tobase64url should convert special chars", () => {
    const result = base64Tobase64url(base64);
    expect(result).eql(expectedBase64Url);
  });

  it("base64ToBytes should convert base64 to Buffer", () => {
    const buf = base64ToBytes(base64);
    expect(buf).eql(bytes);
  });

  it("base64URLToUint8Array should convert base64URL to Buffer", () => {
    const buf = base64URLToUint8Array(expectedBase64Url);
    expect(buf).eql(bytes);
  });
});
