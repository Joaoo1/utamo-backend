import jwt from 'jsonwebtoken';

import { IJwt, JwtPayload } from './IJwt';

export class Jwt implements IJwt {
  constructor(private readonly secret: string) {}

  async encrypt(payload: JwtPayload): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
  }

  async decrypt(cipherText: string): Promise<JwtPayload> {
    return jwt.verify(cipherText, this.secret) as any;
  }
}
