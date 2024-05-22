import jwt from 'jsonwebtoken';

import { IJwt, JwtPayload } from './IJwt';

export class Jwt implements IJwt {
  constructor(private readonly secret: string) {}

  encrypt(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
  }

  decrypt(cipherText: string): JwtPayload {
    return jwt.verify(cipherText, this.secret) as any;
  }

  validate(token: string): boolean {
    return !!jwt.decode(token);
  }
}
