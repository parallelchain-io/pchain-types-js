import { expect } from "chai";
import {
  SubmitTransactionError,
  SubmitTransactionResponse,
  Option,
} from "../../src";

describe("Deserialize method", () => {
  it("should accept both Buffers and ArrayBuffers", () => {
    const b64Payload = "AQI=";
    const buffer = Buffer.from(b64Payload, "base64");

    const pureByteArray = new ArrayBuffer(2);
    const view = new Uint8Array(pureByteArray);
    // manipulate the underlying ArrayBuffer using the view
    view[0] = 1;
    view[1] = 2;
    expect((pureByteArray as any).readUInt8).to.be.undefined;

    const fromBuffer: SubmitTransactionResponse =
      SubmitTransactionResponse.deserialize(buffer);
    expect(fromBuffer.error).to.be.instanceOf(Option);
    expect(fromBuffer.error.value).to.eql(SubmitTransactionError.Other);

    const fromByteArray: SubmitTransactionResponse =
      SubmitTransactionResponse.deserialize(pureByteArray);
    expect(fromByteArray.error).to.be.instanceOf(Option);
    expect(fromByteArray.error.value).to.eql(SubmitTransactionError.Other);
  });
});
