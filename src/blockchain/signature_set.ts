import { Serializable } from "../serde/serializable";
import { Signature } from "./signature";
import { Option } from "../serde/option";
import { TypeCtorParams } from "../constants";

export class SignatureSet extends Serializable {
  signatures: Option<Signature>[];

  constructor({ signatures }: TypeCtorParams<SignatureSet>) {
    super();
    this.signatures = signatures;
  }
}
