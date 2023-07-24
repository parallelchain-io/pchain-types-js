import { createHash } from "crypto";
import { Sha256Hash } from "./sha256hash";

export const generateSha256Hash = (message: Uint8Array): Sha256Hash => {
  const h1 = createHash("sha256").update(message);
  const h2 = h1.digest();
  const h3 = new Sha256Hash(h2);
  return h3;
};
