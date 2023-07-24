export enum ExitStatus {
  /// The Transaction successfully accomplished everything that it could have been expected to do.
  Success = 0x00,

  /// The Transaction failed to accomplish the primary operation that Transactions of its kinds are expected to accomplish.
  Failed,

  /// The Gas Limit was exceeded by a dynamically costed activity in a dynamic-cost Transaction.
  GasExhausted,
}
