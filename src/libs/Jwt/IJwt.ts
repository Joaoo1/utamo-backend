export interface JwtPayload {
  id: string;
}

export interface IJwt {
  decrypt: (cipherText: string) => Promise<JwtPayload>;
  encrypt: (payload: JwtPayload) => Promise<string>;
}
