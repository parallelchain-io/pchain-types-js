import * as borsh from 'borsh';
import { base64ToBytes } from './functions';
import { Block, BlockHeader } from '../block';
import { Commit, Generic, Phase, Precommit, Prepare, QuorumCertificate } from '../hotstuff/quorum-certificate';
import { Log, Transaction, CommandReceipt } from '../transaction';
import { Signature } from './signature';
import { Vote } from './vote';
import { SignatureSet } from './signature-set';
import { Sha256Hash } from './sha256hash';
import { PublicAddress } from './public_address';
import { BloomFilter } from './bloomFilter';
import { StateProofItem, Storage } from '../proofs';
import BN from 'bn.js';
import { Command } from '../transaction_commands';
import { ValidatorSet, Pool, Deposit, PoolsWithDelegator, PoolsWithoutDelegator, Account } from "../rpc";
import { Stake } from '../stake';
import { Option } from './option';

export class ExtendedWriter extends borsh.BinaryWriter{
    writeOption<T>(v: T | null, callbackfn: (to_write: T)=>void) {
        if (v != null) {
            this.writeU8(1);
            callbackfn(v);
        } else {
            this.writeU8(0);
        }
    }

    writeOptionU8(number: number | null) {
        this.writeOption(number, (to_write)=>{
            this.writeU8(to_write);
        });
    }

    writeOptionU32(number: number | null) {
        this.writeOption(number, (to_write)=>{
            this.writeU32(to_write);
        });
    }

    writeOptionU64(number: BN | null | number){
        this.writeOption(number, (to_write)=>{
            this.writeU64(to_write);
        });
    }

    writeOptionSha256Hash(hash: Sha256Hash | null) {
        this.writeOption(hash, (to_write)=>{
            this.writeSha256Hash(to_write);
        });
    }

    writeOptionVector(vector: Buffer | null) {
        this.writeOption(vector, (to_write)=>{
            this.writeVector(new Uint8Array(to_write));
        });
    }

    writeOptionOptionVector(vector: Option<Buffer> | null) {
        this.writeOption(vector, (to_write)=>{
            this.writeOptionVector(to_write.value);
        });
    }

    writeOptionArgs(args: Buffer[] | null){
        this.writeOption(args, (to_write)=>{
            this.writeVectorOfVector(to_write);
        });
    }

    writeBlockHeader(blockHeader: BlockHeader): void{
        const serializedBlockHeader = blockHeader.serialize();
        this.writeFixedArray(serializedBlockHeader);
    }

    writeOptionBlockHeader(blockHeader: BlockHeader | null): void {
        this.writeOption(blockHeader, (to_write)=>{
            this.writeBlockHeader(to_write);
        });
    }

    writeTransactions(transactions: Transaction[]): void{
        this.writeU32(transactions.length);
        transactions.forEach((txn: Transaction)=> {
           this.writeTransaction(txn);
        })
    }

    writeTransaction(transaction: Transaction){
        const serializedTX = transaction.serialize();
        this.writeFixedArray(serializedTX);
    }

    writeOptionTransaction(transaction: Transaction | null) {
        this.writeOption(transaction, (to_write)=>{
            this.writeTransaction(to_write);
        });
    }

    writeOptionBlock(block: Block | null): void {
        this.writeOption(block, (to_write)=>{
            this.writeBlock(to_write);
        });
    }

    writeBlock(block: Block): void {
        const serialized = block.serialize();
        this.writeFixedArray(serialized);
    }

    writeCommands(commands: (Command.Transfer | Command.Deploy | Command.Call | Command.CreatePool | Command.SetPoolSettings | Command.DeletePool | Command.CreateDeposit | Command.SetDepositSettings | Command.TopUpDeposit | Command.WithdrawDeposit | Command.StakeDeposit | Command.UnstakeDeposit | Command.NextEpoch)[]): void {
        // TODO
        this.writeU32(commands.length);
        commands.forEach((command: Command.Transfer | Command.Deploy | Command.Call | Command.CreatePool | Command.SetPoolSettings | Command.DeletePool | Command.CreateDeposit | Command.SetDepositSettings | Command.TopUpDeposit | Command.WithdrawDeposit | Command.StakeDeposit | Command.UnstakeDeposit | Command.NextEpoch)=>{
            this.writeU8(command.index);
            const serialized_command = command.serialize();
            this.writeFixedArray(serialized_command);
        })
    }

    writeReceipts(receipts: CommandReceipt[][]): void {
        // todo
        this.writeU32(receipts.length);
        receipts.forEach((crs: CommandReceipt[])=>{
            this.writeReceipt(crs);
        });
    }

    writeReceipt(receipt: CommandReceipt[]): void {
        this.writeU32(receipt.length);
        receipt.forEach((crs: CommandReceipt)=>{
            this.writeCommandReceipt(crs);
        });
    }

    writeOptionReceipt(receipt: CommandReceipt[] | null): void {
        this.writeOption(receipt, (to_write)=>{
            this.writeReceipt(to_write);
        })
    }

    writeCommandReceipt(receipt: CommandReceipt): void {
        this.writeFixedArray(receipt.serialize());
    }

    writeLogs(logs: Log[]): void{
        this.writeU32(logs.length);
        logs.forEach((log: Log)=>{
            const serializedLog =  log.serialize();
            this.writeFixedArray(serializedLog);
        }) 
    }

    writeBase64URL(base64String: string): void{
        const base64Array = base64ToBytes(base64String);
        this.writeU32(base64Array.length);
        this.writeFixedArray(base64Array)
    }

    writeOptionBase64URL(base64String: string | null): void{
        this.writeOption(base64String, (to_write)=>{
            const base64Array = base64ToBytes(to_write);
            this.writeU32(base64Array.length);
            this.writeFixedArray(base64Array)
        });
    }


    writeQuorumCertificate(quorumCertificate: QuorumCertificate): void{
        this.writeFixedArray(quorumCertificate.serialize());
    }

    writeBloomFilter(log_bloom: BloomFilter){
        this.writeFixedArray(log_bloom.filter);
    }

    writeSignatureSet(sigs: SignatureSet): void{
        this.writeFixedArray(sigs.serialize());
    }

    writeSignatures(signatures: any[]): void{
        this.writeU32(signatures.length);
        signatures.forEach((signature: any)=>{
            if(signature){
                this.writeU8(1);
                this.writeSignature(signature);
            }
            else{
                this.writeU8(0);
            }
        })
    }

    writeSignature(signature: Signature): void{
        this.writeBytes64(signature.signature);   
    }


    writeVote(vote: Vote): void{
        this.writeU64(vote.app_id);
        this.writeU64(vote.view_number);
        this.writeSha256Hash(vote.block_hash);
        this.writePhase(vote.phase);
        this.writeSignature(vote.signature);
    }

    writePhase(phase: Phase): void {
        if (phase instanceof Generic) {
            this.writeU8(Generic.index);
        } else if (phase instanceof Prepare) {
            this.writeU8(Prepare.index);
        } else if (phase instanceof Precommit) {
            this.writeU8(Precommit.index);
            this.writeU64(phase.view);
        } else if (phase instanceof Commit) {
            this.writeU8(Commit.index);
            this.writeU64(phase.view);
        }
    }

    writeBytes64(bytes: Buffer): void {
        this.writeFixedArray(bytes);
    }

    writeBytes32(bytes: Buffer): void {
        this.writeFixedArray(bytes);
    }

    writeSha256Hash = (hash: Sha256Hash): void => {
        this.writeFixedArray(hash.hash);
    }

    writeVectorSha256Hash = (hashes: Sha256Hash[]): void => {
        this.writeU32(hashes.length);
        hashes.forEach((hash: Sha256Hash)=>{
            this.writeSha256Hash(hash);
        })
    }

    writeVectorOfBase64 = (items: string[]): void => {
        this.writeU32(items.length);
        items.forEach(item=>{this.writeBase64URL(item)});
    }

    writeVectorOfVector = (items: Buffer[]) => {
        this.writeU32(items.length);
        items.forEach((item: Buffer)=>{
            this.writeVector(item);
        });
    }

    writeVector = (item: Uint8Array | Buffer) => {
        this.writeU32(item.length);
        this.writeFixedArray(item)
    }

    writePublicAddress = (address: PublicAddress) => {
        this.writeFixedArray(address.value);
    }

    writeSetAddress = (addresses: Set<PublicAddress>): void => {
        this.writeU32(addresses.size);
        addresses.forEach((address: PublicAddress)=>{
            this.writePublicAddress(address);
        })
    }
    
    writeMapAddressToKeys = (items: Map<PublicAddress, Set<Uint8Array>>): void => {
        this.writeU32(items.size);
        items.forEach((keys, address) => {
            this.writePublicAddress(address);
            let buffers: Buffer[] = [];
            keys.forEach((key) => {
                buffers.push(Buffer.from(key));
            });
            this.writeVectorOfVector(buffers);
        });
    }

    writeMapAddressToAccounts = (items: Map<PublicAddress, Account>): void => {
        this.writeU32(items.size);
        items.forEach((acc, address)=>{
            this.writePublicAddress(address);
            this.writeU8(acc.index());
            this.writeFixedArray(acc.serialize());
        })
    }

    writeMapAddressToTuples = (items: Map<PublicAddress, Map<Uint8Array, Uint8Array>>): void => {
        this.writeU32(items.size);
        items.forEach((tuples, address)=>{
            this.writePublicAddress(address);
            this.writeTuples(tuples);
        })
    }

    writeStake = (stake: Stake): void => {
        const serialized = stake.serialize();
        this.writeFixedArray(serialized);
    }

    writeOptionStake = (stake: Stake | null): void => {
        this.writeOption(stake, (to_write)=>{
            this.writeStake(to_write);
        });
    }

    writeDeposit = (deposit: Deposit): void => {
        let serialized = deposit.serialize();
        this.writeFixedArray(serialized);
    }

    writeOptionDeposit = (deposit: Deposit | null): void => {
        this.writeOption(deposit, (to_write)=>{
            this.writeDeposit(to_write);
        });
    }

    writeStakes = (stakes: Stake[]): void => {
        this.writeU32(stakes.length);
        stakes.forEach((stake: Stake)=>{
            this.writeStake(stake);
        });
    }

    writePool = (pool: Pool): void => {
        this.writeU8(pool.index());
        const serialized = pool.serialize();
        this.writeFixedArray(serialized);
    }

    writePools = (pools: Pool[]): void => {
        this.writeU32(pools.length);
        pools.forEach((pool: Pool)=>{
            this.writePool(pool);
        });
    }

    writePoolsWithDelegator = (pools: PoolsWithDelegator): void => {
        this.writePools(pools.pools);
    }

    writePoolsWithoutDelegator = (pools: PoolsWithoutDelegator): void => {
        this.writePools(pools.pools);
    }

    writeOptionPool = (pool: Pool | null): void => {
        this.writeOption(pool, (to_write)=>{
            this.writePool(to_write);
        });
    }

    writeValidatorSet = (validator_set: ValidatorSet) => {
        if (validator_set instanceof PoolsWithDelegator) {
            this.writeU8(PoolsWithDelegator.index);
            this.writePools(validator_set.pools);
        } else if (validator_set instanceof PoolsWithoutDelegator) {
            this.writeU8(PoolsWithoutDelegator.index);
            this.writePools(validator_set.pools);
        } else {
            throw Error('Unreachable')
        }
    }

    writeOptionValidatorSet = (validator_set: ValidatorSet | null) => {
        this.writeOption(validator_set, (to_write)=>{
            this.writeValidatorSet(to_write);
        });
    }

    writeOptionOptionValidatorSet = (optional_validator_set: Option<ValidatorSet> | null) => {
        this.writeOption(optional_validator_set, (to_write)=>{
            this.writeOptionValidatorSet(to_write.value);
        });
    }

    writeMapAddressToPool = (items: Map<PublicAddress, Option<Pool>>): void => {
        this.writeU32(items.size);
        items.forEach((option_pool, address)=>{
            this.writePublicAddress(address);
            this.writeOptionPool(option_pool.value);
        })
    }

    writeMapAddressesToDeposit = (items: Map<[PublicAddress, PublicAddress], Option<Deposit>>): void => {
        this.writeU32(items.size);
        items.forEach((option_deposit, addresses)=>{
            this.writePublicAddress(addresses[0]);
            this.writePublicAddress(addresses[1]);
            this.writeOptionDeposit(option_deposit.value);
        })
    }

    writeMapAddressesToStake = (items: Map<[PublicAddress, PublicAddress], Option<Stake>>): void => {
        this.writeU32(items.size);
        items.forEach((option_stake, addresses)=>{
            this.writePublicAddress(addresses[0]);
            this.writePublicAddress(addresses[1]);
            this.writeOptionStake(option_stake.value);
        })
    }

    writeTuples = (items: Map<Uint8Array, Uint8Array>): void => {
        this.writeU32(items.size);
        items.forEach((v, k)=>{
            this.writeVector(k);
            this.writeVector(v);
        })
    }

    writeSetAddresses = (items: Set<[PublicAddress, PublicAddress]>): void => {
        this.writeU32(items.size);
        items.forEach((tuple: [PublicAddress, PublicAddress]) => {
            this.writePublicAddress(tuple[0]);
            this.writePublicAddress(tuple[1]);
        })
    }

    writeStateProofItem = (stateProofItem: StateProofItem): void => {
        if(stateProofItem[0] == 0 || stateProofItem[0] == 1 || stateProofItem[0] == 2 || stateProofItem[0] == 3){
            this.writeU8(stateProofItem[0]);
            if(stateProofItem[1]){
                this.writeU32(stateProofItem[1].length);
                this.writeFixedArray(stateProofItem[1]);
            }else{
                this.writeU8(0);
            }
        }
        else if(stateProofItem[0] instanceof Storage){
            this.writeU8(4);
            this.writeSha256Hash(stateProofItem[0].hash);
            this.writeU32(stateProofItem[0].value.length);
            this.writeFixedArray(stateProofItem[0].value);
            if(stateProofItem[1]){
                this.writeU32(stateProofItem[1].length);
                this.writeFixedArray(stateProofItem[1])
            }else{
                this.writeU32(0);
            }
        }
        else{
            return;
        }
    }

    writeVectorU64(items:number[]): void{
        this.writeU32(items.length);
        for (let index = 0; index < items.length; index++) {
            this.writeU64(items[index])
        }
    }

    writeVectorU32(items:number[]): void{
        this.writeU32(items.length);
        for (let index = 0; index < items.length; index++) {
            this.writeU32(items[index])
        }
    }

    writeBoolean(bool: boolean): void{
        if(bool){
            this.writeU8(1);
        }
        else{
            this.writeU8(0);
        }
    }
}