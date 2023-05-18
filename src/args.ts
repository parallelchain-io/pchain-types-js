import BN from "bn.js";
import { PublicAddress } from "./crypto/public_address";
import { Sha256Hash } from "./crypto/sha256hash";

type ArgumentType = 'u8' | 'u16' | 'u32' | 'u64' | 'u128' | 'PublicAddress' | 'Sha256Hash';

type ArgumentValue = string | number | Uint8Array | PublicAddress | Sha256Hash | BN ;

export type Argument = Record<ArgumentType, ArgumentValue>;