import { expect } from "chai";
import BN from "bn.js";

import {
  Block,
  BloomFilter,
  Call,
  CommandReceipt,
  PublicAddress,
  QuorumCertificate,
  Sha256Hash,
  Signature,
  SignatureSet,
  Transaction,
  Option,
  Generic,
  Phase,
  Receipt,
  Commit,
} from "../../src";

describe("Block", async () => {
  it("should serde single Block with no transactions", async () => {
    const base64Payload =
      "5fGVLtDskEzqLH7DH1xnpTap1sw4GlBT816Xum2gOEiRBgAAAAAAAAAAAAAAAAAAnAYAAAAAAABacs7js/l0o576ZbR9e2kfl4/4V0c4gCMuu+bzrSLqEwAEAAAAAe9M3qOO20fokQ1qzBdaY2BhNAUAQyBaukQp07YpOPg+R5RPzlM6Z6bvwqQFE+eW4vbHWpas7tm5uWoN0+wHqgkBVuX9x21/HNVdH8lOqRo4i/w70WmtNZ61YULwEYeMImvJQAvR3gMte7q4FN67n1to5Xpq5M8rXEHIM6RsK/NFCQABgr+MG9hRIaVpN+2ttRgobTHWDCgPgVIz4oSwMbzg1+NLBK2O2guqeVuwRzACa1cMRYprjKevdVwTDLmTdYrvCOFb+u25ax85cKa8hKNNUUFghafxz5/+8oAP0WTocCfcAAAAAAAAAACT0uETN1ftLGyyKSvA0UwaJF+Pi6Aze7cs0m8TQxjrdYR7dWQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANt2IzFkCvdi6vaH+p8ThlVVMmO102DWRf8iwP3g3gieAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    const block: Block = Block.deserialize(
      Buffer.from(base64Payload, "base64")
    );

    const {
      chain_id,
      hash,
      height,
      justify,
      data_hash,
      proposer,
      timestamp,
      base_fee,
      log_bloom,
      txs_hash,
      state_hash,
      receipts_hash,
      gas_used,
    } = block.blockHeader!;

    expect(hash.toBase64url()).to.eql(
      "5fGVLtDskEzqLH7DH1xnpTap1sw4GlBT816Xum2gOEg"
    );
    expect(hash).to.be.instanceOf(Sha256Hash);

    expect(chain_id).to.be.instanceOf(BN);
    expect(chain_id.toString()).to.eql("0");

    expect(height).to.be.instanceOf(BN);
    expect(height.toString()).to.eql("1681");

    expect(justify).to.be.instanceOf(QuorumCertificate);
    expect(justify.app_id).to.be.instanceOf(BN);
    expect(justify.app_id.toString()).to.eql("0");

    expect(justify.view).to.be.instanceOf(BN);
    expect(justify.view.toString()).to.eql("1692");

    expect(justify.block).to.be.instanceOf(Sha256Hash);
    expect(justify.block.toBase64url()).to.eql(
      "WnLO47P5dKOe-mW0fXtpH5eP-FdHOIAjLrvm860i6hM"
    );

    expect(justify.phase.enum).to.eql("generic");
    expect(justify.phase["generic"]).to.be.instanceOf(Generic);

    expect(justify.sigs).to.be.instanceOf(SignatureSet);
    expect(justify.sigs.signatures.length).to.eql(4);

    expect(justify.sigs.signatures[0]).to.be.instanceOf(Option);
    const sig0 = justify.sigs.signatures[0]?.value;
    expect(sig0).to.be.instanceOf(Signature);
    expect(sig0?.toBase64url()).to.eql(
      "70zeo47bR-iRDWrMF1pjYGE0BQBDIFq6RCnTtik4-D5HlE_OUzpnpu_CpAUT55bi9sdalqzu2bm5ag3T7AeqCQ"
    );

    expect(justify.sigs.signatures[1]).to.be.instanceOf(Option);
    const sig1 = justify.sigs.signatures[1]?.value;
    expect(sig1).to.be.instanceOf(Signature);
    expect(sig1?.toBase64url()).to.eql(
      "VuX9x21_HNVdH8lOqRo4i_w70WmtNZ61YULwEYeMImvJQAvR3gMte7q4FN67n1to5Xpq5M8rXEHIM6RsK_NFCQ"
    );

    expect(justify.sigs.signatures[2]).to.be.instanceOf(Option);
    const sig2 = justify.sigs.signatures[2]?.value;
    expect(sig2).to.eql(null);

    expect(justify.sigs.signatures[3]).to.be.instanceOf(Option);
    const sig3 = justify.sigs.signatures[3]?.value;
    expect(sig3).to.be.instanceOf(Signature);
    expect(sig3?.toBase64url()).to.eql(
      "gr-MG9hRIaVpN-2ttRgobTHWDCgPgVIz4oSwMbzg1-NLBK2O2guqeVuwRzACa1cMRYprjKevdVwTDLmTdYrvCA"
    );

    expect(data_hash).to.be.instanceOf(Sha256Hash);
    expect(data_hash.toBase64url()).to.eql(
      "4Vv67blrHzlwpryEo01RQWCFp_HPn_7ygA_RZOhwJ9w"
    );

    expect(proposer).to.be.instanceOf(PublicAddress);
    expect(proposer.toBase64url()).to.eql(
      "k9LhEzdX7SxssikrwNFMGiRfj4ugM3u3LNJvE0MY63U"
    );

    expect(timestamp).to.eql(1685420932);

    expect(base_fee).to.be.instanceOf(BN);
    expect(base_fee.toString()).to.eql("8");

    expect(log_bloom).to.be.instanceOf(BloomFilter);
    expect(log_bloom.toBase64url()).to.eql(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );

    expect(txs_hash).to.be.instanceOf(Sha256Hash);
    expect(txs_hash.toBase64url()).to.eql(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );

    expect(state_hash).to.be.instanceOf(Sha256Hash);
    expect(state_hash.toBase64url()).to.eql(
      "23YjMWQK92Lq9of6nxOGVVUyY7XTYNZF_yLA_eDeCJ4"
    );

    expect(receipts_hash).to.be.instanceOf(Sha256Hash);
    expect(receipts_hash.toBase64url()).to.eql(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );

    expect(gas_used).to.be.instanceOf(BN);
    expect(gas_used.toString()).to.eql("0");

    expect(block.transactions).to.eql([]);
    expect(block.receipts).to.eql([]);

    expect(block.serialize().toString("base64")).to.eql(base64Payload);
  });

  it("should serde single Block with a different Phase payload", async () => {
    const base64Payload =
      "5fGVLtDskEzqLH7DH1xnpTap1sw4GlBT816Xum2gOEiRBgAAAAAAAAAAAAAAAAAAnAYAAAAAAABacs7js/l0o576ZbR9e2kfl4/4V0c4gCMuu+bzrSLqEwM5MAAAAAAAAAQAAAAB70zeo47bR+iRDWrMF1pjYGE0BQBDIFq6RCnTtik4+D5HlE/OUzpnpu/CpAUT55bi9sdalqzu2bm5ag3T7AeqCQFW5f3HbX8c1V0fyU6pGjiL/DvRaa01nrVhQvARh4wia8lAC9HeAy17urgU3rufW2jlemrkzytcQcgzpGwr80UJAAGCv4wb2FEhpWk37a21GChtMdYMKA+BUjPihLAxvODX40sErY7aC6p5W7BHMAJrVwxFimuMp691XBMMuZN1iu8I4Vv67blrHzlwpryEo01RQWCFp/HPn/7ygA/RZOhwJ9wAAAAAAAAAAJPS4RM3V+0sbLIpK8DRTBokX4+LoDN7tyzSbxNDGOt1hHt1ZAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA23YjMWQK92Lq9of6nxOGVVUyY7XTYNZF/yLA/eDeCJ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    const block: Block = Block.deserialize(
      Buffer.from(base64Payload, "base64")
    );

    const { justify } = block.blockHeader!;

    expect(justify.phase.enum).to.eql("commit");
    expect(justify.phase["commit"]).to.be.instanceOf(Commit);

    expect(justify.phase?.commit?.view).to.be.instanceOf(BN);
    expect(justify.phase?.commit?.view.toString()).to.eql("12345");

    expect(block.serialize().toString("base64")).to.eql(base64Payload);
  });
  it("should serde a Block with 1 nested transaction", async () => {
    //
    // https://explorer.parallelchain.io/explorer/blocks/details?block_hash=LjRpv9ytHJeUOHA1Fkvq3VeymkEyEisIIVwUQ7xtoqM
    const base64Payload =
      "LjRpv9ytHJeUOHA1Fkvq3VeymkEyEisIIVwUQ7xtoqP/WwkAAAAAAAAAAAAAAAAAal0JAAAAAADSx6GvJae6BXUGr71qlw8EJuek68j/HsUf9r06Y0/NfQAKAAAAASmwksvj6AXHJgijWqehZUtu7Zgbh5iTZxGnDXEfCTgOG0u+iNO6yOlKmBOErgFhhC04c7LZpiOgkKEhpRTVugoBWN2M7QiYRrcfwI4DXnqt8wERz/OMPcnt7pGiS1qY2PsK+X3exFF7oE/gBzQmToc16ucVr2ZVhxudPFTQN+OgBwELAqBnGB7WXYPgX4kiq3mgnxheuw9IWHbFYnMjMYNyAiwGjtHV2se0xs8ixzAO4ST6Eoko+h7RLV2z4fa9UyIGARMrZVNybfYt7mUqpO05e2I9pt4TP2+IDPuMk86wJ7QSQnHDzc/I1gYGJVvNdEbBx/w+v/xHzNBKSf2pbmqO4w8BW+qQeWe8uzZYONxjG7VW9ECBjpToaOfFvxsKSnlJISd/25L1HmlNWJiH2JxQQEfbAyK0nAWKv5KADnxri9FtCwEvFqlQFIU8a1tG1P75skxKM0J03uUYo3NwtPTHpY/lbmLeDKZm3QwdB2Ot3WVasIwLRNhz5j1gMDVTRdfsRwcBAWxyWTgGKhqz+WUODNjAKNaiBz5gQ/2sFB1UqlQxr/pBbfsFXvOexVUdkYxPLESKuqvoPD6dEmEub0yL+QmMmgEAAfBa6vSbmDcxJCar7ox1Js2qk7arg0uZ1dXjRDR2fOwkKp6Wz7AmDZwkJQgMFvG9K3OFRxXeqzTkiorsbXbSGQYBqVssKcCFgGax8huvFkW52dgDkUlkNfUumI2ndpNnpCY/auoS3ZHZMUYJY7UQw1ce8kNYKEVDNqjGd5j4A2nSCXpZW2S0a0r6HbPrUpDXRe65RH0YCghGAuJOtzI8t6E1AAAAAAAAAAD8baYA0g0llQh26RLoHfNnjey30cN7ceNKGAk5Q0yIB93HdmQIAAAAAAAAAFneGgAAAAAARdHm1leOSy6ZYSyJLbEBuWSyNr5N+6C49d2hsg2+ej+XxpZSsrtGQN40tDy8X8x/RltfreipFfweiG2EqOshLOsDdrhrOvMVtOGV0Tqi9pveFoxTtLDpDY3EdIulD3BEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAABCxm8zHxrNe3Tp0OssdWTo0WnMV1Q4c05Cjp9zGCG2zwMAAAAAAAAAAQAAAALyxJvKc8UGHaZyHqqUBCuOq/b1rXYQ7eO7kn4rDbu9/xUAAABjbGFpbV91bmxvY2tlZF90b2tlbnMBAQAAAAgAAABCtQ9gBwAAAAEAAAAAAAAAAMDGLQAAAAAACAAAAAAAAAAAAAAAAAAAACzQNCcPNhdNgD+uIHW2BRQrLzR/Jc927JVFtVsCaRTCHpegxG289x1WJ/ufzZomdb/wj7R1vyuTvcfSfsBz3wayOlQmoWTB0SDOIsY8nhoPpDljTpJZQwEVJ35a5VY6ZQEAAAABAAAAAKXQGAAAAAAAAAAAAAAAAAA=";
    const block: Block = Block.deserialize(
      Buffer.from(base64Payload, "base64")
    );

    const {
      chain_id,
      hash,
      height,
      justify,
      data_hash,
      proposer,
      timestamp,
      base_fee,
      log_bloom,
      txs_hash,
      state_hash,
      receipts_hash,
      gas_used,
    } = block.blockHeader!;

    expect(hash.toBase64url()).to.eql(
      "LjRpv9ytHJeUOHA1Fkvq3VeymkEyEisIIVwUQ7xtoqM"
    );
    expect(hash).to.be.instanceOf(Sha256Hash);

    expect(chain_id).to.be.instanceOf(BN);
    expect(chain_id.toString()).to.eql("0");

    expect(height).to.be.instanceOf(BN);
    expect(height.toString()).to.eql("613375");

    expect(justify).to.be.instanceOf(QuorumCertificate);
    expect(justify.app_id).to.be.instanceOf(BN);
    expect(justify.app_id.toString()).to.eql("0");

    expect(justify.view).to.be.instanceOf(BN);
    expect(justify.view.toString()).to.eql("613738");

    expect(justify.block).to.be.instanceOf(Sha256Hash);
    expect(justify.block.toBase64url()).to.eql(
      "0sehryWnugV1Bq-9apcPBCbnpOvI_x7FH_a9OmNPzX0"
    );

    expect(justify.phase).to.be.instanceOf(Phase);
    expect(justify.phase.generic).to.be.instanceOf(Generic);

    expect(justify.sigs).to.be.instanceOf(SignatureSet);
    expect(justify.sigs.signatures.length).to.eql(10);

    expect(justify.sigs.signatures[0]).to.be.instanceOf(Option);
    const sig0 = justify.sigs.signatures[0]?.value;
    expect(sig0).to.be.instanceOf(Signature);
    expect(sig0?.toBase64url()).to.eql(
      "KbCSy-PoBccmCKNap6FlS27tmBuHmJNnEacNcR8JOA4bS76I07rI6UqYE4SuAWGELThzstmmI6CQoSGlFNW6Cg"
    );

    expect(justify.sigs.signatures[1]).to.be.instanceOf(Option);
    const sig1 = justify.sigs.signatures[1]?.value;
    expect(sig1).to.be.instanceOf(Signature);
    expect(sig1?.toBase64url()).to.eql(
      "WN2M7QiYRrcfwI4DXnqt8wERz_OMPcnt7pGiS1qY2PsK-X3exFF7oE_gBzQmToc16ucVr2ZVhxudPFTQN-OgBw"
    );

    expect(justify.sigs.signatures[2]).to.be.instanceOf(Option);
    const sig2 = justify.sigs.signatures[2]?.value;
    expect(sig2).to.be.instanceOf(Signature);
    expect(sig2?.toBase64url()).to.eql(
      "CwKgZxge1l2D4F-JIqt5oJ8YXrsPSFh2xWJzIzGDcgIsBo7R1drHtMbPIscwDuEk-hKJKPoe0S1ds-H2vVMiBg"
    );

    expect(justify.sigs.signatures[3]).to.be.instanceOf(Option);
    const sig3 = justify.sigs.signatures[3]?.value;
    expect(sig3).to.be.instanceOf(Signature);
    expect(sig3?.toBase64url()).to.eql(
      "EytlU3Jt9i3uZSqk7Tl7Yj2m3hM_b4gM-4yTzrAntBJCccPNz8jWBgYlW810RsHH_D6__EfM0EpJ_aluao7jDw"
    );

    expect(justify.sigs.signatures[4]).to.be.instanceOf(Option);
    const sig4 = justify.sigs.signatures[4]?.value;
    expect(sig4).to.be.instanceOf(Signature);
    expect(sig4?.toBase64url()).to.eql(
      "W-qQeWe8uzZYONxjG7VW9ECBjpToaOfFvxsKSnlJISd_25L1HmlNWJiH2JxQQEfbAyK0nAWKv5KADnxri9FtCw"
    );

    expect(justify.sigs.signatures[5]).to.be.instanceOf(Option);
    const sig5 = justify.sigs.signatures[5]?.value;
    expect(sig5).to.be.instanceOf(Signature);
    expect(sig5?.toBase64url()).to.eql(
      "LxapUBSFPGtbRtT--bJMSjNCdN7lGKNzcLT0x6WP5W5i3gymZt0MHQdjrd1lWrCMC0TYc-Y9YDA1U0XX7EcHAQ"
    );

    expect(justify.sigs.signatures[6]).to.be.instanceOf(Option);
    const sig6 = justify.sigs.signatures[6]?.value;
    expect(sig6).to.be.instanceOf(Signature);
    expect(sig6?.toBase64url()).to.eql(
      "bHJZOAYqGrP5ZQ4M2MAo1qIHPmBD_awUHVSqVDGv-kFt-wVe857FVR2RjE8sRIq6q-g8Pp0SYS5vTIv5CYyaAQ"
    );

    expect(justify.sigs.signatures[7]).to.be.instanceOf(Option);
    const sig7 = justify.sigs.signatures[7]?.value;
    expect(sig7).to.eql(null);

    expect(justify.sigs.signatures[8]).to.be.instanceOf(Option);
    const sig8 = justify.sigs.signatures[8]?.value;
    expect(sig8).to.be.instanceOf(Signature);
    expect(sig8?.toBase64url()).to.eql(
      "8Frq9JuYNzEkJqvujHUmzaqTtquDS5nV1eNENHZ87CQqnpbPsCYNnCQlCAwW8b0rc4VHFd6rNOSKiuxtdtIZBg"
    );

    expect(justify.sigs.signatures[9]).to.be.instanceOf(Option);
    const sig9 = justify.sigs.signatures[9]?.value;
    expect(sig9).to.be.instanceOf(Signature);
    expect(sig9?.toBase64url()).to.eql(
      "qVssKcCFgGax8huvFkW52dgDkUlkNfUumI2ndpNnpCY_auoS3ZHZMUYJY7UQw1ce8kNYKEVDNqjGd5j4A2nSCQ"
    );

    expect(data_hash).to.be.instanceOf(Sha256Hash);
    expect(data_hash.toBase64url()).to.eql(
      "ellbZLRrSvods-tSkNdF7rlEfRgKCEYC4k63Mjy3oTU"
    );

    expect(proposer).to.be.instanceOf(PublicAddress);
    expect(proposer.toBase64url()).to.eql(
      "_G2mANINJZUIdukS6B3zZ43st9HDe3HjShgJOUNMiAc"
    );

    expect(timestamp).to.eql(1685506013);

    expect(base_fee).to.be.instanceOf(BN);
    expect(base_fee.toString()).to.eql("8");

    expect(log_bloom).to.be.instanceOf(BloomFilter);
    expect(log_bloom.toBase64url()).to.eql(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );

    expect(txs_hash).to.be.instanceOf(Sha256Hash);
    expect(txs_hash.toBase64url()).to.eql(
      "RdHm1leOSy6ZYSyJLbEBuWSyNr5N-6C49d2hsg2-ej8"
    );

    expect(state_hash).to.be.instanceOf(Sha256Hash);
    expect(state_hash.toBase64url()).to.eql(
      "6wN2uGs68xW04ZXROqL2m94WjFO0sOkNjcR0i6UPcEQ"
    );

    expect(receipts_hash).to.be.instanceOf(Sha256Hash);
    expect(receipts_hash.toBase64url()).to.eql(
      "l8aWUrK7RkDeNLQ8vF_Mf0ZbX63oqRX8HohthKjrISw"
    );

    expect(gas_used).to.be.instanceOf(BN);
    expect(gas_used.toString()).to.eql("1760857");

    //
    // TRANSACTIONS
    //
    expect(block.transactions.length).to.eql(1);
    expect(block.transactions[0]).to.be.instanceOf(Transaction);

    const {
      signer,
      nonce,
      commands,
      hash: txn_hash,
      signature,
      gas_limit,
      priority_fee_per_gas,
      max_base_fee_per_gas,
    } = block.transactions[0];

    expect(signer).to.be.instanceOf(PublicAddress);
    expect(signer.toBase64url()).to.eql(
      "QsZvMx8azXt06dDrLHVk6NFpzFdUOHNOQo6fcxghts8"
    );

    //
    // Tx Commands
    //
    expect(commands.length).to.eql(1);

    const oneCommand = commands[0].call as Call;
    expect(oneCommand).to.be.instanceOf(Call);
    expect(oneCommand.index).to.eql(2); // Call has index 2

    expect(oneCommand.target).to.be.instanceOf(PublicAddress);
    expect(oneCommand.target.toBase64url()).to.eql(
      "8sSbynPFBh2mch6qlAQrjqv29a12EO3ju5J-Kw27vf8"
    );

    expect(oneCommand.args).to.be.instanceOf(Option);
    const args = oneCommand.args?.value;
    expect(args).to.be.instanceOf(Array);
    expect((args as Uint8Array[]).length).to.eql(1);
    expect(Buffer.from((args as Uint8Array[])[0]).toString("base64")).to.eql(
      "QrUPYAcAAAA="
    );

    expect(oneCommand.amount).to.be.instanceOf(Option);
    expect(oneCommand.amount?.value?.toString()).to.eql("0");

    expect(oneCommand.method).to.eql("claim_unlocked_tokens");

    //
    //
    //

    expect(nonce).to.be.instanceOf(BN);
    expect(nonce.toString()).to.eql("3");

    expect(priority_fee_per_gas).to.be.instanceOf(BN);
    expect(priority_fee_per_gas.toString()).to.eql("0");

    expect(max_base_fee_per_gas).to.be.instanceOf(BN);
    expect(max_base_fee_per_gas.toString()).to.eql("8");

    expect(gas_limit).to.be.instanceOf(BN);
    expect(gas_limit.toString()).to.eql("3000000");

    expect(txn_hash).to.be.instanceOf(Sha256Hash);
    expect(txn_hash.toBase64url()).to.eql(
      "sjpUJqFkwdEgziLGPJ4aD6Q5Y06SWUMBFSd-WuVWOmU"
    );

    expect(signature).to.be.instanceOf(Signature);
    expect(signature.toBase64url()).to.eql(
      "LNA0Jw82F02AP64gdbYFFCsvNH8lz3bslUW1WwJpFMIel6DEbbz3HVYn-5_NmiZ1v_CPtHW_K5O9x9J-wHPfBg"
    );

    //
    // Block Receipts
    //

    expect(block.receipts.length).to.eql(block.transactions.length);
    const txOneReceipts = block.receipts[0];
    expect(txOneReceipts).to.be.instanceOf(Receipt);
    expect(txOneReceipts?.command_receipts.length).to.eql(1);
    expect(txOneReceipts?.command_receipts[0]).to.be.instanceOf(CommandReceipt);

    expect(txOneReceipts?.command_receipts[0].exit_status).to.eql(0);
    expect(txOneReceipts?.command_receipts[0].gas_used.toString()).to.eql(
      "1626277"
    );

    expect(txOneReceipts?.command_receipts[0].logs.length).to.eql(0);
    expect(txOneReceipts?.command_receipts[0].return_values).to.eql(
      new Uint8Array([])
    );
    //
    //
    //

    expect(block.serialize().toString("base64")).to.eql(base64Payload);
  });
});
