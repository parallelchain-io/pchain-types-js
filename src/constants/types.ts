import BN from "bn.js";
import { PublicAddress } from "../blockchain/ed_keys";
import { Sha256Hash } from "../hash/sha256hash";

export type u64 = BN;

export type u32 = number;

export type u16 = number;

export enum NumberType {
  u8,
  u16,
  u32,
  u64,
}

type ArgumentType =
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "u128"
  | "PublicAddress"
  | "Sha256Hash";

type ArgumentValue =
  | string
  | number
  | Uint8Array
  | PublicAddress
  | Sha256Hash
  | BN;

export type Argument = Record<ArgumentType, ArgumentValue>;

// helper type for extracting the constructor object interface of a class
// select only non-method properties
// specially omits the legacy property 'index'
export type TypeCtorParams<T> = Omit<Pick<T, NonMethodKeys<T>>, "index">;

export type NonMethodKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
