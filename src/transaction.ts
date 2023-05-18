import { ExtendedReader } from "./crypto/extended-reader";
import { ExtendedWriter } from "./crypto/extended-writer";
import { borshDeserialize, borshSerialize } from "./serde";
import { u32, u64 } from "./crypto/numbers";
import { PublicAddress } from "./crypto/public_address";
import { Sha256Hash } from "./crypto/sha256hash";
import { Signature } from "./crypto/signature";
import { ExitStatus } from "./exit_status";
import { base64ToBytes } from "./crypto/functions";
import { Keypair } from "./keypair";
import * as ed from '@noble/ed25519';
import { BN } from "bn.js";
import { bytesToBase64Url, generateSha256Hash } from "./crypto/functions";
import { TransactionCommand } from "./transaction_commands";

export type InputTransaction = {
    signer: PublicAddress;
    nonce: u64 | number;
    commands: (TransactionCommand)[];
    gas_limit?: u64 | number;
    max_base_fee_per_gas?: u64 | number;
    priority_fee_per_gas?: u64 | number;
    hash?: Sha256Hash;
    signature?: Signature;
}

export interface Transaction{
    commands: (TransactionCommand)[];
    signer: PublicAddress;
    hash: Sha256Hash;
    signature: Signature;
    nonce: u64 | number;
    gas_limit: u64 | number;
    max_base_fee_per_gas: u64 | number;
    priority_fee_per_gas: u64 | number;
    toSignedTx?: (keypair: Keypair) => Promise<SignedTx>
}

export interface SignedTx {
    commands: (TransactionCommand)[];
    signer: PublicAddress;
    hash: Sha256Hash;
    signature: Signature;
    nonce: u64 | number;
    gas_limit: u64 | number;
    max_base_fee_per_gas: u64 | number;
    priority_fee_per_gas: u64 | number;
}

export class Transaction {

    signer: PublicAddress;
    nonce: u64 | number;
    commands: (TransactionCommand)[];
    hash: Sha256Hash;
    signature: Signature;
    gas_limit: u64 | number;
    max_base_fee_per_gas: u64 | number;
    priority_fee_per_gas: u64 | number;

    constructor({commands, signer, priority_fee_per_gas, gas_limit, max_base_fee_per_gas, nonce, hash, signature}: InputTransaction){
        this.commands = commands;
        this.signer = signer;
        this.nonce = nonce;
        this.priority_fee_per_gas = priority_fee_per_gas ?? new BN(0);
        this.gas_limit = gas_limit ?? new BN(200000);
        this.max_base_fee_per_gas = max_base_fee_per_gas ?? new BN(0);
        this.hash = hash ?? new Sha256Hash(base64ToBytes('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='));
        this.signature = signature ?? new Signature(base64ToBytes('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='));

    }

    static schema = new Map([[Transaction, {kind:'struct', fields:[
        ['signer','PublicAddress'],
        ['nonce','u64'], 
        ['commands','Commands'], 
        ['gas_limit','u64'],
        ['max_base_fee_per_gas','u64'],
        ['priority_fee_per_gas','u64'],
        ['signature','signature'],
        ['hash','sha256Hash'],
    ]}]])

    serialize = () => {
        try {
            const buffer = borshSerialize(this, Transaction.schema, ExtendedWriter);
            return buffer;
        } catch (e: any) {
            throw Error(e);
        }
    }

    static deserialize = (buffer: Buffer) => {
        try {
            const deserializedTx = borshDeserialize(buffer, Transaction.schema, Transaction, ExtendedReader);
            return deserializedTx as Transaction;
        } catch (e: any) {
            throw Error(e);
        }
    }

    toSignedTx? = async (keypair: Keypair) => {
        try {
            const serialized_tx = this.serialize();
            const signedMessage = await ed.sign(serialized_tx, keypair.private_key.toBytes());
            let new_hash = this.hash;
            let new_signature = this.signature;
            if(this.signature.toBase64url() == 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'){
                new_signature = new Signature(Buffer.from(signedMessage));
            }
            if(this.hash.toBase64url() == 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'){
                new_hash = generateSha256Hash(signedMessage);
            }
            const signedTx = await createSignedTransaction({commands: this.commands, signer: this.signer, nonce: this.nonce, priority_fee_per_gas: this.priority_fee_per_gas, gas_limit: this.gas_limit, max_base_fee_per_gas: this.max_base_fee_per_gas, hash: new_hash, signature: new_signature, serialize: this.serialize}, keypair)
            return signedTx as SignedTx;
        } catch (e: any) {
            throw Error(e);
        }
    }
}

export class SignedTx {

    commands: (TransactionCommand)[];
    signer: PublicAddress;
    hash: Sha256Hash;
    signature: Signature;
    nonce: u64 | number;
    gas_limit: u64 | number;
    max_base_fee_per_gas: u64 | number;
    priority_fee_per_gas: u64 | number;

    constructor({commands, signer, priority_fee_per_gas, gas_limit, max_base_fee_per_gas, nonce, hash, signature}: Transaction){
        this.commands = commands;
        this.signer = signer;
        this.nonce = nonce;
        this.priority_fee_per_gas = priority_fee_per_gas
        this.gas_limit = gas_limit;
        this.max_base_fee_per_gas = max_base_fee_per_gas
        this.hash = hash ?? new Sha256Hash(base64ToBytes('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='));
        this.signature = signature ?? new Signature(base64ToBytes('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='));
    }

    static schema = new Map([[SignedTx, {kind:'struct', fields:[
        ['signer','PublicAddress'],
        ['nonce','u64'], 
        ['commands','Commands'], 
        ['gas_limit','u64'],
        ['max_base_fee_per_gas','u64'],
        ['priority_fee_per_gas','u64'],
        ['signature','signature'],
        ['hash','sha256Hash'],
    ]}]])

    serialize = () => {
        try {
            const buffer = borshSerialize(this, SignedTx.schema, ExtendedWriter);
            return buffer;
        } catch (e: any) {
            throw Error(e);
        }
    }

    toSignedTx? = async (keypair: Keypair) => {
        const serialized_tx = this.serialize();
        const signedMessage = await ed.sign(serialized_tx, keypair.private_key.toBytes());
        let new_hash = this.hash;
        let new_signature = this.signature;
        if(this.signature.toBase64url() == 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'){
            new_signature = new Signature(Buffer.from(signedMessage));
        }
        if(this.hash.toBase64url() == 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'){
            new_hash = generateSha256Hash(signedMessage);
        }
        const signedTx = await createSignedTransaction({commands: this.commands, signer: this.signer, nonce: this.nonce, priority_fee_per_gas: this.priority_fee_per_gas, gas_limit: this.gas_limit, max_base_fee_per_gas: this.max_base_fee_per_gas, hash: new_hash, signature: new_signature, serialize: this.serialize}, keypair)
        return signedTx as Readonly<SignedTx>;
    }
}

export interface CommandReceipt{
    exit_status: ExitStatus;
    gas_used: u64;
    return_values: string;
    logs: Log[];
}

export class CommandReceipt{
    exit_status: ExitStatus;
    gas_used: u64;
    return_values: string;
    logs: Log[];

    constructor({exit_status, gas_used, return_values, logs}: CommandReceipt){
        this.exit_status = exit_status;
        this.gas_used = gas_used;
        this.return_values = return_values;
        this.logs = logs;
    }

    static schema = new Map([[CommandReceipt, {kind:'struct', fields:[['exit_status','u8'],['gas_used','u64'], ['return_values','base64URL'], ['logs','Logs']]}]])

    serialize = () => {
        try {
            const buffer = borshSerialize(this, CommandReceipt.schema, ExtendedWriter);
            return buffer;
        } catch (e: any) {
            throw Error(e);
        }
    }

    static deserialize = (buffer: Buffer) => {
        try {
            const deserializedTx = borshDeserialize(buffer, CommandReceipt.schema, CommandReceipt, ExtendedReader);
            return deserializedTx as CommandReceipt;       
        } catch (e: any) {
            throw Error(e);
        }
    }
}

export class Receipt {
    command_receipts: CommandReceipt[];

    constructor({command_receipts}: Receipt){
        this.command_receipts = command_receipts;
    }

    static schema = new Map([[Receipt, {kind:'struct', fields:[['command_receipts','receipt']]}]])

    serialize = () => {
        try {
            const buffer = borshSerialize(this, Receipt.schema, ExtendedWriter);
            return buffer;
        } catch (e: any) {
            throw Error(e);
        }
    }

    static deserialize = (buffer: Buffer) => {
        try {
            const deserializedTx = borshDeserialize(buffer, Receipt.schema, Receipt, ExtendedReader);
            return deserializedTx as Receipt;       
        } catch (e: any) {
            throw Error(e);
        }
    }
}

export interface Log {
    topic: string;
    value: string;
}

export class Log{
    topic:string;
    value:string;

    constructor({topic,value}:Log){
        this.topic = topic;
        this.value = value;
    }

    static schema = new Map([[Log, {kind:'struct', fields:[['topic','base64URL'],['value','base64URL']]}]])

    serialize = () => {
        try {
            const buffer = borshSerialize(this, Log.schema, ExtendedWriter);
            return buffer;
        } catch(e: any) {
            throw Error(e);
        }
    }

    static deserialize = (buffer: Buffer) => {
        try {
            const deserializedTx = borshDeserialize(buffer, Log.schema, Log, ExtendedReader);
            return deserializedTx as Log;
        } catch (e: any) {
            throw Error(e);
        }
    }
}

const createSignedTransaction = async (transaction: Transaction, keypair: Keypair) => {
    try {
        const tx = new Transaction({...transaction, hash: new Sha256Hash(base64ToBytes('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=')), signature: new Signature(base64ToBytes('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='))});
        const serialized_tx = tx.serialize();
        const isHashCorrect = checkHash(transaction.signature, transaction.hash);
        const isSignatureCorrect = await checkSignature(serialized_tx, transaction.signature, keypair);
        if(!isHashCorrect || !isSignatureCorrect){
            console.warn('Incorrect Transaction Hash or Signature');
        }
        let signed_tx: Readonly<SignedTx> = new SignedTx(transaction);
        return signed_tx;
    } catch (e: any) {
        throw Error(e);

    }
}

const checkHash = (signature: Signature, hash: Sha256Hash) => {
    try {
        const hash_correct = generateSha256Hash(signature.toBytes());
        if(hash_correct.toBase64url() == hash.toBase64url()){
            return true;
        }
        else{
            return false;
        }
    } catch (e: any) {
        throw Error(e);
    }
}

const checkSignature = async (serialized_tx: Uint8Array, signature: Signature, keypair: Keypair) => {
    try {
        const signature_correct = await ed.sign(serialized_tx, keypair.private_key.toBytes());
        if(bytesToBase64Url(signature_correct) == signature.toBase64url()){
            return true;
        }
        else{
            return false;
        }
    } catch (e: any) {
        throw Error(e);
    }
}