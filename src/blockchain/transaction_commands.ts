import { PublicAddress } from "./ed_keys";
import { Serializable } from "../serde/serializable";
import { Option } from "../serde/option";
import { Enum } from "../constants/enum_type";
import { TypeCtorParams, u32, u64 } from "../constants";

export class Transfer extends Serializable {
  recipient: PublicAddress;
  amount: u64;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;
  constructor({ recipient, amount }: TypeCtorParams<Transfer>) {
    super();
    this.recipient = recipient;
    this.amount = amount;
    this.index = 0;
  }
}

export class Deploy extends Serializable {
  contract: Uint8Array;
  cbi_version: u32;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor({ contract, cbi_version }: TypeCtorParams<Deploy>) {
    super();
    this.contract = contract;
    this.cbi_version = cbi_version;
    this.index = 1;
  }
}

export class Call extends Serializable {
  target: PublicAddress;
  method: string;
  args: Option<Uint8Array[]>;
  amount: Option<u64>;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor({ target, method, args, amount }: TypeCtorParams<Call>) {
    super();
    this.target = target;
    this.method = method;
    this.args = args;
    this.amount = amount;
    this.index = 2;
  }
}

export class CreatePool extends Serializable {
  commission_rate: number;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor({ commission_rate }: TypeCtorParams<CreatePool>) {
    super();
    this.commission_rate = commission_rate;
    this.index = 3;
  }
}

export class SetPoolSettings extends Serializable {
  commission_rate: number;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor({ commission_rate }: TypeCtorParams<SetPoolSettings>) {
    super();
    this.commission_rate = commission_rate;
    this.index = 4;
  }
}

export class DeletePool extends Serializable {
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor() {
    super();
    this.index = 5;
  }
}

export class CreateDeposit extends Serializable {
  operator: PublicAddress;
  balance: u64;
  auto_stake_rewards: boolean;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor({
    operator,
    balance,
    auto_stake_rewards,
  }: TypeCtorParams<CreateDeposit>) {
    super();
    this.operator = operator;
    this.balance = balance;
    this.auto_stake_rewards = auto_stake_rewards;
    this.index = 6;
  }
}

export class SetDepositSettings extends Serializable {
  operator: PublicAddress;
  auto_stake_rewards: boolean;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor({
    operator,
    auto_stake_rewards,
  }: TypeCtorParams<SetDepositSettings>) {
    super();
    this.operator = operator;
    this.auto_stake_rewards = auto_stake_rewards;
    this.index = 7;
  }
}

export class TopUpDeposit extends Serializable {
  operator: PublicAddress;
  amount: u64 | number;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor({ operator, amount }: TypeCtorParams<TopUpDeposit>) {
    super();
    this.operator = operator;
    this.amount = amount;
    this.index = 8;
  }
}

export class WithdrawDeposit extends Serializable {
  operator: PublicAddress;
  max_amount: u64;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor({ operator, max_amount }: TypeCtorParams<WithdrawDeposit>) {
    super();
    this.operator = operator;
    this.max_amount = max_amount;
    this.index = 9;
  }
}

export class StakeDeposit extends Serializable {
  operator: PublicAddress;
  max_amount: u64 | number;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor({ operator, max_amount }: TypeCtorParams<StakeDeposit>) {
    super();
    this.operator = operator;
    this.max_amount = max_amount;
    this.index = 10;
  }
}

export class UnstakeDeposit extends Serializable {
  operator: PublicAddress;
  max_amount: u64 | number;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor({ operator, max_amount }: TypeCtorParams<UnstakeDeposit>) {
    super();
    this.operator = operator;
    this.max_amount = max_amount;
    this.index = 11;
  }
}

export class NextEpoch extends Serializable {
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  index: number;

  constructor() {
    super();
    this.index = 12;
  }
}
export class Command extends Enum {
  transfer?: Transfer;
  deploy?: Deploy;
  call?: Call;
  createPool?: CreatePool;
  setPoolSettings?: SetPoolSettings;
  deletePool?: DeletePool;
  createDeposit?: CreateDeposit;
  setDepositSettings?: SetDepositSettings;
  topUpDeposit?: TopUpDeposit;
  withdrawDeposit?: WithdrawDeposit;
  stakeDeposit?: StakeDeposit;
  unstakeDeposit?: UnstakeDeposit;
  nextEpoch?: NextEpoch;
}
