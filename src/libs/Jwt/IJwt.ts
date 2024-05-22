export interface JwtPayload {
  id: string;
}

export interface IJwt {
  decrypt: (cipherText: string) => JwtPayload;
  encrypt: (payload: JwtPayload) => string;
  validate: (token: string) => boolean;
}
