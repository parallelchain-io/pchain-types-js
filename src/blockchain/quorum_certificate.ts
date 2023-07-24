import { SignatureSet } from "./signature_set";
import { Sha256Hash } from "../hash/sha256hash";
import { Serializable } from "../serde/serializable";
import { Enum } from "../constants/enum_type";
import { TypeCtorParams, u64 } from "../constants";

type AppID = u64;
type ViewNumber = u64;

export class Generic extends Serializable {
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  static index = 0;
}

export class Prepare extends Serializable {
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  static index = 1;
}

export class Precommit extends Serializable {
  view: u64;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  static index = 2;
  constructor({ view }: TypeCtorParams<Precommit>) {
    super();
    this.view = view;
  }
}

export class Commit extends Serializable {
  view: u64;
  /**
   * @deprecated to be removed, check wrapper enum or instance type instead
   */
  static index = 3;
  constructor({ view }: TypeCtorParams<Commit>) {
    super();
    this.view = view;
  }
}

export class Phase extends Enum {
  generic?: Generic;
  prepare?: Prepare;
  precommit?: Precommit;
  commit?: Commit;
}

export class QuorumCertificate extends Serializable {
  app_id: AppID;
  view: ViewNumber;
  block: Sha256Hash;
  phase: Phase;
  sigs: SignatureSet;

  constructor({
    app_id,
    view,
    block,
    sigs,
    phase,
  }: TypeCtorParams<QuorumCertificate>) {
    super();
    this.app_id = app_id;
    this.view = view;
    this.block = block;
    this.phase = phase;
    this.sigs = sigs;
  }
}
