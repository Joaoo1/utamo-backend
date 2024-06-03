export interface IUUID {
  generate: () => string;
  validate: (uuid: string) => boolean;
}
