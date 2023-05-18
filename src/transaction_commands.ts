import { ExtendedReader } from "./crypto/extended-reader";
import { ExtendedWriter } from "./crypto/extended-writer";
import { u32, u64 } from "./crypto/numbers";
import { PublicAddress } from "./crypto/public_address";
import { borshDeserialize, borshSerialize } from "./serde";

export type TransactionCommand = Command.Transfer | Command.Deploy | Command.Call | Command.CreatePool | Command.SetPoolSettings | Command.DeletePool | Command.CreateDeposit | Command.SetDepositSettings | Command.TopUpDeposit | Command.WithdrawDeposit | Command.StakeDeposit | Command.UnstakeDeposit | Command.NextEpoch;

export namespace Command {

    export interface TransferInterface {
        recipient: PublicAddress;
        amount: u64 | number;
    }

    export interface DeployInterface {
        contract: Uint8Array;
        cbi_version: u32;
    }
    
    export interface CallInterface {
        target: PublicAddress;
        method: string;
        args: Uint8Array[];
        amount: u64 | null;
    }
    
    export interface CreatePoolInterface{
        commission_rate: number;
    }    

    export interface SetPoolSettingsInterface{
        commission_rate: number;
    }

    export interface DeletePoolInterface{
    }
    
    export interface CreateDepositInterface{
        operator: PublicAddress;
        balance: u64 | number;
        auto_stake_rewards: boolean;
    }

    export interface SetDepositSettingsInterface{
        operator: PublicAddress;
        auto_stake_rewards: boolean;
    }

    export interface TopUpDepositInterface{
        operator: PublicAddress;
        amount: u64 | number;
    }

    export interface WithdrawDepositInterface{
        operator: PublicAddress;
        max_amount: u64 | number;
    }
    
    export interface StakeDepositInterface{
        operator: PublicAddress;
        max_amount: u64 | number;
    }

    export interface UnstakeDepositInterface{
        operator: PublicAddress;
        max_amount: u64 | number;
    }

    export interface NextEpochInterface{
    }

    export class Transfer{
        recipient: PublicAddress;
        amount: u64 | number;
        index: number;

        constructor({recipient, amount}: TransferInterface){
            this.recipient = recipient;
            this.amount = amount;
            this.index = 0;
        }

        static schema = new Map([[Transfer, {kind:'struct', fields:[['recipient','PublicAddress'], ['amount','u64']]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, Transfer.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, Transfer.schema, Transfer, ExtendedReader);
                return deserializedCommand as Transfer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class Deploy{
        contract: Uint8Array;
        cbi_version: u32;
        index: number;

        constructor({contract, cbi_version}: DeployInterface){
            this.contract = contract;
            this.cbi_version = cbi_version;
            this.index = 1;
        }

        static schema = new Map([[Deploy, {kind:'struct', fields:[['contract','vector'], ['cbi_version','u32']]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, Deploy.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, Deploy.schema, Deploy, ExtendedReader);
                return deserializedCommand as Deploy;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class Call{
        target: PublicAddress;
        method: string;
        args: Uint8Array[] | null;
        amount: u64 | null;
        index: number;

        constructor({target, method, args = [], amount = null}: CallInterface){
            this.target = target;
            this.method = method;
            this.args = args;
            this.amount = amount;
            this.index = 2;
        }

        static schema = new Map([[Call, {kind:'struct', fields:[['target','PublicAddress'], ['method','string'], ['args','optionArgs'], ['amount','optionU64']]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, Call.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, Call.schema, Call, ExtendedReader);
                return deserializedCommand as Call;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class CreatePool {
        commission_rate: number;
        index: number;

        constructor({commission_rate}: CreatePoolInterface){
            this.commission_rate = commission_rate;
            this.index = 3;
        }

        static schema = new Map([[CreatePool, {kind:'struct', fields:[['commission_rate','u8']]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, CreatePool.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, CreatePool.schema, CreatePool, ExtendedReader);
                return deserializedCommand as CreatePool;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class SetPoolSettings{
        commission_rate: number;
        index: number;

        constructor({commission_rate}: SetPoolSettingsInterface){
            this.commission_rate = commission_rate;
            this.index = 4;
        }

        static schema = new Map([[SetPoolSettings, {kind:'struct', fields:[['commission_rate','u8']]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, SetPoolSettings.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, SetPoolSettings.schema, SetPoolSettings, ExtendedReader);
                return deserializedCommand as SetPoolSettings;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class DeletePool{
        index: number;

        constructor() { 
            this.index = 5;
        }

        static schema = new Map([[DeletePool, {kind:'struct', fields:[]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, DeletePool.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, DeletePool.schema, DeletePool, ExtendedReader);
                return deserializedCommand as DeletePool;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class CreateDeposit{
        operator: PublicAddress;
        balance: u64 | number;
        auto_stake_rewards: boolean;
        index: number;

        constructor({operator, balance, auto_stake_rewards}: CreateDepositInterface){
            this.operator = operator;
            this.balance = balance;
            this.auto_stake_rewards = auto_stake_rewards;
            this.index = 6;
        }

        static schema = new Map([[CreateDeposit, {kind:'struct', fields:[['operator','PublicAddress'], ['balance', 'u64'], ['auto_stake_rewards', 'boolean']]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, CreateDeposit.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, CreateDeposit.schema, CreateDeposit, ExtendedReader);
                return deserializedCommand as CreateDeposit;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class SetDepositSettings{
        operator: PublicAddress;
        auto_stake_rewards: boolean;
        index: number;

        constructor({operator, auto_stake_rewards}: SetDepositSettingsInterface){
            this.operator = operator;
            this.auto_stake_rewards = auto_stake_rewards;
            this.index = 7;
        }

        static schema = new Map([[SetDepositSettings, {kind:'struct', fields:[['operator','PublicAddress'], ['auto_stake_rewards','boolean']]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, SetDepositSettings.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, SetDepositSettings.schema, SetDepositSettings, ExtendedReader);
                return deserializedCommand as SetDepositSettings;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class TopUpDeposit{
        operator: PublicAddress;
        amount: u64 | number;
        index: number;

        constructor({operator, amount}: TopUpDepositInterface){
            this.operator = operator;
            this.amount = amount;
            this.index = 8;
        }

        static schema = new Map([[TopUpDeposit, {kind:'struct', fields:[['operator','PublicAddress'], ['amount','u64']]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, TopUpDeposit.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, TopUpDeposit.schema, TopUpDeposit, ExtendedReader);
                return deserializedCommand as TopUpDeposit;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class WithdrawDeposit{
        operator: PublicAddress;
        max_amount: u64 | number;
        index: number;

        constructor({operator, max_amount}: WithdrawDepositInterface){
            this.operator = operator;
            this.max_amount = max_amount;
            this.index = 9;
        }

        static schema = new Map([[WithdrawDeposit, {kind:'struct', fields:[['operator','PublicAddress'], ['max_amount','u64']]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, WithdrawDeposit.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, WithdrawDeposit.schema, WithdrawDeposit, ExtendedReader);
                return deserializedCommand as WithdrawDeposit;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class StakeDeposit{
        operator: PublicAddress;
        max_amount: u64 | number;
        index: number;

        constructor({operator, max_amount}: StakeDepositInterface){
            this.operator = operator;
            this.max_amount = max_amount;
            this.index = 10;
        }

        static schema = new Map([[StakeDeposit, {kind:'struct', fields:[['operator','PublicAddress'], ['max_amount','u64']]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, StakeDeposit.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, StakeDeposit.schema, StakeDeposit, ExtendedReader);
                return deserializedCommand as StakeDeposit;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class UnstakeDeposit{
        operator: PublicAddress;
        max_amount: u64 | number;
        index: number;

        constructor({operator, max_amount}: UnstakeDepositInterface){
            this.operator = operator;
            this.max_amount = max_amount;
            this.index = 11;
        }

        static schema = new Map([[UnstakeDeposit, {kind:'struct', fields:[['operator','PublicAddress'], ['max_amount','u64']]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, UnstakeDeposit.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, UnstakeDeposit.schema, UnstakeDeposit, ExtendedReader);
                return deserializedCommand as UnstakeDeposit;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }

    export class NextEpoch{
        index: number;

        constructor() {
            this.index = 12;
         }

        static schema = new Map([[NextEpoch, {kind:'struct', fields:[]}]])

        serialize = () => {
            try {
                const buffer = borshSerialize(this, NextEpoch.schema, ExtendedWriter);
                return buffer;
            } catch (e: any) {
                throw Error(e);
            }
        }
    
        static deserialize = (buffer: Buffer) => {
            try {
                const deserializedCommand = borshDeserialize(buffer, NextEpoch.schema, NextEpoch, ExtendedReader);
                return deserializedCommand as NextEpoch;
            } catch (e: any) {
                throw Error(e);
            }
        }
    }
}