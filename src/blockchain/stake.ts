import { TypeCtorParams, u64 } from "../constants";
import { Serializable } from "../serde/serializable";
import { PublicAddress } from "./ed_keys";

export class Stake extends Serializable {
  owner: PublicAddress;
  power: u64;

  constructor({ owner, power }: TypeCtorParams<Stake>) {
    super();
    this.owner = owner;
    this.power = power;
  }
}
