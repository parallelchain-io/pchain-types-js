import { PublicAddress } from "./ed_keys";
import { Sha256Hash } from "../hash/sha256hash";
import { Signature } from "./signature";
import { ExitStatus, TypeCtorParams, u64 } from "../constants";
import { base64ToBytes } from "../helpers";
import { Keypair } from "../cryptography";
import * as ed from "@noble/ed25519";
import { BN } from "bn.js";
import { Command } from "./transaction_commands";
import { Serializable } from "../serde/serializable";
import { generateSha256Hash } from "../hash";

export class Transaction extends Serializable {
  signer: PublicAddress;
  nonce: u64 | number;
  commands: Command[];
  gas_limit: u64 | number;
  max_base_fee_per_gas: u64 | number;
  priority_fee_per_gas: u64 | number;
  signature: Signature;
  hash: Sha256Hash;

  constructor({
    signer,
    nonce,
    commands,
    hash = new Sha256Hash(
      base64ToBytes("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=")
    ),
    signature = new Signature(
      base64ToBytes(
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
      )
    ),
    gas_limit = new BN(200000), // default to cover a basic Transfer transaction
    priority_fee_per_gas = new BN(0),
    max_base_fee_per_gas = new BN(0),
  }: {
    signer: PublicAddress;
    nonce: u64 | number;
    commands: Command[];
    hash?: Sha256Hash;
    signature?: Signature;
    gas_limit?: u64 | number;
    max_base_fee_per_gas?: u64 | number;
    priority_fee_per_gas?: u64 | number;
  }) {
    super();
    this.commands = commands;
    this.signer = signer;
    this.nonce = nonce;
    this.priority_fee_per_gas = priority_fee_per_gas;
    this.gas_limit = gas_limit;
    this.max_base_fee_per_gas = max_base_fee_per_gas;
    this.hash = hash;
    this.signature = signature;
  }

  async toSignedTx(keypair: Keypair) {
    const serialized_tx = this.serialize();
    const signedMessage = await ed.sign(
      serialized_tx,
      keypair.private_key.toBytes()
    );
    let new_hash = this.hash;
    let new_signature = this.signature;
    if (
      this.signature.toBase64url() ==
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    ) {
      new_signature = new Signature(Buffer.from(signedMessage));
    }
    if (
      this.hash.toBase64url() == "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    ) {
      new_hash = generateSha256Hash(signedMessage);
    }
    const signedTx = new SignedTx({
      commands: this.commands,
      signer: this.signer,
      nonce: this.nonce,
      priority_fee_per_gas: this.priority_fee_per_gas,
      gas_limit: this.gas_limit,
      max_base_fee_per_gas: this.max_base_fee_per_gas,
      hash: new_hash,
      signature: new_signature,
    });
    return signedTx;
  }
}

export class SignedTx extends Transaction {
  constructor(transactionParams: TypeCtorParams<Transaction>) {
    super(transactionParams);
  }

  // verify signature using public key
  async verifySignature(keypair: Keypair): Promise<boolean> {
    const tx = new Transaction({
      ...this,
      hash: new Sha256Hash(
        base64ToBytes("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=")
      ),
      signature: new Signature(
        base64ToBytes(
          "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
        )
      ),
    });
    const serialized_tx = tx.serialize();
    const isHashCorrect = checkHash(this.signature, this.hash);
    const isSignatureCorrect = await checkSignature(
      serialized_tx,
      this.signature,
      keypair
    );
    return isHashCorrect && isSignatureCorrect;
  }
}

export class Receipt extends Serializable {
  command_receipts: CommandReceipt[];
  constructor({ command_receipts }: TypeCtorParams<Receipt>) {
    super();
    this.command_receipts = command_receipts;
  }
}

export class CommandReceipt extends Serializable {
  exit_status: ExitStatus;
  gas_used: u64;
  return_values: Uint8Array;
  logs: Log[];

  constructor({
    exit_status,
    gas_used,
    return_values,
    logs,
  }: TypeCtorParams<CommandReceipt>) {
    super();
    this.exit_status = exit_status;
    this.gas_used = gas_used;
    this.return_values = return_values;
    this.logs = logs;
  }
}

export class Log extends Serializable {
  topic: Uint8Array;
  value: Uint8Array;

  constructor({ topic, value }: TypeCtorParams<Log>) {
    super();
    this.topic = topic;
    this.value = value;
  }
}

const checkHash = (signature: Signature, hash: Sha256Hash) => {
  const hash_correct = generateSha256Hash(signature.toBytes());
  return hash_correct.toBase64url() === hash.toBase64url();
};

const checkSignature = async (
  serialized_tx: Uint8Array,
  signature: Signature,
  keypair: Keypair
): Promise<boolean> => {
  return ed.verify(
    signature.toBytes(),
    serialized_tx,
    keypair.public_key.toBytes()
  );
};
