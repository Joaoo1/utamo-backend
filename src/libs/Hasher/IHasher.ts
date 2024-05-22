export interface IHasher {
  hash: (plaintext: string) => Promise<string>;
  compare: (plainText: string, digest: string) => Promise<boolean>;
}
