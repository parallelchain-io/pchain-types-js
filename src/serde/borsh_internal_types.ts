import { Enum } from "../constants";
import { Serializable } from "./serializable";

export type InheritsSerializable = new (...args: any[]) => Serializable;
export type InheritsEnum = new (...args: any[]) => Enum;

/* 
Schema types allowed by Borsh
When extending, be careful not to make them too generic as they are meant to provide type checking for the schema.
*/

export type BorshStruct = {
  kind: "struct";
  fields: Array<[string, BorshAllowedType]>;
};

export type BorshEnum = {
  kind: "enum";
  field: "enum";
  values: Array<[string, InheritsSerializable | InheritsSerializable[]]>;
};

export type BorshSet = {
  kind: "set";
  type: BorshAllowedType;
};

export type BorshMap = {
  kind: "map";
  key: BorshAllowedType;
  value: BorshAllowedType;
};

export type BorshOption = {
  kind: "option";
  type: BorshAllowedType;
};

export type BorshFixedLengthAnyArray = [BorshAllowedType, number];
export type BorshFixedLengthByteArray = [8 | 16 | 32 | 64 | 128 | 256 | 512];

export type BorshVariableLengthByteArray = {
  kind: "bytearray";
};

export type BorshScalar =
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "u128"
  | "u256"
  | "u512"
  | "string"
  | "boolean"
  | InheritsSerializable
  | InheritsEnum
  | BorshOption
  | BorshSet
  | BorshMap
  | BorshFixedLengthByteArray
  | BorshFixedLengthAnyArray
  | BorshVariableLengthByteArray;

export type BorshCompound = Array<BorshScalar>;

export type BorshAllowedType = BorshScalar | BorshCompound;
