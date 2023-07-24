import { expect } from "chai";
import { generateSha256Hash } from "../../src/hash";

describe("Hash", async () => {
  it("generateSha256Hash should hash strings using SHA256 correctly", () => {
    const hash = generateSha256Hash(Buffer.from("I love ParallelChain"));
    expect(hash.toBase64url()).to.eql(
      "jisoQ4ZrNlEFLx_5NhsyZRVir7fM8Wwg49KaV1Aj_EU"
    );
  });
});
