import * as borsh from 'borsh';
import { bytesToBase64Url } from './functions';
import { Block, BlockHeader } from '../block';
import { Commit, Generic, Precommit, Prepare, QuorumCertificate } from '../hotstuff/quorum-certificate';
import { Log, Transaction, CommandReceipt } from '../transaction';
import { Signature } from './signature';
import { SignatureSet } from './signature-set';
import { Sha256Hash } from './sha256hash';
import { PublicAddress } from './public_address';
import { BloomFilter } from './bloomFilter';
import { Storage } from '../proofs';
import { Command } from '../transaction_commands';
import { Vote } from './vote';
import { Account, AccountWithContract, AccountWithoutContract, PoolWithDelegator, PoolWithoutDelegator, Deposit, PoolsWithDelegator, PoolsWithoutDelegator, Pool, ValidatorSet } from "../rpc";
import { Stake } from '../stake';
import { Option } from './option';

export class ExtendedReader extends borsh.BinaryReader{
    readOption<T>(callbackfn: ()=>T ) {
        const exists = this.readU8();
        if (exists != 0) {
            return callbackfn();
        } else {
            return null;
        }
    } 

    readOptionU8(){
        return this.readOption(()=>{
            return this.readU8();
        });
    }

    readOptionU32() {
        return this.readOption(()=>{
            return this.readU32();
        });
    }

    readOptionU64(){
        return this.readOption(()=>{
            return this.readU64();
        });
    }

    readOptionSha256Hash() {
        return this.readOption(()=>{
            return this.readSha256Hash();
        });
    }

    readOptionVector() {
        return this.readOption(()=>{
            return Buffer.from(this.readVector());
        });
    }

    readOptionOptionVector() {
        return this.readOption(()=>{
            return new Option<Buffer>({value: this.readOptionVector()});
        });
    }

    /* --------------------------------BLOCK--------------------------------------*/
    /**
    * Read @type {BlockHeader} from a stream of bytes
    * FINAL
    */
    readBlockHeader(): BlockHeader{
        // Get slice of bytes corresponding to block_header
        const blockheader_buf = this.buf.slice(this.offset, this.offset + this.buf.length);
        // Deserialize blockHeader without checking length
        const deserializedBlockHeader = BlockHeader.deserialize(Buffer.from(blockheader_buf));
        // Reserialize blockHeader
        const serialize_blockheader = deserializedBlockHeader.serialize();
        // Get length of Block Header byteArray
        this.offset += serialize_blockheader.length;
        // Return Block Header;
        return deserializedBlockHeader as BlockHeader
    }

    readOptionBlockHeader() {
        return this.readOption(()=>{
            return this.readBlockHeader();
        });
    }

    /**
    * Returns an object of @type {Pchain.Transaction[]} from a byteArray
    * FINAL
    */
    readTransactions(){
        let num_transactions = this.readU32();
        let transactions = [];
        for (let index = 0; index < num_transactions; index++) {
            const deserialized_tx = this.readTransaction();
            transactions.push(deserialized_tx);
        }
        return transactions as Transaction[];
    }

    // PENDING
    readTransaction(){
        const tx_buf = this.buf.slice(this.offset, this.offset + this.buf.length);
        const deserialized_tx = Transaction.deserialize(Buffer.from(tx_buf));
        // @ts-ignore
        const serialize_tx = deserialized_tx.serialize();
        this.offset += serialize_tx.length;
        return deserialized_tx as Transaction
    }

    readOptionTransaction() {
        return this.readOption(()=>{
            return this.readTransaction();
        });
    }

    readOptionBlock() {
        return this.readOption(()=>{
           return this.readBlock();
        });
    }

    readBlock() {
        const blk_buf = this.buf.slice(this.offset, this.offset + this.buf.length);
        const deserialized = Block.deserialize(Buffer.from(blk_buf)) as Block;
        this.offset += deserialized.serialize().length;
        return deserialized;
    }

    /**
    * Returns an object of @type {(typeof Pchain.Command)[]} from a byteArray
    * FINAL
    */
    readCommands(){
        let commands_length = this.readU32();
        let commands = [];
        for (let index = 0; index < commands_length; index++) {
            const command = this.readCommand();
            commands.push(command);
        }
        return commands;
    }

    // PENDING
    readCommand() {
        const command_enum = this.readU8();
        const command_serialized = this.buf.slice(this.offset, this.buf.byteLength);
        let command;
        switch(command_enum){
            case 0: 
                command = Command.Transfer.deserialize(command_serialized);
                break;
            case 1:
                command = Command.Deploy.deserialize(command_serialized);
                break;
            case 2:
                command = Command.Call.deserialize(command_serialized);
                break;
            case 3:
                command = Command.CreatePool.deserialize(command_serialized);
                break;
            case 4:
                command = Command.SetPoolSettings.deserialize(command_serialized);
                break;
            case 5:
                command = Command.DeletePool.deserialize(command_serialized);
                break;
            case 6:
                command = Command.CreateDeposit.deserialize(command_serialized);
                break;
            case 7:
                command = Command.SetDepositSettings.deserialize(command_serialized);
                break;
            case 8:
                command = Command.TopUpDeposit.deserialize(command_serialized);
                break;
            case 9:
                command = Command.WithdrawDeposit.deserialize(command_serialized);
                break;
            case 10:
                command = Command.StakeDeposit.deserialize(command_serialized);
                break;
            case 11:
                command = Command.UnstakeDeposit.deserialize(command_serialized);
                break;
            case 12:
                command = Command.NextEpoch.deserialize(command_serialized);
                break;
        }
        const serialized_command = command?.serialize();
        this.offset += serialized_command?.byteLength ?? 0;
        return command;
    }

    /**
    * Returns an object of @type {QuorumCertificate} from a byteArray
    * FINAL
    */
    readQuorumCertificate(){
        const qc_buf = this.buf.slice(this.offset, this.offset + this.buf.length);
        const qc = QuorumCertificate.deserialize(Buffer.from(qc_buf)) as QuorumCertificate;
        this.offset += qc.serialize().length;
        return qc;
    }

    /**
     * Returns an object of @type {string} from a byteArray
     * FINAL
    */
    readSignature(){
        return new Signature(Buffer.from(this.readFixedArray(64)));
    }

    /**
    * Returns an object of @type {Pchain.SignatureSet} from a byteArray
    * FINAL
    */
    readSignatureSet(){
        const sigset_buf = this.buf.slice(this.offset, this.offset + this.buf.length);
        const signature_set = SignatureSet.deserialize(Buffer.from(sigset_buf)) as SignatureSet;
        this.offset += signature_set.serialize().length;
        return signature_set;
    }

    /**
    * Returns an object of @type {Pchain.Signature[]} from a byteArray
    * PENDING TEST
    */
    readSignatures(){
        const num_signatures = this.readU32();
        let signatures: (Signature | null)[] = [];
        for (let index = 0; index < num_signatures; index++) {
            const exists = this.readU8();
            if(exists){
                const signature = this.readSignature();
                signatures.push(signature);
            }
            else{
                signatures.push(null);
            }
        }
        return signatures as Signature[];
    }

    /**
    * Returns an object of @type {Pchain.Vote}
    * PENDING TEST
    */
    readVote(){
        let app_id = this.readU64();
        let view_number = this.readU64();
        let block_hash = this.readSha256Hash();
        let phase = this.readPhase();
        let signature = this.readSignature();
        return new Vote(app_id, view_number, block_hash, phase, signature);
    }

    readPhase = () => {
        let phase = this.readU8();
        let view = null;
        switch (phase) {
            case Prepare.index:
                return new Prepare();
            case Generic.index:
                return new Generic();
            case Precommit.index:
                view = this.readU64()
                return new Precommit({view});
            case Commit.index:
                view = this.readU64()
                return new Commit({view});
        }
        throw Error('Invalid Phase')
    }

    // FINAL
    readReceipts() {
        let num_receipts = this.readU32();
        let receipts = [];
        for (let index = 0; index < num_receipts; index++) {
            receipts.push(this.readReceipt());
        }
        return receipts as CommandReceipt[][]
    }
    
    /**
    * Returns an object of @type {CommandReceipt[]} from a byteArray
    * PENDING TEST
    */
    readReceipt() {
        let num_command_receipts = this.readU32();
        let receipts = [];
        for (let index = 0; index < num_command_receipts; index++) {
            receipts.push(this.readCommandReceipt());
        }
        return receipts as CommandReceipt[]
    }

    readOptionReceipt() {
        return this.readOption(()=>{
            return this.readReceipt();
        });
    }

    /**
    * Returns an object of @type {CommandReceipt} from a byteArray
    * PENDING
    */
    readCommandReceipt(){
        const receipt_buf = this.buf.slice(this.offset, this.offset + this.buf.length);
        const deserialized_receipt = CommandReceipt.deserialize(Buffer.from(receipt_buf)) as CommandReceipt;
        // @ts-ignore
        this.offset += deserialized_receipt.serialize().length;
        return deserialized_receipt as CommandReceipt;
    }

    /**
    * Returns an object of @type {Log} from a byteArray
    * PENDING
    */
    readLogs(){
        let num_logs = this.readU32();
        let logs = [];
        for (let index = 0; index < num_logs; index++) {
            const log_buf = this.buf.slice(this.offset, this.offset + this.buf.length);
            const log = Log.deserialize(Buffer.from(log_buf));
            // @ts-ignore
            const serialize_log = log.serialize();
            this.offset += serialize_log.length;
            logs.push(log);
        }
        return logs;
    }

    /**
    * Returns a Base64URL encoded string from a byteArray
    * FINAL
    */
    readBase64URL(){
        const string_length = this.readU32();
        const stringArray = this.readFixedArray(string_length);
        return bytesToBase64Url(Buffer.from(stringArray));
    }

    readOptionBase64URL(){
        return this.readOption(()=>{
            const string_length = this.readU32();
            const stringArray = this.readFixedArray(string_length);
            return bytesToBase64Url(Buffer.from(stringArray));
        });
    }

    /**
    *  Returns a list of Arguments or null
    *  FINAL
    */
    readOptionArgs() {
        return this.readOption(()=>{
            return this.readVectorOfVector();
        });
    }

    /**
    * Returns a Sha256Hash string
    * FINAL
    */
    readSha256Hash(){
        const hashBuffer = this.readFixedArray(32);
        return new Sha256Hash(Buffer.from(hashBuffer));
    }

    // FINAL
    readBloomFilter(){
        const filter = this.readFixedArray(256);
        return new BloomFilter(Buffer.from(filter));
    }

    /**
    * Returns a list of Sha256Hashes from a byteArray
    * FINAL
    */
    readVectorSha256Hash = () => {
        const num_hashes = this.readU32();
        let hashes = [];
        for (let index = 0; index < num_hashes; index++) {
            const hash = this.readSha256Hash();
            hashes.push(hash);
        }
        return hashes;
    }

    // FINAL
    readPublicAddress = () => {
        const address = this.readFixedArray(32);
        return new PublicAddress(Buffer.from(address));
    }

    readSetAddress = () => {
        const num_addresses = this.readU32();
        let addresses = new Set<PublicAddress>();
        for (let index = 0; index < num_addresses; index++) {
            addresses.add(this.readPublicAddress());
        }
        return addresses;
    }

    readMapAddressToKeys = () => {
        const num_items = this.readU32();        
        let map = new Map<PublicAddress, Set<Uint8Array>>();
        for (let index = 0; index < num_items; index++) {
            let address = new PublicAddress(this.readBytes32());

            let set = new Set<Uint8Array>();
            this.readVectorOfVector().forEach((k)=>{ // HashSet is a sorted Vector
                set.add(k);
            });

            map.set(address, set);
        }
        return map;
    }

    readMapAddressToAccounts = () => {
        const num_items = this.readU32();
        let map = new Map<PublicAddress, Account>();
        for (let index = 0; index < num_items; index++) {
            let address = this.readBytes32();
            let account_type = this.readU8();
            const acc_buf = this.buf.slice(this.offset, this.offset + this.buf.length);
            if (account_type == AccountWithContract.index) {
                const acc = AccountWithContract.deserialize(Buffer.from(acc_buf)) as AccountWithContract;
                this.offset +=  acc.serialize().length;
                map.set(new PublicAddress(address), acc);
            } else if (account_type == AccountWithoutContract.index) {
                const acc = AccountWithoutContract.deserialize(Buffer.from(acc_buf)) as AccountWithoutContract;
                this.offset +=  acc.serialize().length;
                map.set(new PublicAddress(address), acc);
            } else {
                throw Error('Invalid Account type')
            }
        }
        return map;
    }

    readTuples = () => {
        const num_items = this.readU32();
        let map = new Map<Uint8Array, Uint8Array>();
        for (let index = 0; index < num_items; index++) {
            let k = this.readVector();
            let v = this.readVector();
            map.set(k, v);
        }
        return map
    }

    readMapAddressToTuples = () => {
        const num_items = this.readU32();
        let map = new Map<PublicAddress, Map<Uint8Array, Uint8Array>>();
        for (let index = 0; index < num_items; index++) {
            let address = this.readPublicAddress();
            let tuples = this.readTuples();
            map.set(address, tuples);
        }
        return map
    }

    readSetAddresses = () => {
        const num_items = this.readU32();
        let map = new Set<[PublicAddress, PublicAddress]>();
        for (let index = 0; index < num_items; index++) {
            let addr_1 = this.readPublicAddress();
            let addr_2 = this.readPublicAddress();
            map.add([addr_1, addr_2]);
        }
        return map
    }

    readStake = () => {
        const buf = this.buf.slice(this.offset, this.offset + this.buf.length);
        const deserialized = Stake.deserialize(Buffer.from(buf));
        this.offset += deserialized.serialize().length;
        return deserialized as Stake;
    }

    readOptionStake = () => {
        return this.readOption(()=>{
            return this.readStake();
        });
    }

    readStakes = () => {
        const num_items = this.readU32();
        let map = [];
        for (let index = 0; index < num_items; index++) {
            let stake = this.readStake();
            map.push(stake);
        }
        return map
    }

    readDeposit = () => {
        const buf = this.buf.slice(this.offset, this.offset + this.buf.length);
        const deserialized = Deposit.deserialize(Buffer.from(buf));
        this.offset += deserialized.serialize().length;
        return deserialized as Deposit;
    }

    readOptionDeposit = () => {
        return this.readOption(()=>{
            return this.readDeposit();
        });
    }

    readPool = () => {
        let type = this.readU8();
        if (type == PoolWithDelegator.index) {
            return this.readPoolWithDelegator();
        } else if (type == PoolWithoutDelegator.index) {
            return this.readPoolWithoutDelegator();
        } else {
            throw Error('Invalid Pool type')
        }
    }

    readOptionPool = () => {
        return this.readOption(()=>{
            return this.readPool(); 
        });
    }

    readPoolWithDelegator = () => {
        const buf = this.buf.slice(this.offset, this.offset + this.buf.length);
        const deserialized = PoolWithDelegator.deserialize(Buffer.from(buf)) as PoolWithDelegator;
        this.offset +=  deserialized.serialize().length;
        return deserialized;
    }

    readPoolsWithDelegator = () => {
        const num_items = this.readU32();
        const pools = [] as PoolWithDelegator[];
        for (let index = 0; index < num_items; index++) {
            let pool = this.readPoolWithDelegator();
            pools.push(pool);
        }
        return new PoolsWithDelegator({pools} as PoolsWithDelegator);
    }

    readPoolWithoutDelegator = () => {
        const buf = this.buf.slice(this.offset, this.offset + this.buf.length);
        const deserialized = PoolWithoutDelegator.deserialize(Buffer.from(buf)) as PoolWithoutDelegator;
        this.offset +=  deserialized.serialize().length;
        return deserialized;
    }

    readPoolsWithoutDelegator = () => {
        const num_items = this.readU32();
        const pools = [];
        for (let index = 0; index < num_items; index++) {
            let pool = this.readPoolWithoutDelegator();
            pools.push(pool);
        }
        return new PoolsWithoutDelegator({pools} as PoolsWithoutDelegator);
    }

    readValidatorSet = () => {
        const validator_set_type = this.readU8();
        if (validator_set_type == PoolsWithDelegator.index) {
            return this.readPoolsWithDelegator();
        } else if (validator_set_type == PoolsWithoutDelegator.index) {
            return this.readPoolsWithoutDelegator();
        } else {
            throw Error('Invalid Validator Set type')
        }
    }

    readOptionValidatorSet = () => {
        return this.readOption(()=>{
            return this.readValidatorSet();
        });
    }

    readOptionOptionValidatorSet = () => {
        return this.readOption(()=>{
            let validator_set = this.readOptionValidatorSet();
            return new Option<ValidatorSet>({value: validator_set});
        });
    }

    readMapAddressToPool = () => {
        const num_items = this.readU32();
        let map = new Map<PublicAddress, Option<Pool>>();
        for (let index = 0; index < num_items; index++) {
            let operator = this.readPublicAddress();
            let pool = this.readOptionPool();
            map.set(operator, new Option<Pool>({value: pool}));
        }
        return map
    }

    readMapAddressesToDeposit = () => {
        const num_items = this.readU32();
        let map = new Map<[PublicAddress, PublicAddress], Option<Deposit>>();
        for (let index = 0; index < num_items; index++) {
            let addr_1 = this.readPublicAddress();
            let addr_2 = this.readPublicAddress();
            let deposit = this.readOptionDeposit();
            map.set([addr_1, addr_2], new Option<Deposit>({value: deposit}));
        }
        return map
    }

    readMapAddressesToStake = () => {
        const num_items = this.readU32();
        let map = new Map<[PublicAddress, PublicAddress], Option<Stake>>();
        for (let index = 0; index < num_items; index++) {
            let addr_1 = this.readPublicAddress();
            let addr_2 = this.readPublicAddress();
            let stake = this.readOptionStake();
            map.set([addr_1, addr_2], new Option<Stake>({value: stake}));
        }
        return map
    }

    /**
    * Returns a list of base64url encoded strings from a byteArray
    * FINAL
    */
    readVectorOfBase64 = () => {
        const num_items = this.readU32();
        const items = [];
        for (let index = 0; index < num_items; index++) {
            const base64String = this.readBase64URL();
            items.push(base64String);
        }
        return items;
    }

    /**
    * Returns a list of byteArray from a byteArray
    * FINAL
    */
    readVectorOfVector = () => {
        const num_items = this.readU32();
        const items = [];
        for (let index = 0; index < num_items; index++) {
            const byteArray = this.readVector();
            items.push(byteArray);
        }
        return items;
    }

    // FINAL
    readVector = () => {
        const byteArraySize = this.readU32();
        const byteArray = this.readFixedArray(byteArraySize);
        return byteArray;
    }

    /**
    * Returns a list of State Proof Items from a byteArray
    * FINAL
    */
    readVectorStateProofItems = () => {
        const num_items = this.readU32();
        let stateProofItems: any[] = [];
        for (let index = 0; index < num_items; index++) {
            const stateProofItem = this.readStateProofItem();
            stateProofItems.push(stateProofItem);
        }
        return stateProofItems;
    }

    /**
    * Returns a State Proof Item from a byteArray
    * FINAL
    */
    readStateProofItem = () => {
        let stateProofItem:any[] = [];
        const spiType = this.readU8();
        let spi1Length = 0;
        let spi1 = null;
        switch(spiType){
            case 0:
                stateProofItem.push(0)
                spi1Length = this.readU32();
                spi1 = this.readFixedArray(spi1Length)
                stateProofItem.push(spi1)
                break;
            case 1:
                stateProofItem.push(1)
                spi1Length = this.readU32();
                spi1 = this.readFixedArray(spi1Length)
                stateProofItem.push(spi1)
                break;
            case 2:
                stateProofItem.push(2)
                spi1Length = this.readU32();
                spi1 = this.readFixedArray(spi1Length)
                stateProofItem.push(spi1)
                break;
            case 3:
                stateProofItem.push(3)
                spi1Length = this.readU32();
                spi1 = this.readFixedArray(spi1Length)
                stateProofItem.push(spi1)
                break;
            case 4:
                const storageHash = new Sha256Hash(Buffer.from(this.readFixedArray(32)));
                const storageItemsLength = this.readU32();
                const storage = new Storage(storageHash, this.readFixedArray(storageItemsLength));
                stateProofItem.push(storage)
                spi1Length = this.readU32();
                spi1 = this.readFixedArray(spi1Length)
                stateProofItem.push(spi1)
                break;
            default:
                stateProofItem.push([]);
        }
        return stateProofItem
    }

    /**
    * FINAl
    * Returns a vector of BigNumbers from a byteArray
    ** [1,0,0,0,,1,0,0,0,0,0,0,0] -> [BN(1)]
    ** [2,0,0,0,,1,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0] -> [BN(1), BN(22)]
    */
    readVectorU64(){
        const itemsLength = this.readU32();
        let items:any[] = [];
        for (let index = 0; index < itemsLength; index++) {
            const item = this.readU64();
            items.push(item);
        }
        return items;
    }

    readVectorU32(){
        const itemsLength = this.readU32();
        let items:any[] = [];
        for (let index = 0; index < itemsLength; index++) {
            const item = this.readU32();
            items.push(item);
        }
        return items;
    }

    readBytes64(){
        const bytes64 = this.readFixedArray(64);
        return Buffer.from(bytes64);
    }

    readBytes32(){
        const bytes32 = this.readFixedArray(32);
        return Buffer.from(bytes32);
    }

    readBoolean(){
        const bool = this.readU8();
        if(bool == 0){
            return false;
        }
        return true;
    }
}
