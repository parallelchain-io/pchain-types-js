import { expect } from "chai";
import nacl from "tweetnacl";

import { Keypair } from "../../src/cryptography";

describe("Keypair", async () => {
  it("should sign a message corectly", async () => {
    const keypair = await Keypair.generate();
    const signatureNacl = nacl.sign.detached(
      Buffer.from("I love ParallelChain"),
      new Uint8Array([
        ...keypair.private_key.toBytes(),
        ...keypair.public_key.toBytes(),
      ])
    );

    const signature = await keypair.sign(Buffer.from("I love ParallelChain"));
    expect(signatureNacl).to.eql(signature.toBytes());

    const isSignatureVerified = nacl.sign.detached.verify(
      Buffer.from("I love ParallelChain"),
      signature.toBytes(),
      keypair.public_key.toBytes()
    );
    expect(isSignatureVerified).to.eql(true);
  });
});
