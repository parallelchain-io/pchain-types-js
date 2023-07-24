import { Sha256Hash } from "../hash/sha256hash";
import { PublicAddress } from "./ed_keys";
import { Serializable } from "../serde/serializable";
import { Enum } from "../constants/enum_type";
import { TypeCtorParams, u32, u64 } from "../constants";

export class MerkleProof extends Serializable {
  root_hash: Sha256Hash;
  total_leaves_count: u64;
  leaf_indices: u32[];
  leaf_hashes: Sha256Hash[];
  proof: string;

  constructor({
    root_hash,
    total_leaves_count,
    leaf_indices,
    leaf_hashes,
    proof,
  }: TypeCtorParams<MerkleProof>) {
    super();
    this.root_hash = root_hash;
    this.total_leaves_count = total_leaves_count;
    this.leaf_indices = leaf_indices;
    this.leaf_hashes = leaf_hashes;
    this.proof = proof;
  }
}

export class StateProofItemType extends Enum {
  nonce?: StateProofNonce;
  balance?: StateProofBalance;
  code?: StateProofCode;
  cbiVersion?: StateProofCbiVersion;
  storage?: StateProofStorage;
}

export class StateProofNonce extends Serializable {
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  private static index = 0;
}

export class StateProofBalance extends Serializable {
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  private static index = 1;
}

export class StateProofCode extends Serializable {
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  private static index = 2;
}

export class StateProofCbiVersion extends Serializable {
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  private static index = 3;
}

export class StateProofStorage extends Serializable {
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  private static index = 4;
  storageHash: Sha256Hash;
  value: Uint8Array;

  constructor({ storageHash, value }: StateProofStorage) {
    super();
    this.storageHash = storageHash;
    this.value = value;
  }
}

export class StateProofItem extends Serializable {
  type: StateProofItemType;
  value: Uint8Array;

  constructor({ type, value }: TypeCtorParams<StateProofItem>) {
    super();
    this.type = type;
    this.value = value;
  }
}

export class StateProof extends Serializable {
  root_hash: Sha256Hash;
  item: StateProofItem;
  address: PublicAddress;
  proof: Uint8Array[];

  constructor({ root_hash, item, address, proof }: TypeCtorParams<StateProof>) {
    super();
    this.root_hash = root_hash;
    this.item = item;
    this.address = address;
    this.proof = proof;
  }
}
