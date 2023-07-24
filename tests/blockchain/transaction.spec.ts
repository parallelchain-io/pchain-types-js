import { expect } from "chai";
import {
  Command,
  Keypair,
  PrivateKey,
  PublicAddress,
  SignedTx,
  Transaction,
  Transfer,
} from "../../src";
import { BN } from "bn.js";

describe("Transactions", async () => {
  it("should sign and verify transactions", async () => {
    const keypair1 = new Keypair(
      new PublicAddress("6vvYQ-UezWtH8cVGiq_vA2rW4gl0i13ykTn8IdEKo6U"),
      new PrivateKey("m2r_l0Bo1CgjYhTDv0nngUGTiRKWDz3rf5HYv-WWObI")
    );

    const keypair2 = new Keypair(
      new PublicAddress("BsMzURgVIZoSxn3NfxyMlktmvFeajOGJk_rtP8wU9oA"),
      new PrivateKey("3OV7nQ-MWW7Ui-FVibKdiBaMlkSOG-qCe5mAsZXxGF4")
    );

    const transaction = new Transaction({
      commands: [
        new Command({
          transfer: new Transfer({
            amount: new BN("99"),
            recipient: keypair2.public_key,
          }),
        }),
      ],
      signer: keypair1.public_key,
      nonce: 1,
    });

    const signedTx = (await transaction?.toSignedTx?.(keypair1)) as SignedTx;

    expect(signedTx.signature.toBase64url()).to.eql(
      "0jOml5lwhYQ1zgBVwknu2OSS1KjcWAydfv95nn-ZzoJfsFLgRcuzbSSDz0DolvJsCTnKkixNhLvlacKROAawCQ"
    );

    expect(await signedTx.verifySignature(keypair1)).to.eql(true);
    expect(await signedTx.verifySignature(keypair2)).to.eql(false); // mismatched keypair
  });
});
