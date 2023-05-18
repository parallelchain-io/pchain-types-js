import BN from "bn.js";
import { BinaryReader, BinaryWriter, deserialize } from "borsh";

export type u64 = BN;

export type u32 = number;

export type u16 = number;

export enum NumberType {
    u8,
    u16,
    u32,
    u64
}

export const serializeNum = (data: number | string, numberType: NumberType) => {
    const writer = new BinaryWriter();
    if(typeof data == "number"){
        if(data < 0){
            return 'Invalid data'
        }else{
            if(numberType == NumberType.u8){
                writer.writeU8(data);
            }
            if(numberType == NumberType.u16){
                writer.writeU16(data);
            }
            if(numberType == NumberType.u32){
                writer.writeU32(data);
            }
            if(numberType == NumberType.u64){
                writer.writeU64(data);
            }
        }
    }else if(typeof data == "string"){
        if(numberType == NumberType.u8){
            writer.writeU8(Number(data));
        }
        if(numberType == NumberType.u16){
            writer.writeU16(Number(data));
        }
        if(numberType == NumberType.u32){
            writer.writeU32(Number(data));
        }
        if(numberType == NumberType.u64){
            writer.writeU64(new BN(data));
        }
    }
    return writer.toArray();
}

export const deserializeNum = (data: Uint8Array, numberType: NumberType) => {
    const reader = new BinaryReader(Buffer.from(data));
    if(numberType == NumberType.u8){
        if(data.length != 1) return null;
        return reader.readU8();
    }
    if(numberType == NumberType.u16){
        if(data.length != 2) return null;
        return reader.readU16();
    }
    if(numberType == NumberType.u32){
        if(data.length != 4) return null;
        return reader.readU32();
    }
    if(numberType == NumberType.u64){
        if(data.length != 8) return null;
        return reader.readU64();
    }
    return null;
}

/**
 * Convert an unsigned integer or string to amount as u64. Throw error if 
 * the input is not an unsigned integer
 * @param num unsigned integer
 * @returns u64 integer
 */
export const safeUint = (num: number | string): u64 => {
    if(typeof num == "number"){
        if(num < 0){
            throw new Error("Invalid number");
        } else if (num >= 0x20000000000000) { // 2^53
            return new BN(num.toString());
        }
    }else if(typeof num == "string"){ 
        if (!num.trim().match(/^[0-9]+$/)) {
            throw new Error("Invalid number");
        }
    }
    return new BN(num);
}