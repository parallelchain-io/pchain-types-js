export abstract class Serializable {
  serialize(): Buffer {
    // dummy interface
    // actual serialization logic implementated by schema
    throw new Error("Generic serialize not implemented");
  }

  static deserialize(buffer: Buffer | ArrayBuffer): any {
    // dummy interface
    // actual serialization logic implementated by schema
    throw new Error("Generic deserialize not implemented");
  }
}
