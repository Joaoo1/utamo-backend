import bcrypt from 'bcrypt';

import { IHasher } from './IHasher';

export class Bcrypt implements IHasher {
  constructor(private readonly saltOrRounds: string | number) {}

  async hash(plaintext: string): Promise<string> {
    return await bcrypt.hash(plaintext, this.saltOrRounds);
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    return await bcrypt.compare(plaintext, digest);
  }
}
