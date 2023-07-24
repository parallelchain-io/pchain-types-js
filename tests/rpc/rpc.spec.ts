import { expect } from "chai";
import BN from "bn.js";

import {
  PublicAddress,
  StateResponse,
  ValidatorSetsRequest,
  ValidatorSetsResponse,
  PoolWithoutDelegator,
  StateRequest,
  DepositsRequest,
  DepositsResponse,
  Deposit,
  PoolsRequest,
  PoolsResponse,
  PoolWithDelegator,
  Pool,
  StakesRequest,
  StakesResponse,
  Stake,
  BlockRequest,
  BlockResponse,
  Block,
  BlockHeader,
  BloomFilter,
  Generic,
  QuorumCertificate,
  Sha256Hash,
  SignatureSet,
  Transaction,
  Command,
  CommandReceipt,
  ValidatorSet,
  Enum,
  Option,
  Transfer,
  SubmitTransactionRequest,
  SubmitTransactionResponse,
  SubmitTransactionError,
  TransactionRequest,
  TransactionResponse,
  Receipt,
} from "../../src";

describe("RPC", () => {
  it("should serde a BlockRequest", () => {
    const b64Payload = "TLfBH0tsJ7ZODO0BNdQNq08S7sCE3ZNJnUvMbaQjKaU=";

    const request: BlockRequest = BlockRequest.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    expect(request.block_hash.toBase64url()).to.eql(
      "TLfBH0tsJ7ZODO0BNdQNq08S7sCE3ZNJnUvMbaQjKaU"
    );

    expect(request.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a BlockResponse A", () => {
    const b64Payload =
      "AUy3wR9LbCe2TgztATXUDatPEu7AhN2TSZ1LzG2kIymlM3ULAAAAAAAAAAAAAAAAAL52CwAAAAAA3l41Wx4PBe/6vPK7bqvR/w/0HFemI8DKtHj9ux9z/O4ACgAAAAHskC1lgNvEDN6lfMZh081JAqdbeqFqnbH+5Aw80WwTPov1+GzPr14fiOEVL8Hev0TjYMWZxbqd/FVHmi22UCsIAZU5lvf8kk29nPZqQs68LsxXW4MWG5VwUnPZMKzCaomSti9zL2E4advxjZrl2jOiETEocv5oubw61Ny06NzuPQoBJ5SFuH/1pTDypYD29YrXwJ175gkG34BKUylDuJvjiql0VmmbFKCD7aJFOjaHFm8wdR8G0gDpOG77KrDNOE4dBQFs36jcswZSnNdQElmsqM2snP+BKh2T1FGiZbsxi1sF0OSwcElPOUpXXg42QnUxh4R2+1fS2fJw5zxyIBMjNtEMAe9XPosQcr0UDqU50WIE+X+qL+5JuqBdTv5h6O0simCiuGAsZMJ6MkRE8o0TQdASZqIzVAWP7B3Z7Pr0yIh7BwQBJNBYlcylfSG3IBQCQeEgWrurqnJKcIUZ0vyz2QhYajLjurT0ZE7NUUozsn4DNgykiVPxu8LR1mIa8ALQ3lS4BQFS94F2eoaqXI4lv8OnzakDO60llsx6coAV8nWp7wC/mwx2Zs5XGeJSemGAVcz8mgIkAVeM3oJWsSOhIoc4+TkDAAFDgvpWsbiXxkA11dIFeQocHwKYtqVclxZL4bQuJfo1eCPItBtQOpsAGniFfr5jYlyuK2qQcRd8mV/vYY7E5koIAc2UQOZ2HwYxQyPxDgZ0kGqVXuQJeqCG2b3cW1stvmxZ7v7ocSz1ssSrGQPcou+eG61kysBThhb7VtaD9566QgX1OIjJLwgWLVg9m9NHm+lRDKHXxSzN9FOisUgQ1R2FuwAAAAAAAAAAo7iyYZaaVT6Z9U5HMjR01Zj1/Q5ejzrsrVQhA03BmIJDt4pkCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACl/WtJ/X1z+GanTTKw07KxszyPR/E3AEL9sFPYnDAnKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

    const response: BlockResponse = BlockResponse.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    const blockOption = response.block;
    expect(blockOption).to.be.instanceOf(Option);

    const block = blockOption.value;
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
    } = block?.blockHeader as BlockHeader;

    expect(hash.toBase64url()).to.eql(
      "TLfBH0tsJ7ZODO0BNdQNq08S7sCE3ZNJnUvMbaQjKaU"
    );
    expect(hash).to.be.instanceOf(Sha256Hash);

    expect(chain_id).to.be.instanceOf(BN);
    expect(chain_id.toString()).to.eql("0");

    expect(height).to.be.instanceOf(BN);
    expect(height.toString()).to.eql("750899");

    expect(justify).to.be.instanceOf(QuorumCertificate);
    expect(justify.app_id).to.be.instanceOf(BN);
    expect(justify.app_id.toString()).to.eql("0");

    expect(justify.view).to.be.instanceOf(BN);
    expect(justify.view.toString()).to.eql("751294");

    expect(justify.block).to.be.instanceOf(Sha256Hash);
    expect(justify.block.toBase64url()).to.eql(
      "3l41Wx4PBe_6vPK7bqvR_w_0HFemI8DKtHj9ux9z_O4"
    );

    expect(justify.phase.enum).to.eql("generic");
    expect(justify.phase["generic"]).to.be.instanceOf(Generic);

    expect(justify.sigs).to.be.instanceOf(SignatureSet);
    expect(justify.sigs.signatures.length).to.eql(10);

    expect(data_hash).to.be.instanceOf(Sha256Hash);
    expect(data_hash.toBase64url()).to.eql(
      "9TiIyS8IFi1YPZvTR5vpUQyh18UszfRTorFIENUdhbs"
    );

    expect(proposer).to.be.instanceOf(PublicAddress);
    expect(proposer.toBase64url()).to.eql(
      "o7iyYZaaVT6Z9U5HMjR01Zj1_Q5ejzrsrVQhA03BmII"
    );

    expect(timestamp).to.eql(1686812483);

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
      "pf1rSf19c_hmp00ysNOysbM8j0fxNwBC_bBT2JwwJyo"
    );

    expect(receipts_hash).to.be.instanceOf(Sha256Hash);
    expect(receipts_hash.toBase64url()).to.eql(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );

    expect(gas_used).to.be.instanceOf(BN);
    expect(gas_used.toString()).to.eql("0");

    expect(block?.transactions).to.eql([]);
    expect(block?.receipts).to.eql([]);

    expect(response.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a BlockResponse B", () => {
    const b64Payload =
      "AScDhVIiryBJ5zczodo5wZyYp8wP2q1elGpmdOxJHz7hHjULAAAAAAAAAAAAAAAAAKc2CwAAAAAAGAUDtMy9kC6PZ3BJ1ae3C/MA/jiD82348qV1RFc8+aAACgAAAAFVXjdoZLwf1qUOxobxqe73QaKye7slHQl/XocHmPJoUFiEw5hUAf0/m0AsqrS4lL1/zIvhjfoZOvhi1Vxi7fMCAAEVWF3aEeF0lDeK3cw8ezP7ryrBwoseyJVSIwh/JTmKyKP39p0buVbG2/Mz4PwL5MgtgihXfUsw3m8VUaDXJfYIAAEeLrxlsnlG6cscJFdixifaZn3ZEvDxTBDMi0Edy9yMPSrSEtt3FwnTs+skRb2XjPfD56zUqUTCc1QWjhD+g9wEAUONWliA9d2eQ90C9xcuNBeEdUrnXeLexTdyWJk/7SaTT+9t9Mxa08jiRt54pH+Uqi1PGJPI+Bkb8AWvyiwCvQQBq2shMnJ+kfVZwUdojzvs+1Gdi2SAU656ciPXOpG3FWd4zqFwsHAEZCg/dZPlndW3Xe906Z6T4dJ4MFwkfPf8BQHTrqK1vHQTNblRXeXZQK9ib41jrX7p36aDrYYwpv1SgWWKhxxFcMoOKXFC5YdQ4LwKYyyGcifwj/8jDe7SI/4EAQ3kzjkDV+Ay63JEoaj9iZctDOIzddy3fefFCXYH86KG3ZCaUdUHUGKONux5LgwGGtKc/uareeYMSHzBlhesSAMAedc5palXpgvQidCzMBXQFiTmaSCP2LJGJs4ZBHmaPkcAAAAAAAAAAPTSvJQrG7ibXJy8Z185jx9dkZ3zjoQwi8b3+YamulFpalaIZAgAAAAAAAAAvNcMAAAAAACAR5ulPEJyFgkdilGgNYo7l0y2mtBH/Gn/vavSyFMFsh+/1rIsC+cIOCA+EOkt2QTIiZ6cShHJ4xgFL1CC4rRbcwxSTzqNcnIvDxxqF9fiVgj1uO6zFlTkzQLcIEXSTQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAPqlhTC5pSPTj7f2oodFmYA9gq1XM3yPmvFf2fp/IZl0AQAAAAAAAAABAAAACqCvCr3ftnFmJaEGjzZRrRt0OXVeiRSs1a1zgIQUbeYbACz17A8AAAAACT0AAAAAAAgAAAAAAAAAAAAAAAAAAADK+qbv5aN2GUL89GUqpGgnCeDbs8d55W6WhnA8cXqZFBmlaR4cPF1grOW6G9gFib++TLL8RNanCiAD7+6xyHQKq4V5YTOaBrGuSnus9f0VjSaUe2li/uIqnpMxf0dGzGIBAAAAAQAAAAAizgoAAAAAAAgAAAAALPXsDwAAAAAAAAA=";

    const response: BlockResponse = BlockResponse.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    const blockOpt = response.block;
    expect(blockOpt).to.be.instanceOf(Option);
    const block = blockOpt.value;
    expect(blockOpt.value).to.be.instanceOf(Block);

    // only assert a subset
    const { height, log_bloom, txs_hash, state_hash, receipts_hash, gas_used } =
      block?.blockHeader as BlockHeader;

    expect(height.toString()).to.eql("734494");

    expect(log_bloom).to.be.instanceOf(BloomFilter);
    expect(log_bloom.toBase64url()).to.eql(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );

    expect(txs_hash).to.be.instanceOf(Sha256Hash);
    expect(txs_hash.toBase64url()).to.eql(
      "gEebpTxCchYJHYpRoDWKO5dMtprQR_xp_72r0shTBbI"
    );

    expect(state_hash).to.be.instanceOf(Sha256Hash);
    expect(state_hash.toBase64url()).to.eql(
      "cwxSTzqNcnIvDxxqF9fiVgj1uO6zFlTkzQLcIEXSTQ4"
    );

    expect(receipts_hash).to.be.instanceOf(Sha256Hash);
    expect(receipts_hash.toBase64url()).to.eql(
      "H7_WsiwL5wg4ID4Q6S3ZBMiJnpxKEcnjGAUvUILitFs"
    );

    expect(gas_used).to.be.instanceOf(BN);
    expect(gas_used.toString()).to.eql("841660");

    expect(block?.transactions.length).to.eql(1);
    const txn = block?.transactions[0];
    expect(txn).to.be.instanceOf(Transaction);

    expect(txn?.commands).be.instanceOf(Array);
    expect(txn?.commands.length).to.eql(1);
    const command = txn?.commands[0];
    expect(command).to.be.instanceOf(Command);

    expect(command?.enum).to.eql("stakeDeposit");

    const stakeDeposit = command?.["stakeDeposit"];
    expect(stakeDeposit?.operator.toBase64url()).to.eql(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    );
    expect(stakeDeposit?.max_amount.toString()).to.eql("68400000000");

    expect(block?.receipts).to.be.instanceOf(Array);
    expect(block?.receipts?.length).to.eql(1);

    expect(block?.receipts[0]).to.be.instanceOf(Receipt);
    const commandReceipts = block?.receipts[0].command_receipts;
    const commandReceipt = commandReceipts?.[0];
    expect(commandReceipt).to.be.instanceOf(CommandReceipt);
    expect(commandReceipt?.exit_status).to.eql(0);
    expect(commandReceipt?.gas_used.toString()).to.eql("708130");
    expect(commandReceipt?.logs).to.eql([]);
    expect(commandReceipt?.return_values).to.eql(
      new Uint8Array([0, 44, 245, 236, 15, 0, 0, 0])
    );

    expect(response.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a BlockResponse C, with a nested transaction Transfer", () => {
    const b64Payload =
      "AQZnq7iSelpm3sDcuIQZIZb8Yckugz3kxYPzOGnwjO0t6kkKAAAAAAAAAAAAAAAAAGVLCgAAAAAAnlgQtRWUmQwIK95yIxLXZq4o1Shx+tY1MX8td88Cs8EACgAAAAFsNx0O/CUFhY3QxGITHOnXzu1eTnzJ+MhVJBL0iB4i1comzJyd71N6KTkP2ZnQN0dquOR1KxJqGLlkm0RH8tAJAVM9DqqIxurqKMUvyVrQ57VnKZrAK1PZAgkINHXSeCfCL2E5e6NFBtYI8uj/WV6g3q06Fgcsa2JEwsZ64DwPQg0Bv5vSsu9W6F3zp/Sh+ROsOdJIgzO/8CvErKEaaZiCuiwJnEqSYG18/1TvHLNVSjcBynNHty6rBAGJnaknAsDDBAAAAAEvSFSnGnLDDPhWMf1R4KR8fGXRHfR4H3hnsE6ysuS3U1EOryE6+Iwx3lPJEqG7uvm84AqkwVv4i1VfS46/iGcCAAEmCCb+/WNRPSF9wQEAP2kvFHerqHSdTZh6C9vQlUiJHU9aJzPYyKFRkiNBgViY1NYBGnDchLfk6zpDysUFec0AAB8PcBEH26O3aRE04DY3GrG4w19TBTPG0H1oJ1k7dSL7AAAAAAAAAAA3obSmr64URW3468MlkltGjGzXB/tuxDbkEvciZ50FW3Gcf2QIAAAAAAAAAM6JAgAAAAAAKGhcdgJPFgU1CH1Jk6hHaguHF1rHGIE0bdZsSrpc0O65dFPWaJwdS3uitU+J9oWDkG85Akt30riY0AWjTNbTHpO5gVSsztgRbu1Xf3JRr+UL1Bq4/ic6OHPVhzSRyg1qAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAACriJB35O86eSTYX1aYlD8AuHwUqWouvubbcMa0CctXAxAAAAAAAAAAAQAAAAB99npvzjXwVANK3GFcL5U3nHBkyA1cCg5t4FjttTmWe0AdhYgNAAAAzokCAAAAAAAIAAAAAAAAAAAAAAAAAAAAesEHyWcpU0GxQjISAHVWNcVqgOY9vzmAMNSMRRxrl++4IT1lEXQDMOTfe9FNARAGJnqr2u6l0tJrTz2nIGBaDp0YpMmfvi4E6N1g1jaqU5mLPcHZnxzFHrqCa/PDkoscAQAAAAEAAAAANIAAAAAAAAAAAAAAAAAAAA==";

    const response: BlockResponse = BlockResponse.deserialize(
      Buffer.from(b64Payload, "base64")
    );
    const txns = response.block.value?.transactions;

    expect(txns?.length).to.eql(1);
    const command = txns?.[0].commands[0];
    expect(command).to.be.instanceOf(Command);

    expect(command?.enum).to.eql("transfer");
    expect(command?.transfer).to.be.instanceOf(Transfer);
    expect(command?.transfer?.amount.toString()).to.eql("58125000000");
    expect(command?.transfer?.recipient.toBase64url()).to.eql(
      "ffZ6b8418FQDStxhXC-VN5xwZMgNXAoObeBY7bU5lns"
    );
  });

  it("should serde a SubmitTransactionRequest", () => {
    const b64Payload =
      "6vvYQ+UezWtH8cVGiq/vA2rW4gl0i13ykTn8IdEKo6UBAAAAAAAAAAEAAAAABsMzURgVIZoSxn3NfxyMlktmvFeajOGJk/rtP8wU9oBjAAAAAAAAAEANAwAAAAAAAAAAAAAAAAAAAAAAAAAAANIzppeZcIWENc4AVcJJ7tjkktSo3FgMnX7/eZ5/mc6CX7BS4EXLs20kg89A6JbybAk5ypIsTYS75WnCkTgGsAm4hzDWrE4tdb1mpSqJU7Nph9Jj9s3s6d0lRadxUfpr5g==";

    const txRequest: SubmitTransactionRequest =
      SubmitTransactionRequest.deserialize(Buffer.from(b64Payload, "base64"));

    const tx = txRequest.transaction;
    expect(tx).to.be.instanceOf(Transaction);

    expect(tx.hash.toBase64url()).to.eql(
      "uIcw1qxOLXW9ZqUqiVOzaYfSY_bN7OndJUWncVH6a-Y"
    );
    expect(tx.nonce.toString()).to.eql("1");
    expect(tx.signer.toBase64url()).to.eql(
      "6vvYQ-UezWtH8cVGiq_vA2rW4gl0i13ykTn8IdEKo6U"
    );
    expect(tx.priority_fee_per_gas.toString()).to.eql("0");
    expect(tx.gas_limit.toString()).to.eql("200000");
    expect(tx.max_base_fee_per_gas.toString()).to.eql("0");

    expect(tx.signature.toBase64url()).to.eql(
      "0jOml5lwhYQ1zgBVwknu2OSS1KjcWAydfv95nn-ZzoJfsFLgRcuzbSSDz0DolvJsCTnKkixNhLvlacKROAawCQ"
    );

    const commands = tx.commands;
    expect(commands.length).to.eql(1);
    const command = commands[0];
    expect(command).to.be.instanceOf(Command);
    expect(command.transfer?.amount.toString()).to.eql("99");
    expect(command.transfer?.recipient.toBase64url()).to.eql(
      "BsMzURgVIZoSxn3NfxyMlktmvFeajOGJk_rtP8wU9oA"
    );

    expect(txRequest.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a SubmitTransactionReseponse", () => {
    const b64Payload = "AQI=";

    const response: SubmitTransactionResponse =
      SubmitTransactionResponse.deserialize(Buffer.from(b64Payload, "base64"));
    expect(response.error).to.be.instanceOf(Option);
    expect(response.error.value).to.eql(SubmitTransactionError.Other);
  });

  it("should serde a TransactionRequest", () => {
    const b64Payload = "DjBrTH8T75YE7+rEQqqG6NwgCi6EVEUYB4QIscSyq48B";

    const txRequest: TransactionRequest = TransactionRequest.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    expect(txRequest.transaction_hash.toBase64url()).to.eql(
      "DjBrTH8T75YE7-rEQqqG6NwgCi6EVEUYB4QIscSyq48"
    );

    expect(txRequest.include_receipt).to.eql(true);
    expect(txRequest.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a TransactionResponse", () => {
    const b64Payload =
      "AYchXkESPY4EEzCl6idD8iKTJsKaKjynqZDqR3u82GswDwAAAAAAAAABAAAACaO4smGWmlU+mfVORzI0dNWY9f0OXo867K1UIQNNwZiCAKkNrgQAAAAACT0AAAAAAAgAAAAAAAAAAAAAAAAAAABvx/cB3FncHBpoYCaRv9SLzSrSxfTAmHNzDQh1Qs45Nq7yxOWLvOT5zl852wZiCuHWsj/BLPhwl3pI886w0FUGDjBrTH8T75YE7+rEQqqG6NwgCi6EVEUYB4QIscSyq48BAQAAAAEIdQAAAAAAAAAAAAAAAAAAAeQPXz8ez4JULUTiS0ipWn6rbm0ogq6K8EH/OWwiTyUTAQAAAAA=";

    const txResponse: TransactionResponse = TransactionResponse.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    expect(txResponse.block_hash).to.be.instanceOf(Option);
    expect(txResponse.block_hash.value?.toBase64url()).to.eql(
      "5A9fPx7PglQtROJLSKlafqtubSiCrorwQf85bCJPJRM"
    );

    expect(txResponse.transaction).to.be.instanceOf(Option);
    const tx = txResponse.transaction.value;
    expect(tx).to.be.instanceOf(Transaction);
    expect(tx?.signer.toBase64url()).to.eql(
      "hyFeQRI9jgQTMKXqJ0PyIpMmwpoqPKepkOpHe7zYazA"
    );

    expect(tx?.commands).to.be.instanceOf(Array);
    expect(tx?.commands.length).to.eql(1);
    expect(tx?.commands[0]).to.be.instanceOf(Command);
    expect(tx?.commands[0].enum).to.eql("withdrawDeposit");

    const withdrawDeposit = tx?.commands[0].withdrawDeposit;
    expect(withdrawDeposit?.operator.toBase64url()).to.eql(
      "o7iyYZaaVT6Z9U5HMjR01Zj1_Q5ejzrsrVQhA03BmII"
    );
    expect(withdrawDeposit?.max_amount.toString()).to.eql("20100000000");

    expect(txResponse.receipt).to.be.instanceOf(Option);
    const rcp = txResponse.receipt.value;
    expect(rcp).to.be.instanceOf(Receipt);
    const commandReceipts = rcp?.command_receipts;
    expect(commandReceipts?.length).to.eql(1);
    expect(commandReceipts?.[0]).to.be.instanceOf(CommandReceipt);

    expect(commandReceipts?.[0].exit_status).to.eql(1);
    expect(commandReceipts?.[0].gas_used.toString()).to.eql("29960");

    expect(txResponse.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a StateRequest", () => {
    const buffer = Buffer.from(
      "0000000001010000000000000000000000000000000000000000000000000000000000000000000000010000000100000005",
      "hex"
    );
    const request = StateRequest.deserialize(buffer) as StateRequest;

    expect(request.accounts).to.eql(new Set());
    expect(request.include_contract).to.eql(true);
    expect([...request.storage_keys].length).to.eql(1);
    expect([...request.storage_keys][0][0]).be.instanceOf(PublicAddress);
    expect([...request.storage_keys][0][0].toBase64url()).be.eql(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );
    expect([...request.storage_keys][0][1]).eql(new Set([new Uint8Array([5])]));

    expect(request.serialize()).to.eql(buffer);
  });

  it("should serde a StateResponse", () => {
    const base64Payload =
      "AAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAABQgAAABNAAAAAAAAABizNPTCZG1cIDAAuH6w7i+0ullcsxLJLzWYpIdsNenS";
    let stateResponse = StateResponse.deserialize(
      Buffer.from(base64Payload, "base64")
    ) as StateResponse;

    const { accounts, storage_tuples, block_hash } = stateResponse;
    expect(accounts.size).to.eql(0);
    expect(storage_tuples.size).to.eql(1);

    const storageTupleOne = [...storage_tuples][0];
    expect(storageTupleOne[0]).to.be.instanceOf(PublicAddress);
    expect(storageTupleOne[0].toBase64url()).to.eql(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );

    const byteArrayMap = storageTupleOne[1];
    expect(byteArrayMap).to.be.instanceOf(Map); // key value of ByteArrays
    expect(byteArrayMap.size).to.eql(1);

    for (const key of byteArrayMap.keys()) {
      expect(key).to.eql(new Uint8Array(Buffer.from([5])));
      expect(byteArrayMap.get(key)).to.eql(
        new Uint8Array(Buffer.from([77, 0, 0, 0, 0, 0, 0, 0]))
      );
    }

    expect(block_hash.toBase64url()).to.eql(
      "GLM09MJkbVwgMAC4frDuL7S6WVyzEskvNZikh2w16dI"
    );
    expect(stateResponse.serialize().toString("base64")).to.eql(base64Payload);
  });

  it("should serde a ValidatorSetRequest for CURRENT validator sets", () => {
    const buffer = Buffer.from([0, 0, 1, 0, 0, 0]);
    const request = ValidatorSetsRequest.deserialize(
      buffer
    ) as ValidatorSetsRequest;

    expect(request).to.eql(
      new ValidatorSetsRequest({
        include_prev: false,
        include_prev_delegators: false,
        include_curr: true,
        include_curr_delegators: false,
        include_next: false,
        include_next_delegators: false,
      })
    );
    expect(request.serialize()).to.eql(buffer);
  });

  it("should serde a ValidatorSetsResponse with CURRENT validator sets", () => {
    const base64Payload =
      "AAEBCgAAAPxtpgDSDSWVCHbpEugd82eN7LfRw3tx40oYCTlDTIgHMHYFMUkLAAAAAfxtpgDSDSWVCHbpEugd82eN7LfRw3tx40oYCTlDTIgHAKByThgJAACgrwq937ZxZiWhBo82Ua0bdDl1XokUrNWtc4CEFG3mG4zA/GSOCwAAAAGgrwq937ZxZiWhBo82Ua0bdDl1XokUrNWtc4CEFG3mGwCgck4YCQAAR5aexUGcjnUwYuy7JrffNb8hsdmEllWEoMoodJ4s3xQSr3t/pAsAAAABR5aexUGcjnUwYuy7JrffNb8hsdmEllWEoMoodJ4s3xQAoHJOGAkAAMxT3WtGQNOegqIquQhvS9YkW25rn3KSAJ/a848x6oAAenWCqPQMAAAAAcxT3WtGQNOegqIquQhvS9YkW25rn3KSAJ/a848x6oAAAKByThgJAAD00ryUKxu4m1ycvGdfOY8fXZGd846EMIvG9/mGprpRaYG+WiJpZgAAAAH00ryUKxu4m1ycvGdfOY8fXZGd846EMIvG9/mGprpRaQCgck4YCQAAIiJoIUHLuuBUHyGHU2/rGSyoHBZ3LQNqI5dgo6ff0k6q8EROxwsAAAABIiJoIUHLuuBUHyGHU2/rGSyoHBZ3LQNqI5dgo6ff0k4AoHJOGAkAADehtKavrhRFbfjrwyWSW0aMbNcH+27ENuQS9yJnnQVbu7JaheMLAAAAATehtKavrhRFbfjrwyWSW0aMbNcH+27ENuQS9yJnnQVbAKByThgJAADHt6LLAf/xhUdCRKCNmTcRd0tTcUajhVpX/qqL6HM4opqAgkMmDwAAAAHHt6LLAf/xhUdCRKCNmTcRd0tTcUajhVpX/qqL6HM4ogCgck4YCQAAo7iyYZaaVT6Z9U5HMjR01Zj1/Q5ejzrsrVQhA03BmIJ+dpTtEWUAAAABo7iyYZaaVT6Z9U5HMjR01Zj1/Q5ejzrsrVQhA03BmIIAoHJOGAkAACCw68wVb1UaoSzRrBO3iSVuygOLy1NtHyli/KGW0vBrs+x/OTmMCQAAASCw68wVb1UaoSzRrBO3iSVuygOLy1NtHyli/KGW0vBrAKByThgJAAAAqiJ+lQQL/1VxX3z9odpk333+ZXeaxgdr0etToS5JIuI=";
    const response = ValidatorSetsResponse.deserialize(
      Buffer.from(base64Payload, "base64")
    ) as ValidatorSetsResponse;

    // const req = new ValidatorSetsRequest({
    //   include_prev: false,
    //   include_prev_delegators: false,
    //   include_curr: true,
    //   include_curr_delegators: false,
    //   include_next: false,
    //   include_next_delegators: false,
    // });

    expect(response.prev_validator_set).to.be.instanceOf(Option);
    expect(response.prev_validator_set.value).to.eql(null);

    expect(response.curr_validator_set).to.be.instanceOf(Option);
    expect(response.curr_validator_set.value).to.be.instanceOf(ValidatorSet);

    const validatorSet = response.curr_validator_set?.value;

    const poolsWithoutDelegator = validatorSet?.poolsWithoutDelegator || [];
    expect(poolsWithoutDelegator.length).to.eql(10);

    for (const s of poolsWithoutDelegator!) {
      expect(s).to.be.instanceOf(PoolWithoutDelegator);
    }

    const pool0 = poolsWithoutDelegator[0];
    expect(pool0?.operator.toBase64url()).to.eql(
      "_G2mANINJZUIdukS6B3zZ43st9HDe3HjShgJOUNMiAc"
    );
    expect(pool0?.commission_rate).to.eql(0);
    expect(pool0?.power.toString()).to.eql("12408982959664");

    expect(pool0?.operator_stake).to.be.instanceOf(Option);
    const operatorStake = pool0?.operator_stake?.value;

    expect(operatorStake?.owner.toBase64url()).to.eql(
      "_G2mANINJZUIdukS6B3zZ43st9HDe3HjShgJOUNMiAc"
    );
    expect(operatorStake?.power.toString()).to.eql("10000000000000");

    const pool1 = poolsWithoutDelegator[1];
    expect(pool1?.operator.toBase64url()).to.eql(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    );
    expect(pool1?.commission_rate).to.eql(0);
    expect(pool1?.power.toString()).to.eql("12706207547532");

    expect(pool1?.operator_stake).to.be.instanceOf(Option);
    const operatorStake1 = pool1?.operator_stake?.value;

    expect(operatorStake1?.owner.toBase64url()).to.eql(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    );
    expect(operatorStake1?.power.toString()).to.eql("10000000000000");

    const pool2 = poolsWithoutDelegator[2];
    expect(pool2?.operator_stake).to.be.instanceOf(Option);
    const operatorStake2 = pool2?.operator_stake?.value;

    expect(pool2?.operator.toBase64url()).to.eql(
      "R5aexUGcjnUwYuy7JrffNb8hsdmEllWEoMoodJ4s3xQ"
    );
    expect(pool2?.commission_rate).to.eql(0);
    expect(pool2?.power.toString()).to.eql("12801141354258");
    expect(operatorStake2?.owner.toBase64url()).to.eql(
      "R5aexUGcjnUwYuy7JrffNb8hsdmEllWEoMoodJ4s3xQ"
    );
    expect(operatorStake2?.power.toString()).to.eql("10000000000000");

    const pool9 = poolsWithoutDelegator[9];
    expect(pool9?.operator_stake).to.be.instanceOf(Option);
    const operatorStake9 = pool9?.operator_stake?.value;

    expect(pool9?.operator.toBase64url()).to.eql(
      "ILDrzBVvVRqhLNGsE7eJJW7KA4vLU20fKWL8oZbS8Gs"
    );
    expect(pool9?.commission_rate).to.eql(0);
    expect(pool9?.power.toString()).to.eql("2687452196105395");
    expect(operatorStake9?.owner.toBase64url()).to.eql(
      "ILDrzBVvVRqhLNGsE7eJJW7KA4vLU20fKWL8oZbS8Gs"
    );
    expect(operatorStake9?.power.toString()).to.eql("10000000000000");

    expect(response.serialize().toString("base64")).to.eql(base64Payload);
  });

  it("should serde a ValidatorSetRequest for PREVIOUS validator sets", () => {
    const buffer = Buffer.from([1, 0, 0, 0, 0, 0]);
    const request = ValidatorSetsRequest.deserialize(
      buffer
    ) as ValidatorSetsRequest;

    expect(request).to.eql(
      new ValidatorSetsRequest({
        include_prev: true,
        include_prev_delegators: false,
        include_curr: false,
        include_curr_delegators: false,
        include_next: false,
        include_next_delegators: false,
      })
    );
    expect(request.serialize()).to.eql(buffer);
  });

  it("should serde a ValidatorSetsResponse with PREV validator set", () => {
    const base64Payload =
      "AQEBCgAAADehtKavrhRFbfjrwyWSW0aMbNcH+27ENuQS9yJnnQVbA9ZXZ84KAAAAATehtKavrhRFbfjrwyWSW0aMbNcH+27ENuQS9yJnnQVbAKByThgJAACgrwq937ZxZiWhBo82Ua0bdDl1XokUrNWtc4CEFG3mG544P3aLCwAAAAGgrwq937ZxZiWhBo82Ua0bdDl1XokUrNWtc4CEFG3mGwCgck4YCQAA/G2mANINJZUIdukS6B3zZ43st9HDe3HjShgJOUNMiAdtwar16woAAAAB/G2mANINJZUIdukS6B3zZ43st9HDe3HjShgJOUNMiAcAoHJOGAkAAMxT3WtGQNOegqIquQhvS9YkW25rn3KSAJ/a848x6oAAYYHLHNoMAAAAAcxT3WtGQNOegqIquQhvS9YkW25rn3KSAJ/a848x6oAAAKByThgJAAD00ryUKxu4m1ycvGdfOY8fXZGd846EMIvG9/mGprpRacSDvixXZgAAAAH00ryUKxu4m1ycvGdfOY8fXZGd846EMIvG9/mGprpRaQCgck4YCQAAIiJoIUHLuuBUHyGHU2/rGSyoHBZ3LQNqI5dgo6ff0k6jAubCrwsAAAABIiJoIUHLuuBUHyGHU2/rGSyoHBZ3LQNqI5dgo6ff0k4AoHJOGAkAAEeWnsVBnI51MGLsuya33zW/IbHZhJZVhKDKKHSeLN8UJfAXZYMLAAAAAUeWnsVBnI51MGLsuya33zW/IbHZhJZVhKDKKHSeLN8UAKByThgJAADHt6LLAf/xhUdCRKCNmTcRd0tTcUajhVpX/qqL6HM4ou/6VEXnDgAAAAHHt6LLAf/xhUdCRKCNmTcRd0tTcUajhVpX/qqL6HM4ogCgck4YCQAAo7iyYZaaVT6Z9U5HMjR01Zj1/Q5ejzrsrVQhA03BmIKVwCrL+mQAAAABo7iyYZaaVT6Z9U5HMjR01Zj1/Q5ejzrsrVQhA03BmIIAoHJOGAkAACCw68wVb1UaoSzRrBO3iSVuygOLy1NtHyli/KGW0vBrsQk+2suLCQAAASCw68wVb1UaoSzRrBO3iSVuygOLy1NtHyli/KGW0vBrAKByThgJAAAAAPAM6JjlRzhVDZO/DlYL6M2cchB8k7YhRgJ/+AwauxN+";
    const response: ValidatorSetsResponse = ValidatorSetsResponse.deserialize(
      Buffer.from(base64Payload, "base64")
    );

    expect(response.curr_validator_set).to.be.instanceOf(Option);
    expect(response.curr_validator_set.value).to.eql(null);

    // note the nested Option
    expect(response.prev_validator_set).to.be.instanceOf(Option);
    expect(response.prev_validator_set.value).to.be.instanceOf(Option);

    expect(response.prev_validator_set?.value?.value).to.be.instanceOf(
      ValidatorSet
    );

    const validatorSet = response.prev_validator_set?.value?.value;
    expect(validatorSet).to.be.instanceOf(Enum);

    const poolsWithoutDelegator = validatorSet?.poolsWithoutDelegator || [];
    for (const s of poolsWithoutDelegator) {
      expect(s).to.be.instanceOf(PoolWithoutDelegator);
    }

    expect(poolsWithoutDelegator.length).to.eql(10);

    const pool0 = poolsWithoutDelegator[0];
    expect(pool0?.operator.toBase64url()).to.eql(
      "N6G0pq-uFEVt-OvDJZJbRoxs1wf7bsQ25BL3ImedBVs"
    );
    expect(pool0?.commission_rate).to.eql(0);
    expect(pool0?.power.toString()).to.eql("11881613350403");

    expect(pool0?.operator_stake).to.be.instanceOf(Option);
    const pool0OperatorStake = pool0?.operator_stake?.value;
    expect(pool0OperatorStake?.owner.toBase64url()).to.eql(
      "N6G0pq-uFEVt-OvDJZJbRoxs1wf7bsQ25BL3ImedBVs"
    );
    expect(pool0OperatorStake?.power.toString()).to.eql("10000000000000");

    const pool1 = poolsWithoutDelegator[1];
    expect(pool1?.operator_stake).to.be.instanceOf(Option);
    const pool1OperatorStake = pool1?.operator_stake?.value;

    expect(pool1?.operator.toBase64url()).to.eql(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    );
    expect(pool1?.commission_rate).to.eql(0);
    expect(pool1?.power.toString()).to.eql("12693612214430");
    expect(pool1OperatorStake?.owner.toBase64url()).to.eql(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    );
    expect(pool1OperatorStake?.power.toString()).to.eql("10000000000000");

    const pool2 = poolsWithoutDelegator[2];
    expect(pool2?.operator_stake).to.be.instanceOf(Option);
    const pool2OperatorStake = pool2?.operator_stake?.value;

    expect(pool2?.operator.toBase64url()).to.eql(
      "_G2mANINJZUIdukS6B3zZ43st9HDe3HjShgJOUNMiAc"
    );
    expect(pool2?.commission_rate).to.eql(0);
    expect(pool2?.power.toString()).to.eql("12008555200877");
    expect(pool2OperatorStake?.owner.toBase64url()).to.eql(
      "_G2mANINJZUIdukS6B3zZ43st9HDe3HjShgJOUNMiAc"
    );
    expect(pool2OperatorStake?.power.toString()).to.eql("10000000000000");

    const pool9 = poolsWithoutDelegator[9];
    expect(pool9?.operator_stake).to.be.instanceOf(Option);
    const pool9OperatorStake = pool9?.operator_stake?.value;

    expect(pool9?.operator.toBase64url()).to.eql(
      "ILDrzBVvVRqhLNGsE7eJJW7KA4vLU20fKWL8oZbS8Gs"
    );
    expect(pool9?.commission_rate).to.eql(0);
    expect(pool9?.power.toString()).to.eql("2686982446516657");
    expect(pool9OperatorStake?.owner.toBase64url()).to.eql(
      "ILDrzBVvVRqhLNGsE7eJJW7KA4vLU20fKWL8oZbS8Gs"
    );
    expect(pool9OperatorStake?.power.toString()).to.eql("10000000000000");

    expect(response.serialize().toString("base64")).to.eql(base64Payload);
  });

  it("should serde a DepositRequest", () => {
    const b64Payload =
      "AQAAAKCvCr3ftnFmJaEGjzZRrRt0OXVeiRSs1a1zgIQUbeYboK8Kvd+2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs=";

    const request: DepositsRequest = DepositsRequest.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    expect(request.stakes).to.be.instanceOf(Set);
    expect(request.stakes.size).to.eql(1);
    const [[addr1, addr2]] = request.stakes;
    expect(addr1.toBase64url()).to.eql(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    );
    expect(addr2.toBase64url()).to.eql(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    );
    expect(request.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a DepositResponse A", () => {
    const b64Payload =
      "AQAAAKCvCr3ftnFmJaEGjzZRrRt0OXVeiRSs1a1zgIQUbeYboK8Kvd+2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hsBoK8Kvd+2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs/Ho69RAkAAACBIW6nyq89ujRbZaMINrZu7rYJPZ43SbHb2VgCElvmGQ==";

    const response: DepositsResponse = DepositsResponse.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    const deposits = response.deposits;
    expect(deposits).to.be.instanceOf(Map);
    expect(deposits.size).to.eql(1);

    const ownerBytes = new PublicAddress(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    ).toBytes();

    for (const key of deposits.keys()) {
      expect(key[0]).to.be.instanceOf(PublicAddress);
      expect(key[0]).to.be.instanceOf(PublicAddress);
      expect(key[0].toBytes()).to.eql(ownerBytes);
      expect(key[1].toBytes()).to.eql(ownerBytes);
      const depositOpt = deposits.get(key);
      expect(depositOpt).to.be.instanceOf(Option);
      const deposit = depositOpt?.value;
      expect(deposit).to.be.instanceOf(Deposit);
      expect(deposit?.balance.toString()).to.eql("10190842633791");
      expect(deposit?.auto_stake_rewards).to.eql(false);

      expect(deposit?.owner).instanceOf(PublicAddress);
      expect(deposit?.owner.toBytes()).to.eql(ownerBytes);
    }
    expect(response.block_hash.toBase64url()).to.eql(
      "gSFup8qvPbo0W2WjCDa2bu62CT2eN0mx29lYAhJb5hk"
    );

    expect(response.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a DepositResponse B", () => {
    const b64Payload =
      "AQAAAKCvCr3ftnFmJaEGjzZRrRt0OXVeiRSs1a1zgIQUbeYboK8Kvd+2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hsBoK8Kvd+2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs/Ho69RAkAAADH3obaYteBoI1oAAFc0gJYeH8MffeSFKD9PtRrBMacaA==";

    const response: DepositsResponse = DepositsResponse.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    const deposits = response.deposits;
    expect(deposits).to.be.instanceOf(Map);
    expect(deposits.size).to.eql(1);

    const ownerBytes = new PublicAddress(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    ).toBytes();

    for (const key of deposits.keys()) {
      expect(key[0].toBytes()).to.eql(ownerBytes);
      expect(key[1].toBytes()).to.eql(ownerBytes);
      const depositOpt = deposits.get(key);
      expect(depositOpt).to.be.instanceOf(Option);
      const deposit = depositOpt?.value;
      expect(deposit).to.be.instanceOf(Deposit);
      expect(deposit?.balance.toString()).to.eql("10190842633791");
      expect(deposit?.auto_stake_rewards).to.eql(false);
      expect(deposit?.owner).instanceOf(PublicAddress);
      expect(deposit?.owner.toBytes()).to.eql(ownerBytes);
    }
    expect(response.block_hash.toBase64url()).to.eql(
      "x96G2mLXgaCNaAABXNICWHh_DH33khSg_T7UawTGnGg"
    );

    expect(response.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a PoolsRequest", () => {
    const b64Payload =
      "AgAAAKCvCr3ftnFmJaEGjzZRrRt0OXVeiRSs1a1zgIQUbeYbx7eiywH/8YVHQkSgjZk3EXdLU3FGo4VaV/6qi+hzOKIB";

    const request: PoolsRequest = PoolsRequest.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    expect(request.include_stakes).to.eql(true);
    expect(request.operators).to.be.instanceOf(Set);
    expect(request.operators.size).to.eql(2);
    expect([...request.operators][0].toBase64url()).to.eql(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    );
    expect([...request.operators][1].toBase64url()).to.eql(
      "x7eiywH_8YVHQkSgjZk3EXdLU3FGo4VaV_6qi-hzOKI"
    );
    expect(request.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a PoolsResponse A", () => {
    const b64Payload =
      "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";

    const response: PoolsResponse = PoolsResponse.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    expect(response.pools).to.be.instanceOf(Map);
    expect(response.pools.size).to.eql(2);

    const [entry1, entry2] = [...response.pools];
    const operator1Addr = "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs";
    expect(entry1[0]).to.be.instanceOf(PublicAddress);
    expect(entry1[0].toBase64url()).to.eql(operator1Addr);

    expect(entry1[1]).to.be.instanceOf(Option);

    const pool1 = entry1[1].value;
    expect(pool1).to.be.instanceOf(Pool);
    expect(pool1?.poolWithoutDelegator).to.eql(undefined);
    expect(pool1?.poolWithDelegator).to.be.instanceOf(PoolWithDelegator);

    // operator stake
    const operatorStake1 = pool1?.poolWithDelegator?.operator_stake?.value;
    expect(operatorStake1?.power.toString()).to.eql("10000000000000");
    expect(operatorStake1?.owner.toBase64url()).to.eql(operator1Addr);

    expect(pool1?.poolWithDelegator?.commission_rate).to.eql(0);
    expect(pool1?.poolWithDelegator?.power.toString()).to.eql("15519013676948");

    const delegated_stakes_one = pool1!.poolWithDelegator!.delegated_stakes;
    // delegator stake
    expect(delegated_stakes_one).to.be.instanceOf(Array);
    expect(delegated_stakes_one.length).to.eql(29);

    let found1 = false,
      found2 = false;
    for (const stake of delegated_stakes_one) {
      // selectively assert some of the delegator stakes
      if (
        stake.owner.toBase64url() ===
        "sIiENi_NZ06TJC0vUvxGETjfhOSdNtPLs_shU2Czjy4"
      ) {
        expect(stake.power.toString()).to.eql("14313189288");
        found1 = true;
      }
      if (
        stake.owner.toBase64url() ===
        "-qWFMLmlI9OPt_aih0WZgD2CrVczfI-a8V_Z-n8hmXQ"
      ) {
        expect(stake.power.toString()).to.eql("68400000000");
        found2 = true;
      }
    }
    expect(found1 && found2).to.eql(true);

    //
    // operator 2
    //
    const operator2Addr = "x7eiywH_8YVHQkSgjZk3EXdLU3FGo4VaV_6qi-hzOKI";
    expect(entry2[0]).to.be.instanceOf(PublicAddress);
    expect(entry2[0].toBase64url()).to.eql(operator2Addr);

    const pool2 = entry2[1]?.value;
    expect(pool2).to.be.instanceOf(Pool);
    expect(pool2?.poolWithoutDelegator).to.eql(undefined);
    expect(pool2?.poolWithDelegator).to.be.instanceOf(PoolWithDelegator);

    const operatorStake2 = pool2?.poolWithDelegator?.operator_stake?.value;
    expect(operatorStake2?.power.toString()).to.eql("10000000000000");
    expect(operatorStake2?.owner.toBase64url()).to.eql(operator2Addr);

    expect(pool2?.poolWithDelegator?.commission_rate).to.eql(0);
    expect(pool2?.poolWithDelegator?.power.toString()).to.eql("17721120893251");

    // delegator stakes
    const delegated_stakes_two = pool2!.poolWithDelegator!.delegated_stakes;
    expect(delegated_stakes_two).to.be.instanceOf(Array);
    expect(delegated_stakes_two.length).to.eql(38);

    let found3 = false,
      found4 = false;
    for (const stake of delegated_stakes_two) {
      // selectively assert some of the delegator stakes
      if (
        stake.owner.toBase64url() ===
        "wmiRwqEdHDuGgA6ef5QA-bUucV1TcZ8_YxfteBklaTo"
      ) {
        expect(stake.power.toString()).to.eql("4818489292375");
        found3 = true;
      }
      if (
        stake.owner.toBase64url() ===
        "hz9s4mwe1xWR2YDmpy4edWgjfMQneM64L1ykeEmFLsk"
      ) {
        expect(stake.power.toString()).to.eql("67683831776");
        found4 = true;
      }
    }
    expect(found3 && found4).to.eql(true);

    expect(response.block_hash.toBase64url()).to.eql(
      "0k57eFAwPBzOQkkfy9XuX4AFcp_KgkTERRodHduJv-E"
    );

    expect(response.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a StakesRequest", () => {
    const b64Payload =
      "AQAAAKCvCr3ftnFmJaEGjzZRrRt0OXVeiRSs1a1zgIQUbeYbsIiENi/NZ06TJC0vUvxGETjfhOSdNtPLs/shU2Czjy4=";

    const request: StakesRequest = StakesRequest.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    expect(request.stakes).to.be.instanceOf(Set);
    expect(request.stakes.size).to.eql(1);
    expect([...request.stakes][0][0].toBase64url()).to.eql(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    ); // operator
    expect([...request.stakes][0][1].toBase64url()).to.eql(
      "sIiENi_NZ06TJC0vUvxGETjfhOSdNtPLs_shU2Czjy4"
    ); // owner

    expect(request.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a StakesResponse", () => {
    const b64Payload =
      "AQAAAKCvCr3ftnFmJaEGjzZRrRt0OXVeiRSs1a1zgIQUbeYbsIiENi/NZ06TJC0vUvxGETjfhOSdNtPLs/shU2Czjy4BsIiENi/NZ06TJC0vUvxGETjfhOSdNtPLs/shU2Czjy6o7yFVAwAAAGA72Bbv5xw0HCwTsFmMSP1fsDh4Ey+3wdJ5ANFVZkZS";

    const response: StakesResponse = StakesResponse.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    expect(response.stakes).to.be.instanceOf(Map);
    expect(response.stakes.size).to.eql(1);
    expect([...response.stakes][0][0][0]).to.be.instanceOf(PublicAddress);
    expect([...response.stakes][0][0][0].toBase64url()).to.eql(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    );

    expect([...response.stakes][0][0][1]).to.be.instanceOf(PublicAddress);
    expect([...response.stakes][0][0][1].toBase64url()).to.eql(
      "sIiENi_NZ06TJC0vUvxGETjfhOSdNtPLs_shU2Czjy4"
    ); // owner

    expect([...response.stakes][0][1]).to.be.instanceOf(Option);
    const stake = [...response.stakes][0][1].value;
    expect(stake).to.be.instanceOf(Stake);
    expect(stake?.power.toString()).to.eql("14313189288");
    expect(stake?.owner.toBase64url()).to.eql(
      "sIiENi_NZ06TJC0vUvxGETjfhOSdNtPLs_shU2Czjy4"
    );

    expect(response.serialize().toString("base64")).to.eql(b64Payload);
  });
});
