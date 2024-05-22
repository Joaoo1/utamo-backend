import crypto from 'crypto';
import { IUUID } from './IUUID';

export class UUID implements IUUID {
  v4() {
    return crypto.randomUUID();
  }
}
