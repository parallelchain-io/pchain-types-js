import { expect } from "chai";
import { MerkleTree } from "merkletreejs";

import { createHash } from "crypto";
import {
  MerkleProof,
  PublicAddress,
  Sha256Hash,
  StateProof,
  StateProofItem,
  StateProofItemType,
  StateProofNonce,
} from "../../src";

describe("Proofs", async () => {
  it("should serde a MerkleProof", () => {
    // note this is a dummy MerkleProof, update with a realistic on-chain proof if possible
    // const leaves = ["a", "b", "c"].map((x) => sha256(x));

    // build a dummy MerkleProof
    function sha256(data: string) {
      return createHash("sha256").update(Buffer.from(data, "utf-8")).digest();
    }

    const b64Payload =
      "cHUVLQOlzZIQSIe0doYneOwMh75cL6HAqQ+HxJ+tbv8DAAAAAAAAAAMAAAAAAAAAAQAAAAIAAAADAAAAypeBEsobvcr6wjGzmiPcTaeG7/gUfE5yuYB3ha/uSLs+I+gWADlZSjOJT2Vk4bE0i716AIjULErLc+6u1ZwAnS59LAOpUHriZez1tTVohaUzk6ICnSQTlJlyZaGiWu/GEgAAAKG43nLTm43nLaG43nLTm43nLQ==";

    const merkleProof: MerkleProof = MerkleProof.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    const leaves = merkleProof.leaf_hashes.map((l) => l.toBytes());
    const tree = new MerkleTree(leaves, sha256);

    expect(merkleProof.root_hash.toBase64url()).to.eql(
      "cHUVLQOlzZIQSIe0doYneOwMh75cL6HAqQ-HxJ-tbv8"
    );
    expect(tree.getRoot()).to.eql(merkleProof.root_hash.toBytes());
    expect(merkleProof.total_leaves_count.toNumber()).to.eql(leaves.length);
    expect(merkleProof.leaf_indices).to.eql([0, 1, 2]);

    const leaf = leaves[0];
    expect(tree.verify(tree.getProof(leaf), leaf, tree.getRoot())).to.eql(true);
    expect(merkleProof.serialize().toString("base64")).to.eql(b64Payload);
  });

  it("should serde a StateProof correctly", () => {
    // note this is a dummy StateProof,
    // update with a realistic on-chain proof if possible

    const b64Payload =
      "AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQGgrwq937ZxZiWhBo82Ua0bdDl1XokUrNWtc4CEFG3mGwAKAAAAAQEBAAAAAAAAAAMAAAAKAAAAAQEAAAAAAAAAAAoAAAABAAAAAAAAAAAACgAAAAEBAQAAAAAAAAA=";

    const stateProof: StateProof = StateProof.deserialize(
      Buffer.from(b64Payload, "base64")
    );

    expect(stateProof.root_hash).to.be.instanceOf(Sha256Hash);
    expect(stateProof.root_hash.toBase64url()).to.eql(
      "AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE"
    );

    expect(stateProof.address).to.be.instanceOf(PublicAddress);
    expect(stateProof.address.toBase64url()).to.eql(
      "oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"
    );

    expect(stateProof.proof).to.eql([
      new Uint8Array([1, 1, 0, 0, 0, 0, 0, 0, 0, 0]),
      new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      new Uint8Array([1, 1, 1, 0, 0, 0, 0, 0, 0, 0]),
    ]);

    expect(stateProof.item).to.be.instanceOf(StateProofItem);
    expect(stateProof.item.type).to.be.instanceOf(StateProofItemType);
    expect(stateProof.item.type.enum).to.eql("nonce");
    expect(stateProof.item.type.nonce).to.be.instanceOf(StateProofNonce);
    expect(stateProof.item.value).to.eql(
      new Uint8Array([1, 1, 1, 0, 0, 0, 0, 0, 0, 0])
    );

    expect(stateProof.serialize().toString("base64")).to.eql(b64Payload);
  });
});
